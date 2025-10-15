import React, { useState } from 'react';
import PlannerCanvas from './components/PlannerCanvas';
import Controls from './components/Controls.jsx';
import { v4 as uuidv4 } from 'uuid';
import {
  bboxForPoints,
  generateParallelLines,
  sampleLineSegments
} from './utils/pathPlanner';

function App() {
  // ----------------- STATE -----------------
  const [mode, setMode] = useState('boundary');
  const [boundaryPoints, setBoundaryPoints] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [currentPoly, setCurrentPoly] = useState([]);
  const [rectStart, setRectStart] = useState(null);
  const [spacing, setSpacing] = useState(30);
  const [angle, setAngle] = useState(0);
  const [pathSegments, setPathSegments] = useState([]);

  // ----------------- HANDLERS -----------------
  function onCanvasClick(pos) {
    if (mode === 'boundary') {
      setBoundaryPoints(prev => [...prev, pos]);
    } else if (mode === 'obstacle-poly') {
      setCurrentPoly(prev => [...prev, pos]);
    } else if (mode === 'obstacle-rect') {
      if (!rectStart) setRectStart(pos);
      else {
        const x = Math.min(rectStart.x, pos.x);
        const y = Math.min(rectStart.y, pos.y);
        const width = Math.abs(pos.x - rectStart.x);
        const height = Math.abs(pos.y - rectStart.y);
        setObstacles(prev => [
          ...prev,
          { id: uuidv4(), type: 'rect', x, y, width, height }
        ]);
        setRectStart(null);
      }
    }
  }

  function finishPolygonObstacle() {
    if (currentPoly.length >= 3) {
      setObstacles(prev => [...prev, { id: uuidv4(), type: 'poly', points: currentPoly }]);
      setCurrentPoly([]);
    }
  }

  function generatePath() {
    if (boundaryPoints.length < 3) {
      alert('Add 3+ boundary points first');
      return;
    }
    const bbox = bboxForPoints(boundaryPoints);
    const lines = generateParallelLines(bbox, angle, spacing);
    const segs = [];
    for (const ln of lines) {
      const s = sampleLineSegments(ln, boundaryPoints, obstacles, 6);
      segs.push(...s);
    }
    setPathSegments(segs);
  }

  function saveMission() {
    const data = { boundaryPoints, obstacles, pathSegments };
    localStorage.setItem('mission_v1', JSON.stringify(data));
    alert('Mission saved to localStorage!');
  }

  function exportJSON() {
    const data = { boundaryPoints, obstacles, pathSegments };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mission.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearMission() {
    setBoundaryPoints([]);
    setObstacles([]);
    setPathSegments([]);
    setCurrentPoly([]);
    setRectStart(null);
  }

  // ----------------- RENDER -----------------
  return (
    <div style={{ display: 'flex' }}>
      <Controls
        mode={mode} onChangeMode={setMode}
        spacing={spacing} onChangeSpacing={setSpacing}
        angle={angle} onChangeAngle={setAngle}
        onGeneratePath={generatePath}
        onSave={saveMission} onExport={exportJSON} onClear={clearMission}
        onFinishPoly={finishPolygonObstacle}
        canFinishPoly={currentPoly.length >= 3}
      />
      <div style={{ flex: 1 }}>
        <PlannerCanvas
          boundaryPoints={boundaryPoints}
          obstacles={obstacles}
          currentPoly={currentPoly}
          rectStart={rectStart}
          pathSegments={pathSegments}
          mode={mode}
          onCanvasClick={onCanvasClick}
          width={window.innerWidth - 320}
          height={window.innerHeight}
        />
      </div>
    </div>
  );
}

export default App;
