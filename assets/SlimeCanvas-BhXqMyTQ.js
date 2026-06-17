import{j as t,C as i,r as v,V as l,a,D as x}from"./index-tpmveUZT.js";const d=`
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,m=`
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;
  varying vec3 vPosition;

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

    vec2 center1 = vec2(0.5 + sin(t * 0.7) * 0.15, 0.5 + cos(t * 0.5) * 0.1);
    vec2 center2 = vec2(0.5 + cos(t * 0.6 + 1.0) * 0.2, 0.5 + sin(t * 0.8 + 2.0) * 0.15);
    vec2 center3 = vec2(0.5 + sin(t * 0.5 + 3.0) * 0.12, 0.5 + cos(t * 0.7 + 1.5) * 0.18);
    vec2 center4 = vec2(uMouse.x, uMouse.y);

    float field = 0.0;
    field += metaball(uv, center1, 0.012);
    field += metaball(uv, center2, 0.008);
    field += metaball(uv, center3, 0.006);
    field += metaball(uv, center4, 0.015);

    float noise = snoise(vec3(uv * 3.0, t * 0.2)) * 0.5 + 0.5;
    field += noise * 0.3;

    float threshold = 2.5;
    float edge = smoothstep(threshold - 0.5, threshold, field);
    float fresnel = smoothstep(threshold, threshold + 1.0, field) * 0.3;

    vec3 deepColor = vec3(0.11, 0.247, 0.227);
    vec3 tealColor = vec3(0.235, 0.816, 0.741);
    vec3 emeraldColor = vec3(0.0, 0.722, 0.58);

    vec3 color = mix(deepColor, tealColor, edge);
    color = mix(color, emeraldColor, fresnel);

    float innerGlow = smoothstep(threshold + 0.5, threshold + 2.0, field);
    color += emeraldColor * innerGlow * 0.3;

    vec2 lightDir = normalize(vec2(0.7, 0.8) - uv);
    float specular = pow(max(dot(normalize(vec2(dFdx(edge), dFdy(edge)) + 0.001), lightDir), 0.0), 32.0);
    color += vec3(0.8, 0.95, 0.9) * specular * 0.5;

    float alpha = smoothstep(threshold - 1.0, threshold, field) * 0.85;

    gl_FragColor = vec4(color, alpha);
  }
`;function u(){const s=v.useRef(null),r=v.useRef({x:.5,y:.5}),n=v.useMemo(()=>({uTime:{value:0},uMouse:{value:new l(.5,.5)},uResolution:{value:new l(1,1)}}),[]);return v.useEffect(()=>{const c=e=>{const o=e.target?.closest?.(".slime-container")?.getBoundingClientRect();o&&(r.current.x=(e.clientX-o.left)/o.width,r.current.y=1-(e.clientY-o.top)/o.height)};return window.addEventListener("mousemove",c),()=>window.removeEventListener("mousemove",c)},[]),a(c=>{if(s.current){const e=s.current.material;e.uniforms.uTime.value=c.clock.elapsedTime,e.uniforms.uMouse.value.lerp(new l(r.current.x,r.current.y),.08)}}),t.jsxs("mesh",{ref:s,children:[t.jsx("planeGeometry",{args:[2,2]}),t.jsx("shaderMaterial",{vertexShader:d,fragmentShader:m,uniforms:n,transparent:!0,side:x})]})}function f(){return t.jsx(i,{className:"slime-container",camera:{position:[0,0,1],fov:60},style:{width:"100%",height:"100%",borderRadius:"1.5rem"},children:t.jsx(u,{})})}export{f as default};
