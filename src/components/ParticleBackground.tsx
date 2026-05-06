import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 4000

const vertexShader = `
  attribute float size;
  attribute float opacity;
  attribute vec3 random;
  uniform float uTime;
  uniform vec2 uMouse;
  varying float vOpacity;
  varying vec3 vColor;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vOpacity = opacity;
    
    vec3 pos = position;
    float t = uTime * 0.15;
    
    // Create flowing motion with noise
    float noise1 = snoise(pos * 0.003 + t + random * 0.5);
    float noise2 = snoise(pos * 0.005 - t * 0.7 + random * 0.3);
    float noise3 = snoise(pos * 0.002 + t * 0.3);
    
    pos.x += noise1 * 30.0;
    pos.y += noise2 * 25.0;
    pos.z += noise3 * 20.0;
    
    // Gentle wave motion
    pos.x += sin(t + random.x * 6.28) * 10.0;
    pos.y += cos(t * 0.8 + random.y * 6.28) * 8.0;
    
    // Mouse repulsion
    vec2 mouseOffset = (pos.xy - uMouse * 100.0);
    float mouseDist = length(mouseOffset);
    if (mouseDist < 80.0) {
      float force = (80.0 - mouseDist) / 80.0;
      pos.xy += normalize(mouseOffset) * force * 30.0;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Color based on depth and noise
    float depth = (pos.z + 50.0) / 100.0;
    vec3 tealColor = vec3(0.235, 0.816, 0.741);
    vec3 emeraldColor = vec3(0.0, 0.722, 0.58);
    vec3 deepColor = vec3(0.11, 0.247, 0.227);
    vColor = mix(deepColor, mix(emeraldColor, tealColor, noise1 * 0.5 + 0.5), depth);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    // Create circular particle
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
    
    // Glow center
    float glow = 1.0 - smoothstep(0.0, 0.3, dist);
    vec3 finalColor = mix(vColor, vec3(0.8, 0.95, 0.9), glow * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })

  const { positions, sizes, opacities, randoms } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const opacities = new Float32Array(PARTICLE_COUNT)
    const randoms = new Float32Array(PARTICLE_COUNT * 3)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 400
      positions[i3 + 1] = (Math.random() - 0.5) * 300
      positions[i3 + 2] = (Math.random() - 0.5) * 200

      sizes[i] = Math.random() * 3 + 1
      opacities[i] = Math.random() * 0.6 + 0.2

      randoms[i3] = Math.random()
      randoms[i3 + 1] = Math.random()
      randoms[i3 + 2] = Math.random()
    }

    return { positions, sizes, opacities, randoms }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    }),
    [viewport]
  )

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x * viewport.width, mouseRef.current.y * viewport.height),
        0.05
      )
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-opacity" args={[opacities, 1]} />
        <bufferAttribute attach="attributes-random" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 60, near: 1, far: 500 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
