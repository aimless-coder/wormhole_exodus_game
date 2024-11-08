import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import "./Game.css";
import levelConfig from "./GameComps/gameLevel";
import InGameUI from "../UI components/InGameUI/InGameUI";
import tubePath from "./GameComps/tubePath";
import obstacles from "./GameComps/obstacles";
import getCrosshair from "./GameComps/getCrosshair";
import getStarPoint from "./GameComps/starPoint";
import LevelComplete from "../UI components/LevelComplete/LevelComplete";
import Preloader from "../UI components/Preloader/Preloader";
import { useGameContext } from "../GameContext";

function WormholeShooter() {
  const { currentLevel, incrementLevel } = useGameContext();

  const containerRef = useRef();
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    levelConfig[currentLevel].timeLimit
  );

  const { obstacleCount, cameraSpeed, goal, timeLimit } =
    levelConfig[currentLevel];

  const handleLevelTimeout = () => {
    if (score < goal) {
      setIsComplete(true);
    }
  };

  const startGame = () => {
    setLoading(false);
  };

  const initializeGame = () => {
    let w = window.innerWidth;
    let h = window.innerHeight;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.3);

    // CAMERA SETUP
    const fov = 75;
    const aspect = w / h;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;
    scene.add(camera);

    //AUDIO SETUP
    const sounds = [];
    let explodeSound, laserSound;
    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {};
    const audioLoader = new THREE.AudioLoader(manager);
    const mp3s = ["explode", "laser"];
    const listener = new THREE.AudioListener();
    camera.add(listener);
    mp3s.forEach((name) => {
      const sound = new THREE.Audio(listener);
      sound.name = name;
      if (name === "explode") {
        explodeSound = sound;
      }
      if (name === "laser") {
        laserSound = sound;
      }
      sounds.push(sound);
      audioLoader.load(`./audio/${name}.mp3`, function (buffer) {
        sound.setBuffer(buffer);
      });
    });

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(w, h);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    //POST PROCESSING
    const sceneRender = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(w, h),
      1.5,
      0.4,
      100
    );
    bloomPass.threshold = 0.002;
    bloomPass.strength = 3;
    bloomPass.radius = 0;
    const composer = new EffectComposer(renderer);
    composer.addPass(sceneRender);
    composer.addPass(bloomPass);

    //GAME ENVIRONMENT

    const starField = getStarPoint();
    scene.add(starField);

    const { tubeHitArea, tubeLines, tubeGeometry } = tubePath();
    scene.add(tubeLines);
    scene.add(tubeHitArea);

    const { obstaclesGroup } = obstacles(obstacleCount);
    scene.add(obstaclesGroup);

    const { crosshair } = getCrosshair();
    camera.add(crosshair);

    let laserGroup = [];
    const rayCaster = new THREE.Raycaster();
    const direction = new THREE.Vector3();
    const impactPos = new THREE.Vector3();
    const impactColor = new THREE.Color();
    let impactBox = null;

    const laserGeometry = new THREE.IcosahedronGeometry(0.05, 2);

    const getLaserShot = () => {
      const laserMaterial = new THREE.MeshBasicMaterial({
        color: 0xff944d,
        transparent: true,
        fog: false,
      });
      let laserShot = new THREE.Mesh(laserGeometry, laserMaterial);
      laserShot.position.copy(camera.position);

      let active = true;
      let speed = 0.5;

      let hitPosition = camera.position
        .clone()
        .setFromMatrixPosition(crosshair.matrixWorld);
      const hitDirection = new THREE.Vector3(0, 0, 0);

      hitDirection
        .subVectors(laserShot.position, hitPosition)
        .normalize()
        .multiplyScalar(speed);

      direction.subVectors(hitPosition, camera.position);
      rayCaster.set(camera.position, direction);
      let intersect = rayCaster.intersectObjects(
        [...obstaclesGroup.children, tubeHitArea],
        true
      );

      if (intersect.length > 0) {
        impactPos.copy(intersect[0].point);
        impactColor.copy(intersect[0].object.material.color);

        if (intersect[0].object.name === "box") {
          impactBox = intersect[0].object.userData.box;
          obstaclesGroup.remove(intersect[0].object);

          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= goal) {
              setIsComplete(true);
            }
            return newScore;
          });

          explodeSound.stop();
          explodeSound.detune = Math.floor(Math.random() * 1000 - 240);
          explodeSound.play();
        }
      }

      let scale = 1.0;
      let opacity = 1.0;
      let isExplode = false;

      const update = () => {
        if (active === true) {
          if (isExplode === false) {
            laserShot.position.sub(hitDirection);

            if (laserShot.position.distanceTo(impactPos) < 0.5) {
              laserShot.position.copy(impactPos);
              laserShot.material.color.set(impactColor);
              isExplode = true;
              impactBox?.scale.setScalar(0.0);
            }
          } else {
            if (opacity > 0.01) {
              scale += 0.2;
              opacity *= 0.85;
            } else {
              opacity = 0.0;
              scale = 0.01;
              active = false;
            }
            laserShot.scale.setScalar(scale);
            laserShot.material.opacity = opacity;
            laserShot.userData.active = active;
          }
        }
      };
      laserShot.userData = { update, active };
      return laserShot;
    };

    const fireLaserShot = () => {
      if (!isComplete && !loading) {
        const laser = getLaserShot();
        laserGroup.push(laser);
        scene.add(laser);

        if (!isComplete) {
          laserSound.stop();
          laserSound.detune = Math.floor(Math.random() * 1000 - 800);
          laserSound.play();
        }

        let inactiveLasers = laserGroup.filter(
          (l) => l.userData.active === false
        );
        scene.remove(...inactiveLasers);
        laserGroup = laserGroup.filter((l) => l.userData.active === true);
      }
    };

    if (!loading && !isComplete) {
      window.addEventListener("click", fireLaserShot);
    }

    const mousePos = new THREE.Vector2(0, 0);
    const onMouseMove = (e) => {
      h = window.innerHeight;
      w = window.innerWidth;
      let aspect = w / h;
      let fudge = { x: aspect * 0.75, y: 0.75 };
      mousePos.x = ((e.clientX / w) * 2 - 1) * fudge.x;
      mousePos.y = (-1 * (e.clientY / h) * 2 + 1) * fudge.y;
    };

    window.addEventListener("mousemove", onMouseMove, false);

    const updateCamera = (t) => {
      const time = t * cameraSpeed;
      const loopTime = 15 * 1000;
      const p = (time % loopTime) / loopTime;
      const pos = tubeGeometry.parameters.path.getPointAt(p);
      const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
      camera.position.copy(pos);
      camera.lookAt(lookAt);
    };

    // ANIMATION LOOP
    const animate = (t = 0) => {
      if (!isComplete) {
        animationRef.current = requestAnimationFrame(animate);
        updateCamera(t);
        obstaclesGroup.children.forEach((obstacle) => {
          obstacle.rotation.y += 0.03;
        });
        crosshair.position.set(mousePos.x, mousePos.y, -1);
        laserGroup.forEach((l) => l.userData.update());
        composer.render(scene, camera);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // RESIZE HANDLING
    const handleWindowResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      bloomPass.setSize(w, h);
    };
    window.addEventListener("resize", handleWindowResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("click", fireLaserShot);

      if (explodeSound) explodeSound.stop();
      if (laserSound) laserSound.stop();

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  };

  useEffect(() => {
    setTimeRemaining(timeLimit);

    let timer;
    if (!isComplete) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleLevelTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentLevel, isComplete]);

  useEffect(() => {
    if (!isComplete) {
      if (loading) {
        setTimeout(startGame, 2000);
      } else {
        initializeGame();
      }
    }
  }, [loading, isComplete]);

  return (
    <div className="game">
      <div className="game-wrapper">
        {loading ? (
          <Preloader />
        ) : (
          <div>
            <div ref={containerRef} className="gameContainer" />
            <div className="ui-wrapper">
              {!isComplete && (
                <InGameUI
                  score={score}
                  goal={goal}
                  time={timeRemaining}
                  timeLimit={timeLimit}
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="game-complete">
        {isComplete && (
          <LevelComplete score={score} goal={goal} level={currentLevel} />
        )}
      </div>
    </div>
  );
}

export default WormholeShooter;
