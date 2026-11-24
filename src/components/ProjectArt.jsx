// Original SVG "thumbnails" — one unique visual identity per project.
// They only use words that appear in the resume (EC2, RDS, S3, Patient, Doctor,
// Administrator, MySQL, ...) and show no numbers or results.

export function CloudArt() {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label="Cloud IQ illustration: cloud resources and a downward cost trend">
      <defs>
        <linearGradient id="ci-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#06283d" />
          <stop offset="1" stopColor="#0b1b4d" />
        </linearGradient>
        <linearGradient id="ci-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#ci-bg)" />
      <g stroke="#22d3ee" strokeOpacity=".12">
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="0" x2="400" y1={y} y2={y} />
        ))}
      </g>
      {/* cloud */}
      <g fill="#e0f7ff" opacity=".95">
        <circle cx="96" cy="76" r="26" />
        <circle cx="128" cy="64" r="34" />
        <circle cx="164" cy="78" r="26" />
        <rect x="80" y="76" width="100" height="28" rx="14" />
      </g>
      {/* resource chips */}
      {[
        ['EC2', 60],
        ['RDS', 118],
        ['S3', 176],
      ].map(([t, x]) => (
        <g key={t} transform={`translate(${x},128)`}>
          <rect width="48" height="26" rx="7" fill="#0b2a55" stroke="#22d3ee" />
          <text x="24" y="17" textAnchor="middle" fill="#7dd3fc" fontSize="12" fontFamily="monospace">
            {t}
          </text>
        </g>
      ))}
      {/* trend */}
      <g transform="translate(230,36)">
        <rect width="150" height="130" rx="12" fill="#07122e" stroke="#3b82f6" strokeOpacity=".5" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={14 + i * 22} y={30 + i * 9} width="14" height={80 - i * 9} rx="3" fill="#22d3ee" opacity={0.85 - i * 0.08} />
        ))}
        <path d="M14 34 L40 44 L62 54 L84 62 L106 74 L132 84" stroke="url(#ci-line)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(60,184)">
        <rect width="264" height="30" rx="15" fill="#0b2a55" stroke="#22d3ee" strokeOpacity=".5" />
        <circle cx="18" cy="15" r="6" fill="#22d3ee" />
        <text x="34" y="20" fill="#bae6fd" fontSize="12" fontFamily="monospace">
          AI recommendations
        </text>
      </g>
    </svg>
  )
}

export function DoctorArt() {
  const days = Array.from({ length: 21 })
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label="Doctor Appointment Booking illustration: calendar and three user roles">
      <defs>
        <linearGradient id="dr-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a0f5c" />
          <stop offset="1" stopColor="#4a0f4a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#dr-bg)" />
      <circle cx="340" cy="40" r="90" fill="#f472b6" opacity=".08" />
      {/* calendar */}
      <g transform="translate(34,32)">
        <rect width="190" height="170" rx="14" fill="#160a38" stroke="#a78bfa" strokeOpacity=".6" />
        <rect width="190" height="30" rx="14" fill="#7c3aed" />
        <text x="16" y="20" fill="#fff" fontSize="13" fontFamily="sans-serif" fontWeight="600">
          Availability
        </text>
        {days.map((_, i) => {
          const x = 16 + (i % 7) * 23
          const y = 46 + Math.floor(i / 7) * 36
          const hot = i === 9
          const free = [2, 5, 11, 16, 18].includes(i)
          return (
            <g key={i}>
              <rect x={x} y={y} width="18" height="26" rx="5" fill={hot ? '#f472b6' : free ? '#6d28d9' : '#221350'} stroke={hot ? '#fff' : 'none'} />
            </g>
          )
        })}
      </g>
      {/* medical cross */}
      <g transform="translate(250,30)">
        <rect x="26" y="0" width="28" height="80" rx="8" fill="#fff" opacity=".95" />
        <rect x="0" y="26" width="80" height="28" rx="8" fill="#fff" opacity=".95" />
      </g>
      {/* roles */}
      {[
        ['Patient', 250],
        ['Doctor', 296],
        ['Admin', 342],
      ].map(([t, x], i) => (
        <g key={t} transform={`translate(${x - 12},136)`}>
          <circle cx="24" cy="18" r="16" fill={['#a78bfa', '#f472b6', '#60a5fa'][i]} />
          <circle cx="24" cy="14" r="5" fill="#160a38" />
          <path d="M14 26a10 8 0 0 1 20 0" fill="#160a38" />
          <text x="24" y="50" textAnchor="middle" fill="#e9d5ff" fontSize="10" fontFamily="sans-serif">
            {t}
          </text>
        </g>
      ))}
      <g transform="translate(240,196)">
        <rect width="140" height="24" rx="12" fill="#160a38" stroke="#a78bfa" strokeOpacity=".6" />
        <text x="70" y="16" textAnchor="middle" fill="#ddd6fe" fontSize="11" fontFamily="monospace">
          JWT · role-based
        </text>
      </g>
    </svg>
  )
}

export function BotArt() {
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label="Bank Bot AI illustration: chat bubbles connected to a database">
      <defs>
        <linearGradient id="bb-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b1f5c" />
          <stop offset="1" stopColor="#231060" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bb-bg)" />
      <g stroke="#60a5fa" strokeOpacity=".15">
        {[60, 120, 180, 240, 300, 360].map((x) => (
          <line key={x} x1={x} x2={x} y1="0" y2="240" />
        ))}
      </g>
      {/* bubbles */}
      <g fontFamily="sans-serif" fontSize="13">
        <rect x="34" y="34" width="150" height="38" rx="14" fill="#e0e7ff" />
        <text x="50" y="58" fill="#1e1b4b">
          What is my balance?
        </text>
        <rect x="120" y="86" width="160" height="38" rx="14" fill="#6d5bff" />
        <text x="136" y="110" fill="#fff">
          Your account balance…
        </text>
        <rect x="34" y="138" width="150" height="38" rx="14" fill="#e0e7ff" />
        <text x="50" y="162" fill="#1e1b4b">
          Recent transactions
        </text>
      </g>
      {/* database */}
      <g transform="translate(298,70)">
        <ellipse cx="40" cy="14" rx="38" ry="12" fill="#1d4ed8" />
        <path d="M2 14v60c0 7 17 12 38 12s38-5 38-12V14" fill="#1e3a8a" stroke="#60a5fa" />
        <ellipse cx="40" cy="14" rx="38" ry="12" fill="#2563eb" stroke="#93c5fd" />
        <ellipse cx="40" cy="44" rx="38" ry="12" fill="none" stroke="#93c5fd" strokeOpacity=".5" />
        <text x="40" y="112" textAnchor="middle" fill="#bfdbfe" fontSize="13" fontFamily="monospace">
          MySQL
        </text>
      </g>
      <path d="M284 105 H296" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 3" />
      <g transform="translate(34,196)">
        <rect width="150" height="26" rx="13" fill="#0b1f5c" stroke="#60a5fa" strokeOpacity=".6" />
        <text x="75" y="17" textAnchor="middle" fill="#bfdbfe" fontSize="11" fontFamily="monospace">
          NLP · Flask API
        </text>
      </g>
    </svg>
  )
}

export default function ProjectArt({ id }) {
  if (id === 'cloud-iq') return <CloudArt />
  if (id === 'doctor-booking') return <DoctorArt />
  return <BotArt />
}
