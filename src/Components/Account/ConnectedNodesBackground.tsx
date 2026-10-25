import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const createUserShape = () => {
  const group = new THREE.Group();

  const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const headMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 0.9;
  group.add(head);

  const torsoGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.8, 16);
  const torsoMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  torso.position.y = 0.2;
  group.add(torso);

  const scalingFactor = 0.2;
  group.scale.set(scalingFactor, scalingFactor, scalingFactor);

  return group;
};

const ConnectedNodes = () => {
  const groupRef = useRef<THREE.Group>(null);
  const linesGroup = useRef<THREE.Group>(new THREE.Group());

  const NODE_COUNT = 40;
  const nodes = useRef(
    Array.from({ length: NODE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
    }))
  ).current;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];

    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = node.position.distanceTo(otherNode.position);
          if (distance < 3) {
            positions.push(
              node.position.x,
              node.position.y,
              node.position.z,
              otherNode.position.x,
              otherNode.position.y,
              otherNode.position.z
            );
          }
        }
      });
    });

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.LineBasicMaterial({
      color: "#888888",
      transparent: true,
      opacity: 0.25,
    });
    const lineSegments = new THREE.LineSegments(geometry, material);

    linesGroup.current.clear();
    linesGroup.current.add(lineSegments);
  }, [nodes]);

  return (
    <group ref={groupRef}>
      {nodes.map((node, index) => (
        <primitive
          key={index}
          object={createUserShape()}
          position={node.position}
        />
      ))}
      <primitive object={linesGroup.current} />
    </group>
  );
};

export default function ConnectedNodesBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ConnectedNodes />
      </Canvas>
    </div>
  );
}
