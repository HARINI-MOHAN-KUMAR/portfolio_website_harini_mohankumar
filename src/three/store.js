// Shared mutable state between the DOM (GSAP ScrollTrigger) and the 3D scene.
// `t` is the "story position": 0 = start, 7 = contact. Each integer is a scene.

export const store = {
  t: 0,
  pointer: { x: 0, y: 0 },
  hover: { project: -1, exp: -1, skill: -1 },
  reduced: false,
  mobile: false,
  theme: 'dark',
  invalidate: null, // set by Scene3D (used when frameloop="demand")
}

export const ease = (x) => x * x * (3 - 2 * x)
export const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b)

// Keyframe interpolation: arr[i] is the value at scene i.
export function kf(t, arr) {
  const max = arr.length - 1
  const c = clamp(t, 0, max)
  const i = Math.min(Math.floor(c), max - 1)
  const f = ease(c - i)
  return arr[i] + (arr[i + 1] - arr[i]) * f
}

// Weight of a scene group: 1 at its centre, 0 beyond `half` scenes away.
export function wt(t, center, half = 0.95) {
  const d = Math.abs(t - center)
  return d >= half ? 0 : ease(1 - d / half)
}

// Desk is visible at the start and again at the end.
export function deskWeight(t) {
  if (t <= 1) return 1
  if (t < 2) return 1 - ease(t - 1)
  if (t < 6) return 0
  if (t < 7) return ease(t - 6)
  return 1
}
