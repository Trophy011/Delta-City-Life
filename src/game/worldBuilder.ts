import * as THREE from 'three';
import { MaterialLibrary, createCashPickupMesh, createFurnitureMesh, createCharacterMesh, createVehicleMesh, createAfroGirlMesh } from './proceduralModels';
import { PlacedFurniture, DeltaLocation } from '../types';
import { DELTA_LOCATIONS } from './constants';

export interface WorldObjects {
  scene: THREE.Scene;
  cashPickups: THREE.Group[];
  interactiveZones: DeltaLocation[];
  clubDanceFloor: THREE.Mesh | null;
  exteriorGroup: THREE.Group;
  pedestrians: THREE.Group[];
  streetVehicles: THREE.Group[];
}

export function buildOpenWorldScene(scene: THREE.Scene): WorldObjects {
  const exteriorGroup = new THREE.Group();
  exteriorGroup.name = 'exterior_world';
  scene.add(exteriorGroup);

  const cashPickups: THREE.Group[] = [];
  const pedestrians: THREE.Group[] = [];
  const streetVehicles: THREE.Group[] = [];

  // 1. Terrain Ground (Expansive Nigerian green & red soil terrain extending beyond view)
  const groundGeom = new THREE.PlaneGeometry(1600, 1600, 24, 24);
  const ground = new THREE.Mesh(groundGeom, MaterialLibrary.grassMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  exteriorGroup.add(ground);

  // 2. Comprehensive Road Network with Sidewalks & Crosswalks
  const addRoad = (x: number, z: number, width: number, length: number, isVertical = false) => {
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(isVertical ? length : width, isVertical ? width : length),
      MaterialLibrary.roadMat
    );
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.02, z);
    road.receiveShadow = true;
    exteriorGroup.add(road);

    // Concrete Sidewalks on both sides of road
    const walkW = 2.4;
    const s1 = new THREE.Mesh(
      new THREE.PlaneGeometry(isVertical ? length : walkW, isVertical ? walkW : length),
      MaterialLibrary.sidewalkMat
    );
    s1.rotation.x = -Math.PI / 2;
    s1.position.set(
      isVertical ? x : x - width / 2 - walkW / 2,
      0.035,
      isVertical ? z - width / 2 - walkW / 2 : z
    );
    s1.receiveShadow = true;

    const s2 = new THREE.Mesh(
      new THREE.PlaneGeometry(isVertical ? length : walkW, isVertical ? walkW : length),
      MaterialLibrary.sidewalkMat
    );
    s2.rotation.x = -Math.PI / 2;
    s2.position.set(
      isVertical ? x : x + width / 2 + walkW / 2,
      0.035,
      isVertical ? z + width / 2 + walkW / 2 : z
    );
    s2.receiveShadow = true;
    exteriorGroup.add(s1, s2);

    // Yellow Center Divider Line
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(isVertical ? length * 0.96 : 0.35, isVertical ? 0.35 : length * 0.96),
      MaterialLibrary.roadLineMat
    );
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.03, z);
    exteriorGroup.add(line);
  };

  // Main East-West Highway connecting Warri to Asaba & Airport
  addRoad(0, 0, 14, 900, true);
  // North-South Expressway to Club Empire & Delta Oil HQ
  addRoad(0, 0, 14, 900, false);
  // North Avenue
  addRoad(0, 140, 14, 850, true);
  // South Avenue
  addRoad(0, -140, 14, 850, true);
  // West Avenue (Ring Road)
  addRoad(-180, 0, 14, 850, false);
  // East Avenue (Airport & Commercial Corridor)
  addRoad(180, 0, 14, 850, false);
  // Airport Boulevard
  addRoad(130, -60, 14, 400, false);
  // Residential Villa Street outside player house (as seen in video!)
  addRoad(-100, 70, 12, 380, false);
  // Commercial District Boulevard
  addRoad(60, 60, 12, 380, false);
  // Effurun Link Avenue
  addRoad(50, -30, 12, 350, true);

  // Pedestrian Zebra Crossings at Major Intersections (GTA detail)
  const addCrosswalk = (cx: number, cz: number, isVertical = false) => {
    const crosswalkGroup = new THREE.Group();
    crosswalkGroup.position.set(cx, 0.035, cz);
    const stripeCount = 6;
    const stripeW = 0.8;
    const stripeL = 4.2;
    const spacing = 1.6;
    for (let i = 0; i < stripeCount; i++) {
      const stripe = new THREE.Mesh(
        new THREE.PlaneGeometry(isVertical ? stripeL : stripeW, isVertical ? stripeW : stripeL),
        new THREE.MeshBasicMaterial({ color: 0xf8fafc })
      );
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(
        isVertical ? 0 : (i - stripeCount / 2 + 0.5) * spacing,
        0,
        isVertical ? (i - stripeCount / 2 + 0.5) * spacing : 0
      );
      crosswalkGroup.add(stripe);
    }
    exteriorGroup.add(crosswalkGroup);
  };

  addCrosswalk(0, 12, false);
  addCrosswalk(0, -12, false);
  addCrosswalk(12, 0, true);
  addCrosswalk(-12, 0, true);
  addCrosswalk(-100, 52, false);
  addCrosswalk(-100, 88, false);
  addCrosswalk(60, 48, false);

  // Traffic Light Gantries at Key Intersections (GTA Streetscape)
  const addTrafficLight = (tx: number, tz: number, rotY = 0) => {
    const tlGroup = new THREE.Group();
    tlGroup.position.set(tx, 0, tz);
    tlGroup.rotation.y = rotY;

    // Metal mast pole
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.18, 7.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
    );
    pole.position.y = 3.75;
    tlGroup.add(pole);

    // Horizontal arm over roadway
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 6.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 })
    );
    arm.rotation.z = Math.PI / 2;
    arm.position.set(3.25, 7.0, 0);
    tlGroup.add(arm);

    // Traffic signal housing (Black box with yellow/red/green glowing lens)
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8 })
    );
    box.position.set(3.5, 6.2, 0);

    const redLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.2 })
    );
    redLens.position.set(3.5, 6.6, 0.2);

    const amberLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.5 })
    );
    amberLens.position.set(3.5, 6.2, 0.2);

    const greenLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 1.5 })
    );
    greenLens.position.set(3.5, 5.8, 0.2);

    tlGroup.add(box, redLens, amberLens, greenLens);
    exteriorGroup.add(tlGroup);
  };

  addTrafficLight(8, 8, 0);
  addTrafficLight(-8, -8, Math.PI);
  addTrafficLight(68, 8, 0);
  addTrafficLight(-108, 148, Math.PI / 2);

  // Street Lights with Warm Overhead Lamps lining avenues
  const addStreetLight = (lx: number, lz: number) => {
    const lightPost = new THREE.Group();
    lightPost.position.set(lx, 0, lz);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.16, 7.0, 8),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 })
    );
    post.position.y = 3.5;
    lightPost.add(post);

    const lampHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.2, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    lampHead.position.set(0, 6.9, 0.5);
    const bulb = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.08, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfde047, emissiveIntensity: 1.4 })
    );
    bulb.position.set(0, 6.8, 0.5);
    lightPost.add(lampHead, bulb);
    exteriorGroup.add(lightPost);
  };

  for (let z = -200; z <= 200; z += 50) {
    addStreetLight(8.5, z);
    addStreetLight(-8.5, z);
  }
  for (let x = -200; x <= 200; x += 50) {
    if (Math.abs(x) < 20) continue;
    addStreetLight(x, 8.5);
    addStreetLight(x, -8.5);
  }

  // Royal Palm Trees (Iconic Delta State Street Landscape)
  const addPalmTree = (px: number, pz: number) => {
    const palm = new THREE.Group();
    palm.position.set(px, 0, pz);

    // Textured trunk with curved taper
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 7.5, 8), trunkMat);
    trunk.position.y = 3.75;
    trunk.castShadow = true;
    palm.add(trunk);

    // Fronds
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
    for (let f = 0; f < 7; f++) {
      const angle = (f / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 3.2), frondMat);
      frond.position.set(Math.sin(angle) * 1.4, 7.4, Math.cos(angle) * 1.4);
      frond.rotation.y = angle;
      frond.rotation.x = 0.35;
      palm.add(frond);
    }
    exteriorGroup.add(palm);
  };

  for (let z = -180; z <= 180; z += 40) {
    addPalmTree(-9.5, z);
    addPalmTree(9.5, z);
  }

  // GTA Commercial Billboards Along Highways
  const addHighwayBillboard = (title: string, sub: string, bx: number, bz: number, rotY = 0, bgColor = 0x0f172a, textColor = 0xfacc15) => {
    const bb = new THREE.Group();
    bb.position.set(bx, 0, bz);
    bb.rotation.y = rotY;

    // Steel Pillars
    const pil1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 8), MaterialLibrary.chromeMat);
    pil1.position.set(-3, 5, 0);
    const pil2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 8), MaterialLibrary.chromeMat);
    pil2.position.set(3, 5, 0);
    bb.add(pil1, pil2);

    // Billboard Panel
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(9.5, 4.2, 0.3),
      new THREE.MeshStandardMaterial({ color: bgColor, roughness: 0.4 })
    );
    board.position.set(0, 10.5, 0);

    const face = new THREE.Mesh(
      new THREE.BoxGeometry(9.0, 3.8, 0.05),
      new THREE.MeshStandardMaterial({ color: textColor, emissive: textColor, emissiveIntensity: 0.35 })
    );
    face.position.set(0, 10.5, 0.18);
    bb.add(board, face);
    exteriorGroup.add(bb);
  };

  addHighwayBillboard("DELTA STATE OIL & GAS", "WARRI ENERGY CORRIDOR", -24, 60, Math.PI / 2, 0x1e3a8a, 0xfacc15);
  addHighwayBillboard("ZENITH BANK", "24/7 ATM & INSTANT TRANSFERS", 24, -80, -Math.PI / 2, 0x991b1b, 0xffffff);
  addHighwayBillboard("CLUB EMPIRE VIP NIGHT", "AFROBEATS & MONEY RAIN", 24, 75, -Math.PI / 2, 0x581c87, 0x38bdf8);
  addHighwayBillboard("MTN 5G EVERYWHERE", "WARRI - EFFURUN - ASABA", -24, -100, Math.PI / 2, 0xfacc15, 0x09090b);

  // TotalEnergies / NNPC Petrol & Fuel Station (Iconic GTA & Nigerian city fixture)
  const gasStation = new THREE.Group();
  gasStation.position.set(-35, 0, 25);

  // Overhead Fuel Canopy
  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(22, 1.2, 14),
    new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.5 })
  );
  canopy.position.set(0, 5.5, 0);
  gasStation.add(canopy);

  // 4 Canopy Pillars
  for (let px of [-8, 8]) {
    for (let pz of [-4.5, 4.5]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5.5, 8), MaterialLibrary.chromeMat);
      p.position.set(px, 2.75, pz);
      gasStation.add(p);
    }
  }

  // 4 Fuel Pump Islands
  for (let pumpZ of [-2.5, 2.5]) {
    const pumpIsland = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.25, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    pumpIsland.position.set(0, 0.12, pumpZ);

    const pumpUnit1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.8, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 })
    );
    pumpUnit1.position.set(-1.8, 1.0, pumpZ);

    const pumpUnit2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.8, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 })
    );
    pumpUnit2.position.set(1.8, 1.0, pumpZ);

    gasStation.add(pumpIsland, pumpUnit1, pumpUnit2);
  }

  // Convenience Mart Building behind fuel pumps
  const gasShop = new THREE.Mesh(
    new THREE.BoxGeometry(16, 4.2, 8),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5 })
  );
  gasShop.position.set(0, 2.1, -12);
  const gasShopGlass = new THREE.Mesh(new THREE.BoxGeometry(12, 2.5, 0.1), MaterialLibrary.glassTinted);
  gasShopGlass.position.set(0, 2.0, -7.9);
  gasStation.add(gasShop, gasShopGlass);

  exteriorGroup.add(gasStation);

  // GTA-Style Urban Commercial Towers & High-Rises along Expressways
  const towerMat1 = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.8 });
  const towerMat2 = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.6 });
  const towerMat3 = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.7 });
  const glassTowerMat = MaterialLibrary.glassTinted;

  for (let b = -320; b <= 320; b += 55) {
    if (Math.abs(b) < 35) continue;
    // Commercial tower left of highway
    const tL = new THREE.Mesh(new THREE.BoxGeometry(18, 28 + (Math.abs(b) % 25), 18), towerMat1);
    tL.position.set(b, 14 + (Math.abs(b) % 12.5), -32);
    tL.castShadow = true;
    exteriorGroup.add(tL);

    // Glass curtain facade
    const glassFacade = new THREE.Mesh(new THREE.BoxGeometry(15, 24 + (Math.abs(b) % 25), 0.2), glassTowerMat);
    glassFacade.position.set(b, 14 + (Math.abs(b) % 12.5), -22.9);
    exteriorGroup.add(glassFacade);

    // Commercial tower right of highway
    const tR = new THREE.Mesh(new THREE.BoxGeometry(18, 24 + (Math.abs(b) % 20), 18), (b % 110 === 0 ? towerMat3 : towerMat2));
    tR.position.set(b, 12 + (Math.abs(b) % 10), 32);
    tR.castShadow = true;
    exteriorGroup.add(tR);
  }

  // 3. Residential Street Neighborhood (As seen in video 00:54-01:13)
  // Compound fences, gates, neighbor villas, red soil sidewalks
  for (let z = 10; z <= 130; z += 24) {
    // West side compound walls
    const wallL = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 2.4, 20),
      MaterialLibrary.compoundWallMat
    );
    wallL.position.set(-108, 1.2, z);
    wallL.castShadow = true;
    exteriorGroup.add(wallL);

    // Gate pillar
    const pillarL = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 2.8, 1.0),
      MaterialLibrary.compoundWallMat
    );
    pillarL.position.set(-108, 1.4, z + 10);
    exteriorGroup.add(pillarL);

    // East side compound walls
    const wallR = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 2.4, 20),
      MaterialLibrary.compoundWallMat
    );
    wallR.position.set(-92, 1.2, z);
    wallR.castShadow = true;
    exteriorGroup.add(wallR);

    // Neighbor houses behind walls
    const neighborHouse = new THREE.Mesh(
      new THREE.BoxGeometry(14, 7, 16),
      new THREE.MeshStandardMaterial({
        color: z % 48 === 0 ? 0xfde047 : 0xe2e8f0,
        roughness: 0.6,
      })
    );
    neighborHouse.position.set(-122, 3.5, z);
    neighborHouse.castShadow = true;
    exteriorGroup.add(neighborHouse);
  }

  // 4. Player Residence Exterior
  const playerHouseCompound = new THREE.Group();
  playerHouseCompound.position.set(-100, 0, 70);

  // Main Duplex Structure
  const villaBody = new THREE.Mesh(
    new THREE.BoxGeometry(22, 9, 18),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3, metalness: 0.1 })
  );
  villaBody.position.set(0, 4.5, 0);
  villaBody.castShadow = true;
  playerHouseCompound.add(villaBody);

  // Front Compound Gate
  const gateL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 0.8), MaterialLibrary.compoundWallMat);
  gateL.position.set(-5, 1.4, 11);
  const gateR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 0.8), MaterialLibrary.compoundWallMat);
  gateR.position.set(5, 1.4, 11);
  const gateIron = new THREE.Mesh(new THREE.BoxGeometry(8, 2.2, 0.1), MaterialLibrary.chromeMat);
  gateIron.position.set(0, 1.2, 11);
  playerHouseCompound.add(gateL, gateR, gateIron);

  // Driveway with parked car
  const driveway = new THREE.Mesh(new THREE.PlaneGeometry(9, 14), MaterialLibrary.sidewalkMat);
  driveway.rotation.x = -Math.PI / 2;
  driveway.position.set(0, 0.04, 14);
  playerHouseCompound.add(driveway);

  exteriorGroup.add(playerHouseCompound);

  // 5. Club Empire (Warri Nightlife)
  const clubBuilding = new THREE.Group();
  clubBuilding.position.set(50, 0, 60);

  const clubWalls = new THREE.Mesh(
    new THREE.BoxGeometry(28, 9, 24),
    new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.8, metalness: 0.2 })
  );
  clubWalls.position.y = 4.5;
  clubWalls.castShadow = true;
  clubBuilding.add(clubWalls);

  // Neon Sign "CLUB EMPIRE WARRI"
  const neonSign = new THREE.Mesh(
    new THREE.BoxGeometry(18, 2.2, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xdb2777,
      emissiveIntensity: 1.8,
    })
  );
  neonSign.position.set(0, 8.5, 12.2);
  clubBuilding.add(neonSign);

  // Dance floor with flashing strobe tiles
  const danceFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 16),
    new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.8,
    })
  );
  danceFloor.rotation.x = -Math.PI / 2;
  danceFloor.position.set(0, 0.08, 0);
  clubBuilding.add(danceFloor);

  exteriorGroup.add(clubBuilding);

  // Cash drops scattered on Club Empire floor (pickable money!)
  const cashLocations = [
    { x: 48, z: 58, amt: 5000 },
    { x: 53, z: 62, amt: 10000 },
    { x: 45, z: 64, amt: 15000 },
    { x: 56, z: 56, amt: 25000 },
    { x: 51, z: 65, amt: 10000 },
    { x: 54, z: 53, amt: 50000 },
    // Warri street cash pickups
    { x: -98, z: 60, amt: 5000 },
    { x: -100, z: 95, amt: 10000 },
    { x: 20, z: -15, amt: 15000 },
    { x: 75, z: -25, amt: 20000 },
  ];

  cashLocations.forEach((c) => {
    const mesh = createCashPickupMesh(c.amt);
    mesh.position.set(c.x, 0.25, c.z);
    exteriorGroup.add(mesh);
    cashPickups.push(mesh);
  });

  // 6. Warri Petrochemical & Refinery (WRPC)
  const refinery = new THREE.Group();
  refinery.position.set(-70, 0, -80);

  const tower1 = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2.5, 30, 16),
    MaterialLibrary.chromeMat
  );
  tower1.position.set(0, 15, 0);
  tower1.castShadow = true;
  refinery.add(tower1);

  // Gas flare at top
  const flare = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xf97316 })
  );
  flare.position.set(0, 31, 0);
  refinery.add(flare);

  // Storage tanks
  for (let i = 0; i < 4; i++) {
    const tank = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 5.5, 8, 16),
      MaterialLibrary.chromeMat
    );
    tank.position.set(16 + (i % 2) * 14, 4, -10 + Math.floor(i / 2) * 14);
    tank.castShadow = true;
    refinery.add(tank);
  }

  exteriorGroup.add(refinery);

  // 7. Osubi Airport Runway & Terminal
  const airport = new THREE.Group();
  airport.position.set(130, 0, -70);

  const runway = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 280),
    new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 })
  );
  runway.rotation.x = -Math.PI / 2;
  runway.position.set(0, 0.03, 0);
  runway.receiveShadow = true;
  airport.add(runway);

  // Runway markings
  for (let z = -120; z <= 120; z += 18) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 9),
      new THREE.MeshBasicMaterial({ color: 0xf8fafc })
    );
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.04, z);
    airport.add(stripe);
  }

  exteriorGroup.add(airport);

  // 8. Delta Mall & Shoprite
  const mall = new THREE.Group();
  mall.position.set(70, 0, -10);
  const mallBuilding = new THREE.Mesh(
    new THREE.BoxGeometry(32, 12, 30),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
  );
  mallBuilding.position.y = 6;
  mallBuilding.castShadow = true;
  mall.add(mallBuilding);
  exteriorGroup.add(mall);

  // 9. Authentic Street Environment matching video 00:00-00:47:
  // Store Billboards & Street Names
  const addStoreSign = (title: string, x: number, y: number, z: number, color = 0x1e3a8a, textHex = 0xfacc15) => {
    const sign = new THREE.Group();
    sign.position.set(x, y, z);
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 1.1, 0.15),
      new THREE.MeshStandardMaterial({ color, roughness: 0.4 })
    );
    const label = new THREE.Mesh(
      new THREE.BoxGeometry(3.9, 0.7, 0.05),
      new THREE.MeshStandardMaterial({ color: textHex, emissive: textHex, emissiveIntensity: 0.3 })
    );
    label.position.z = 0.1;
    sign.add(board, label);
    exteriorGroup.add(sign);
  };

  // Nigerian Store Signs from Video!
  addStoreSign("Bayo Photo Studio", -108, 3.8, 48, 0x1e40af, 0xfacc15);
  addStoreSign("God's Time Pharmacy", -108, 3.8, 78, 0x15803d, 0xffffff);
  addStoreSign("Grocery & Business Centre", -92, 3.8, 35, 0x991b1b, 0xfacc15);
  addStoreSign("Jesus is Lord Phone Clinic", -92, 3.8, 65, 0x7c3aed, 0x38bdf8);

  // House tags floating over buildings (as in video: Amane's house, blakchase's house, Your house)
  const addHouseTag = (name: string, x: number, z: number) => {
    const tag = new THREE.Group();
    tag.position.set(x, 7.8, z);
    const bg = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.65, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x38bdf8, emissiveIntensity: 0.25 })
    );
    tag.add(bg);
    exteriorGroup.add(tag);
  };

  addHouseTag("Amane's house", -108, 40);
  addHouseTag("blakchase's house", -108, 90);
  addHouseTag("Your house", -100, 70);

  // Power Poles & Overhead Electric Lines (Iconic Nigerian Streetscape)
  for (let z = 15; z <= 125; z += 35) {
    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 8.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.9 })
    );
    pole.position.set(-106.5, 4.25, z);
    const crossArm = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.12, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x3f3f46 })
    );
    crossArm.position.set(-106.5, 8.0, z);
    exteriorGroup.add(pole, crossArm);

    // Power lines connecting poles
    if (z + 35 <= 125) {
      const lineGeom = new THREE.CylinderGeometry(0.015, 0.015, 35);
      const wire = new THREE.Mesh(lineGeom, new THREE.MeshBasicMaterial({ color: 0x111827 }));
      wire.position.set(-106.5, 7.8, z + 17.5);
      wire.rotation.x = Math.PI / 2;
      exteriorGroup.add(wire);
    }
  }

  // Pedestrians & Characters (Afro girl in yellow trousers from video 00:00-00:46!)
  const afroGirl = createAfroGirlMesh();
  afroGirl.position.set(-98.5, 0, 72);
  exteriorGroup.add(afroGirl);
  pedestrians.push(afroGirl);

  // Walking Pedestrian Man in Suit
  const pedSuit = createCharacterMesh('#8d5524', '#1e293b', true);
  pedSuit.position.set(-97, 0, 56);
  exteriorGroup.add(pedSuit);
  pedestrians.push(pedSuit);

  // Sitting Pedestrian on Curb (as seen in video 00:13-00:16!)
  const pedSitting = createCharacterMesh('#3d2314', '#047857', true);
  pedSitting.position.set(-106.5, -0.2, 50);
  const limbsSit = pedSitting as unknown as { leftLeg: THREE.Group; rightLeg: THREE.Group; torso: THREE.Mesh };
  if (limbsSit.leftLeg && limbsSit.rightLeg) {
    limbsSit.leftLeg.rotation.x = -Math.PI / 2;
    limbsSit.rightLeg.rotation.x = -Math.PI / 2;
  }
  exteriorGroup.add(pedSitting);
  pedestrians.push(pedSitting);

  // Additional passer-by
  const ped4 = createCharacterMesh('#593b22', '#eab308', true, 'casual');
  ped4.position.set(-102, 0, 88);
  exteriorGroup.add(ped4);
  pedestrians.push(ped4);

  // GTA Street Hype Guy
  const pedStreet = createCharacterMesh('#704214', '#ef4444', true, 'street');
  pedStreet.position.set(-98, 0, 42);
  exteriorGroup.add(pedStreet);
  pedestrians.push(pedStreet);

  // GTA Business Tycoon with gold watch & briefcase near bank billboard
  const pedTycoon = createCharacterMesh('#8d5524', '#0f172a', true, 'tycoon');
  pedTycoon.position.set(18, 0, -75);
  exteriorGroup.add(pedTycoon);
  pedestrians.push(pedTycoon);

  // NPF Police Officer standing near checkpoint
  const pedPolice = createCharacterMesh('#3b2210', '#1e293b', true, 'police');
  pedPolice.position.set(-15, 0, 10);
  exteriorGroup.add(pedPolice);
  pedestrians.push(pedPolice);

  // Yellow Danfo Commercial Buses on the street (as seen in video!)
  const danfoBus1 = createVehicleMesh('danfo');
  danfoBus1.position.set(-94, 0, 38);
  danfoBus1.rotation.y = 0.05;
  exteriorGroup.add(danfoBus1);
  streetVehicles.push(danfoBus1);

  const danfoBus2 = createVehicleMesh('danfo');
  danfoBus2.position.set(-94, 0, 115);
  danfoBus2.rotation.y = -0.05;
  exteriorGroup.add(danfoBus2);
  streetVehicles.push(danfoBus2);

  // NPF Police Patrol Cruiser on the avenue shoulder (GTA staple!)
  const policeCar = createVehicleMesh('police');
  policeCar.position.set(-16, 0, 8);
  policeCar.rotation.y = 0.15;
  exteriorGroup.add(policeCar);
  streetVehicles.push(policeCar);

  // Black Label G-Wagon parked on commercial boulevard
  const gwagonParked = createVehicleMesh('gwagon');
  gwagonParked.position.set(54, 0, 45);
  gwagonParked.rotation.y = -0.2;
  exteriorGroup.add(gwagonParked);
  streetVehicles.push(gwagonParked);

  // Apex Supercar parked outside Club Empire entrance
  const supercarVIP = createVehicleMesh('supercar');
  supercarVIP.position.set(42, 0, 48);
  supercarVIP.rotation.y = 0.4;
  exteriorGroup.add(supercarVIP);
  streetVehicles.push(supercarVIP);

  // Ambient parked Keke on street
  const kekeParked = createVehicleMesh('keke');
  kekeParked.position.set(-94, 0, 68);
  kekeParked.rotation.y = 0.25;
  exteriorGroup.add(kekeParked);
  streetVehicles.push(kekeParked);

  // Ambient parked sedan
  const sedanParked = createVehicleMesh('sedan');
  sedanParked.position.set(-104, 0, 82);
  exteriorGroup.add(sedanParked);
  streetVehicles.push(sedanParked);

  return {
    scene,
    cashPickups,
    interactiveZones: DELTA_LOCATIONS,
    clubDanceFloor: danceFloor,
    exteriorGroup,
    pedestrians,
    streetVehicles,
  };
}

// 10. Architectural Dollhouse Cutaway Scene for House Interior (As seen in video 00:04 & 00:31-00:46)
export function buildDollhouseCutawayScene(
  scene: THREE.Scene,
  placedItems: PlacedFurniture[],
  activeFloor: 'downstairs' | 'upstairs' = 'downstairs'
): THREE.Group {
  const houseGroup = new THREE.Group();
  houseGroup.name = 'dollhouse_interior';

  // Ground Lawn outside compound
  const lawn = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 32),
    MaterialLibrary.grassMat
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.receiveShadow = true;
  houseGroup.add(lawn);

  // Driveway on right side with parked car
  const drive = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 18),
    MaterialLibrary.sidewalkMat
  );
  drive.rotation.x = -Math.PI / 2;
  drive.position.set(11, 0.02, 4);
  houseGroup.add(drive);

  // Parked Sedan on driveway (matching video!)
  const drivewayCar = createVehicleMesh('sedan');
  drivewayCar.position.set(11, 0, 4);
  drivewayCar.scale.set(0.85, 0.85, 0.85);
  houseGroup.add(drivewayCar);

  // Main House Base Foundation
  const floorW = 18;
  const floorL = 16;
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // modern slate floor tiles as seen in video
    roughness: 0.35,
    metalness: 0.1,
  });

  const mainFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(floorW, floorL),
    floorMat
  );
  mainFloor.rotation.x = -Math.PI / 2;
  mainFloor.position.set(0, 0.05, 0);
  mainFloor.receiveShadow = true;
  houseGroup.add(mainFloor);

  // Clean room wall partitions with low cutaway height (dollhouse architecture)
  const wallH = 2.4;
  const wallThick = 0.28;
  const wallColor = 0x334155; // dark modern trim walls as seen in video
  const partitionMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.7 });

  const addWall = (x: number, z: number, length: number, isVertical = false) => {
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(
        isVertical ? wallThick : length,
        wallH,
        isVertical ? length : wallThick
      ),
      partitionMat
    );
    wall.position.set(x, wallH / 2 + 0.05, z);
    wall.castShadow = true;
    houseGroup.add(wall);
  };

  // Outer Perimeter Walls (Cutaway on front so camera can view inside!)
  addWall(0, -floorL / 2, floorW, false); // North back wall
  addWall(-floorW / 2, 0, floorL, true); // West left wall
  addWall(floorW / 2, 0, floorL, true); // East right wall
  // Low front boundary wall
  const frontLowWall = new THREE.Mesh(
    new THREE.BoxGeometry(floorW, 0.5, wallThick),
    partitionMat
  );
  frontLowWall.position.set(0, 0.3, floorL / 2);
  houseGroup.add(frontLowWall);

  // Room Partitions (Living room, Kitchen, Master Bedroom, Bath, Corridor)
  // Partition 1: Separating parlor from kitchen & bedrooms
  addWall(-2, -1, 10, false);
  addWall(3, 2, 8, true);
  addWall(-4, 3, 6, true);

  // Wooden Staircase leading to upstairs (as seen in video!)
  const stairGroup = new THREE.Group();
  stairGroup.position.set(-7, 0, -5);
  const stepWood = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
  for (let s = 0; s < 10; s++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.24, 0.4), stepWood);
    step.position.set(0, s * 0.24 + 0.12, s * 0.35);
    stairGroup.add(step);
  }
  houseGroup.add(stairGroup);

  // Render placed furniture items inside the rooms
  placedItems
    .filter((item) => (item.floor || 'downstairs') === activeFloor)
    .forEach((item) => {
      const mesh = createFurnitureMesh(item.furnitureId);
      mesh.position.set(item.x, item.y + 0.05, item.z);
      mesh.rotation.y = item.rotationY;
      houseGroup.add(mesh);
    });

  // Warm room spotlights
  const roomLight1 = new THREE.PointLight(0xffedd5, 1.4, 18);
  roomLight1.position.set(-3, 3.2, 2);
  const roomLight2 = new THREE.PointLight(0xffedd5, 1.2, 18);
  roomLight2.position.set(4, 3.2, -3);
  houseGroup.add(roomLight1, roomLight2);

  scene.add(houseGroup);
  return houseGroup;
}
