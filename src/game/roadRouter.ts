/**
 * Delta State Main Road GPS Navigation & Routing System
 * Ensures vehicles strictly drive down paved asphalt roads and NEVER clip through buildings!
 */

export interface RoadWaypoint {
  x: number;
  z: number;
}

interface RoadLine {
  id: string;
  axis: 'X' | 'Z'; // 'X' means constant Z (East-West), 'Z' means constant X (North-South)
  coord: number;   // coordinate on the fixed axis (e.g. z = 0, or x = 0)
  min: number;     // min value on the other axis
  max: number;     // max value on the other axis
}

// Complete Delta State main asphalt road network
const MAIN_ROADS: RoadLine[] = [
  // East-West Roads (constant Z)
  { id: 'highway_main', axis: 'X', coord: 0, min: -380, max: 380 },
  { id: 'north_avenue', axis: 'X', coord: 140, min: -380, max: 380 },
  { id: 'south_avenue', axis: 'X', coord: -140, min: -380, max: 380 },
  { id: 'effurun_link', axis: 'X', coord: -35, min: -180, max: 180 },

  // North-South Roads (constant X)
  { id: 'expressway_main', axis: 'Z', coord: 0, min: -250, max: 250 },
  { id: 'west_avenue', axis: 'Z', coord: -180, min: -250, max: 250 },
  { id: 'east_avenue', axis: 'Z', coord: 180, min: -250, max: 250 },
  { id: 'villa_street', axis: 'Z', coord: -100, min: 0, max: 140 },
  { id: 'commercial_blvd', axis: 'Z', coord: 60, min: 0, max: 140 },
  { id: 'airport_blvd', axis: 'Z', coord: 130, min: -140, max: 0 },
];

/**
 * Projects a point onto the closest point on a road line
 */
function projectToRoad(x: number, z: number, road: RoadLine): { pt: RoadWaypoint; dist: number } {
  if (road.axis === 'X') {
    // Road has constant Z = road.coord
    const clampedX = Math.max(road.min, Math.min(road.max, x));
    const pt = { x: clampedX, z: road.coord };
    const dist = Math.hypot(x - pt.x, z - pt.z);
    return { pt, dist };
  } else {
    // Road has constant X = road.coord
    const clampedZ = Math.max(road.min, Math.min(road.max, z));
    const pt = { x: road.coord, z: clampedZ };
    const dist = Math.hypot(x - pt.x, z - pt.z);
    return { pt, dist };
  }
}

/**
 * Finds the closest road in the network to a given coordinate
 */
function findClosestRoad(x: number, z: number): { road: RoadLine; pt: RoadWaypoint } {
  let bestRoad = MAIN_ROADS[0];
  let bestPt = { x: 0, z: 0 };
  let minDist = Infinity;

  for (const road of MAIN_ROADS) {
    const res = projectToRoad(x, z, road);
    if (res.dist < minDist) {
      minDist = res.dist;
      bestRoad = road;
      bestPt = res.pt;
    }
  }

  return { road: bestRoad, pt: bestPt };
}

/**
 * Calculates a series of waypoints strictly along the asphalt road network
 * connecting start coordinate (sX, sZ) to destination (dX, dZ).
 * Never cuts diagonals through buildings!
 */
export function calculateRoadRoute(
  sX: number,
  sZ: number,
  dX: number,
  dZ: number
): RoadWaypoint[] {
  const startRoadMatch = findClosestRoad(sX, sZ);
  const endRoadMatch = findClosestRoad(dX, dZ);

  const startPt = startRoadMatch.pt;
  const endPt = endRoadMatch.pt;

  const waypoints: RoadWaypoint[] = [{ x: startPt.x, z: startPt.z }];

  const road1 = startRoadMatch.road;
  const road2 = endRoadMatch.road;

  if (road1.id === road2.id) {
    // Same road line! Simply drive directly down the road to the destination dropoff
    waypoints.push({ x: endPt.x, z: endPt.z });
    waypoints.push({ x: dX, z: dZ });
    return waypoints;
  }

  // If one road is horizontal and the other is vertical, check if they intersect directly
  if (road1.axis !== road2.axis) {
    const interX = road1.axis === 'Z' ? road1.coord : road2.coord;
    const interZ = road1.axis === 'X' ? road1.coord : road2.coord;

    // Check if the intersection is within bounds of both roads
    const inRoad1 =
      road1.axis === 'X'
        ? interX >= road1.min && interX <= road1.max
        : interZ >= road1.min && interZ <= road1.max;
    const inRoad2 =
      road2.axis === 'X'
        ? interX >= road2.min && interX <= road2.max
        : interZ >= road2.min && interZ <= road2.max;

    if (inRoad1 && inRoad2) {
      // Direct intersection!
      waypoints.push({ x: interX, z: interZ });
      waypoints.push({ x: endPt.x, z: endPt.z });
      waypoints.push({ x: dX, z: dZ });
      return waypoints;
    }
  }

  // Route through the primary East-West Highway (Z = 0) or North Avenue (Z = 140)
  // 1. Move from start road to nearest major highway intersection
  let intermediateZ = 0;
  if (Math.abs(startPt.z - 140) + Math.abs(endPt.z - 140) < Math.abs(startPt.z) + Math.abs(endPt.z)) {
    intermediateZ = 140; // Use North Avenue
  }

  if (road1.axis === 'Z') {
    // Start road is vertical (constant X) -> drive to highway intersection at (road1.coord, intermediateZ)
    waypoints.push({ x: road1.coord, z: intermediateZ });
  } else if (road1.coord !== intermediateZ) {
    // Start road is horizontal -> drive to expressway intersection at (0, road1.coord), then (0, intermediateZ)
    waypoints.push({ x: 0, z: road1.coord });
    waypoints.push({ x: 0, z: intermediateZ });
  }

  if (road2.axis === 'Z') {
    // Drive along highway to (road2.coord, intermediateZ), then down road2 to endPt
    waypoints.push({ x: road2.coord, z: intermediateZ });
  } else if (road2.coord !== intermediateZ) {
    // Drive along highway to expressway (0, intermediateZ), then (0, road2.coord)
    waypoints.push({ x: 0, z: intermediateZ });
    waypoints.push({ x: 0, z: road2.coord });
  }

  waypoints.push({ x: endPt.x, z: endPt.z });
  waypoints.push({ x: dX, z: dZ });

  // Clean duplicate waypoints
  const cleaned: RoadWaypoint[] = [];
  for (let i = 0; i < waypoints.length; i++) {
    const curr = waypoints[i];
    if (i === 0) {
      cleaned.push(curr);
    } else {
      const prev = cleaned[cleaned.length - 1];
      if (Math.hypot(curr.x - prev.x, curr.z - prev.z) > 1.5) {
        cleaned.push(curr);
      }
    }
  }

  return cleaned;
}
