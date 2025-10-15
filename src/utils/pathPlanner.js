// utils/pathPlanner.js

export function pointInPolygon(point, vs) {
  const x = point.x, y = point.y;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x, yi = vs[i].y;
    const xj = vs[j].x, yj = vs[j].y;
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi + 1e-7) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function pointInAnyObstacle(pt, obstacles) {
  for (const ob of obstacles) {
    if (ob.type === 'rect') {
      const { x, y, width, height } = ob;
      if (pt.x >= x && pt.x <= x + width && pt.y >= y && pt.y <= y + height) return true;
    } else if (ob.type === 'poly') {
      if (pointInPolygon(pt, ob.points)) return true;
    }
  }
  return false;
}

export function bboxForPoints(points) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  points.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  });
  return { minX, minY, maxX, maxY };
}

export function generateParallelLines(bbox, angleDeg, spacing) {
  const angle = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(angle), dy = Math.sin(angle);
  const px = -dy, py = dx;

  const corners = [
    { x: bbox.minX, y: bbox.minY },
    { x: bbox.minX, y: bbox.maxY },
    { x: bbox.maxX, y: bbox.minY },
    { x: bbox.maxX, y: bbox.maxY },
  ];

  const projections = corners.map(c => c.x * px + c.y * py);
  const minProj = Math.min(...projections);
  const maxProj = Math.max(...projections);

  const lines = [];
  for (let p = minProj - spacing; p <= maxProj + spacing; p += spacing) {
    const cx = px * p, cy = py * p;
    const len = Math.max(bbox.maxX - bbox.minX, bbox.maxY - bbox.minY) * 3;
    lines.push({
      x1: cx - dx * len, y1: cy - dy * len,
      x2: cx + dx * len, y2: cy + dy * len
    });
  }
  return lines;
}

export function sampleLineSegments(line, polygonPoints, obstacles, step = 6) {
  const { x1, y1, x2, y2 } = line;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const nx = (x2 - x1) / dist, ny = (y2 - y1) / dist;

  const points = [];
  for (let d = 0; d <= dist; d += step) {
    const p = { x: x1 + nx * d, y: y1 + ny * d };
    const inside = pointInPolygon(p, polygonPoints) && !pointInAnyObstacle(p, obstacles);
    points.push({ p, inside });
  }

  const segments = [];
  let cur = null;
  for (const item of points) {
    if (item.inside) {
      if (!cur) cur = { from: item.p, to: item.p };
      else cur.to = item.p;
    } else {
      if (cur) { segments.push(cur); cur = null; }
    }
  }
  if (cur) segments.push(cur);
  return segments;
}
