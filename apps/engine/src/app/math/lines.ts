import { AREAS, BORDER } from '../modules';
import { distanceBetweenTwoPoints } from './points';

function getLine([firstPointsSet, secondPointsSet]) {
   const [x1, y1] = firstPointsSet;
   const [x2, y2] = secondPointsSet;

   if (x1 - x2 === 0) {
      return { x: x1, a: 0 };
   }

   if (y1 - y2 === 0) {
      return { y: y1 };
   }

   const a = (y1 - y2) / (x1 - x2);
   const b = y2 - a * x2;

   return { a, b };
}

export function linesCrossPoint(line1, line2) {
   if (line1.x !== undefined && line2.y !== undefined) {
      return { x: line1.x, y: line2.y };
   }

   if (line2.x !== undefined && line1.y !== undefined) {
      return { x: line2.x, y: line1.y };
   }

   if (line1.x !== undefined) {
      return { x: line1.x, y: line2.a * line1.x + line2.b };
   }

   if (line2.x !== undefined) {
      return { x: line2.x, y: line1.a * line2.x + line1.b };
   }

   if (line1.y !== undefined) {
      return { x: (line1.y - line2.b) / line2.a, y: line1.y };
   }

   if (line2.y !== undefined) {
      return { x: (line2.y - line1.b) / line1.a, y: line2.y };
   }

   const b = line1.b - line2.b;
   const a = line2.a - line1.a;

   const x = b / a;
   const y = line1.a * x + line1.b;

   return { x, y };
}

function isThePointOnTheSegment({ x, y }, segment) {
   if (x > segment[0][0] && x > segment[1][0]) return false;
   if (x < segment[0][0] && x < segment[1][0]) return false;
   if (y > segment[0][1] && y > segment[1][1]) return false;
   if (y < segment[0][1] && y < segment[1][1]) return false;
   return true;
}

export function getSegmentsCrossingPoint(segment1, segment2) {
   const line1 = getLine(segment1);
   const line2 = getLine(segment2);

   if (line1.a === line2.a) {
      return null;
   }

   const { x, y } = linesCrossPoint(line1, line2);

   if (isThePointOnTheSegment({ x, y }, segment1) && isThePointOnTheSegment({ x, y }, segment2)) {
      return { x, y };
   }

   return null;
}

export function areSegmentsIntersecting(segment1, segment2) {
   return getSegmentsCrossingPoint(segment1, segment2) !== null;
}

export function isSegmentIntersectingWithACircle(segment, circle) {
   const line = getLine(segment);

   const perpenticularLine = Object.assign({}, { ...line, a: -1 / line.a });
   perpenticularLine.b = circle[1] - circle[0] * perpenticularLine.a;

   const linesIntersectionPoint = linesCrossPoint(line, perpenticularLine);

   if (!isThePointOnTheSegment(linesIntersectionPoint, segment)) {
      return false;
   }

   const distance = distanceBetweenTwoPoints({ x: circle[0], y: circle[1] }, linesIntersectionPoint);
   return distance < circle[2];
}

export function getCrossingPointsWithWalls(movementSegment) {
   return [...BORDER, ...AREAS].reduce((prev, polygon) => {
      const intersections = [];
      for (let i = 0; i < polygon.length; i++) {
         const crossPoint = getSegmentsCrossingPoint(movementSegment, [polygon[i], polygon[(i + 1) % polygon.length]]);
         if (crossPoint !== null) {
            intersections.push(crossPoint);
         }
      }
      return prev.concat(intersections);
   }, []);
}

export function isSegementCrossingWithAnyWall(movementSegment) {
   const polygons = [...BORDER, ...AREAS];

   for (let polygon of polygons) {
      for (let i = 0; i < polygon.length; i++) {
         const crossPoint = getSegmentsCrossingPoint(movementSegment, [polygon[i], polygon[(i + 1) % polygon.length]]);
         if (crossPoint !== null) {
            return true;
         }
      }
   }

   return false;
}
