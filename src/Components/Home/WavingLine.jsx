import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

const WavingLine = (props) => {
  const mountRef = useRef(null);
  const heroRef = props.heroRef;
  const themeColor = useSelector((state) => state.theme.themeColor);
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Line setup
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff00ff });
    const lineGeometry = new THREE.BufferGeometry();

    // Create points for the line
    const points = [];
    const lineSegments = 100; // Number of segments
    for (let i = 0; i <= lineSegments; i++) {
      points.push(new THREE.Vector3(i - lineSegments / 2, 0, 0));
    }
    lineGeometry.setFromPoints(points);

    // Store positions for animation
    const linePositions = lineGeometry.attributes.position.array;

    const line = new THREE.Line(lineGeometry, lineMaterial);
    lineMaterial.color.set(themeColor);
    scene.add(line);

    // Cursor position tracking
    const cursor = { x: 0, y: 0 };

    const handleMouseMove = (event) => {
      const rect = heroRef.current.getBoundingClientRect();
      cursor.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      cursor.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    // Event listener for mouse movement
    heroRef.current.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.05;

      // Update line positions based on cursor
      for (let i = 0; i <= lineSegments; i++) {
        const index = i * 3; // Each vertex has x, y, z
        const x = linePositions[index];
        linePositions[index + 1] =
          Math.sin(x * 0.5 + time) * 0.5 + cursor.y * 2; // Y position reacts to cursor
      }
      let isTransparent = false;
      lineGeometry.attributes.position.needsUpdate = true;
      renderer.setClearColor(isTransparent ? 0 : 1);
      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="wavingline" />;
};

export default WavingLine;
