import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createCharacterMesh, createVehicleMesh } from './proceduralModels';
import { buildOpenWorldScene, buildDollhouseCutawayScene } from './worldBuilder';
import { sound } from '../utils/audio';
import { PlayerProfile, DeltaLocation } from '../types';

export type ViewMode = 'house_dollhouse' | 'street_walk' | 'map_overhead' | 'cab_ride';

interface GameCanvasProps {
  player: PlayerProfile;
  viewMode: ViewMode;
  activeFloor: 'downstairs' | 'upstairs';
  isDancing: boolean;
  cabDestination: DeltaLocation | null;
  onPickCash: (amount: number) => void;
  onNearLocationChange: (loc: DeltaLocation | null) => void;
  onNearPedestrianChange: (pedName: string | null) => void;
  onEnterLocation: (loc: DeltaLocation) => void;
  onStopDancing: () => void;
  touchInputRef: React.MutableRefObject<{
    moveX: number;
    moveY: number;
    jump: boolean;
    action: boolean;
    sprint: boolean;
  }>;
}

// Module-level pre-allocated math objects to avoid garbage collection
const _vec3 = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const _camOffset = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _forward = new THREE.Vector3();

export const GameCanvas: React.FC<GameCanvasProps> = ({
  player,
  viewMode,
  activeFloor,
  isDancing,
  cabDestination,
  onPickCash,
  onNearLocationChange,
  onNearPedestrianChange,
  onEnterLocation,
  onStopDancing,
  touchInputRef,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    player,
    viewMode,
    activeFloor,
    isDancing,
    cabDestination,
    onPickCash,
    onNearLocationChange,
    onNearPedestrianChange,
    onEnterLocation,
    onStopDancing,
  });

  useEffect(() => {
    stateRef.current = {
      player,
      viewMode,
      activeFloor,
      isDancing,
      cabDestination,
      onPickCash,
      onNearLocationChange,
      onNearPedestrianChange,
      onEnterLocation,
      onStopDancing,
    };
  }, [player, viewMode, activeFloor, isDancing, cabDestination, onPickCash, onNearLocationChange, onNearPedestrianChange, onEnterLocation, onStopDancing]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const isHouse = viewMode === 'house_dollhouse';
    const isMap = viewMode === 'map_overhead';

    scene.background = new THREE.Color(isHouse ? 0xbbf7d0 : (isMap ? 0x93c5fd : 0x7dd3fc));
    scene.fog = new THREE.Fog(isHouse ? 0xbbf7d0 : 0x93c5fd, isHouse ? 40 : 120, isHouse ? 90 : 350);

    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Environment Lighting via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Sunlight Key Light + Fill
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    dirLight.position.set(60, 110, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 400;
    const d = 80;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x1e293b, 0.75);
    scene.add(hemiLight);

    // 2. Build World or Dollhouse Scene
    const worldData = buildOpenWorldScene(scene);
    let dollhouseGroup: THREE.Group | null = null;

    if (isHouse) {
      worldData.exteriorGroup.visible = false;
      dollhouseGroup = buildDollhouseCutawayScene(scene, player.placedFurniture, activeFloor);
      camera.position.set(-14, 17, 16);
      camera.lookAt(0, 1.5, 0);
    } else {
      worldData.exteriorGroup.visible = true;
      camera.position.set(-100, 3.5, 82);
    }

    // 3. Player Character Mesh
    const playerMesh = createCharacterMesh(player.skinTone, player.outfitColor);
    playerMesh.position.set(-100, 0, 70); // Starts right outside villa gate on street
    scene.add(playerMesh);

    // Vehicle mesh for active vehicle or cab ride
    let vehicleMesh: THREE.Group | null = null;
    let isInVehicle = false;
    let isJet = false;

    const setupVehicle = (vehId: string | null) => {
      if (vehicleMesh) {
        scene.remove(vehicleMesh);
        vehicleMesh = null;
      }
      if (!vehId || isHouse) {
        isInVehicle = false;
        playerMesh.visible = !isHouse;
        return;
      }
      const type = (
        vehId.includes('jet') ? 'jet' :
        vehId.includes('gwagon') ? 'gwagon' :
        vehId.includes('supercar') ? 'supercar' :
        vehId.includes('keke') ? 'keke' : 'sedan'
      ) as 'keke' | 'sedan' | 'gwagon' | 'supercar' | 'jet';

      vehicleMesh = createVehicleMesh(type);
      vehicleMesh.position.copy(playerMesh.position);
      vehicleMesh.rotation.y = playerMesh.rotation.y;
      scene.add(vehicleMesh);
      isInVehicle = true;
      isJet = type === 'jet';
      playerMesh.visible = false;
    };

    if (viewMode === 'cab_ride') {
      // Cab ride mode: spawn cab sedan driving player!
      setupVehicle('cruiser_sedan');
    } else {
      setupVehicle(player.activeVehicleId);
    }

    // 4. Free Orbit Camera Dragging
    let isPointerDown = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let orbitAzimuth = 0.7;
    let orbitElevation = 0.65;
    let orbitDistance = 24;

    const handlePointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - prevPointerX;
      const dy = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      orbitAzimuth -= dx * 0.006;
      orbitElevation = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, orbitElevation + dy * 0.005));
    };

    const handlePointerUp = () => {
      isPointerDown = false;
    };

    const handleWheel = (e: WheelEvent) => {
      orbitDistance = Math.max(10, Math.min(80, orbitDistance + e.deltaY * 0.03));
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: true });

    // 5. Input System
    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'KeyE') {
        if (currentNearLocation) {
          stateRef.current.onEnterLocation(currentNearLocation);
        }
      }
      if (e.code === 'KeyF') {
        if (stateRef.current.isDancing) {
          stateRef.current.onStopDancing();
        } else {
          sound.playDanceBeat();
        }
      }
      if (e.code === 'KeyH') {
        sound.playHorn();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };
    const handleBlur = () => {
      Object.keys(keys).forEach((k) => (keys[k] = false));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Physics & Movement
    const playerPos = playerMesh.position.clone();
    let playerVelocityY = 0;
    let playerHeading = 0;
    let vehicleSpeed = 0;
    let flightAltitude = 0;
    let isGrounded = true;
    let currentNearLocation: DeltaLocation | null = null;
    let currentNearPedestrian: string | null = null;
    let danceTimer = 0;

    const clock = new THREE.Clock();
    let animFrameId: number;

    renderer.compile(scene, camera);

    // 6. Game Loop (60FPS)
    const tick = () => {
      animFrameId = requestAnimationFrame(tick);
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      const mode = stateRef.current.viewMode;

      if (mode === 'house_dollhouse') {
        // --- ISOMETRIC DOLLHOUSE CAMERA (as seen in video 00:04 & 00:31-00:46) ---
        sound.stopEngineSound();
        const targetX = Math.sin(orbitAzimuth) * Math.cos(orbitElevation) * orbitDistance;
        const targetY = Math.sin(orbitElevation) * orbitDistance;
        const targetZ = Math.cos(orbitAzimuth) * Math.cos(orbitElevation) * orbitDistance;

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 5, dt);
        camera.lookAt(0, 1.5, 0);

      } else if (mode === 'map_overhead') {
        // --- OVERHEAD 3D MAP CAMERA (as seen in video 00:10-00:30) ---
        sound.stopEngineSound();
        camera.position.x = THREE.MathUtils.damp(camera.position.x, 20, 4, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 90, 4, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, 70, 4, dt);
        camera.lookAt(20, 0, 10);

      } else if (mode === 'cab_ride') {
        // --- CAB RIDE HIGHWAY CRUISE (as seen in video 00:00-00:03) ---
        const dest = stateRef.current.cabDestination;
        if (dest && vehicleMesh) {
          // Cruise along road towards destination
          _vec3.set(dest.x, 0, dest.z);
          _moveDir.subVectors(_vec3, playerPos).normalize();
          playerHeading = Math.atan2(_moveDir.x, _moveDir.z);

          const cabSpeed = 35;
          playerPos.addScaledVector(_moveDir, cabSpeed * dt);
          vehicleMesh.position.copy(playerPos);
          vehicleMesh.rotation.y = playerHeading;

          sound.updateEngineSound(0.65, false);

          // Video camera perspective behind cab on highway
          _camOffset.set(
            playerPos.x - Math.sin(playerHeading) * 9,
            playerPos.y + 4.2,
            playerPos.z - Math.cos(playerHeading) * 9
          );
          camera.position.x = THREE.MathUtils.damp(camera.position.x, _camOffset.x, 6, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _camOffset.y, 6, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _camOffset.z, 6, dt);
          camera.lookAt(playerPos.x, playerPos.y + 1.2, playerPos.z);
        }

      } else {
        // --- THIRD PERSON STREET WALK & RUN (as seen in video 00:54-01:13) ---
        let moveForward = 0;
        let moveTurn = 0;

        if (keys['KeyW'] || keys['ArrowUp']) moveForward += 1;
        if (keys['KeyS'] || keys['ArrowDown']) moveForward -= 1;
        if (keys['KeyA'] || keys['ArrowLeft']) moveTurn += 1;
        if (keys['KeyD'] || keys['ArrowRight']) moveTurn -= 1;

        const touch = touchInputRef.current;
        if (Math.abs(touch.moveY) > 0.1) moveForward -= touch.moveY;
        if (Math.abs(touch.moveX) > 0.1) moveTurn -= touch.moveX;

        const isSprinting = keys['ShiftLeft'] || keys['ShiftRight'] || touch.sprint;
        const isJumping = keys['Space'] || touch.jump;
        const dancing = stateRef.current.isDancing;

        if (isInVehicle && vehicleMesh) {
          // Vehicle Driving
          const maxSpeed = isJet ? 95 : 45;
          if (moveForward > 0.1) vehicleSpeed = Math.min(vehicleSpeed + 26 * dt, maxSpeed);
          else if (moveForward < -0.1) vehicleSpeed = Math.max(vehicleSpeed - 20 * dt, -maxSpeed * 0.3);
          else vehicleSpeed = THREE.MathUtils.damp(vehicleSpeed, 0, 4, dt);

          if (Math.abs(vehicleSpeed) > 0.5) {
            playerHeading += moveTurn * 2.2 * dt * (vehicleSpeed > 0 ? 1 : -1);
          }

          if (isJet && isJumping && vehicleSpeed > 30) {
            flightAltitude = Math.min(flightAltitude + 25 * dt, 110);
          } else if (isJet && keys['KeyC']) {
            flightAltitude = Math.max(0, flightAltitude - 20 * dt);
          }

          _forward.set(Math.sin(playerHeading), 0, Math.cos(playerHeading));
          playerPos.addScaledVector(_forward, vehicleSpeed * dt);
          playerPos.y = flightAltitude;

          vehicleMesh.position.copy(playerPos);
          vehicleMesh.rotation.y = playerHeading;
          sound.updateEngineSound(Math.abs(vehicleSpeed) / maxSpeed, isJet);

          _camOffset.set(
            playerPos.x - Math.sin(playerHeading) * (isJet ? 22 : 10),
            playerPos.y + (isJet ? 8 : 4.5),
            playerPos.z - Math.cos(playerHeading) * (isJet ? 22 : 10)
          );
          camera.position.x = THREE.MathUtils.damp(camera.position.x, _camOffset.x, 6, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _camOffset.y, 6, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _camOffset.z, 6, dt);
          camera.lookAt(playerPos.x, playerPos.y + 1.2, playerPos.z);

        } else {
          // On Foot Character Controller (GTA-style Walk & Sprint)
          sound.stopEngineSound();

          // Calculate analog joystick magnitude
          const analogMag = Math.hypot(touch.moveX, touch.moveY);
          const isSprintByAnalog = analogMag > 0.65;
          const isSprinting = keys['ShiftLeft'] || keys['ShiftRight'] || touch.sprint || isSprintByAnalog;

          const baseSpeed = isSprinting ? 9.5 : (analogMag > 0.1 ? 2.8 + analogMag * 2.8 : 4.8);
          const hasInput = Math.abs(moveForward) > 0.05 || Math.abs(moveTurn) > 0.05 || analogMag > 0.08;

          if (hasInput && !dancing) {
            _moveDir.set(moveTurn, 0, moveForward).normalize();
            const targetHeading = Math.atan2(_moveDir.x, _moveDir.z);

            // Smooth rotational damping for authentic GTA character turn
            let diff = targetHeading - playerHeading;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            playerHeading += diff * Math.min(1, 14 * dt);

            _vec3.set(Math.sin(playerHeading), 0, Math.cos(playerHeading));
            playerPos.addScaledVector(_vec3, baseSpeed * dt);

            // Animate limbs smoothly proportional to actual running speed
            const animFreq = isSprinting ? 14 : 8.5;
            const cycle = Math.sin(clock.getElapsedTime() * animFreq);
            const limbs = playerMesh as unknown as {
              leftArm: THREE.Group;
              rightArm: THREE.Group;
              leftLeg: THREE.Group;
              rightLeg: THREE.Group;
            };
            if (limbs.leftLeg) {
              const legAmp = isSprinting ? 0.85 : 0.55;
              const armAmp = isSprinting ? 0.75 : 0.45;
              limbs.leftLeg.rotation.x = cycle * legAmp;
              limbs.rightLeg.rotation.x = -cycle * legAmp;
              limbs.leftArm.rotation.x = -cycle * armAmp;
              limbs.rightArm.rotation.x = cycle * armAmp;
            }

            // Subtle vertical walking/running bob for weight and realism
            if (isGrounded) {
              playerMesh.position.y = Math.abs(Math.sin(clock.getElapsedTime() * animFreq)) * (isSprinting ? 0.08 : 0.04);
            }
          } else if (dancing) {
            danceTimer += dt * 8;
            const bounce = Math.abs(Math.cos(danceTimer * 2)) * 0.2;
            playerMesh.position.y = bounce;
          } else {
            // Idle stance reset
            if (isGrounded) {
              playerMesh.position.y = 0;
            }
            const limbs = playerMesh as unknown as {
              leftArm: THREE.Group;
              rightArm: THREE.Group;
              leftLeg: THREE.Group;
              rightLeg: THREE.Group;
            };
            if (limbs.leftLeg) {
              limbs.leftLeg.rotation.x = 0;
              limbs.rightLeg.rotation.x = 0;
              limbs.leftArm.rotation.x = 0;
              limbs.rightArm.rotation.x = 0;
            }
          }

          if (isJumping && isGrounded && !dancing) {
            playerVelocityY = 7.2;
            isGrounded = false;
          }

          if (!isGrounded) {
            playerVelocityY -= 20 * dt;
            playerPos.y += playerVelocityY * dt;
            if (playerPos.y <= 0) {
              playerPos.y = 0;
              playerVelocityY = 0;
              isGrounded = true;
            }
            playerMesh.position.y = playerPos.y;
          }

          playerMesh.position.x = playerPos.x;
          playerMesh.position.z = playerPos.z;
          playerMesh.rotation.y = playerHeading;

          // Realistic GTA Third-Person Camera with dynamic distance and shoulder view
          const camDist = isSprinting ? 4.8 : 3.8;
          const camHeight = 2.1;
          const shoulderOffset = 0.35; // Slight GTA right shoulder framing

          _camOffset.set(
            playerPos.x - Math.sin(playerHeading) * camDist + Math.cos(playerHeading) * shoulderOffset,
            playerPos.y + camHeight,
            playerPos.z - Math.cos(playerHeading) * camDist - Math.sin(playerHeading) * shoulderOffset
          );

          camera.position.x = THREE.MathUtils.damp(camera.position.x, _camOffset.x, 8, dt);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _camOffset.y, 8, dt);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _camOffset.z, 8, dt);

          _camTarget.set(playerPos.x, playerPos.y + 1.35, playerPos.z);
          camera.lookAt(_camTarget);
        }
      }

      // Cash Pickup Detection
      for (const cash of worldData.cashPickups) {
        if (!cash.visible) continue;
        cash.rotation.y += dt * 2.5;

        if (playerPos.distanceTo(cash.position) < 2.2) {
          cash.visible = false;
          const amt = (cash as unknown as { pickupAmount: number }).pickupAmount || 10000;
          sound.playCashPickup();
          stateRef.current.onPickCash(amt);
          setTimeout(() => (cash.visible = true), 12000);
        }
      }

      // Proximity to Delta landmarks
      let nearLoc: DeltaLocation | null = null;
      let minDist = 18;
      for (const loc of worldData.interactiveZones) {
        _vec3.set(loc.x, 0, loc.z);
        const dist = playerPos.distanceTo(_vec3);
        if (dist < minDist) {
          minDist = dist;
          nearLoc = loc;
        }
      }

      if (nearLoc !== currentNearLocation) {
        currentNearLocation = nearLoc;
        stateRef.current.onNearLocationChange(nearLoc);
        if (nearLoc?.id === 'loc_club') sound.startClubMusic();
        else sound.stopClubMusic();
      }

      // Proximity to pedestrians ("Talk - Passer-by" as seen in video!)
      let nearPed: string | null = null;
      for (const ped of worldData.pedestrians) {
        if (playerPos.distanceTo(ped.position) < 3.5) {
          nearPed = 'Passer-by (Warri Resident)';
          break;
        }
      }

      if (nearPed !== currentNearPedestrian) {
        currentNearPedestrian = nearPed;
        stateRef.current.onNearPedestrianChange(nearPed);
      }

      renderer.render(scene, camera);
    };

    tick();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
      sound.stopEngineSound();
      sound.stopClubMusic();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode, activeFloor, player.skinTone, player.outfitColor, player.activeVehicleId, player.placedFurniture]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-slate-950"
      style={{ touchAction: 'none' }}
    />
  );
};
