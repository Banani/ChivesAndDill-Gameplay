export const distanceBetweenTwoPoints = (point1, point2) => Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));

export const getTheClosestObject = (point, objects: Array<any>) =>
   objects.sort((a, b) => distanceBetweenTwoPoints(point, b.location) - distanceBetweenTwoPoints(point, a.location)).pop();
