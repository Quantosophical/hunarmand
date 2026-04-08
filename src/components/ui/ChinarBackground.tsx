'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ChinarBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create a stylized Chinar tree (half tree design)
    const chinarGroup = new THREE.Group();

    // Trunk - curved and elegant
    const trunkGeometry = new THREE.CylinderGeometry(0.15, 0.3, 4, 8);
    const trunkMaterial = new THREE.MeshBasicMaterial({
      color: 0x8B6020,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = -1;
    trunk.rotation.z = 0.1;
    chinarGroup.add(trunk);

    // Main branches spreading out (half tree - only right side)
    const branchPositions = [
      { x: 0.5, y: 0.5, z: 0, rx: 0, ry: 0, rz: 0.4, sx: 0.5 },
      { x: 0.8, y: 1, z: 0, rx: 0, ry: 0, rz: 0.2, sx: 0.4 },
      { x: 1.0, y: 1.5, z: 0, rx: 0, ry: 0, rz: 0.1, sx: 0.35 },
      { x: 0.6, y: -0.5, z: 0, rx: 0, ry: 0, rz: 0.5, sx: 0.45 },
      { x: 0.9, y: -1, z: 0, rx: 0, ry: 0, rz: 0.3, sx: 0.4 },
    ];

    branchPositions.forEach((pos) => {
      const branchGeo = new THREE.CylinderGeometry(0.05, 0.1, 1.5, 6);
      const branchMat = new THREE.MeshBasicMaterial({
        color: 0xA07830,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      });
      const branch = new THREE.Mesh(branchGeo, branchMat);
      branch.position.set(pos.x, pos.y, pos.z);
      branch.rotation.set(pos.rx, pos.ry, pos.rz);
      branch.scale.x = pos.sx;
      chinarGroup.add(branch);
    });

    // Chinar leaves - distinctive 5-lobed shape (only on right side)
    const createChinarLeaf = (x: number, y: number, z: number, scale: number) => {
      const leafGroup = new THREE.Group();

      // Create 5 lobes for Chinar leaf
      const lobePositions = [
        { x: 0, y: 0.3, z: 0 },      // Top
        { x: 0.25, y: 0.1, z: 0 },   // Top right
        { x: 0.2, y: -0.15, z: 0 },  // Bottom right
        { x: -0.2, y: -0.15, z: 0 }, // Bottom left
        { x: -0.25, y: 0.1, z: 0 },  // Top left
      ];

      lobePositions.forEach((lobePos) => {
        const lobeGeo = new THREE.SphereGeometry(0.15 * scale, 8, 8);
        const lobeMat = new THREE.MeshBasicMaterial({
          color: 0xC9A84C,
          wireframe: true,
          transparent: true,
          opacity: 0.08
        });
        const lobe = new THREE.Mesh(lobeGeo, lobeMat);
        lobe.position.set(lobePos.x, lobePos.y, lobePos.z);
        leafGroup.add(lobe);
      });

      leafGroup.position.set(x, y, z);
      return leafGroup;
    };

    // Add leaves around branches
    const leafPositions = [
      { x: 1.2, y: 0.8, z: 0, scale: 1 },
      { x: 1.5, y: 1.2, z: 0.2, scale: 0.8 },
      { x: 1.8, y: 0.5, z: -0.2, scale: 0.9 },
      { x: 1.3, y: -0.3, z: 0.1, scale: 0.85 },
      { x: 1.6, y: -0.8, z: 0, scale: 0.75 },
      { x: 2.0, y: 1.0, z: 0.1, scale: 0.7 },
      { x: 1.9, y: 0, z: -0.1, scale: 0.8 },
      { x: 1.4, y: 1.5, z: 0, scale: 0.6 },
    ];

    leafPositions.forEach((pos) => {
      const leaf = createChinarLeaf(pos.x, pos.y, pos.z, pos.scale);
      chinarGroup.add(leaf);
    });

    // Position the half tree on the right side
    chinarGroup.position.x = 1.5;
    chinarGroup.scale.set(1.8, 1.8, 1.8);
    scene.add(chinarGroup);

    // Add floating particles around the tree
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 1 + Math.random() * 3;  // Right side only
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xC9A84C,
      size: 0.02,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let animId: number;
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.001;

      // Gentle swaying motion
      chinarGroup.rotation.z = Math.sin(time) * 0.02;
      chinarGroup.rotation.y = Math.sin(time * 0.5) * 0.03;

      // Slowly rotate particles
      particles.rotation.y += 0.0003;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const currentMount = mountRef.current;

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />;
}
