import { Component, Suspense, lazy, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sections } from './data/profile'
import { store, ease, clamp } from './three/store'
import { Cursor, Loader, Nav, ProgressBar, usePointerTracking } from './components/ui'
import { About, Certs, Contact, Education, Experience, Hero, Projects, TechLab } from './components/Sections'
import ProjectModal from './components/ProjectModal'

gsap.registerPlugin(ScrollTrigger)

// Lazy-load the whole 3D bundle (three + r3f) so the page text is usable immediately.
const Scene3D = lazy(() => import('./three/Scene3D'))

/* ---- environment detection (runs once, before first render) ---- */
store.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
store.mobile = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
const savedTheme = (() => {
  try {
    return localStorage.getItem('theme')
  } catch {
    return null
  }
})()
store.theme = savedTheme || 'dark'
document.documentElement.dataset.theme = store.theme

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('3D scene disabled:', err)
    this.props.onFail?.()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/* ---- GSAP ScrollTrigger drives the story position `store.t` ---- */
function useStoryScroll() {
  useLayoutEffect(() => {
    let centers = []
    const measure = () => {
      centers = sections.map((s) => {
        const el = document.getElementById(s.id)
        if (!el) return 0
        const r = el.getBoundingClientRect()
        return r.top + window.scrollY + r.height / 2
      })
    }
    const compute = () => {
      const y = window.scrollY + window.innerHeight / 2
      const last = centers.length - 1
      if (y <= centers[0]) return 0
      if (y >= centers[last]) return last
      let i = 0
      while (i < last - 1 && y >= centers[i + 1]) i++
      const f = (y - centers[i]) / (centers[i + 1] - centers[i])
      // hold each scene for a while around its centre, transition in between
      return i + ease(clamp((f - 0.2) / 0.6))
    }
    const apply = () => {
      const t = compute()
      if (store.reduced) {
        store.t = t
        store.invalidate?.()
      } else {
        gsap.to(store, { t, duration: 0.9, ease: 'power3.out', overwrite: true })
      }
    }
    measure()
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: apply,
      onRefresh: () => {
        measure()
        apply()
      },
    })
    apply()
    const ro = new ResizeObserver(() => ScrollTrigger.refresh())
    ro.observe(document.body)
    return () => {
      st.kill()
      ro.disconnect()
    }
  }, [])
}

/* ---- text reveals + active section ---- */
function useReveals(setActive, enabled) {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      sections.forEach((s) => {
        ScrollTrigger.create({
          trigger: `#${s.id}`,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(s.id),
        })
      })

      if (store.reduced || !enabled) return

      gsap.set('[data-reveal]', { autoAlpha: 0, y: 28 })
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true }),
      })

      // hero name: slide-up letters
      gsap.utils.toArray('[data-split]').forEach((el, li) => {
        const text = el.textContent
        el.setAttribute('aria-hidden', 'true')
        el.innerHTML = ''
        const grad = el.classList.contains('hero__line--grad')
        const chars = [...text]
        chars.forEach((ch, ci) => {
          const s = document.createElement('span')
          s.className = 'ch'
          s.textContent = ch
          if (grad) s.style.color = gsap.utils.interpolate('#22d3ee', '#8b5cf6', ci / (chars.length - 1))
          el.appendChild(s)
        })
        gsap.from(el.querySelectorAll('.ch'), {
          yPercent: 110,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.04,
          delay: 0.2 + li * 0.25,
        })
      })

      // education line grows with scroll
      gsap.fromTo(
        '.edu__line',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.edu', start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
        },
      )
    })
    return () => ctx.revert()
  }, [setActive, enabled])
}

export default function App() {
  const [theme, setTheme] = useState(store.theme)
  const [active, setActive] = useState('home')
  const [ready, setReady] = useState(false)
  const [webgl] = useState(hasWebGL)
  const [project, setProject] = useState(null)

  useStoryScroll()
  usePointerTracking()
  useReveals(setActive, ready)

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      store.theme = next
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* ignore */
      }
      store.invalidate?.()
      return next
    })
  }, [])

  // Reveal the experience once the 3D scene is ready (or after a safety timeout / no WebGL).
  useEffect(() => {
    const min = setTimeout(() => {
      if (!webgl) setReady(true)
    }, 900)
    const max = setTimeout(() => setReady(true), 6000)
    return () => {
      clearTimeout(min)
      clearTimeout(max)
    }
  }, [webgl])

  useEffect(() => {
    if (ready) requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [ready])

  const closeProject = useCallback(() => setProject(null), [])

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Loader done={ready} />
      <Cursor />
      <ProgressBar />

      <div className="stage" aria-hidden="true">
        {webgl ? (
          <SceneBoundary onFail={() => setReady(true)}>
            <Suspense fallback={null}>
              <Scene3D theme={theme} onReady={() => setReady(true)} />
            </Suspense>
          </SceneBoundary>
        ) : null}
        <div className="stage__vignette" />
      </div>

      <Nav active={active} theme={theme} onToggleTheme={toggleTheme} />

      <main id="story">
        <Hero />
        <About />
        <TechLab />
        <Projects onOpen={setProject} />
        <Experience />
        <Education />
        <Certs />
        <Contact />
      </main>

      <ProjectModal index={project} onClose={closeProject} onNavigate={setProject} />
    </>
  )
}
