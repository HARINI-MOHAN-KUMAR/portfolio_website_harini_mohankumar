import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Menu, Moon, Sun, X, Download } from 'lucide-react'
import { profile, sections } from '../data/profile'
import { store } from '../three/store'

/* Magnetic wrapper: element gently follows the pointer. */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || store.reduced || store.mobile) return
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.35, ease: 'power3.out' })
    }
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  )
}

/* Custom cursor (fine pointers only, disabled for reduced motion). */
export function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled] = useState(
    () => !store.reduced && !store.mobile && window.matchMedia('(pointer: fine)').matches,
  )

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3' })
    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      const hot = e.target.closest?.('a, button, [role="button"], input, [data-cursor]')
      ring.current.classList.toggle('is-hot', !!hot || document.body.dataset.cursor === 'tile')
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

/* Pointer tracking for touch / reduced-motion setups (head follow only on fine pointers). */
export function usePointerTracking() {
  useEffect(() => {
    if (store.mobile) return
    const move = (e) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      store.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
}

export function ProgressBar() {
  const bar = useRef(null)
  useEffect(() => {
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      const p = h > 0 ? window.scrollY / h : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])
  return (
    <div className="progress" aria-hidden="true">
      <div ref={bar} className="progress__bar" />
    </div>
  )
}

export function Loader({ done }) {
  const [pct, setPct] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const o = { v: 0 }
    const tw = gsap.to(o, {
      v: done ? 100 : 88,
      duration: done ? 0.5 : 2.2,
      ease: 'power2.out',
      onUpdate: () => setPct(Math.round(o.v)),
    })
    return () => tw.kill()
  }, [done])

  useEffect(() => {
    if (!done) return
    const id = setTimeout(() => setGone(true), 900)
    return () => clearTimeout(id)
  }, [done])

  if (gone) return null
  return (
    <div className={`loader ${done ? 'loader--out' : ''}`} role="status" aria-live="polite">
      <div className="loader__mark" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id="loader-hm" x1="20" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#65E6CE" />
              <stop offset="1" stopColor="#42CFF4" />
            </linearGradient>
          </defs>
          <circle className="loader__orbit" cx="50" cy="50" r="46" />
          <path
            className="loader__glyph"
            d="M20 20V80M20 50H50M50 20V80M50 20L70 80L90 20V80"
            pathLength="100"
            stroke="url(#loader-hm)"
            strokeWidth="8"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="loader__name">HARINI MOHAN</p>
      <div className="loader__track" aria-hidden="true">
        <div className="loader__fill" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <p className="loader__pct">{pct}%</p>
    </div>
  )
}

export function Nav({ active, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: store.reduced ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="nav">
        <a href="#home" className="nav__logo" onClick={go('home')} aria-label="Harini Mohankumar — back to start">
          <img src={`${import.meta.env.BASE_URL}hm-navbar.svg`} alt="" />
          <span>HARINI MOHAN</span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          {sections.slice(1).map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={go(s.id)}
              className={active === s.id ? 'is-active' : ''}
              aria-current={active === s.id ? 'true' : undefined}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a className="btn btn--sm btn--ghost nav__resume" href={profile.links.resume} download>
            <Download size={15} /> Resume
          </a>
          <button
            className="icon-btn nav__burger"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* side rail: scene dots */}
      <nav className="rail" aria-label="Scene navigation">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={go(s.id)}
            className={active === s.id ? 'is-active' : ''}
            aria-label={s.label}
          >
            <span className="rail__label">{s.label}</span>
            <span className="rail__dot" />
          </a>
        ))}
      </nav>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} hidden={!open}>
        {sections.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} onClick={go(s.id)} className={active === s.id ? 'is-active' : ''}>
            <small>0{i + 1}</small> {s.label}
          </a>
        ))}
        <a className="btn" href={profile.links.resume} download>
          <Download size={16} /> Download Resume
        </a>
      </div>
    </>
  )
}
