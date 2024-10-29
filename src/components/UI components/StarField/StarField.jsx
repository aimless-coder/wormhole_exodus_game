import * as THREE from "three";
import { useEffect, useRef} from "react";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import getStarPoint from "../../Game/GameComps/starPoint";

const StarField = () => {        
    const containerRef = useRef();

    useEffect(() => {
            
    let w = window.innerWidth;
    let h = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.3);
            
    const aspect = w/h;
    const camera = new THREE.PerspectiveCamera(80, aspect, 0.1, 1000);
    camera.position.z = 3;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);

    const sceneRender = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass( new  THREE.Vector2(w, h), 1.5, 0.4, 100);
    bloomPass.threshold  = 0.002;
    bloomPass.strength = 3.5;
    bloomPass.radius = 0;
    const composer = new EffectComposer(renderer);
    composer.addPass(sceneRender);
    composer.addPass(bloomPass);
        
    const stars = getStarPoint();
    scene.add(stars);
    composer.render(scene, camera);

    const animate = () => {
        requestAnimationFrame(animate);
        composer.render();
    };

    animate();

    const handleWindowResize = () => {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      }
      window.addEventListener("resize", handleWindowResize);
  
      return () => {
        window.removeEventListener("resize", handleWindowResize);
        containerRef.current.removeChild(renderer.domElement);
      };
    }, []);
  
    return <div ref={containerRef} style={{ width: "100%", height: "100vh"}} />;
  }

export default StarField
  
