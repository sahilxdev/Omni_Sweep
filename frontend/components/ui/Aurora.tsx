'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

// WebGL1 shader sources
const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,-0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m *= m; m *= m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw; return 130.0 * dot(m, g);
}

vec3 getRampColor(float factor) {
  return factor <= 0.5 ? mix(uColorStops[0], uColorStops[1], factor * 2.0)
                       : mix(uColorStops[1], uColorStops[2], (factor - 0.5) * 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 rampColor = getRampColor(uv.x);
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  vec3 auroraColor = intensity * rampColor;
  gl_FragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: string[]; // 3 stops
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  fallbackScale?: number; // 0-1 controlling size of fallback radial shadow
  fallbackIntensity?: number; // 0-1 multiplier for alpha of inner color
  fallbackBlur?: number; // px blur for fallback overlay
}

export default function Aurora(props: AuroraProps) {
  // Purple gradient default (Tailwind purple family)
  const { colorStops = ['#7e22ce', '#a855f7', '#c084fc'], amplitude = 1.0, blend = 0.5, fallbackScale = 0.55, fallbackIntensity = 0.55, fallbackBlur = 40 } = props;
  const propsRef = useRef<AuroraProps>(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;
    // Attempt WebGL1 directly. If renderer fails, fallback to blurred shadow overlay.

    let renderer: Renderer | undefined;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    } catch (e) {
      // Fallback overlay
      const inner = Math.max(0, Math.min(1, fallbackIntensity));
      const scale = Math.max(0.2, Math.min(1, fallbackScale));
      ctn.style.position = ctn.style.position || 'relative';
      const overlay = document.createElement('div');
      overlay.setAttribute('data-aurora-fallback', '');
      overlay.style.position = 'absolute';
      overlay.style.pointerEvents = 'none';
      overlay.style.top = '0';
      overlay.style.right = '0';
      overlay.style.width = `${Math.round(scale * 55)}%`;
      overlay.style.height = `${Math.round(scale * 55)}%`;
      overlay.style.transform = 'translate(15%, -15%)';
      overlay.style.background = `radial-gradient(circle at 50% 50%, rgba(168,85,247,${inner.toFixed(2)}) 0%, rgba(168,85,247,${(inner*0.45).toFixed(2)}) 35%, rgba(168,85,247,0) 70%)`;
      overlay.style.filter = `blur(${fallbackBlur}px)`;
      ctn.appendChild(overlay);
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    let program: Program | undefined;

    function resize() {
      if (!ctn || !renderer) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) program.uniforms.uResolution.value = [width, height];
    }
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv; // Unused in shader

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex); return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      if (!program || !renderer) return;
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      program.uniforms.uTime.value = time * speed * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? amplitude;
      program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
      const stops = propsRef.current.colorStops ?? colorStops;
      program.uniforms.uColorStops.value = stops.map((hex: string) => {
        const c = new Color(hex); return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (ctn && renderer && gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude, blend, colorStops]);

  return <div ref={ctnDom} className="w-full h-full" />;
}
