// components/PlannerCanvas.jsx
import React, { useRef } from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';

export default function PlannerCanvas({
  boundaryPoints,
  obstacles,
  currentPoly,
  rectStart,
  pathSegments,
  mode,
  onCanvasClick,
  width,
  height
}) {
  const stageRef = useRef();

  return (
    <Stage
      width={width}
      height={height}
      ref={stageRef}
      onMouseDown={e => {
        const pos = stageRef.current.getPointerPosition();
        onCanvasClick(pos);
      }}
    >
      <Layer>
        {/* Boundary */}
        {boundaryPoints.length >= 2 && (
          <Line
            points={boundaryPoints.flatMap(p => [p.x, p.y])}
            closed
            stroke="#1976d2"
            strokeWidth={2}
          />
        )}
        {boundaryPoints.map((p, i) => (
          <Circle key={`b-${i}`} x={p.x} y={p.y} radius={5} fill="#1976d2" />
        ))}

        {/* Obstacles */}
        {obstacles.map(ob =>
          ob.type === 'rect' ? (
            <Rect key={ob.id} x={ob.x} y={ob.y} width={ob.width} height={ob.height}
                  fill="rgba(200,0,0,0.4)" stroke="#b71c1c" />
          ) : (
            <Line key={ob.id}
                  points={ob.points.flatMap(p => [p.x, p.y])}
                  closed
                  stroke="#b71c1c"
                  fill="rgba(200,0,0,0.35)" />
          )
        )}

        {/* Poly being drawn */}
        {currentPoly.length >= 2 && (
          <Line points={currentPoly.flatMap(p => [p.x, p.y])} stroke="#9c27b0" dash={[4, 4]} />
        )}

        {/* Rect start marker */}
        {rectStart && <Circle x={rectStart.x} y={rectStart.y} radius={4} fill="#ff9800" />}

        {/* Generated path */}
        {pathSegments.map((s, idx) => (
          <Line key={`path-${idx}`} points={[s.from.x, s.from.y, s.to.x, s.to.y]} stroke="#2e7d32" strokeWidth={2} />
        ))}
      </Layer>
    </Stage>
  );
}
