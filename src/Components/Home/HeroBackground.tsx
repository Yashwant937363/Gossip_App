import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";
import { RootState } from "../../store/store";

interface HeroBackgroundProps {
  heroRef: React.RefObject<HTMLElement>;
}

export default function HeroBackground({ heroRef }: HeroBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeMode = useSelector((state: RootState) => state.theme.themeMode);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    currentMount.appendChild(renderer.domElement);

    const getParticalsObject = (numOfParticals: number, image: string) => {
      const particlesCount = numOfParticals;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }

      const textureLoader = new THREE.TextureLoader();
      const imageTexture = textureLoader.load(image);
      imageTexture.colorSpace = THREE.SRGBColorSpace;
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        map: imageTexture,
        size: 0.1,
        transparent: true,
        alphaTest: 0.5,
      });

      return new THREE.Points(particlesGeometry, particlesMaterial);
    };

    const particleImg =
      themeMode === "white"
        ? "/applogo_black_without_background.png"
        : "/applogo_white_without_background.png";

    const particles = getParticalsObject(100, particleImg);
    scene.add(particles);

    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [themeMode]);

  return <div ref={mountRef} className="absolute inset-0 -z-10 pointer-events-none opacity-60" />;
}
