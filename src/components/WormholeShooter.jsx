import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import spline from "./spline";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



function WormholeShooter() {
  const containerRef = useRef();
  
  useEffect(() => {
    
    let w = window.innerWidth;
    let h = window.innerHeight;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.3);
    
    // CAMERA SETUP
    const fov = 75;
    const aspect = w/h;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;
    scene.add(camera);
    
    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(w, h);

    //Cinematic Looks
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    containerRef.current.appendChild(renderer.domElement);

    //POST PROCESSING
    const sceneRender = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass( new  THREE.Vector2(w, h), 1.5, 0.4, 100);
    bloomPass.threshold  = 0.002;
    bloomPass.strength = 3.5;
    bloomPass.radius = 0;
    const composer = new EffectComposer(renderer);
    composer.addPass(sceneRender);
    composer.addPass(bloomPass);

    //GAME ENVIRONMENT

    //Tube Geometry
    const tubeGeometry = new THREE.TubeGeometry(spline, 225, 0.65, 16, true);
    
    //Modifying Tube Edges
    const edges = new THREE.EdgesGeometry(tubeGeometry, 0.3);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0099ff
    });
    const tubeLines = new THREE.LineSegments(edges, lineMaterial);
    scene.add(tubeLines);

    //Hit Map of Tube
    const hitMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.0,
      side: THREE.BackSide
    });
    const tubeHitArea = new THREE.Mesh(tubeGeometry, hitMaterial);
    scene.add(tubeHitArea);


    //CREATING OBSTACLES
    const obstaclesGroup = new THREE.Group();
    scene.add(obstaclesGroup);

    const numBoxes = 50;
    const size = 0.075;
    
    const obstaclesGeo = new THREE.BoxGeometry(size, size, size);

    for(let i = 0; i < numBoxes; i++){

      const p = (i / numBoxes + Math.random() * 0.1) % 1;
      const pos = tubeGeometry.parameters.path.getPointAt(p);

      const color = new THREE.Color().setHSL(0.7 + p, 1, 0.5);
      const hitBoxMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5
      });

      const hitBox = new THREE.Mesh(obstaclesGeo, hitBoxMat);
      hitBox.name = 'box';
      
      pos.x += Math.random() - 0.4;
      pos.y += Math.random() - 0.4;
      hitBox.position.copy(pos);

      const coords = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );

      hitBox.rotation.set(coords.x, coords.y, coords.z);
      hitBox.userData.box = hitBox;
      obstaclesGroup.add(hitBox);
    }


    //CROSSHAIR
    const mousePos = new THREE.Vector2(0, 0);
    const crosshair = new THREE.Group();
    crosshair.position.z = -1;
    camera.add(crosshair);
    const crossMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff
    });
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertex = [0, 0.05, 0, 0, 0.02, 0];
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(lineVertex, 3));

    for(let i = 0; i < 4; i++){
      const line = new THREE.Line(lineGeometry, crossMaterial);
      line.rotation.z = i * 0.5 * Math.PI;
      crosshair.add(line);
    }

    const rayCaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    const impactPos = new THREE.Vector3();
    const impactColor = new THREE.Color();
    let impactBox = null;

    let laserGroup = [];
    const laserGeometry = new THREE.IcosahedronGeometry(0.05, 2);

    const getLaserShot = () => {
      const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xff944d,
        transparent: true,
        fog: false
      });
      let laserShot = new THREE.Mesh(laserGeometry, laserMaterial);
      laserShot.position.copy(camera.position);

      let active = true;
      let speed = 0.5;

      let hitPosition = camera.position.clone().setFromMatrixPosition(crosshair.matrixWorld);
      const hitDirection = new THREE.Vector3(0,0,0);

      hitDirection.subVectors(laserShot.position, hitPosition).normalize().multiplyScalar(speed);

      direction.subVectors(hitPosition, camera.position);
      rayCaster.set(camera.position, direction);
      let intersect = rayCaster.intersectObjects([...obstaclesGroup.children, tubeHitArea], true);

      if(intersect.length > 0){
        impactPos.copy(intersect[0].point);
        impactColor.copy(intersect[0].object.material.color);

        if(intersect[0].object.name === 'box'){
          impactBox = intersect[0].object.userData.box;
          obstaclesGroup.remove(intersect[0].object);
        }
      } 

      let scale = 1.0;
      let opacity = 1.0;
      let isExplode = false;

      const update = () => {
        if(active === true){
          if(isExplode === false){

            laserShot.position.sub(hitDirection);

            if(laserShot.position.distanceTo(impactPos) < 0.5){

              laserShot.position.copy(impactPos);
              laserShot.material.color.set(impactColor);
              isExplode = true;
              impactBox?.scale.setScalar(0.0);
            }
          }else{
            if(opacity > 0.01){
              scale += 0.2;
              opacity *= 0.85;
            }else {
              opacity = 0.0;
              scale = 0.01;
              active = false;
            }
            laserShot.scale.setScalar(scale);
            laserShot.material.opacity = opacity;
            laserShot.userData.active = active;

          }
        }
      }
      laserShot.userData = {update, active};
      return laserShot;

    }

    const fireLaserShot = () => {
      const laser = getLaserShot();
      laserGroup.push(laser);
      scene.add(laser);

      let inactiveLasers = laserGroup.filter((l) => l.userData.active === false);
      scene.remove(...inactiveLasers);
      laserGroup = laserGroup.filter((l) => l.userData.active === true);
    }

    window.addEventListener('click', () => fireLaserShot());

    const onMouseMove = (e) => {
      h = window.innerHeight;
      w = window.innerWidth;
      let aspect = w/h;
      let fudge = {x: aspect * 0.75, y: 0.75};
      mousePos.x = ((e.clientX / w) * 2 - 1) * fudge.x;
      mousePos.y = (-1 * (e.clientY / h) * 2 + 1) * fudge.y;
    }

    window.addEventListener('mousemove', onMouseMove, false);    

    const updateCamera = (t) =>{
      const time = t * 0.1;
      const loopTime = 15 * 1000;
      const p = (time % loopTime) / loopTime;
      const pos = tubeGeometry.parameters.path.getPointAt(p);
      const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
      camera.position.copy(pos);
      camera.lookAt(lookAt);
    }

    // ANIMATION LOOP
    function animate(t = 0) {
      requestAnimationFrame(animate);
      updateCamera(t);
      crosshair.position.set(mousePos.x, mousePos.y, -1);
      laserGroup.forEach(l => l.userData.update());
      composer.render(scene, camera);
    }
    animate();

    // RESIZE HANDLING
    function handleWindowResize() {
      w = window.innerWidth;
      h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleWindowResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh", cursor: "none" }} />;
}

export default WormholeShooter;
