import * as THREE from 'three'

const KEYWORDS = new Set([
  'public', 'class', 'void', 'String', 'private', 'return', 'def', 'from',
  'import', 'new', 'static', 'int',
])

function colorFor(tok, accent) {
  if (/^\/\//.test(tok) || /^#/.test(tok)) return '#64748b'
  if (/^".*"$/.test(tok)) return '#86efac'
  if (KEYWORDS.has(tok)) return '#c4b5fd'
  if (/^[$@]/.test(tok)) return accent
  if (/^\d+$/.test(tok)) return '#fbbf24'
  if (/^[(){};.,=<>+\-*/:]$/.test(tok)) return '#94a3b8'
  return '#e2e8f0'
}

// Animated "typing" code window rendered to a canvas texture.
export function makeCodeScreen(lines, { accent = '#22d3ee', title = 'Main.java' } = {}) {
  const w = 512
  const h = 320
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  const full = lines.join('\n')

  const draw = (chars) => {
    ctx.fillStyle = '#070d24'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#101a3d'
    ctx.fillRect(0, 0, w, 30)
    ;['#fb7185', '#fbbf24', '#34d399'].forEach((c, i) => {
      ctx.fillStyle = c
      ctx.beginPath()
      ctx.arc(18 + i * 17, 15, 4.5, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.fillStyle = '#94a3b8'
    ctx.font = '13px "JetBrains Mono", monospace'
    ctx.fillText(title, 80, 19)
    ctx.fillStyle = accent
    ctx.fillRect(0, 30, w, 2)

    ctx.font = '16px "JetBrains Mono", monospace'
    const shown = full.slice(0, chars).split('\n')
    shown.forEach((ln, i) => {
      const y = 62 + i * 24
      ctx.fillStyle = '#334155'
      ctx.fillText(String(i + 1).padStart(2, ' '), 12, y)
      let x = 44
      const toks = ln.split(/(\s+|"[^"]*"|\/\/.*|#.*|[(){};.,=<>+\-*/:])/).filter((s) => s !== '')
      toks.forEach((tk) => {
        ctx.fillStyle = colorFor(tk, accent)
        ctx.fillText(tk, x, y)
        x += ctx.measureText(tk).width
      })
      if (i === shown.length - 1 && chars < full.length + 1) {
        ctx.fillStyle = accent
        ctx.fillRect(x + 1, y - 13, 8, 17)
      }
    })
    texture.needsUpdate = true
  }

  return { texture, draw, length: full.length }
}

// Label tile for a skill (used in the Technology Lab).
export function makeLabelTexture(text, color) {
  const w = 384
  const h = 160
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  const r = 28
  ctx.fillStyle = 'rgba(9,14,40,0.94)'
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.arcTo(w, 0, w, h, r)
  ctx.arcTo(w, h, 0, h, r)
  ctx.arcTo(0, h, 0, 0, r)
  ctx.arcTo(0, 0, w, 0, r)
  ctx.closePath()
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = color
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(46, h / 2, 14, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#f1f5f9'
  let size = 44
  ctx.font = `600 ${size}px "Space Grotesk", sans-serif`
  while (ctx.measureText(text).width > w - 110 && size > 20) {
    size -= 2
    ctx.font = `600 ${size}px "Space Grotesk", sans-serif`
  }
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 78, h / 2 + 2)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}
