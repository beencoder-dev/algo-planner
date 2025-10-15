// src/components/Controls.jsx
import React from 'react';
import { Box, Button, Slider, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';

function Controls({
  mode, onChangeMode,
  spacing, onChangeSpacing,
  angle, onChangeAngle,
  onGeneratePath, onSave, onExport, onClear, onFinishPoly,
  canFinishPoly
}) {
  return (
    <Box sx={{ width: 320, p: 2, bgcolor: '#f7f7f7', height: '100vh', overflow: 'auto' }}>
      <Typography variant="h6">Path Planner Controls</Typography>

      <Box sx={{ mt: 2 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => { if (val) onChangeMode(val); }}
          orientation="vertical"
          fullWidth
        >
          <ToggleButton value="boundary">Draw Boundary</ToggleButton>
          <ToggleButton value="obstacle-rect">Add Rect Obstacle</ToggleButton>
          <ToggleButton value="obstacle-poly">Add Poly Obstacle</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography>Spacing (px)</Typography>
        <Slider value={spacing} min={8} max={200} onChange={(e, v) => onChangeSpacing(v)} />
        <Typography>Angle (deg)</Typography>
        <Slider value={angle} min={0} max={180} onChange={(e, v) => onChangeAngle(v)} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth onClick={onGeneratePath}>Generate Path</Button>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={onSave}>Save</Button>
        <Button variant="outlined" onClick={onExport}>Export</Button>
        <Button variant="outlined" color="error" onClick={onClear}>Clear</Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button onClick={onFinishPoly} disabled={!canFinishPoly}>Finish poly</Button>
      </Box>
    </Box>
  );
}

export default Controls;
