import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { RootState } from "../../store/store";

interface WavingLineProps {
  heroRef?: React.RefObject<HTMLElement>;
}

export default function WavingLine({}: WavingLineProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeColor = useSelector((state: RootState) => state.theme.themeColor);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || 200;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const lineMaterial = new THREE.LineBasicMaterial({ color: themeColor || 0x00ffff });
    const lineGeometry = new THREE.BufferGeometry();

    const lineSegments = 100;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= lineSegments; i++) {
      points.push(new THREE.Vector3(i - lineSegments / 2, 0, 0));
    }
    lineGeometry.setFromPoints(points);

    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const posArray = lineGeometry.attributes.position.array as Float32Array;

      for (let i = 0; i <= lineSegments; i++) {
        const x = i - lineSegments / 2;
        posArray[i * 3 + 1] = Math.sin(x * 0.2 + time * 2) * 1.5;
      }
      lineGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [themeColor]);

  return <div ref={mountRef} className="w-full h-32 pointer-events-none" />;
}
