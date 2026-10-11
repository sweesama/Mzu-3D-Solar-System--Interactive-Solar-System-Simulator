(function (root) {
    'use strict';
    // Drag-to-look maths shared by the eight first-person expeditions.
    // Dragging the mouse or a finger turns the view: horizontal motion changes yaw
    // (wrapped to −π…π so the view never jumps at the seam), vertical motion changes
    // pitch (clamped so the camera cannot flip over the top or look straight down).
    // Pure functions only: each page keeps its own yaw/pitch variables and drag state.
    const SENSITIVITY = 0.003;
    const PITCH_MIN = -1.45;
    const PITCH_MAX = 1.2;

    // Returns the new view angles after a pointer moved (dx, dy) pixels.
    function applyDrag(yaw, pitch, dx, dy) {
        const nextYaw = ((yaw - dx * SENSITIVITY + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        const nextPitch = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitch - dy * SENSITIVITY));
        return { yaw: nextYaw, pitch: nextPitch };
    }

    root.ExpeditionLook = Object.freeze({ SENSITIVITY, PITCH_MIN, PITCH_MAX, applyDrag });
}(typeof globalThis !== 'undefined' ? globalThis : this));
