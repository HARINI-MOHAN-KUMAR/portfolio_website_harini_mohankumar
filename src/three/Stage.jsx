import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { store, kf, wt, deskWeight, ease } from './store'
import { makeCodeScreen, makeLabelTexture } from './textures'
import { allSkills, certifications } from '../data/profile'

const lerp = (a, b, f) => a + (b - a) * f

/* ------------------------------------------------------------------ */
/* Holographic code screen                                             */
/* ------------------------------------------------------------------ */
function HoloScreen({ position, rotation, lines, accent, title, scale = 1, phase = 0 }) {
  const ref = useRef()
  const screen = useMemo(() => makeCodeScreen(lines, { accent, title }), [lines, accent, title])
  const last = useRef(0)

  useFrame((state) => {
    const time = store.reduced ? 99 : state.clock.elapsedTime
    if (!store.reduced) {
      ref.current.position.y = position[1] + Math.sin(time * 0.8 + phase) * 0.04
      ref.current.rotation.y = rotation[1] + store.pointer.x * 0.06
    }
    if (time - last.current > 0.1) {
      last.current = time
      const cycle = screen.length + 30
      const chars = store.reduced ? screen.length : Math.floor(time * 20 + phase * 40) % cycle
      screen.draw(Math.min(chars, screen.length + 1))
    }
  })

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <mesh>
        <planeGeometry args={[1.4, 0.875]} />
        <meshBasicMaterial map={screen.texture} transparent opacity={0.93} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.44, 0.915)]} />
        <lineBasicMaterial color={accent} transparent opacity={0.85} />
      </lineSegments>
      <mesh position={[0, -0.5, -0.01]}>
        <planeGeometry args={[0.5, 0.012]} />
        <meshBasicMaterial color={accent} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

const JAVA = [
  'public class Harini {',
  '  String role = "Full Stack Dev";',
  '  void build() {',
  '    // reusable, scalable',
  '    runTests();',
  '    ship();',
  '  }',
  '}',
]
const PY = [
  'from flask import Flask',
  'app = Flask(__name__)',
  '',
  '@app.route("/api")',
  'def home():',
  '    return "Hello"',
]
const TERM = [
  '$ mvn test',
  '[INFO] Running tests',
  '[INFO] BUILD SUCCESS',
  '$ git add .',
  '$ git commit -m "ship"',
  '$ git push origin main',
]

/* ------------------------------------------------------------------ */
/* Workstation (desk, chair, laptop, holo screens)                     */
/* ------------------------------------------------------------------ */
function Workstation() {
  const group = useRef()
  const lid = useRef()
  const glow = useRef()

  useFrame(() => {
    const t = store.t
    const w = deskWeight(t)
    const g = group.current
    g.visible = w > 0.01
    g.position.x = (1 - w) * -9
    g.scale.setScalar(lerp(0.7, 1, w))
    // laptop lid closes during the final scene
    const open = kf(t, [1, 1, 1, 1, 1, 1, 1, 0])
    lid.current.rotation.x = ((open * 105) * Math.PI) / 180 - Math.PI / 2
    glow.current.intensity = 0.4 + open * 1.4
  })

  return (
    <group ref={group}>
      {/* desk */}
      <mesh position={[0, 0.76, 0.4]}>
        <boxGeometry args={[3.6, 0.06, 1.3]} />
        <meshStandardMaterial color="#141b3d" roughness={0.35} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.795, 1.04]}>
        <boxGeometry args={[3.6, 0.01, 0.02]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} />
      </mesh>
      {[-1.65, 1.65].map((x) => (
        <mesh key={x} position={[x, 0.37, 0.4]}>
          <boxGeometry args={[0.08, 0.74, 1.1]} />
          <meshStandardMaterial color="#0e1330" roughness={0.5} metalness={0.4} />
        </mesh>
      ))}

      {/* chair */}
      <group position={[0, 0, -0.5]}>
        <mesh position={[0, 0.47, 0]}>
          <boxGeometry args={[0.52, 0.07, 0.5]} />
          <meshStandardMaterial color="#1f2a5c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.82, -0.26]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.5, 0.62, 0.06]} />
          <meshStandardMaterial color="#1f2a5c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.4, 10]} />
          <meshStandardMaterial color="#6b7bb8" metalness={0.8} roughness={0.3} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[Math.cos((i / 5) * Math.PI * 2) * 0.2, 0.04, Math.sin((i / 5) * Math.PI * 2) * 0.2]}
            rotation={[0, -(i / 5) * Math.PI * 2, 0]}
          >
            <boxGeometry args={[0.4, 0.035, 0.05]} />
            <meshStandardMaterial color="#6b7bb8" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* laptop */}
      <group position={[0, 0.795, 0.1]}>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.8, 0.025, 0.55]} />
          <meshStandardMaterial color="#aab4e8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.026, -0.04]}>
          <boxGeometry args={[0.7, 0.004, 0.34]} />
          <meshStandardMaterial color="#10162f" roughness={0.6} />
        </mesh>
        {/* hinge + lid */}
        <group ref={lid} position={[0, 0.02, 0.27]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.8, 0.5, 0.02]} />
            <meshStandardMaterial color="#aab4e8" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* screen (inner face) */}
          <mesh position={[0, 0.25, -0.0115]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.74, 0.44]} />
            <meshBasicMaterial color="#0a1230" />
          </mesh>
          {/* back logo glow (outer face) */}
          <mesh position={[0, 0.25, 0.0115]}>
            <ringGeometry args={[0.05, 0.075, 32]} />
            <meshBasicMaterial color="#22d3ee" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.25, 0.0115]}>
            <circleGeometry args={[0.035, 24]} />
            <meshBasicMaterial color="#8b5cf6" toneMapped={false} />
          </mesh>
        </group>
        <pointLight ref={glow} position={[0, 0.5, -0.3]} color="#7dd3fc" intensity={1.5} distance={3} />
      </group>

      {/* desk accessories */}
      <mesh position={[1.2, 0.84, 0.5]}>
        <cylinderGeometry args={[0.07, 0.06, 0.12, 16]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.4} />
      </mesh>
      <mesh position={[-1.1, 0.8, 0.6]}>
        <boxGeometry args={[0.35, 0.02, 0.22]} />
        <meshStandardMaterial color="#10162f" roughness={0.6} />
      </mesh>

      {/* holographic monitors */}
      <HoloScreen position={[-1.55, 1.55, 0.35]} rotation={[0, 0.5, 0]} lines={JAVA} accent="#22d3ee" title="Harini.java" />
      <HoloScreen position={[1.55, 1.5, 0.35]} rotation={[0, -0.5, 0]} lines={PY} accent="#a78bfa" title="app.py" phase={1.7} />
      <HoloScreen position={[0, 2.5, 0.5]} rotation={[0, 0, 0]} lines={TERM} accent="#60a5fa" title="terminal" scale={0.85} phase={3.1} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Technology lab: helix of skill tiles                                */
/* ------------------------------------------------------------------ */
function SkillTile({ skill, index, total, textures }) {
  const ref = useRef()
  const mesh = useRef()
  const angle = (index / total) * Math.PI * 2 * 1.5
  const radius = store.mobile ? 2.6 : 3.3
  const y = 0.9 + (index / total) * 2.6
  const { camera } = useThree()
  const base = useMemo(() => new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius), [angle, radius, y])
  const [hovered, setHovered] = useHover()
  const target = useRef(1)

  useFrame(() => {
    const g = ref.current
    g.position.copy(base)
    g.quaternion.copy(camera.quaternion)
    target.current = store.hover.skill === index || hovered.current ? 1.3 : 1
    const s = lerp(mesh.current.scale.x, target.current, 0.15)
    mesh.current.scale.set(s, s, s)
  })

  return (
    <group ref={ref}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          store.hover.skill = index
          window.dispatchEvent(new CustomEvent('skillhover', { detail: index }))
          document.body.dataset.cursor = 'tile'
        }}
        onPointerOut={() => {
          setHovered(false)
          if (store.hover.skill === index) store.hover.skill = -1
          window.dispatchEvent(new CustomEvent('skillhover', { detail: -1 }))
          document.body.dataset.cursor = ''
        }}
      >
        <planeGeometry args={[0.96, 0.4]} />
        <meshBasicMaterial map={textures[index]} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function useHover() {
  const ref = useRef(false)
  const set = (v) => {
    ref.current = v
  }
  return [ref, set]
}

function TechLab() {
  const group = useRef()
  const core = useRef()
  const textures = useMemo(() => allSkills.map((s) => makeLabelTexture(s.name, s.color)), [])

  useFrame((state) => {
    const w = wt(store.t, 2, 1.0)
    const g = group.current
    g.visible = w > 0.01
    g.scale.setScalar(lerp(0.3, 1, w))
    if (!store.reduced) {
      g.rotation.y = state.clock.elapsedTime * 0.12
      core.current.rotation.x = state.clock.elapsedTime * 0.6
      core.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  return (
    <group ref={group} position={[0, 0, -0.5]}>
      {allSkills.map((s, i) => (
        <SkillTile key={s.name} skill={s} index={i} total={allSkills.length} textures={textures} />
      ))}
      <mesh ref={core} position={[0, 2.0, 0]}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color="#6d5bff" wireframe emissive="#6d5bff" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 2.0, 0]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.06, 64]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Project universe: three distinct planets                            */
/* ------------------------------------------------------------------ */
function Planet({ index, position, children }) {
  const ref = useRef()
  useFrame((state) => {
    const w = wt(store.t, 3, 1.0)
    const g = ref.current
    g.visible = w > 0.01
    const hov = store.hover.project === index ? 1.25 : 1
    const s = lerp(g.scale.x, lerp(0.2, 1, w) * hov, 0.12)
    g.scale.setScalar(Math.max(s, 0.001))
    if (!store.reduced) {
      g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9 + index * 2) * 0.12
      g.rotation.y += 0.004 + (store.hover.project === index ? 0.02 : 0)
    }
  })
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  )
}

function CloudPlanet() {
  const ring = useRef()
  useFrame((s) => {
    if (!store.reduced) ring.current.rotation.z = s.clock.elapsedTime * 0.5
  })
  return (
    <>
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#0e7490" emissive="#22d3ee" emissiveIntensity={0.35} flatShading roughness={0.4} />
      </mesh>
      {[[-0.3, 0.9, 0.2, 0.32], [0.05, 1.05, 0.1, 0.4], [0.42, 0.9, 0.2, 0.3]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshStandardMaterial color="#e0f7ff" emissive="#7dd3fc" emissiveIntensity={0.5} roughness={0.9} />
        </mesh>
      ))}
      <mesh ref={ring} rotation={[1.2, 0, 0]}>
        <torusGeometry args={[1.25, 0.015, 8, 80]} />
        <meshBasicMaterial color="#22d3ee" />
      </mesh>
    </>
  )
}

function DoctorPlanet() {
  const pulse = useRef()
  useFrame((s) => {
    if (store.reduced) return
    const k = (s.clock.elapsedTime * 0.8) % 1
    pulse.current.scale.setScalar(1 + k * 0.7)
    pulse.current.material.opacity = 0.7 * (1 - k)
  })
  return (
    <>
      <mesh>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial color="#7c3aed" emissive="#a78bfa" emissiveIntensity={0.3} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.78]}>
        <boxGeometry args={[0.46, 0.14, 0.1]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.78]}>
        <boxGeometry args={[0.14, 0.46, 0.1]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={pulse}>
        <torusGeometry args={[1.0, 0.012, 8, 80]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.6} />
      </mesh>
    </>
  )
}

function BotPlanet() {
  const orbit = useRef()
  useFrame((s) => {
    if (!store.reduced) orbit.current.rotation.y = s.clock.elapsedTime * 0.8
  })
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={0.3} roughness={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.83, 16, 12]} />
        <meshBasicMaterial color="#93c5fd" wireframe transparent opacity={0.25} />
      </mesh>
      {/* chat bubbles */}
      <mesh position={[-0.2, 0.15, 0.82]}>
        <boxGeometry args={[0.6, 0.3, 0.06]} />
        <meshStandardMaterial color="#e0e7ff" emissive="#c7d2fe" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.2, -0.25, 0.82]}>
        <boxGeometry args={[0.5, 0.26, 0.06]} />
        <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={0.5} />
      </mesh>
      <group ref={orbit}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[Math.cos((i / 4) * Math.PI * 2) * 1.2, 0.1 * i - 0.1, Math.sin((i / 4) * Math.PI * 2) * 1.2]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
    </>
  )
}

function ProjectUniverse() {
  return (
    <>
      <Planet index={0} position={[-0.6, 2.4, -0.5]}>
        <CloudPlanet />
      </Planet>
      <Planet index={1} position={[1.9, 3.0, -1.6]}>
        <DoctorPlanet />
      </Planet>
      <Planet index={2} position={[4.2, 2.4, -0.5]}>
        <BotPlanet />
      </Planet>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Experience: glowing path with three nodes                           */
/* ------------------------------------------------------------------ */
function Timeline() {
  const group = useRef()
  const nodes = useRef([])
  const xs = [1.6, 3.0, 4.4]
  const colors = ['#22d3ee', '#a78bfa', '#60a5fa']

  useFrame((state) => {
    const w = wt(store.t, 4, 1.0)
    group.current.visible = w > 0.01
    group.current.scale.setScalar(lerp(0.4, 1, w))
    nodes.current.forEach((n, i) => {
      if (!n) return
      const hov = store.hover.exp === i ? 1.5 : 1
      const bob = store.reduced ? 0 : Math.sin(state.clock.elapsedTime * 1.4 + i) * 0.06
      n.position.y = 1.3 + bob
      const s = lerp(n.scale.x, hov, 0.15)
      n.scale.setScalar(s)
      n.rotation.y += store.reduced ? 0 : 0.02
    })
  })

  return (
    <group ref={group}>
      <mesh position={[3.0, 0.02, 0.6]}>
        <boxGeometry args={[5.4, 0.02, 0.3]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} />
      </mesh>
      {xs.map((x, i) => (
        <group key={x} position={[x, 0, 0.6]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
            <meshBasicMaterial color={colors[i]} transparent opacity={0.6} />
          </mesh>
          <mesh ref={(el) => (nodes.current[i] = el)} position={[0, 1.3, 0]}>
            <octahedronGeometry args={[0.32, 0]} />
            <meshStandardMaterial color={colors[i]} emissive={colors[i]} emissiveIntensity={0.9} flatShading />
          </mesh>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.42, 32]} />
            <meshBasicMaterial color={colors[i]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Education: two steps and a graduation cap                           */
/* ------------------------------------------------------------------ */
function Steps() {
  const group = useRef()
  const cap = useRef()
  useFrame((state) => {
    const w = wt(store.t, 5, 1.0)
    group.current.visible = w > 0.01
    group.current.scale.setScalar(lerp(0.4, 1, w))
    if (!store.reduced) {
      cap.current.position.y = 2.9 + Math.sin(state.clock.elapsedTime * 1.2) * 0.1
      cap.current.rotation.y = state.clock.elapsedTime * 0.8
    }
  })
  return (
    <group ref={group}>
      <mesh position={[1.4, 0.2, 0.5]}>
        <boxGeometry args={[1.5, 0.4, 1.5]} />
        <meshStandardMaterial color="#18204a" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[1.4, 0.405, 0.5]}>
        <boxGeometry args={[1.5, 0.01, 1.5]} />
        <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[3.5, 0.35, 0.5]}>
        <boxGeometry args={[1.8, 0.7, 1.6]} />
        <meshStandardMaterial color="#1c1f55" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[3.5, 0.705, 0.5]}>
        <boxGeometry args={[1.8, 0.01, 1.6]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.9} />
      </mesh>
      <group ref={cap} position={[3.5, 2.9, 0.5]}>
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.7, 0.05, 0.7]} />
          <meshStandardMaterial color="#10162f" emissive="#22d3ee" emissiveIntensity={0.25} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.2, 16]} />
          <meshStandardMaterial color="#10162f" />
        </mesh>
        <mesh position={[0.3, -0.08, 0.3]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Certifications: arc of medals                                       */
/* ------------------------------------------------------------------ */
const KIND_COLOR = {
  Certification: '#22d3ee',
  Achievement: '#fbbf24',
  'Conference paper': '#a78bfa',
}

function Badges() {
  const group = useRef()
  const items = useRef([])
  const n = certifications.length
  useFrame((state) => {
    const w = wt(store.t, 6, 1.0)
    group.current.visible = w > 0.01
    group.current.scale.setScalar(lerp(0.4, 1, w))
    items.current.forEach((m, i) => {
      if (!m) return
      if (!store.reduced) {
        m.rotation.y = Math.sin(state.clock.elapsedTime * 0.7 + i) * 0.5
        m.position.y = 2.2 + Math.sin(state.clock.elapsedTime * 0.9 + i * 0.8) * 0.12 + Math.cos(((i / (n - 1)) - 0.5) * 1.8) * 0.6
      }
    })
  })
  return (
    <group ref={group}>
      {certifications.map((c, i) => {
        const a = (i / (n - 1) - 0.5) * 1.9
        const col = KIND_COLOR[c.kind]
        return (
          <group
            key={c.id}
            ref={(el) => (items.current[i] = el)}
            position={[Math.sin(a) * 5.0, 2.2, -Math.cos(a) * 3.2]}
          >
            <mesh>
              <torusGeometry args={[0.36, 0.045, 12, 40]} />
              <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.8} metalness={0.5} roughness={0.3} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.05, 28]} />
              <meshStandardMaterial color="#10162f" metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.03]}>
              <circleGeometry args={[0.12, 6]} />
              <meshBasicMaterial color={col} toneMapped={false} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Floating technology particles + floor                               */
/* ------------------------------------------------------------------ */
function Particles() {
  const ref = useRef()
  const count = store.mobile ? 70 : 220
  const { positions, colors } = useMemo(() => {
    const p = new Float32Array(count * 3)
    const c = new Float32Array(count * 3)
    const palette = [new THREE.Color('#22d3ee'), new THREE.Color('#8b5cf6'), new THREE.Color('#60a5fa')]
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 18
      p[i * 3 + 1] = Math.random() * 7
      p[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1
      const col = palette[i % 3]
      c[i * 3] = col.r
      c[i * 3 + 1] = col.g
      c[i * 3 + 2] = col.b
    }
    return { positions: p, colors: c }
  }, [count])

  useFrame((state, delta) => {
    if (store.reduced) return
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * (0.1 + (i % 5) * 0.03)
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = 0
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y = store.t * 0.12 + state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

const BG_DARK = ['#070b1f', '#0a1030', '#07162e', '#14093a', '#07182c', '#0d0b30', '#100a33', '#070b1f'].map((c) => new THREE.Color(c))
const BG_LIGHT = ['#eef2ff', '#e8edff', '#e6f2fb', '#f0eaff', '#e6f3fa', '#ece9ff', '#efe9ff', '#eef2ff'].map((c) => new THREE.Color(c))
const tmp = new THREE.Color()

function Environment() {
  const grid = useRef()
  const { scene } = useThree()
  useFrame(() => {
    const t = store.t
    const arr = store.theme === 'light' ? BG_LIGHT : BG_DARK
    const i = Math.min(Math.floor(t), 6)
    tmp.copy(arr[i]).lerp(arr[i + 1], ease(t - i))
    if (!scene.background) scene.background = new THREE.Color()
    scene.background.copy(tmp)
    if (scene.fog) scene.fog.color.copy(tmp)
    if (grid.current) {
      grid.current.material.opacity = store.theme === 'light' ? 0.35 : 0.5
    }
  })
  return (
    <>
      <fog attach="fog" args={['#070b1f', 12, 34]} />
      <gridHelper ref={grid} args={[60, 60, '#3b82f6', '#1e2a5a']} position={[0, 0, 0]} material-transparent material-opacity={0.5} />
    </>
  )
}

export default function Stage() {
  return (
    <>
      <Environment />
      <Particles />
      <Workstation />
      <TechLab />
      <ProjectUniverse />
      <Timeline />
      <Steps />
      <Badges />
    </>
  )
}
