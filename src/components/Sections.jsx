import { memo, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowDown,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Check,
  Copy,
  Download,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Target,
  Trophy,
  FileText,
} from 'lucide-react'
import {
  profile,
  skillGroups,
  allSkills,
  projects,
  experience,
  education,
  certifications,
} from '../data/profile'
import { store } from '../three/store'
import { Magnetic } from './ui'
import ProjectArt from './ProjectArt'
import { GitHubIcon, LinkedInIcon, LeetCodeIcon } from './icons'

const scrollTo = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: store.reduced ? 'auto' : 'smooth', block: 'start' })
}

function Eyebrow({ no, children }) {
  return (
    <p className="eyebrow" data-reveal>
      <span>{no}</span>
      {children}
    </p>
  )
}

/* ------------------------------ Scene 1 ------------------------------ */
export const Hero = memo(function Hero() {
  return (
    <section id="home" className="scene scene--hero" aria-labelledby="hero-title">
      <div className="panel panel--clear">
        <p className="eyebrow" data-reveal>
          <span>00</span>Beyond the screen
        </p>
        <h1 id="hero-title" className="hero__name" aria-label={profile.nameCaps}>
          <span className="hero__line" data-split>HARINI</span>
          <span className="hero__line hero__line--grad" data-split>MOHANKUMAR</span>
        </h1>
        <p className="hero__role" data-reveal>
          {profile.titleLine1}
          <br />
          <strong>{profile.titleLine2}</strong>
        </p>
        <p className="lead" data-reveal>
          {profile.intro}
        </p>
        <div className="actions" data-reveal>
          <Magnetic>
            <a className="btn" href="#about" onClick={scrollTo('about')}>
              Explore My World <ArrowDown size={17} />
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn btn--ghost" href={profile.links.resume} download>
              <Download size={17} /> Download Resume
            </a>
          </Magnetic>
        </div>
        <p className="hint" data-reveal>
          <span className="hint__mouse" aria-hidden="true" /> Scroll to follow the story
        </p>
      </div>
    </section>
  )
})

/* ------------------------------ Scene 2 ------------------------------ */
export function About() {
  const be = education[0]
  return (
    <section id="about" className="scene" aria-labelledby="about-title">
      <div className="panel">
        <Eyebrow no="01">About me</Eyebrow>
        <h2 id="about-title" data-reveal>
          Building efficient, scalable, <em>user-friendly</em> software.
        </h2>
        <p className="body" data-reveal>
          {profile.summary}
        </p>
        <div className="floaters">
          <article className="float-card" data-reveal>
            <GraduationCap size={20} aria-hidden="true" />
            <h3>Education</h3>
            <p>
              B.E. Computer & Communication Engineering
              <br />
              <span className="muted">
                {be.school} · {be.years}
              </span>
            </p>
            <p className="stat">
              CGPA <b>{be.score}</b>
            </p>
          </article>
          <article className="float-card" data-reveal>
            <Sparkles size={20} aria-hidden="true" />
            <h3>Interests</h3>
            <ul className="chips">
              {profile.interests.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
          <article className="float-card" data-reveal>
            <Target size={20} aria-hidden="true" />
            <h3>Career goal</h3>
            <p>{profile.goal}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Scene 3 ------------------------------ */
export function TechLab() {
  const [hot, setHot] = useState(-1)
  useEffect(() => {
    const fn = (e) => setHot(e.detail)
    window.addEventListener('skillhover', fn)
    return () => window.removeEventListener('skillhover', fn)
  }, [])

  return (
    <section id="lab" className="scene" aria-labelledby="lab-title">
      <div className="panel">
        <Eyebrow no="02">Technology lab</Eyebrow>
        <h2 id="lab-title" data-reveal>
          The tools I build with.
        </h2>
        <p className="body" data-reveal>
          Hover a skill here — or a floating tile in the lab — to bring it into focus.
        </p>
        <div className="skills">
          {skillGroups.map((g) => (
            <div key={g.id} className="skill-group" data-reveal>
              <h3>{g.label}</h3>
              <ul className="chips chips--skills">
                {g.items.map((s) => {
                  const idx = allSkills.findIndex((x) => x.name === s.name)
                  return (
                    <li
                      key={s.name}
                      className={hot === idx ? 'is-hot' : ''}
                      style={{ '--c': s.color }}
                      onPointerEnter={() => {
                        store.hover.skill = idx
                      }}
                      onPointerLeave={() => {
                        store.hover.skill = -1
                      }}
                    >
                      <i aria-hidden="true" />
                      {s.name}
                      {s.note && <small>{s.note}</small>}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Scene 4 ------------------------------ */
export function Projects({ onOpen }) {
  return (
    <section id="projects" className="scene scene--wide" aria-labelledby="projects-title">
      <div className="panel panel--wide">
        <Eyebrow no="03">Project universe</Eyebrow>
        <h2 id="projects-title" data-reveal>
          Three worlds I have built.
        </h2>
        <p className="body body--center" data-reveal>
          Select a project to explore its problem, workflow, stack and my contribution.
        </p>
        <div className="project-grid">
          {projects.map((p, i) => (
            <button
              key={p.id}
              className="project-card"
              style={{ '--a': p.accent, '--b': p.accent2 }}
              onClick={() => onOpen(i)}
              onPointerEnter={() => (store.hover.project = i)}
              onPointerLeave={() => (store.hover.project = -1)}
              onFocus={() => (store.hover.project = i)}
              onBlur={() => (store.hover.project = -1)}
              aria-haspopup="dialog"
              aria-label={`Open project: ${p.name} — ${p.subtitle}`}
              data-reveal
            >
              <div className="project-card__art">
                <ProjectArt id={p.id} />
                <span className="project-card__no">{p.index}</span>
              </div>
              <div className="project-card__body">
                <h3>{p.name}</h3>
                <p className="project-card__sub">{p.subtitle}</p>
                <p className="project-card__tag">{p.tagline}</p>
                <ul className="chips chips--tiny">
                  {p.tech.slice(0, 4).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                  {p.tech.length > 4 && <li>+{p.tech.length - 4}</li>}
                </ul>
                <span className="project-card__cta">
                  Explore project <ArrowUpRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ Scene 5 ------------------------------ */
export function Experience() {
  const [active, setActive] = useState(0)
  const set = (i) => {
    setActive(i)
    store.hover.exp = i
  }
  return (
    <section id="experience" className="scene" aria-labelledby="exp-title">
      <div className="panel">
        <Eyebrow no="04">Experience</Eyebrow>
        <h2 id="exp-title" data-reveal>
          Internship journey.
        </h2>
        <ol className="timeline" onPointerLeave={() => (store.hover.exp = active)}>
          {experience.map((e, i) => {
            const on = active === i
            return (
              <li key={e.id} className={`tl-item ${on ? 'is-on' : ''}`} data-reveal>
                <span className="tl-dot" aria-hidden="true" />
                <button
                  className="tl-head"
                  onClick={() => set(i)}
                  onPointerEnter={() => (store.hover.exp = i)}
                  aria-expanded={on}
                  aria-controls={`exp-${e.id}`}
                >
                  <span className="tl-dates">{e.dates}</span>
                  <span className="tl-role">{e.role}</span>
                  <span className="tl-company">
                    {e.company}
                    {e.place && <small> · {e.place}</small>}
                  </span>
                </button>
                <div id={`exp-${e.id}`} className="tl-body" hidden={!on}>
                  <p className="tl-focus">
                    <Briefcase size={14} aria-hidden="true" /> {e.focus}
                    {e.project && (
                      <>
                        {' '}
                        · Project: <b>{e.project}</b>
                      </>
                    )}
                  </p>
                  {e.summary && <p className="tl-summary">{e.summary}</p>}
                  <ul className="bullets">
                    {e.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="chips chips--tiny">
                    {e.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  {e.github && (
                    <a className="link" href={e.github} target="_blank" rel="noopener noreferrer">
                      <GitHubIcon width={16} height={16} /> View project on GitHub <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------ Scene 6 ------------------------------ */
function CountUp({ value, decimals = 2, suffix = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const final = Number(value)
    if (store.reduced) {
      el.textContent = final.toFixed(decimals) + suffix
      return
    }
    const o = { v: 0 }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        gsap.to(o, {
          v: final,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => (el.textContent = o.v.toFixed(decimals) + suffix),
          onComplete: () => (el.textContent = final.toFixed(decimals) + suffix),
        })
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [value, decimals, suffix])
  return <span ref={ref}>{Number(value).toFixed(decimals) + suffix}</span>
}

export function Education() {
  return (
    <section id="education" className="scene" aria-labelledby="edu-title">
      <div className="panel">
        <Eyebrow no="05">Education</Eyebrow>
        <h2 id="edu-title" data-reveal>
          Academic journey.
        </h2>
        <ol className="edu">
          <span className="edu__line" aria-hidden="true" />
          {[...education].reverse().map((e, i) => (
            <li key={e.id} className="edu-item" data-reveal>
              <span className="edu-node" aria-hidden="true">
                <BookOpen size={14} />
              </span>
              <div className="edu-card">
                <p className="edu-years">{e.years}</p>
                <h3>{e.degree}</h3>
                <p className="muted">
                  {e.school} · {e.place}
                </p>
                <p className="stat">
                  {e.scoreLabel}{' '}
                  <b>
                    {e.id === 'be' ? (
                      <CountUp value="8.54" decimals={2} />
                    ) : (
                      <CountUp value="86.17" decimals={2} suffix="%" />
                    )}
                  </b>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------ Scene 7 ------------------------------ */
function Tilt({ children, className }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (store.reduced || store.mobile) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-3px)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <article ref={ref} className={className} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </article>
  )
}

export function Certs() {
  const icon = {
    Certification: Award,
    Achievement: Trophy,
    'Conference paper': FileText,
  }
  return (
    <section id="certs" className="scene scene--wide" aria-labelledby="certs-title">
      <div className="panel panel--wide">
        <Eyebrow no="06">Certifications & achievements</Eyebrow>
        <h2 id="certs-title" data-reveal>
          The achievement gallery.
        </h2>
        <ul className="cert-grid">
          {certifications.map((c) => {
            const Icon = icon[c.kind]
            return (
              <li key={c.id} data-reveal>
                <Tilt className={`cert cert--${c.kind.split(' ')[0].toLowerCase()}`}>
                  <span className="cert__icon" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  <p className="cert__kind">{c.kind}</p>
                  <h3>{c.title}</h3>
                  <p className="cert__issuer">{c.issuer}</p>
                  {c.meta && <p className="cert__meta">{c.meta}</p>}
                </Tilt>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------ Scene 8 ------------------------------ */
export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = profile.links.email
    }
  }

  const cards = [
    { label: 'LinkedIn', value: 'harini-mohankumar', href: profile.links.linkedin, Icon: LinkedInIcon },
    { label: 'GitHub', value: 'HARINI-MOHAN-KUMAR', href: profile.links.github, Icon: GitHubIcon },
    { label: 'LeetCode', value: 'HariniMohankumar', href: profile.links.leetcode, Icon: LeetCodeIcon },
  ]

  return (
    <section id="contact" className="scene scene--contact" aria-labelledby="contact-title">
      <div className="panel panel--contact">
        <Eyebrow no="07">Contact portal</Eyebrow>
        <h2 id="contact-title" data-reveal>
          Let’s connect.
        </h2>
        <p className="body body--center" data-reveal>
          Open to opportunities, collaborations and conversations about Java, AI and full stack development.
        </p>

        <div className="contact-main" data-reveal>
          <a className="contact-email" href={profile.links.email}>
            <Mail size={20} aria-hidden="true" />
            <span>{profile.email}</span>
          </a>
          <button className="icon-btn icon-btn--lg" onClick={copy} aria-label="Copy email address">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <span className="sr-only" role="status">
            {copied ? 'Email copied to clipboard' : ''}
          </span>
        </div>

        <ul className="contact-grid">
          {cards.map(({ label, value, href, Icon }) => (
            <li key={label} data-reveal>
              <Magnetic strength={0.15}>
                <a className="contact-card" href={href} target="_blank" rel="noopener noreferrer">
                  <Icon width={22} height={22} />
                  <span>
                    <b>{label}</b>
                    <small>{value}</small>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>

        <div className="actions actions--center" data-reveal>
          <Magnetic>
            <a className="btn" href={profile.links.resume} download>
              <Download size={17} /> Download Resume
            </a>
          </Magnetic>
          <a className="btn btn--ghost" href={profile.phoneHref}>
            <Phone size={16} /> {profile.phone}
          </a>
        </div>
        <p className="loc" data-reveal>
          <MapPin size={14} aria-hidden="true" /> {profile.location}
        </p>

        <footer className="footer">
          <span>© 2026 {profile.name}</span>
          <a href={profile.links.classicPortfolio} target="_blank" rel="noopener noreferrer">
            Classic portfolio <ArrowUpRight size={13} />
          </a>
        </footer>
      </div>
    </section>
  )
}
