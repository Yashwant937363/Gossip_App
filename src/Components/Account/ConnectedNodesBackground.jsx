import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const createUserShape = () => {
  const group = new THREE.Group();

  // Head (Sphere)
  const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const headMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 0.9; // Position head above the body
  group.add(head);

  // Body (Cylinder)
  const torsoGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.8, 16); // Cylinder for torso
  const torsoMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
  torso.position.y = 0.2; // Position the torso below the head
  group.add(torso);

  const scalingFactor = 0.5;
  group.scale.set(scalingFactor, scalingFactor, scalingFactor);

  return group;
};

const ConnectedNodes = () => {
  const groupRef = useRef();
  const linesGroup = useRef(new THREE.Group());

  const NODE_COUNT = 50;
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    position: new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ),
  }));

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; // Rotate the network slowly
    }
  });

  useEffect(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

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
      color: 0xffffff,
      linewidth: 1,
    });
    const lineSegments = new THREE.LineSegments(geometry, material);

    linesGroup.current.add(lineSegments);

    return () => {
      material.dispose();
      geometry.dispose();
    };
  }, [nodes]);

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node, index) => {
        const userShape = createUserShape(); // Create user shape
        userShape.position.copy(node.position); // Set position
        return <primitive key={index} object={userShape} />;
      })}
      {/* Lines */}
      <primitive object={linesGroup.current} />
    </group>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    camera.position.x += (mousePosition.x * 5 - camera.position.x) * 0.05;
    camera.position.y += (mousePosition.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const ConnectedNodesBackground = () => {
  return (
    <Canvas className="threebackground">
      <ambientLight intensity={1} />
      <CameraController />
      <ConnectedNodes />
    </Canvas>
  );
};

export default ConnectedNodesBackground;
