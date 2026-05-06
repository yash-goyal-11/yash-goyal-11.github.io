import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// Organic Slime Shader
const slimeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const slimeFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex noise
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

  float metaball(vec2 p, vec2 center, float radius) {
    float d = length(p - center);
    return radius / (d * d + 0.001);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.4;
    
    // Create multiple metaballs
    vec2 center1 = vec2(0.5 + sin(t * 0.7) * 0.15, 0.5 + cos(t * 0.5) * 0.1);
    vec2 center2 = vec2(0.5 + cos(t * 0.6 + 1.0) * 0.2, 0.5 + sin(t * 0.8 + 2.0) * 0.15);
    vec2 center3 = vec2(0.5 + sin(t * 0.5 + 3.0) * 0.12, 0.5 + cos(t * 0.7 + 1.5) * 0.18);
    vec2 center4 = vec2(uMouse.x, uMouse.y);
    
    float field = 0.0;
    field += metaball(uv, center1, 0.012);
    field += metaball(uv, center2, 0.008);
    field += metaball(uv, center3, 0.006);
    field += metaball(uv, center4, 0.015);
    
    // Noise distortion
    float noise = snoise(vec3(uv * 3.0, t * 0.2)) * 0.5 + 0.5;
    field += noise * 0.3;
    
    // Threshold for slime boundary
    float threshold = 2.5;
    float edge = smoothstep(threshold - 0.5, threshold, field);
    
    // Fresnel-like effect at edges
    float fresnel = smoothstep(threshold, threshold + 1.0, field) * 0.3;
    
    // Colors
    vec3 deepColor = vec3(0.11, 0.247, 0.227);
    vec3 tealColor = vec3(0.235, 0.816, 0.741);
    vec3 emeraldColor = vec3(0.0, 0.722, 0.58);
    
    vec3 color = mix(deepColor, tealColor, edge);
    color = mix(color, emeraldColor, fresnel);
    
    // Inner glow
    float innerGlow = smoothstep(threshold + 0.5, threshold + 2.0, field);
    color += emeraldColor * innerGlow * 0.3;
    
    // Specular highlight
    vec2 lightDir = normalize(vec2(0.7, 0.8) - uv);
    float specular = pow(max(dot(normalize(vec2(dFdx(edge), dFdy(edge)) + 0.001), lightDir), 0.0), 32.0);
    color += vec3(0.8, 0.95, 0.9) * specular * 0.5;
    
    float alpha = smoothstep(threshold - 1.0, threshold, field) * 0.85;
    
    gl_FragColor = vec4(color, alpha);
  }
`

function SlimeMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLElement)?.closest?.('.slime-container')?.getBoundingClientRect()
      if (rect) {
        mouseRef.current.x = (e.clientX - rect.left) / rect.width
        mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.08
      )
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={slimeVertexShader}
        fragmentShader={slimeFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function SlimeCanvas() {
  return (
    <Canvas
      className="slime-container"
      camera={{ position: [0, 0, 1], fov: 60 }}
      style={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
    >
      <SlimeMesh />
    </Canvas>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, bodyRef.current, statsRef.current], {
        opacity: 0,
        y: 40,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 80%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
        .to(
          bodyRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          statsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const stats = [
    { value: '4+', label: 'Years Experience' },
    { value: '2', label: 'Publications' },
    { value: '3', label: 'Hackathon Wins' },
    { value: '5+', label: 'Projects' },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-10 px-4 py-32 md:py-48"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <h2
              ref={headingRef}
              className="font-display mb-8 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl opacity-0"
            >
              Turning Data
              <br />
              <span className="text-[#3cd0bd]">into Decisions</span>
            </h2>

            <p
              ref={bodyRef}
              className="mb-10 text-lg leading-relaxed text-[#94a3b8] opacity-0"
            >
              I don't just analyze data; I build intelligent systems that solve real
              problems. From predictive models to GenAI agents, my work sits at the
              intersection of robust engineering and cutting-edge research. Currently
              interning at <strong className="text-[#e2e8f0]">SAS Institute</strong> and
              tutoring at the{' '}
              <strong className="text-[#e2e8f0]">University of Sydney</strong>, I bring
              a maker's mindset and a mission to solve problems that matter.
            </p>

            <div
              ref={statsRef}
              className="grid grid-cols-2 gap-6 sm:grid-cols-4 opacity-0"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass-card rounded-xl p-4 text-center transition-all duration-300 hover:border-[#3cd0bd]/30"
                >
                  <div className="font-display text-3xl font-bold text-[#3cd0bd]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs tracking-wider text-[#64748b] uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Slime Shader */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1c3f3a]/20 to-transparent" />
              <SlimeCanvas />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
