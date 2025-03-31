"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function ThreeDViewer() {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[10, 10, 10]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <StreetScene />
          <Environment preset="sunset" />
          <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} minDistance={5} maxDistance={20} />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-4 left-4 right-4 flex justify-center">
        <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          Drag to rotate | Scroll to zoom | Shift+drag to pan
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading 3D view...</p>
      </div>
    </div>
  )
}

function StreetScene() {
  // Simple placeholder scene with buildings
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#8a8a8a" />
      </mesh>

      {/* Main property */}
      <Building position={[0, 0, 0]} scale={[3, 2, 2]} color="#ffffff" />

      {/* Surrounding buildings */}
      <Building position={[-8, 0, -5]} scale={[2, 1.5, 2]} color="#e0e0e0" />
      <Building position={[8, 0, -7]} scale={[2.5, 1.2, 2]} color="#d0d0d0" />
      <Building position={[-6, 0, 8]} scale={[2, 1, 2]} color="#e5e5e5" />
      <Building position={[10, 0, 5]} scale={[3, 1.8, 2]} color="#dadada" />

      {/* Trees */}
      <Tree position={[-3, 0, 4]} scale={1.2} />
      <Tree position={[4, 0, 3]} scale={1} />
      <Tree position={[-5, 0, -3]} scale={0.8} />
      <Tree position={[6, 0, -2]} scale={1.5} />
    </group>
  )
}

function Building({ position, scale, color }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, scale[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[scale[0], scale[1], scale[2]]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, scale[1] + 0.25, 0]} castShadow>
        <boxGeometry args={[scale[0], 0.5, scale[2]]} />
        <meshStandardMaterial color="#555555" />
      </mesh>

      {/* Windows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`window-front-${i}`}
          position={[((i - 1) * scale[0]) / 3, scale[1] / 2, scale[2] / 2 + 0.01]}
          castShadow
        >
          <planeGeometry args={[0.5, 0.8]} />
          <meshStandardMaterial color="#88ccff" />
        </mesh>
      ))}

      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`window-back-${i}`}
          position={[((i - 1) * scale[0]) / 3, scale[1] / 2, -scale[2] / 2 - 0.01]}
          rotation={[0, Math.PI, 0]}
          castShadow
        >
          <planeGeometry args={[0.5, 0.8]} />
          <meshStandardMaterial color="#88ccff" />
        </mesh>
      ))}
    </group>
  )
}

function Tree({ position, scale = 1 }) {
  const treeRef = useRef()

  useFrame(({ clock }) => {
    if (treeRef.current) {
      // Gentle swaying motion
      treeRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
    }
  })

  return (
    <group position={position} ref={treeRef}>
      {/* Trunk */}
      <mesh position={[0, scale * 0.6, 0]} castShadow>
        <cylinderGeometry args={[scale * 0.1, scale * 0.2, scale * 1.2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Foliage */}
      <mesh position={[0, scale * 1.5, 0]} castShadow>
        <coneGeometry args={[scale * 1, scale * 2, 8]} />
        <meshStandardMaterial color="#2e8b57" />
      </mesh>
    </group>
  )
}

