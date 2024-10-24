import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Planet3D = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null); 
  const cameraRef = useRef(null);
  const ringsRef = useRef([]);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const aspectRatio = width/height;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, aspectRatio, 0.1, 1000);
    cameraRef.current = camera; 

    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(0.9, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
      map: textureLoader.load('./images/planet.png'), // 
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.rotation.z = -25 * Math.PI / 180;
    scene.add(planet);

    camera.position.z = 3;

    const ringMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        side: THREE.DoubleSide 
      });
    const numRings = 3;
    const ringCount = 20;
    const ringRadiusIncrement = 0.5;

    const astroidGroup = new THREE.Group();
    astroidGroup.rotation.z = -25 * Math.PI / 180;
    scene.add(astroidGroup);

    for (let i = 0; i < numRings; i++) {
      const ringGeometry = new THREE.RingGeometry(1 + i * ringRadiusIncrement, 1.1 + i * ringRadiusIncrement, 32);
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ringsRef.current.push(ring);

      for (let j = 0; j < ringCount; j++) {
        const asteroidGeometry = new THREE.IcosahedronGeometry(0.04, 0); 
        const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        
        const angle = (j / ringCount) * Math.PI * 2;
        const radius = 1 + Math.random() * (i * ringRadiusIncrement);
        asteroid.position.x = radius * Math.cos(angle);
        asteroid.position.z = radius * Math.sin(angle);

        asteroid.position.y = (Math.random() - 0.8) * 0.1; 
        astroidGroup.add(asteroid);
      }
    }

  const sunLight = new THREE.DirectionalLight(0xffffff);
  sunLight.position.set(-3, 1.5, 1.5)
  scene.add(sunLight)

  const ambientLight = new THREE.AmbientLight(0xff4d4d, 0.1);
  scene.add(ambientLight);

  const animate = () => {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.01;
    astroidGroup.rotation.y += 0.005;

    renderer.render(scene, camera);
  };

  animate();

    const handleResize = () => {
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default Planet3D;
