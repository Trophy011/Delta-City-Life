import * as THREE from 'three';

// Materials cache to prevent shader recompilation and garbage collection
export class MaterialLibrary {
  public static roadMat = new THREE.MeshStandardMaterial({
    color: 0x22262a,
    roughness: 0.85,
    metalness: 0.1,
  });

  public static roadLineMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
  });

  public static grassMat = new THREE.MeshStandardMaterial({
    color: 0x3d7a48,
    roughness: 0.9,
    metalness: 0.05,
  });

  public static sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.85,
    metalness: 0.1,
  });

  public static compoundWallMat = new THREE.MeshStandardMaterial({
    color: 0xdfd8c8,
    roughness: 0.7,
    metalness: 0.1,
  });

  public static glassTinted = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.7,
    transparent: true,
    opacity: 0.85,
  });

  public static chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.15,
  });

  public static goldMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.95,
    roughness: 0.2,
  });

  public static tireMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.95,
    metalness: 0.05,
  });
}

// 1. Procedural Character Model with animated limb hierarchy (Realistic GTA style)
export function createCharacterMesh(
  skinTone = '#8d5524',
  outfitColor = '#18181b',
  isPedestrian = false,
  role: 'player' | 'street' | 'tycoon' | 'police' | 'casual' = 'player'
) {
  const group = new THREE.Group();
  group.name = isPedestrian ? `pedestrian_${role}` : 'player_character';

  const skinMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinTone),
    roughness: 0.55,
    metalness: 0.05,
  });

  const shirtMat = new THREE.MeshStandardMaterial({
    color: role === 'police' ? 0x1e293b : new THREE.Color(outfitColor),
    roughness: 0.6,
    metalness: 0.1,
  });

  const innerShirtMat = new THREE.MeshStandardMaterial({
    color: role === 'tycoon' ? 0xffffff : 0xf1f5f9,
    roughness: 0.7,
  });

  const pantsMat = new THREE.MeshStandardMaterial({
    color: role === 'police' ? 0x0f172a : isPedestrian ? 0x1e293b : 0x111827,
    roughness: 0.65,
    metalness: 0.1,
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: isPedestrian ? 0x334155 : 0x09090b,
    roughness: 0.4,
    metalness: 0.2,
  });

  const sneakerSoleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
  });

  // Torso / Jacket
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.64, 0.3), shirtMat);
  torso.position.y = 1.05;
  torso.castShadow = true;
  group.add(torso);

  // Inner shirt layer showing on chest (classic GTA open jacket / crewneck)
  const innerChest = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.04), innerShirtMat);
  innerChest.position.set(0, 1.12, 0.14);
  group.add(innerChest);

  // Gold chain necklace (GTA street baller aesthetic)
  if (role !== 'police') {
    const chain = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.03), MaterialLibrary.goldMat);
    chain.position.set(0, 1.25, 0.16);
    group.add(chain);
  } else {
    // Police badge
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.02), MaterialLibrary.goldMat);
    badge.position.set(0.14, 1.2, 0.16);
    group.add(badge);
  }

  // Belt with metal buckle
  const belt = new THREE.Mesh(
    new THREE.BoxGeometry(0.53, 0.08, 0.31),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 })
  );
  belt.position.y = 0.76;
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.09, 0.03), MaterialLibrary.chromeMat);
  buckle.position.set(0, 0.76, 0.16);
  group.add(belt, buckle);

  // Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.14, 8), skinMat);
  neck.position.y = 1.41;
  group.add(neck);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.35, 0.3), skinMat);
  head.position.y = 1.58;
  head.castShadow = true;
  group.add(head);

  // Dark aviator sunglasses (classic GTA Vice City / San Andreas style)
  const shades = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.08, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.05, metalness: 0.95 })
  );
  shades.position.set(0, 1.6, 0.16);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.06), MaterialLibrary.goldMat);
  bridge.position.set(0, 1.62, 0.16);
  group.add(shades, bridge);

  // Hair or Police Cap
  if (role === 'police') {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.2, 0.14, 12),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    cap.position.set(0, 1.78, 0);
    const visor = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.03, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 })
    );
    visor.position.set(0, 1.74, 0.15);
    group.add(cap, visor);
  } else {
    // Fade haircut / Afro taper
    const hair = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.12, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.95 })
    );
    hair.position.set(0, 1.76, -0.01);
    group.add(hair);
  }

  // Left Arm (pivot at shoulder)
  const leftArmPivot = new THREE.Group();
  leftArmPivot.position.set(-0.35, 1.32, 0);
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.16), shirtMat);
  leftArm.position.y = -0.24;
  leftArm.castShadow = true;
  leftArmPivot.add(leftArm);
  const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.14, 0.13), skinMat);
  leftHand.position.y = -0.54;
  leftArmPivot.add(leftHand);

  // Gold / Steel Watch on Left Wrist (GTA status flex!)
  const watch = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 8), MaterialLibrary.goldMat);
  watch.position.set(0, -0.46, 0);
  leftArmPivot.add(watch);
  group.add(leftArmPivot);

  // Right Arm (pivot at shoulder)
  const rightArmPivot = new THREE.Group();
  rightArmPivot.position.set(0.35, 1.32, 0);
  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.16), shirtMat);
  rightArm.position.y = -0.24;
  rightArm.castShadow = true;
  rightArmPivot.add(rightArm);
  const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.14, 0.13), skinMat);
  rightHand.position.y = -0.54;
  rightArmPivot.add(rightHand);
  group.add(rightArmPivot);

  // Left Leg (pivot at hip)
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.16, 0.72, 0);
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.64, 0.2), pantsMat);
  leftLeg.position.y = -0.32;
  leftLeg.castShadow = true;
  leftLegPivot.add(leftLeg);

  // Sneaker with rubber sole
  const leftShoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.11, 0.32), shoeMat);
  leftShoeBody.position.set(0, -0.66, 0.05);
  const leftShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.34), sneakerSoleMat);
  leftShoeSole.position.set(0, -0.72, 0.05);
  leftLegPivot.add(leftShoeBody, leftShoeSole);
  group.add(leftLegPivot);

  // Right Leg (pivot at hip)
  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.16, 0.72, 0);
  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.64, 0.2), pantsMat);
  rightLeg.position.y = -0.32;
  rightLeg.castShadow = true;
  rightLegPivot.add(rightLeg);

  // Sneaker with rubber sole
  const rightShoeBody = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.11, 0.32), shoeMat);
  rightShoeBody.position.set(0, -0.66, 0.05);
  const rightShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.34), sneakerSoleMat);
  rightShoeSole.position.set(0, -0.72, 0.05);
  rightLegPivot.add(rightShoeBody, rightShoeSole);
  group.add(rightLegPivot);

  (group as unknown as {
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
  }).leftArm = leftArmPivot;
  (group as unknown as {
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
  }).rightArm = rightArmPivot;
  (group as unknown as {
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
  }).leftLeg = leftLegPivot;
  (group as unknown as {
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
  }).rightLeg = rightLegPivot;
  (group as unknown as {
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
  }).torso = torso;
  (group as unknown as {
    leftArm: THREE.Group;
    rightArm: THREE.Group;
    leftLeg: THREE.Group;
    rightLeg: THREE.Group;
    torso: THREE.Mesh;
    head: THREE.Mesh;
  }).head = head;

  return group;
}

// 2. Procedural Vehicle Models
export function createVehicleMesh(
  type: 'keke' | 'sedan' | 'gwagon' | 'supercar' | 'jet' | 'danfo' | 'police',
  customColor?: string
): THREE.Group {
  const group = new THREE.Group();
  group.name = `vehicle_${type}`;

  const paintColor = customColor || (
    type === 'keke' ? '#fbbf24' :
    type === 'sedan' ? '#0ea5e9' :
    type === 'gwagon' ? '#18181b' :
    type === 'police' ? '#09090b' :
    type === 'supercar' ? '#ef4444' : '#f8fafc'
  );

  const carPaintMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(paintColor),
    metalness: type === 'gwagon' ? 0.8 : 0.85,
    roughness: 0.2,
  });

  const blackTrimMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.7,
    metalness: 0.3,
  });

  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
  });

  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xff2222,
    emissive: 0xff1111,
    emissiveIntensity: 0.6,
  });

  const createWheel = (radius = 0.32, width = 0.22) => {
    const wheelGroup = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 16), MaterialLibrary.tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, width + 0.02, 12), MaterialLibrary.chromeMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);
    return wheelGroup;
  };

  if (type === 'keke') {
    // Keke Napep
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 2.2), carPaintMat);
    chassis.position.y = 0.45;
    chassis.castShadow = true;
    group.add(chassis);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.08, 1.8), blackTrimMat);
    roof.position.set(0, 1.6, -0.1);
    group.add(roof);

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1), blackTrimMat);
    p1.position.set(-0.55, 1.05, 0.7);
    const p2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1), blackTrimMat);
    p2.position.set(0.55, 1.05, 0.7);
    const p3 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1), blackTrimMat);
    p3.position.set(-0.55, 1.05, -0.9);
    const p4 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1), blackTrimMat);
    p4.position.set(0.55, 1.05, -0.9);
    group.add(p1, p2, p3, p4);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.55, 0.04), MaterialLibrary.glassTinted);
    windshield.position.set(0, 1.15, 0.7);
    group.add(windshield);

    const frontWheel = createWheel(0.28, 0.18);
    frontWheel.position.set(0, 0.28, 1.0);
    const rearLeft = createWheel(0.28, 0.18);
    rearLeft.position.set(-0.65, 0.28, -0.7);
    const rearRight = createWheel(0.28, 0.18);
    rearRight.position.set(0.65, 0.28, -0.7);
    group.add(frontWheel, rearLeft, rearRight);

  } else if (type === 'sedan') {
    // Sedan (Teal Blue as shown in video!)
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 3.8), carPaintMat);
    body.position.y = 0.5;
    body.castShadow = true;
    group.add(body);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 2.0), MaterialLibrary.glassTinted);
    cabin.position.set(0, 1.02, -0.2);
    group.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 1.9), carPaintMat);
    roof.position.set(0, 1.3, -0.2);
    group.add(roof);

    // Rear spoiler as seen in video on car!
    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.25), blackTrimMat);
    spoiler.position.set(0, 0.95, -1.8);
    group.add(spoiler);

    const wFL = createWheel(0.35, 0.24);
    wFL.position.set(-0.95, 0.35, 1.2);
    const wFR = createWheel(0.35, 0.24);
    wFR.position.set(0.95, 0.35, 1.2);
    const wRL = createWheel(0.35, 0.24);
    wRL.position.set(-0.95, 0.35, -1.2);
    const wRR = createWheel(0.35, 0.24);
    wRR.position.set(0.95, 0.35, -1.2);
    group.add(wFL, wFR, wRL, wRR);

    const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), headlightMat);
    hl1.position.set(-0.6, 0.55, 1.91);
    const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.05), headlightMat);
    hl2.position.set(0.6, 0.55, 1.91);
    group.add(hl1, hl2);

  } else if (type === 'gwagon') {
    // G-Wagon 4x4
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.7, 4.2), carPaintMat);
    lowerBody.position.y = 0.75;
    lowerBody.castShadow = true;
    group.add(lowerBody);

    const upperCabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.8, 2.7), carPaintMat);
    upperCabin.position.set(0, 1.5, -0.4);
    group.add(upperCabin);

    const windows = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.55, 2.5), MaterialLibrary.glassTinted);
    windows.position.set(0, 1.52, -0.4);
    group.add(windows);

    const spareTire = createWheel(0.38, 0.24);
    spareTire.rotation.x = Math.PI / 2;
    spareTire.position.set(0, 1.3, -2.25);
    group.add(spareTire);

    const wFL = createWheel(0.44, 0.28);
    wFL.position.set(-1.08, 0.44, 1.3);
    const wFR = createWheel(0.44, 0.28);
    wFR.position.set(1.08, 0.44, 1.3);
    const wRL = createWheel(0.44, 0.28);
    wRL.position.set(-1.08, 0.44, -1.3);
    const wRR = createWheel(0.44, 0.28);
    wRR.position.set(1.08, 0.44, -1.3);
    group.add(wFL, wFR, wRL, wRR);

  } else if (type === 'supercar') {
    // Supercar
    const lowHull = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.42, 4.1), carPaintMat);
    lowHull.position.y = 0.36;
    lowHull.castShadow = true;
    group.add(lowHull);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.95, 2.1, 4), MaterialLibrary.glassTinted);
    canopy.rotation.x = -Math.PI / 2.3;
    canopy.rotation.y = Math.PI / 4;
    canopy.position.set(0, 0.72, -0.1);
    group.add(canopy);

    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.35), blackTrimMat);
    wing.position.set(0, 0.95, -1.9);
    group.add(wing);

    const wFL = createWheel(0.33, 0.26);
    wFL.position.set(-1.0, 0.33, 1.25);
    const wFR = createWheel(0.33, 0.26);
    wFR.position.set(1.0, 0.33, 1.25);
    const wRL = createWheel(0.36, 0.32);
    wRL.position.set(-1.0, 0.36, -1.25);
    const wRR = createWheel(0.36, 0.32);
    wRR.position.set(1.0, 0.36, -1.25);
    group.add(wFL, wFR, wRL, wRR);

  } else if (type === 'jet') {
    // Private Jet
    const jetBodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.85, roughness: 0.15 });
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 7.5, 16), jetBodyMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.position.set(0, 1.8, 0);
    fuselage.castShadow = true;
    group.add(fuselage);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.85, 2.2, 16), jetBodyMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.set(0, 1.8, 4.8);
    group.add(nose);

    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(6.5, -3.2);
    wingShape.lineTo(6.0, -4.2);
    wingShape.lineTo(0, -2.0);
    wingShape.closePath();

    const wingGeom = new THREE.ExtrudeGeometry(wingShape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04 });
    const rightWing = new THREE.Mesh(wingGeom, jetBodyMat);
    rightWing.rotation.x = Math.PI / 2;
    rightWing.position.set(0.7, 1.6, 1.5);

    const leftWing = new THREE.Mesh(wingGeom, jetBodyMat);
    leftWing.rotation.x = Math.PI / 2;
    leftWing.scale.x = -1;
    leftWing.position.set(-0.7, 1.6, 1.5);
    group.add(rightWing, leftWing);

    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 1.8), MaterialLibrary.goldMat);
    tailFin.position.set(0, 3.4, -3.2);
    tailFin.rotation.x = -0.4;
    group.add(tailFin);

  } else if (type === 'danfo') {
    // Commercial Yellow Nigerian Danfo Bus (As seen in video 00:30-00:46!)
    const danfoPaint = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const greenStripeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });

    // Main Bus Body
    const busBody = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.4, 4.6), danfoPaint);
    busBody.position.y = 1.05;
    busBody.castShadow = true;
    group.add(busBody);

    // Green horizontal side stripes (Iconic Delta/Lagos commercial bus livery)
    const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 4.4), greenStripeMat);
    stripeL.position.set(-1.06, 0.95, 0);
    const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 4.4), greenStripeMat);
    stripeR.position.set(1.06, 0.95, 0);
    group.add(stripeL, stripeR);

    // Windows
    const windows = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.45, 3.8), MaterialLibrary.glassTinted);
    windows.position.set(0, 1.35, -0.2);
    group.add(windows);

    // Front windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 0.1), MaterialLibrary.glassTinted);
    windshield.position.set(0, 1.35, 2.26);
    windshield.rotation.x = -0.2;
    group.add(windshield);

    // 4 Wheels
    const wFL = createWheel(0.38, 0.26);
    wFL.position.set(-1.08, 0.38, 1.4);
    const wFR = createWheel(0.38, 0.26);
    wFR.position.set(1.08, 0.38, 1.4);
    const wRL = createWheel(0.38, 0.26);
    wRL.position.set(-1.08, 0.38, -1.4);
    const wRR = createWheel(0.38, 0.26);
    wRR.position.set(1.08, 0.38, -1.4);
    group.add(wFL, wFR, wRL, wRR);

    // Headlights
    const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.05), headlightMat);
    hl1.position.set(-0.75, 0.75, 2.31);
    const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.05), headlightMat);
    hl2.position.set(0.75, 0.75, 2.31);
    group.add(hl1, hl2);

  } else if (type === 'police') {
    // Nigeria Police Force (NPF) Patrol Cruiser
    const policeBlack = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3, metalness: 0.7 });
    const policeWhite = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });

    // Chassis / Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.58, 4.0), policeBlack);
    body.position.y = 0.52;
    body.castShadow = true;
    group.add(body);

    // White door paneling (classic police black-and-white)
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 1.8), policeWhite);
    doorL.position.set(-0.94, 0.52, -0.1);
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.48, 1.8), policeWhite);
    doorR.position.set(0.94, 0.52, -0.1);
    group.add(doorL, doorR);

    // Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 2.1), MaterialLibrary.glassTinted);
    cabin.position.set(0, 1.05, -0.2);
    group.add(cabin);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 2.0), policeWhite);
    roof.position.set(0, 1.33, -0.2);
    group.add(roof);

    // Rooftop Emergency Siren Light Bar (Red / Blue strobe LEDs)
    const lightBarBase = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.22), blackTrimMat);
    lightBarBase.position.set(0, 1.38, -0.2);
    const redLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.1, 0.18),
      new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.8 })
    );
    redLight.position.set(-0.24, 1.44, -0.2);
    const blueLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.1, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x2563eb, emissiveIntensity: 1.8 })
    );
    blueLight.position.set(0.24, 1.44, -0.2);
    group.add(lightBarBase, redLight, blueLight);

    // Front Push Bumper / Bull Bar
    const bullBar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.1), blackTrimMat);
    bullBar.position.set(0, 0.52, 2.06);
    group.add(bullBar);

    // 4 Wheels
    const wFL = createWheel(0.35, 0.24);
    wFL.position.set(-0.95, 0.35, 1.25);
    const wFR = createWheel(0.35, 0.24);
    wFR.position.set(0.95, 0.35, 1.25);
    const wRL = createWheel(0.35, 0.24);
    wRL.position.set(-0.95, 0.35, -1.25);
    const wRR = createWheel(0.35, 0.24);
    wRR.position.set(0.95, 0.35, -1.25);
    group.add(wFL, wFR, wRL, wRR);

    // Headlights & Taillights
    const hl1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.05), headlightMat);
    hl1.position.set(-0.65, 0.54, 2.02);
    const hl2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.05), headlightMat);
    hl2.position.set(0.65, 0.54, 2.02);
    const tl1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.05), taillightMat);
    tl1.position.set(-0.65, 0.54, -2.02);
    const tl2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.05), taillightMat);
    tl2.position.set(0.65, 0.54, -2.02);
    group.add(hl1, hl2, tl1, tl2);
  }

  return group;
}

// Model for the Passer-by girl in yellow pants & double afro buns (matching video 00:00-00:46!)
export function createAfroGirlMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'afro_girl_passerby';

  const skinMat = new THREE.MeshStandardMaterial({ color: 0x593b22, roughness: 0.6 });
  const topMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.5 });
  const yellowPants = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.24), topMat);
  torso.position.y = 1.05;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.26), skinMat);
  head.position.y = 1.5;
  group.add(head);

  // Iconic Double Afro Puffs / Space Buns (seen prominently in video!)
  const bunL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), hairMat);
  bunL.position.set(-0.24, 1.76, 0);
  const bunR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), hairMat);
  bunR.position.set(0.24, 1.76, 0);
  group.add(bunL, bunR);

  // Legs in Yellow Pants
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), yellowPants);
  legL.position.set(-0.13, 0.42, 0);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.7, 0.18), yellowPants);
  legR.position.set(0.13, 0.42, 0);
  group.add(legL, legR);

  // Arms
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), skinMat);
  armL.position.set(-0.28, 1.05, 0);
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.5, 0.12), skinMat);
  armR.position.set(0.28, 1.05, 0);
  group.add(armL, armR);

  return group;
}

// Street Sign / Store Billboard (e.g. Bayo Photo Studio, God's Time Pharmacy, No. 22)
export function createStoreSign(title: string, bgColor = 0x1e293b, textColor = 0xfacc15): THREE.Group {
  const group = new THREE.Group();
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 0.9, 0.12),
    new THREE.MeshStandardMaterial({ color: bgColor, roughness: 0.5 })
  );
  board.position.y = 0.45;
  group.add(board);

  // Colored text backing bar
  const textStrip = new THREE.Mesh(
    new THREE.BoxGeometry(3.3, 0.6, 0.04),
    new THREE.MeshStandardMaterial({ color: textColor, emissive: textColor, emissiveIntensity: 0.25 })
  );
  textStrip.position.set(0, 0.45, 0.08);
  group.add(textStrip);

  return group;
}

// 3. Procedural Furniture Models matching exact video catalogue!
export function createFurnitureMesh(modelType: string): THREE.Group {
  const group = new THREE.Group();
  group.name = `furniture_${modelType}`;

  if (modelType === 'plastic_chair') {
    // ₦500 Plastic Chair from video!
    const chairMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.5), chairMat);
    seat.position.y = 0.45;
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.04), chairMat);
    back.position.set(0, 0.7, -0.23);
    for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45), chairMat);
      leg.position.set(x, 0.22, z);
      group.add(leg);
    }
    group.add(seat, back);

  } else if (modelType === 'standing_fan') {
    // ₦2,200 Standing Fan from video!
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const chrome = MaterialLibrary.chromeMat;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.06, 16), blueMat);
    base.position.y = 0.03;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2), chrome);
    pole.position.y = 0.65;
    const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16), chrome);
    cage.rotation.x = Math.PI / 2;
    cage.position.set(0, 1.25, 0.05);
    group.add(base, pole, cage);

  } else if (modelType === 'dining_table') {
    // ₦6,600 Dining Table from video!
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.1), woodMat);
    top.position.y = 0.75;
    for (const [x, z] of [[-0.7, -0.45], [0.7, -0.45], [-0.7, 0.45], [0.7, 0.45]]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75), woodMat);
      leg.position.set(x, 0.375, z);
      group.add(leg);
    }
    group.add(top);

  } else if (modelType === 'armchair') {
    // ₦8,500 Lounge Armchair from video!
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.6 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.8), chairMat);
    seat.position.y = 0.25;
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.2), chairMat);
    back.position.set(0, 0.65, -0.3);
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.8), chairMat);
    armL.position.set(-0.4, 0.45, 0);
    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 0.8), chairMat);
    armR.position.set(0.4, 0.45, 0);
    group.add(seat, back, armL, armR);

  } else if (modelType === 'velvet_sofa') {
    // ₦10,200 Velvet Sofa from video!
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.9), sofaMat);
    seat.position.y = 0.25;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 0.2), sofaMat);
    back.position.set(0, 0.65, -0.35);
    group.add(seat, back);

  } else if (modelType === 'bean_bag') {
    // ₦12,000 Bean Bag from video!
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.7 });
    const bag = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), orangeMat);
    bag.scale.set(1.1, 0.7, 1.1);
    bag.position.y = 0.3;
    group.add(bag);

  } else if (modelType === 'ceiling_fan') {
    // ₦32,000 Ceiling Fan from video!
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), whiteMat);
    hub.position.y = 2.4;
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.16), whiteMat);
      blade.rotation.y = (i * Math.PI * 2) / 3;
      blade.position.set(Math.sin((i * Math.PI * 2) / 3) * 0.45, 2.4, Math.cos((i * Math.PI * 2) / 3) * 0.45);
      group.add(blade);
    }
    group.add(hub);

  } else if (modelType === 'royal_gold_sofa') {
    // ₦55,000 Royal Gold Sofa from video!
    const goldFrame = MaterialLibrary.goldMat;
    const velvetRed = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.38, 0.85), velvetRed);
    seat.position.y = 0.25;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.18), velvetRed);
    back.position.set(0, 0.68, -0.35);
    const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.22), goldFrame);
    goldTrim.position.set(0, 1.0, -0.35);
    group.add(seat, back, goldTrim);

  } else if (modelType === 'split_ac') {
    // ₦650,000 Split Air Conditioner from video!
    const acMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const unit = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.35, 0.25), acMat);
    unit.position.set(0, 2.3, -4.8);
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    led.position.set(0.35, 2.25, -4.66);
    group.add(unit, led);

  } else if (modelType === 'sofa') {
    // ₦1,500,000 Lekki Sectional Sofa from video!
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.6 });
    const seat1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 1.0), sofaMat);
    seat1.position.set(0, 0.25, 0);
    const back1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 0.25), sofaMat);
    back1.position.set(0, 0.65, -0.4);
    const lCushion = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.45, 1.4), sofaMat);
    lCushion.position.set(1.1, 0.25, 0.4);
    group.add(seat1, back1, lCushion);

  } else if (modelType === 'bed') {
    // Royal Velvet King Bed
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.5 });
    const sheetMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 2.5), frameMat);
    base.position.set(0, 0.2, 0);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.35, 2.3), sheetMat);
    mattress.position.set(0, 0.45, 0);
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 0.2), frameMat);
    headboard.position.set(0, 0.8, -1.2);
    group.add(base, mattress, headboard);

  } else if (modelType === 'kitchen_island') {
    const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 1.2), marbleMat);
    counter.position.set(0, 0.48, 0);
    group.add(counter);

  } else if (modelType === 'fridge') {
    const fridgeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.25 });
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.85), fridgeMat);
    fridge.position.set(0, 0.95, 0);
    group.add(fridge);

  } else if (modelType === 'tv_unit') {
    const standMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x050b14, emissive: 0x1e3a8a, emissiveIntensity: 0.5 });
    const stand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 0.5), standMat);
    stand.position.set(0, 0.2, 0);
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.2, 0.05), screenMat);
    tvScreen.position.set(0, 1.1, 0);
    group.add(stand, tvScreen);

  } else if (modelType === 'bathtub') {
    const tubMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const tub = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.5, 0.65, 16), tubMat);
    tub.position.y = 0.35;
    group.add(tub);

  } else if (modelType === 'chandelier') {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.05, 8, 24), MaterialLibrary.goldMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 2.1, 0);
    group.add(ring);

  } else if (modelType === 'trophy') {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.08, 0.65, 16), MaterialLibrary.goldMat);
    cup.position.set(0, 0.55, 0);
    group.add(cup);
  }

  return group;
}

// 4. Cash Pickup Mesh
export function createCashPickupMesh(amount: number): THREE.Group {
  const group = new THREE.Group();
  group.name = `cash_pickup_${amount}`;

  const stackMat = new THREE.MeshStandardMaterial({
    color: amount >= 10000 ? 0x15803d : 0x16a34a,
    roughness: 0.6,
  });

  const billStack = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.3), stackMat);
  billStack.castShadow = true;
  group.add(billStack);

  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.23, 0.31), new THREE.MeshStandardMaterial({ color: 0xfef08a }));
  group.add(strap);

  (group as unknown as { pickupAmount: number }).pickupAmount = amount;
  return group;
}
