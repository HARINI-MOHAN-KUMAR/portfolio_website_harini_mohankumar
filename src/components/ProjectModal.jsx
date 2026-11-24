import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, ChevronLeft, ChevronRight, X, ChevronRight as Arrow } from 'lucide-react'
import { projects } from '../data/profile'
import ProjectArt from './ProjectArt'
import { GitHubIcon } from './icons'

export default function ProjectModal({ index, onClose, onNavigate }) {
  const ref = useRef(null)
  const closeBtn = useRef(null)
  const open = index !== null
  const p = open ? projects[index] : null

  // focus management + scroll lock + keyboard
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    document.body.style.overflow = 'hidden'
    closeBtn.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % projects.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + projects.length) % projects.length)
      if (e.key === 'Tab' && ref.current) {
        const f = ref.current.querySelectorAll('a[href], button:not([disabled])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open, index, onClose, onNavigate])

  useEffect(() => {
    if (open && ref.current) ref.current.scrollTop = 0
  }, [index, open])

  if (!open) return null

  return createPortal(
    <div className="modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal__sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={ref}
        style={{ '--a': p.accent, '--b': p.accent2 }}
      >
        <div className="modal__bar">
          <span className="modal__count">
            Project {p.index} / 0{projects.length}
          </span>
          <div className="modal__nav">
            <button className="icon-btn" aria-label="Previous project" onClick={() => onNavigate((index - 1 + projects.length) % projects.length)}>
              <ChevronLeft size={18} />
            </button>
            <button className="icon-btn" aria-label="Next project" onClick={() => onNavigate((index + 1) % projects.length)}>
              <ChevronRight size={18} />
            </button>
            <button ref={closeBtn} className="icon-btn" aria-label="Close project" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal__hero">
          <div className="modal__art">
            <ProjectArt id={p.id} />
          </div>
          <div>
            <p className="eyebrow">
              <span>{p.index}</span>
              {p.subtitle}
            </p>
            <h2 id="modal-title">{p.name}</h2>
            <p className="lead">{p.tagline}</p>
            <ul className="chips">
              {p.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a className="btn" href={p.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon width={18} height={18} /> View on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className="modal__grid">
          <section>
            <h3>The problem</h3>
            <p>{p.problem}</p>
          </section>
          <section>
            <h3>The solution</h3>
            <p>{p.solution}</p>
          </section>
        </div>

        <section className="modal__flow">
          <h3>Workflow</h3>
          <ol className="flow">
            {p.workflow.map((s, i) => (
              <li key={s}>
                <span className="flow__n">{i + 1}</span>
                <span>{s}</span>
                {i < p.workflow.length - 1 && <Arrow size={16} className="flow__arrow" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </section>

        <div className="modal__grid">
          <section>
            <h3>Key features</h3>
            <ul className="bullets">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>My contribution</h3>
            <ul className="bullets">
              {p.contribution.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  )
}
