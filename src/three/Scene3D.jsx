import { useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { store, kf } from './store'
import Character from './Character'
import Stage from './Stage'

// Camera keyframes, one per scene (0..7)
const CAM_POS = [
  [2.4, 1.9, 4.6],
  [0.9, 1.55, 2.4],
  [0, 2.4, 7.8],
  [1.6, 2.1, 8.2],
  [2.4, 2.2, 7.2],
  [2.2, 2.0, 7.0],
  [0, 1.9, 7.6],
  [0, 1.55, 3.7],
]
const CAM_LOOK = [
  [0, 1.3, -0.3],
  [0, 1.35, -0.6],
  [0, 1.7, 0],
  [1.6, 1.9, 0],
  [2.4, 1.2, 0],
  [2.2, 1.3, 0],
  [0, 1.9, 0],
  [0, 1.3, -0.5],
]
// Horizontal framing shift: pushes the 3D subject to the right on desktop
// where the text sits on the left. 0 for centred / full-width scenes.
const OFFSET = [0.2, 0.2, 0.2, 0, 0.18, 0.18, 0, 0.2]

const look = new THREE.Vector3()

function CameraRig() {
  const { camera, size, invalidate } = useThree()

  useEffect(() => {
    store.invalidate = invalidate
    return () => {
      store.invalidate = null
    }
  }, [invalidate])

  useFrame(() => {
    const t = store.t
    const px = store.reduced ? 0 : store.pointer.x
    const py = store.reduced ? 0 : store.pointer.y
    const pos = [0, 1, 2].map((a) => kf(t, CAM_POS.map((p) => p[a])))
    const tgt = [0, 1, 2].map((a) => kf(t, CAM_LOOK.map((p) => p[a])))
    camera.position.set(pos[0] + px * 0.35, pos[1] + py * 0.18, pos[2])
    look.set(tgt[0], tgt[1], tgt[2])
    camera.lookAt(look)

    const off = store.mobile ? 0 : kf(t, OFFSET)
    // On phones, lift the 3D subject into the upper part of the screen; text sits below.
    const voff = store.mobile ? size.height * 0.2 : 0
    if (off > 0.001 || voff > 0) {
      camera.setViewOffset(size.width, size.height, -size.width * off, voff, size.width, size.height)
    } else {
      camera.clearViewOffset()
    }
    const targetFov = store.mobile ? 62 : 42
    if (camera.fov !== targetFov) {
      camera.fov = targetFov
      camera.updateProjectionMatrix()
    }
  })
  return null
}

function Lights() {
  const light = store.theme === 'light'
  return (
    <>
      <ambientLight intensity={light ? 1.1 : 0.55} />
      <directionalLight position={[3, 6, 5]} intensity={light ? 1.4 : 1.15} />
      <pointLight position={[-4, 2.5, 3]} intensity={light ? 6 : 14} color="#22d3ee" distance={14} />
      <pointLight position={[4, 3, -2]} intensity={light ? 6 : 14} color="#8b5cf6" distance={14} />
    </>
  )
}

export default function Scene3D({ theme, onReady }) {
  return (
    <Canvas
      frameloop={store.reduced ? 'demand' : 'always'}
      dpr={store.mobile ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: store.mobile ? 62 : 42, near: 0.1, far: 60, position: [2.4, 1.9, 4.6] }}
      gl={{ antialias: !store.mobile, powerPreference: 'high-performance' }}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
      onCreated={() => onReady?.()}
    >
      <Lights key={theme} />
      <CameraRig />
      <Character />
      <Stage />
    </Canvas>
  )
}
