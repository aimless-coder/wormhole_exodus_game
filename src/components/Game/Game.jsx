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
import useExitConfirmation from "../../hooks/useExitConfirmation";

function WormholeShooter() {
  const { currentLevel, incrementLevel, isSoundEnabled } = useGameContext();
  useExitConfirmation();

  const containerRef = useRef();
  const rendererRef = useRef(null);
  const animationRef = useRef(null);
  const cleanupRef = useRef(null);
  const composerRef = useRef(null);
  const obstaclesGroupRef = useRef(null);
  const bgMusicRef = useRef(null);
  const laserSoundRef = useRef(null);
  const explodeSoundRef = useRef(null);

  const [isAnimatingEnd, setIsAnimatingEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    levelConfig[currentLevel].timeLimit
  );
  const [isComplete, setIsComplete] = useState(false);

  const { obstacleCount, cameraSpeed, goal, timeLimit } =
    levelConfig[currentLevel];

  const playSound = (sound) => {
    if (isSoundEnabled && sound) {
      sound.currentTime = 0;
      sound.play().catch((error) => {
        console.log("Sound playback failed:", error);
      });
    }
  };

  // Initialize sound effects
  useEffect(() => {
    if (isSoundEnabled) {
      const laserSound = new Audio("/audio/laser.mp3");
      const explodeSound = new Audio("/audio/explode.mp3");
      laserSound.volume = 0.3;
      explodeSound.volume = 0.3;
      laserSoundRef.current = laserSound;
      explodeSoundRef.current = explodeSound;

      const bgMusic = new Audio("/audio/gameBackground.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.4;
      bgMusic.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
      bgMusicRef.current = bgMusic;
    }

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (laserSoundRef.current) {
        laserSoundRef.current.pause();
        laserSoundRef.current = null;
      }
      if (explodeSoundRef.current) {
        explodeSoundRef.current.pause();
        explodeSoundRef.current = null;
      }
    };
  }, [isSoundEnabled]);

  const handleLevelTimeout = () => {
    if (score < goal) {
      setIsAnimatingEnd(true);
      if (obstaclesGroupRef.current) {
        obstaclesGroupRef.current.children.forEach((obstacle) => {
          obstacle.visible = false;
        });
      }
      setIsComplete(true);
    }
  };

  const handleLevelComplete = () => {
    setIsAnimatingEnd(true);
    // Let the last explosion animation finish before completing
    setTimeout(() => {
      setIsComplete(true);
      if (score >= goal) {
        incrementLevel();
      }
    }, 500); // Wait for explosion animation
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

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // POST PROCESSING SETUP
    const renderPass = new RenderPass(scene, camera);
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
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    //GAME ENVIRONMENT
    const starField = getStarPoint();
    scene.add(starField);

    const { tubeHitArea, tubeLines, tubeGeometry } = tubePath(currentLevel);
    scene.add(tubeLines);
    scene.add(tubeHitArea);

    const { obstaclesGroup } = obstacles(obstacleCount);
    scene.add(obstaclesGroup);
    obstaclesGroupRef.current = obstaclesGroup;

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
      // Play laser sound
      if (laserSoundRef.current) {
        playSound(laserSoundRef.current);
      }

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
          obstaclesGroupRef.current.remove(intersect[0].object);

          // Play explosion sound
          if (explodeSoundRef.current) {
            playSound(explodeSoundRef.current);
          }

          setScore((prev) => {
            const newScore = prev + 1;
            if (newScore >= goal) {
              handleLevelComplete();
            }
            return newScore;
          });
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
      if (!isAnimatingEnd && !loading) {
        const laser = getLaserShot();
        laserGroup.push(laser);
        scene.add(laser);

        let inactiveLasers = laserGroup.filter(
          (l) => l.userData.active === false
        );
        scene.remove(...inactiveLasers);
        laserGroup = laserGroup.filter((l) => l.userData.active === true);
      }
    };

    window.addEventListener("click", fireLaserShot);

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
      const speedMultiplier = isAnimatingEnd ? 3 : 1;
      const time = t * cameraSpeed * speedMultiplier;
      const loopTime = 15 * 1000;
      const p = (time % loopTime) / loopTime;
      const pos = tubeGeometry.parameters.path.getPointAt(p);
      const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
      camera.position.copy(pos);
      camera.lookAt(lookAt);
    };

    // WINDOW RESIZE HANDLER
    const handleWindowResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleWindowResize);

    // ANIMATION LOOP
    const animate = (t = 0) => {
      if (!isComplete) {
        animationRef.current = requestAnimationFrame(animate);
        updateCamera(t);

        if (!isAnimatingEnd) {
          obstaclesGroupRef.current?.children.forEach((obstacle) => {
            obstacle.rotation.y += 0.03;
          });
        }

        crosshair.position.set(mousePos.x, mousePos.y, -1);
        laserGroup.forEach((l) => l.userData.update());
        composerRef.current.render();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // CLEANUP
    const cleanup = () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("click", fireLaserShot);
      window.removeEventListener("mousemove", onMouseMove);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      // Clean up Three.js resources
      laserGeometry.dispose();
      laserGroup.forEach((laser) => {
        laser.geometry.dispose();
        laser.material.dispose();
      });

      if (composerRef.current) {
        composerRef.current.dispose();
      }

      // Clean up all audio
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current = null;
      }
      if (laserSoundRef.current) {
        laserSoundRef.current.pause();
        laserSoundRef.current = null;
      }
      if (explodeSoundRef.current) {
        explodeSoundRef.current.pause();
        explodeSoundRef.current = null;
      }
    };

    cleanupRef.current = cleanup;
  };

  useEffect(() => {
    setTimeRemaining(timeLimit);

    let timer;
    if (!isAnimatingEnd) {
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
  }, [currentLevel, isAnimatingEnd]);

  useEffect(() => {
    let timeoutId;
    if (!isAnimatingEnd) {
      if (loading) {
        timeoutId = setTimeout(startGame, 2000);
      } else {
        initializeGame();
      }
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [loading, isAnimatingEnd]);

  return (
    <div className="game">
      <div className="game-wrapper">
        {loading ? (
          <Preloader />
        ) : (
          <div>
            <div ref={containerRef} className="gameContainer" />
            <div className="ui-wrapper">
              {!isAnimatingEnd && !isComplete && (
                <InGameUI
                  score={score}
                  goal={goal}
                  time={timeRemaining}
                  timeLimit={timeLimit}
                  level={currentLevel + 1}
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
