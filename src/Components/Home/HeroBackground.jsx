import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

const HeroBackground = (props) => {
  const mountRef = useRef(null);
  const heroRef = props.heroRef;
  const themeMode = useSelector((state) => state.theme.themeMode);
  useEffect(() => {
    // Initialize the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    // Create renderer and append it to the canvas container
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);
    const getParticalsObject = (numOfParticals, image) => {
      const particlesCount = numOfParticals;
      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particlesCount * 3);

      // Randomize particle positions
      for (let i = 0; i < particlesCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10; // X
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z
      }
      const loadingManager = new THREE.LoadingManager();
      loadingManager.onError = (err) => console.log(err);
      loadingManager.onLoad = () => console.log("loaded");
      const textureLoader = new THREE.TextureLoader(loadingManager);
      const imageTexture = textureLoader.load(image);
      imageTexture.colorSpace = THREE.SRGBColorSpace;
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particlesMaterial = new THREE.PointsMaterial({
        map: imageTexture, // Particle color
        size: 0.1,
        transparent: true,
        opacity: 0.8,
      });

      return new THREE.Points(particlesGeometry, particlesMaterial);
    };
    let particles = new Array(6);
    for (let i = 0; i < particles.length; i++) {
      particles[i] = getParticalsObject(100, "/emoji" + (i + 1) + ".png");
      scene.add(particles[i]);
    }
    // Create particle system (simple animated background)

    // Set camera position
    camera.position.z = 5;

    // Track mouse position
    const mouse = { x: 0, y: 0 };

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const animate = () => {
      for (let i = 0; i < particles.length; i++) {
        // Rotate particles for animation effect
        particles[i].rotation.x += 0.001;
        particles[i].rotation.y += 0.001;

        // Parallax effect based on mouse position
        particles[i].rotation.x += mouse.y * 0.005;
        particles[i].rotation.y += mouse.x * 0.005;
      }
      let isTransparent = true;
      renderer.setClearColor(0x000000, 0);
      // Render the scene
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const onWindowResize = () => {
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };

    window.addEventListener("resize", onWindowResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("mousemove", onMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <style>
        {`
      .background{
        background-color: ${
          themeMode === "white"
            ? "color-mix(in srgb, var(--theme-color) 10%, var(--theme-mode))"
            : "color-mix(in srgb, var(--opposite-theme-mode) 8%, var(--theme-mode) )"
        }
      }
    `}
      </style>
      <div ref={mountRef} className="background herobackground" />;
    </>
  );
};

export default HeroBackground;
