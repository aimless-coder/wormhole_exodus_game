import * as THREE from "three";
import { useEffect, useRef} from "react";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const StarField = () => {

    const getStarfield = (numStars = 500) => {
        function randomSpherePoint() {
            const radius = Math.random() * 25 + 25;
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);
        
            return {
              pos: new THREE.Vector3(x, y, z),
              hue: 0.6, // radius * 0.02 + 0.5
              minDist: radius,
            };
          }
          const verts = [];
          const colors = [];
          const positions = [];
          let col;
          for (let i = 0; i < numStars; i += 1) {
            let p = randomSpherePoint();
            const { pos, hue } = p;
            positions.push(p);
            col = new THREE.Color().setHSL(hue, 0.2, Math.random());
            verts.push(pos.x, pos.y, pos.z);
            colors.push(col.r, col.g, col.b);
          }
          const geo = new THREE.BufferGeometry();
          geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
          geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
          const mat = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            map: new THREE.TextureLoader().load(
              "./images/circle.png"
            ),
            fog: false,
          });
          const points = new THREE.Points(geo, mat);
          return points;
        }
        
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
        
    const stars = getStarfield();
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
  
