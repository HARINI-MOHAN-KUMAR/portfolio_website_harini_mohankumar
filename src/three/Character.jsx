import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { store, kf } from './store'

// A fully procedural, stylised developer character (no external model needed).
// Pose is driven by the story position `store.t`.

const SKIN = '#c68a62'
const HAIR = '#16111f'
const BLAZER = '#5b4bd6'
const SHIRT = '#e8ecff'
const PANTS = '#1a2147'

const CHAR_X = [0, 0, -1.0, -2.3, -0.8, 3.0, 3.5, 0]
const CHAR_Z = [-0.45, -0.45, 1.8, 1.9, 1.4, 0.5, 1.6, -0.45]
const CHAR_Y = [0, 0, 0, 0, 0, 0.7, 0, 0]
const CHAR_ROT = [0, -0.15, 0.5, 0.55, 0.3, -0.35, -0.5, 0]
const SIT = [1, 1, 0, 0, 0, 0, 0, 1]
const TYPING = [1, 1, 0, 0, 0, 0, 0, 0]
const POINT = [0, 0, 1, 1, 0.7, 0.2, 0.6, 0]
const WAVE = [0, 0, 0, 0, 0, 0, 0, 1]

const L1 = 0.3
const L2 = 0.28

// 2-bone IK in the Y-Z plane. dy: up, dz: forward (relative to the shoulder).
function solveArm(dy, dz) {
  let d = Math.hypot(dy, dz)
  d = Math.min(Math.max(d, 0.12), L1 + L2 - 0.005)
  const phi = Math.atan2(dz, -dy)
  const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)
  const a = Math.acos(Math.min(1, Math.max(-1, cosA)))
  const tu = phi - a
  const ey = -L1 * Math.cos(tu)
  const ez = L1 * Math.sin(tu)
  const ty = -d * Math.cos(phi)
  const tz = d * Math.sin(phi)
  const tf = Math.atan2(tz - ez, -(ty - ey))
  return [-tu, -(tf - tu)]
}

const lerp = (a, b, f) => a + (b - a) * f

function Limb({ r, len, color, children, refGroup }) {
  return (
    <group ref={refGroup}>
      <mesh position={[0, -len / 2, 0]}>
        <capsuleGeometry args={[r, len - r * 2, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {children}
    </group>
  )
}

export default function Character() {
  const root = useRef()
  const hips = useRef()
  const torso = useRef()
  const head = useRef()
  const blinkL = useRef()
  const blinkR = useRef()
  const thigh = [useRef(), useRef()]
  const shin = [useRef(), useRef()]
  const upper = [useRef(), useRef()]
  const fore = [useRef(), useRef()]
  const walk = useRef({ phase: 0, px: 0, pz: 0 })

  useFrame((state) => {
    const t = store.t
    const time = store.reduced ? 0 : state.clock.elapsedTime
    const sit = kf(t, SIT)
    const typing = kf(t, TYPING) * sit
    const point = kf(t, POINT)
    const wave = kf(t, WAVE)

    // --- placement -----------------------------------------------------
    const x = kf(t, CHAR_X)
    const z = kf(t, CHAR_Z)
    const y = kf(t, CHAR_Y)
    const g = root.current
    g.position.set(x, y, z)
    g.rotation.y = kf(t, CHAR_ROT)

    // walking cycle when she is travelling between scenes
    const w = walk.current
    const speed = Math.hypot(x - w.px, z - w.pz)
    w.px = x
    w.pz = z
    const moving = store.reduced ? 0 : Math.min(1, speed * 90) * (1 - sit)
    w.phase += speed * 22

    hips.current.position.y = lerp(0.95, 0.52, sit) + (moving ? Math.abs(Math.sin(w.phase)) * 0.025 : 0)
    // breathing / idle sway
    const breath = Math.sin(time * 1.6) * 0.008
    torso.current.scale.y = 1 + breath
    torso.current.rotation.x = lerp(0.02, 0.14, typing)

    // --- legs ----------------------------------------------------------
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? 1 : -1
      const swing = Math.sin(w.phase + (s > 0 ? 0 : Math.PI)) * 0.55 * moving
      const bend = Math.max(0, Math.sin(w.phase + (s > 0 ? Math.PI : 0))) * 0.7 * moving
      thigh[i].current.rotation.x = -Math.PI / 2 * sit + swing
      shin[i].current.rotation.x = (Math.PI / 2) * sit + bend
    }

    // --- arms ----------------------------------------------------------
    const shoulderZ = 0.06
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? 1 : -1
      // rest
      let [ux, fx] = solveArm(-0.55, 0.04)
      let uz = s * 0.08
      // typing
      if (typing > 0.001) {
        const tap = Math.max(0, Math.sin(time * 15 + (s > 0 ? 0 : 1.9))) * 0.018
        const sweep = Math.sin(time * 3.2 + s) * 0.02
        let hy = -0.29 + tap
        let hz = 0.45 + sweep
        let zr = -s * 0.2
        // occasionally swipe the right-hand holo screen
        const cyc = (time % 9) / 1.8
        if (s > 0 && cyc < 1) {
          const k = Math.sin(cyc * Math.PI)
          hy = lerp(hy, 0.08, k)
          hz = lerp(hz, 0.5, k)
          zr = lerp(zr, s * 0.55, k)
        }
        const [tux, tfx] = solveArm(hy, hz)
        ux = lerp(ux, tux, typing)
        fx = lerp(fx, tfx, typing)
        uz = lerp(uz, zr, typing)
      }
      // pointing / presenting gesture (right arm mostly)
      if (point > 0.001) {
        const k = point * (s > 0 ? 1 : 0.0)
        const bob = Math.sin(time * 1.4) * 0.03
        const [pux, pfx] = solveArm(0.12 + bob, 0.5)
        ux = lerp(ux, pux, k)
        fx = lerp(fx, pfx, k)
        uz = lerp(uz, s * 0.45, k)
      }
      let uzFinal = uz
      let fz = 0
      if (wave > 0.001 && s > 0) {
        ux = lerp(ux, 0, wave)
        fx = lerp(fx, 0, wave)
        uzFinal = lerp(uz, s * (2.55 + Math.sin(time * 3) * 0.05), wave)
        fz = s * Math.sin(time * 7) * 0.55 * wave
      }
      const up = upper[i].current
      up.rotation.set(ux, 0, uzFinal)
      fore[i].current.rotation.set(fx, 0, fz)
      up.parent.position.z = shoulderZ
    }

    // --- head ----------------------------------------------------------
    const px = store.pointer.x
    const py = store.pointer.y
    head.current.rotation.y = lerp(head.current.rotation.y, px * 0.45, 0.08)
    head.current.rotation.x = lerp(head.current.rotation.x, -py * 0.25, 0.08)
    // blink
    const b = store.reduced ? 1 : Math.abs(Math.sin(time * 0.9)) > 0.985 ? 0.1 : 1
    blinkL.current.scale.y = b
    blinkR.current.scale.y = b
  })

  return (
    <group ref={root}>
      <group ref={hips} position={[0, 0.95, 0]}>
        {/* pelvis */}
        <mesh>
          <boxGeometry args={[0.38, 0.2, 0.24]} />
          <meshStandardMaterial color={PANTS} roughness={0.7} />
        </mesh>

        {/* legs */}
        {[1, -1].map((s, i) => (
          <group key={s} position={[s * 0.1, -0.05, 0]}>
            <Limb r={0.085} len={0.42} color={PANTS} refGroup={thigh[i]}>
              <group position={[0, -0.42, 0]}>
                <Limb r={0.07} len={0.42} color={PANTS} refGroup={shin[i]}>
                  <mesh position={[0, -0.43, 0.06]}>
                    <boxGeometry args={[0.13, 0.07, 0.26]} />
                    <meshStandardMaterial color="#0e1020" roughness={0.5} />
                  </mesh>
                  <mesh position={[0, -0.465, 0.06]}>
                    <boxGeometry args={[0.135, 0.012, 0.265]} />
                    <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.7} />
                  </mesh>
                </Limb>
              </group>
            </Limb>
          </group>
        ))}

        {/* torso */}
        <group ref={torso}>
          <mesh position={[0, 0.3, 0]}>
            <capsuleGeometry args={[0.17, 0.3, 8, 16]} />
            <meshStandardMaterial color={BLAZER} roughness={0.55} />
          </mesh>
          {/* shirt V */}
          <mesh position={[0, 0.5, 0.135]} rotation={[0.05, 0, 0]}>
            <boxGeometry args={[0.13, 0.2, 0.05]} />
            <meshStandardMaterial color={SHIRT} roughness={0.6} />
          </mesh>
          {/* lapel accent */}
          <mesh position={[0.09, 0.42, 0.155]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.025, 0.28, 0.02]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
          </mesh>

          {/* neck */}
          <mesh position={[0, 0.66, 0]}>
            <cylinderGeometry args={[0.055, 0.06, 0.1, 12]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>

          {/* head */}
          <group ref={head} position={[0, 0.82, 0]}>
            <mesh scale={[1, 1.1, 1.02]}>
              <sphereGeometry args={[0.15, 28, 20]} />
              <meshStandardMaterial color={SKIN} roughness={0.65} />
            </mesh>
            {/* hair: cap + long back */}
            <mesh position={[0, 0.02, -0.015]} rotation={[-0.35, 0, 0]} scale={[1.04, 1.1, 1.06]}>
              <sphereGeometry args={[0.158, 28, 18, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
              <meshStandardMaterial color={HAIR} roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.12, -0.085]}>
              <capsuleGeometry args={[0.115, 0.34, 8, 16]} />
              <meshStandardMaterial color={HAIR} roughness={0.45} />
            </mesh>
            {/* side hair framing the face */}
            {[1, -1].map((s) => (
              <mesh key={s} position={[s * 0.138, -0.04, 0.0]} scale={[0.5, 1.5, 0.9]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial color={HAIR} roughness={0.45} />
              </mesh>
            ))}
            {/* eyes */}
            <mesh ref={blinkL} position={[0.055, 0.015, 0.133]}>
              <sphereGeometry args={[0.017, 12, 12]} />
              <meshStandardMaterial color="#0b0b14" roughness={0.2} />
            </mesh>
            <mesh ref={blinkR} position={[-0.055, 0.015, 0.133]}>
              <sphereGeometry args={[0.017, 12, 12]} />
              <meshStandardMaterial color="#0b0b14" roughness={0.2} />
            </mesh>
            {/* brows */}
            {[1, -1].map((s) => (
              <mesh key={s} position={[s * 0.055, 0.055, 0.135]} rotation={[0, 0, s * -0.12]}>
                <boxGeometry args={[0.05, 0.008, 0.01]} />
                <meshStandardMaterial color={HAIR} />
              </mesh>
            ))}
            {/* nose + smile */}
            <mesh position={[0, -0.015, 0.15]}>
              <sphereGeometry args={[0.014, 10, 10]} />
              <meshStandardMaterial color="#b8795a" roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.06, 0.13]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.032, 0.004, 8, 20, Math.PI]} />
              <meshStandardMaterial color="#7a2e3b" />
            </mesh>
            {/* earring studs */}
            {[1, -1].map((s) => (
              <mesh key={s} position={[s * 0.15, -0.04, 0]}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} />
              </mesh>
            ))}
          </group>

          {/* arms (kept relative to hips-space by offsetting up the torso) */}
        </group>

        {[1, -1].map((s, i) => (
          <group key={s} position={[s * 0.24, 0.62, 0.06]}>
            <Limb r={0.058} len={L1} color={BLAZER} refGroup={upper[i]}>
              <group position={[0, -L1, 0]}>
                <Limb r={0.05} len={L2} color={BLAZER} refGroup={fore[i]}>
                  <mesh position={[0, -L2 - 0.02, 0.01]}>
                    <sphereGeometry args={[0.048, 12, 12]} />
                    <meshStandardMaterial color={SKIN} roughness={0.7} />
                  </mesh>
                </Limb>
              </group>
            </Limb>
          </group>
        ))}
      </group>
    </group>
  )
}
