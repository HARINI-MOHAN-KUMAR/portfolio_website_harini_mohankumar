// Single source of truth. Every value below comes from Harini's resume
// (RESUME_HARINI_MOHANKUMAR_New_Updated_profile.pdf) — including the hyperlinks
// embedded in the PDF. Nothing here is invented.

export const profile = {
  name: 'Harini Mohankumar',
  nameCaps: 'HARINI MOHANKUMAR',
  titleLine1: 'Computer & Communication Engineering',
  titleLine2: 'Java, AI & Full Stack Developer',
  location: 'Namakkal, Tamil Nadu',
  phone: '+91 9789137397',
  phoneHref: 'tel:+919789137397',
  email: 'mharinimohan19977@gmail.com',
  links: {
    email: 'mailto:mharinimohan19977@gmail.com',
    linkedin: 'http://www.linkedin.com/in/harini-mohankumar-33245b315',
    github: 'https://github.com/HARINI-MOHAN-KUMAR',
    leetcode: 'https://leetcode.com/u/HariniMohankumar/',
    classicPortfolio: 'https://portfoliowebsite-tau-teal.vercel.app/',
    resume: `${import.meta.env.BASE_URL}Harini_Mohankumar_Resume_Updated.pdf`,
  },
  summary:
    'I am a passionate student of Computer and Communication Engineering with expertise in Java, Python, web technologies, SQL, and foundational SAP. Through internships, I have built efficient, scalable, and user-friendly applications. Proficient in Git and familiar with agile practices, I thrive in collaborative environments and am eager to leverage technology to solve problems and deliver impactful solutions.',
  intro:
    'AI and Full Stack developer building efficient, scalable and user-friendly applications.',
  interests: ['Java', 'Python', 'Web technologies', 'SQL', 'Foundational SAP'],
  goal:
    'Eager to leverage technology to solve problems and deliver impactful solutions — while growing in collaborative, agile teams.',
}

export const skillGroups = [
  {
    id: 'lang',
    label: 'Programming Languages',
    items: [
      { name: 'Java', note: 'Core & Advanced', color: '#f59e0b' },
      { name: 'Python', note: '', color: '#3b82f6' },
      { name: 'C++', note: 'Basic', color: '#6366f1' },
    ],
  },
  {
    id: 'web',
    label: 'Web Technologies & Frameworks',
    items: [
      { name: 'HTML', note: '', color: '#f97316' },
      { name: 'CSS', note: '', color: '#38bdf8' },
      { name: 'JavaScript', note: '', color: '#facc15' },
      { name: 'Spring Boot', note: '', color: '#22c55e' },
    ],
  },
  {
    id: 'db',
    label: 'Database',
    items: [
      { name: 'Microsoft SQL Server', note: '', color: '#ef4444' },
      { name: 'MySQL', note: '', color: '#0ea5e9' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Platforms',
    items: [
      { name: 'Git', note: '', color: '#fb7185' },
      { name: 'Eclipse', note: '', color: '#8b5cf6' },
      { name: 'IntelliJ IDEA', note: '', color: '#ec4899' },
      { name: 'VS Code', note: '', color: '#3b82f6' },
      { name: 'PyCharm', note: '', color: '#10b981' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Tools',
    items: [
      { name: 'Jupyter Notebook', note: '', color: '#f97316' },
      { name: 'Google Colab', note: '', color: '#eab308' },
      { name: 'Flask', note: '', color: '#a1a1aa' },
    ],
  },
]

export const allSkills = skillGroups.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.label })),
)

export const projects = [
  {
    id: 'cloud-iq',
    index: '01',
    name: 'Cloud IQ',
    subtitle: 'AI-Powered Cloud Cost Optimizer',
    github: 'https://github.com/HARINI-MOHAN-KUMAR/cloud_cost_optimizer_mock',
    accent: '#22d3ee',
    accent2: '#3b82f6',
    tagline: 'Finds idle and oversized cloud resources and recommends savings.',
    problem:
      'Cloud bills can hide idle and oversized resources. Cloud IQ looks for idle and oversized EC2, RDS and S3 resources in billing data.',
    solution:
      'An AI-powered cost optimization platform that analyses billing data and generates cost-saving recommendations, surfaced through a Flask dashboard.',
    workflow: [
      'Billing data',
      'Idle / oversized EC2, RDS, S3 detection',
      'Gemini AI recommendations',
      'Flask dashboard + REST APIs',
      'GitHub Issues · Discord · Email alerts',
    ],
    tech: ['Python', 'Flask', 'Gemini AI', 'REST API', 'GitHub API', 'Discord'],
    features: [
      'Identifies idle and oversized EC2, RDS and S3 resources from billing data',
      'Generates cost-saving recommendations',
      'Flask dashboard with cost trends and budget alerts',
      'REST APIs and an AI chatbot',
      'Automated notifications through GitHub Issues, Discord Webhooks and email',
    ],
    contribution: [
      'Built an AI-powered cloud cost optimization platform to identify idle and oversized EC2, RDS, and S3 resources from billing data and generate cost-saving recommendations.',
      'Developed a Flask dashboard with REST APIs, cost trends, budget alerts, AI chatbot, and automated notifications through GitHub Issues, Discord Webhooks, and email.',
    ],
  },
  {
    id: 'doctor-booking',
    index: '02',
    name: 'Doctor Appointment Booking System',
    subtitle: 'Full-stack MERN platform',
    github:
      'https://github.com/HARINI-MOHAN-KUMAR/Doctor_Appointment_Booking_System',
    accent: '#a78bfa',
    accent2: '#ec4899',
    tagline: 'Patients search doctors, check availability and book online.',
    problem:
      'Patients need a simple way to find doctors, see when they are available and book appointments online, while doctors and administrators need their own role-specific tools.',
    solution:
      'A full-stack MERN-based platform with JWT role-based authentication for Patients, Doctors and Administrators, backed by RESTful APIs and MongoDB.',
    workflow: [
      'React frontend',
      'Node.js + Express REST APIs',
      'JWT role-based authentication',
      'MongoDB: users, doctors, appointments',
    ],
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    features: [
      'Patients can search doctors and view availability',
      'Online appointment booking',
      'JWT-based role-based authentication',
      'Role-specific access and functionality for Patients, Doctors and Administrators',
      'RESTful APIs managing users, doctors and appointment records',
    ],
    contribution: [
      'Developed a full-stack MERN-based doctor appointment platform enabling patients to search doctors, view availability, and book appointments online.',
      'Implemented JWT-based role-based authentication for Patients, Doctors, and Administrators with role-specific access and functionalities.',
      'Built RESTful APIs using Node.js and Express.js and integrated MongoDB for managing users, doctors, and appointment records.',
    ],
  },
  {
    id: 'bank-bot',
    index: '03',
    name: 'Bank Bot AI',
    subtitle: 'Banking Chatbot',
    github: 'https://github.com/HARINI-MOHAN-KUMAR/Bankbot',
    accent: '#60a5fa',
    accent2: '#8b5cf6',
    tagline: 'An NLP chatbot that answers with live account data.',
    problem:
      'Customers ask about balances, transactions and banking FAQs. Static canned responses cannot answer account-specific questions.',
    solution:
      'An AI-powered chatbot that uses NLP to understand customer queries, with Flask backend APIs retrieving account and transaction data dynamically from MySQL.',
    workflow: [
      'Customer query (web chat UI)',
      'NLP understands intent',
      'Flask backend APIs',
      'MySQL account & transaction data',
      'Dynamic response',
    ],
    tech: ['Python', 'Flask', 'NLP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    features: [
      'NLP-based understanding of balance, transaction and banking FAQ queries',
      'Dynamic data retrieval from MySQL instead of static responses',
      'Flask backend APIs integrated with a database for secure data handling',
      'Web interface built with HTML, CSS and JavaScript',
    ],
    contribution: [
      'Developed an AI-powered banking chatbot using NLP to understand customer queries related to balance, transactions, and banking FAQs.',
      'Integrated Flask backend APIs with MySQL to retrieve account and transaction data dynamically instead of relying on static responses.',
      'Built backend APIs using Flask and integrated with a database for secure data handling.',
    ],
  },
  {
    id: 'skill-barter',
    index: '04',
    name: 'SkillBarter',
    subtitle: 'Peer-to-Peer Skill Exchange Platform',
    github:
      'https://github.com/HARINI-MOHAN-KUMAR/SkillBarter-A-Digital-Platform-for-Mutual-Skill-Development-and-Knowledge-Exchange',
    accent: '#22c55e',
    accent2: '#14b8a6',
    tagline: 'A digital platform for matching learners and mentors to exchange skills.',
    problem:
      'Learners often struggle to find suitable peers who have complementary skills and can support mutual, practical learning.',
    solution:
      'A peer-to-peer skill exchange platform that matches users based on the skills they can teach and learn, with real-time chat and gamified progress tracking.',
    workflow: [
      'Create a learner or mentor profile',
      'List teaching and learning skills',
      'Find relevant peer matches',
      'Connect through real-time chat',
      'Earn badges and track progress',
    ],
    tech: ['React', 'Vite', 'Flask', 'MongoDB', 'Socket.IO', 'JWT'],
    features: [
      'Profile and skill management for teaching and learning',
      'Skill-similarity matching to find relevant peers',
      'Real-time private chat using Socket.IO',
      'Points, badges, and leaderboard-based gamification',
      'JWT authentication and environment-based configuration',
    ],
    contribution: [
      'Built a full-stack peer-to-peer platform using React, Flask, and MongoDB.',
      'Implemented skill matching, authentication, real-time chat, and gamified progress features.',
      'Designed and integrated REST APIs with the Vite frontend and MongoDB Atlas data store.',
    ],
  },
  {
    id: 'govguide-ai',
    index: '05',
    name: 'GovGuide AI',
    subtitle: 'AI-Powered Government Scheme Assistant',
    github:
      'https://github.com/HARINI-MOHAN-KUMAR/final_year_project_gov_ai/tree/main/govguide-ai',
    accent: '#f59e0b',
    accent2: '#ef4444',
    tagline: 'Helps citizens discover schemes, check eligibility, and track applications.',
    problem:
      'Citizens need to navigate complex government scheme information, eligibility rules, document requirements, and application processes.',
    solution:
      'A multilingual AI advisory platform that combines rule-based and machine-learning eligibility checks, OCR document parsing, RAG-grounded chat, and application tracking.',
    workflow: [
      'Browse or search government schemes',
      'Complete the citizen profile',
      'Check eligibility and upload documents',
      'Ask the AI assistant for guidance',
      'Track applications and scheme updates',
    ],
    tech: ['Python', 'FastAPI', 'React', 'SQLAlchemy', 'RAG', 'OCR', 'ML'],
    features: [
      'Discovery of 50-plus central and state government schemes',
      'Hybrid rule-based and machine-learning eligibility checks',
      'OCR parsing for Aadhaar, income, and ration documents',
      'RAG-grounded AI chat and multilingual support',
      'Citizen profiles, application tracking, and an admin dashboard',
    ],
    contribution: [
      'Developed a final-year full-stack AI platform for discovering Indian government schemes and understanding eligibility.',
      'Integrated FastAPI services with React, SQLAlchemy, OCR processing, a machine-learning eligibility model, and RAG-based assistance.',
      'Built secure authentication and application workflows, and validated the backend with 81 automated tests.',
    ],
  },
]

export const experience = [
  {
    id: 'infosys',
    role: 'Software Development Intern',
    company: 'Infosys',
    dates: 'November 2025 – February 2026',
    place: '',
    focus: 'Enterprise Java & Test Automation',
    project: 'Automation Test Framework',
    summary:
      'Worked on building a reusable Java automation foundation for scalable test execution across enterprise modules.',
    github:
      'https://github.com/HARINI-MOHAN-KUMAR/Infosys_Springboot_Automation_Test',
    points: [
      'Designed and developed a modular Automation Test Framework from scratch using Java, enabling reusable and scalable test execution across multiple modules.',
      'Applied a modular structure to make test components easier to maintain, reuse, and extend.',
      'Used Spring Boot concepts and automation practices to support reliable and repeatable test workflows.',
    ],
    tech: ['Java', 'Spring Boot', 'Test Automation'],
  },
  {
    id: 'nxt',
    role: 'Full Stack Developer Intern',
    company: 'NXT Logic Software Solution',
    dates: 'December 2024 – January 2025',
    place: 'Coimbatore, Tamil Nadu',
    focus: 'Full Stack Web Development',
    project: '',
    summary:
      'Contributed to building responsive web application interfaces using core front-end technologies, reusable page structures, and user-focused design principles.',
    github: '',
    points: [
      'Developed web applications using HTML5, CSS3, and JavaScript, creating simple and user-friendly web pages.',
      'Built structured page layouts and responsive components, using semantic HTML and CSS to provide consistent presentation across screen sizes.',
      'Added JavaScript-based interactions to improve usability and create more dynamic, engaging web experiences.',
      'Reviewed interface behavior and refined visual details to improve clarity, navigation, and overall user experience.',
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript'],
  },
  {
    id: 'coincent',
    role: 'Data Science Intern',
    company: 'Coincent',
    dates: 'June 2024 – July 2024',
    place: 'Bangalore (Remote)',
    focus: 'Python, Data Analysis, Machine Learning',
    project: '',
    summary:
      'Completed an applied remote data science internship focused on transforming data into insights and building, evaluating, and documenting machine learning models.',
    github: '',
    points: [
      'Built, trained, and evaluated classification models using Scikit-learn, optimizing hyperparameters to improve model accuracy.',
      'Performed data preparation and exploratory analysis using Python to understand patterns and prepare datasets for model development.',
      'Compared model performance using appropriate evaluation metrics and tuned parameters to improve predictive accuracy.',
      'Documented findings, model choices, performance results, and conclusions in structured reports for internal review.',
    ],
    tech: ['Python', 'Scikit-learn', 'Data Analysis', 'Machine Learning'],
  },
]

export const education = [
  {
    id: 'be',
    degree: 'Bachelor of Engineering — Computer and Communication Engineering',
    school: 'VSB Engineering College (Autonomous)',
    place: 'Karur, Tamil Nadu',
    years: '2023 – 2027',
    scoreLabel: 'Current CGPA',
    score: '8.54',
  },
  {
    id: 'hsc',
    degree: 'Higher Secondary Certificate',
    school: 'Sri Vinayaga Matric Higher Secondary School',
    place: 'Namakkal, Tamil Nadu',
    years: '2022 – 2023',
    scoreLabel: 'Score',
    score: '86.17%',
  },
]

// No credential URLs exist in the resume, so none of these are linked.
export const certifications = [
  {
    id: 'kaggle',
    issuer: 'Google & Kaggle',
    title: 'AI Agents Course',
    meta: 'Dec 2025',
    kind: 'Certification',
  },
  {
    id: 'sf',
    issuer: 'Salesforce',
    title: 'Administrator Explorer',
    meta: '',
    kind: 'Certification',
  },
  {
    id: 'nptel-java',
    issuer: 'NPTEL',
    title: 'Programming in Java',
    meta: 'Silver Medal',
    kind: 'Achievement',
  },
  {
    id: 'nptel-ds',
    issuer: 'NPTEL',
    title: 'Data Science',
    meta: '2024',
    kind: 'Certification',
  },
  {
    id: 'guvi',
    issuer: 'Guvi',
    title: 'Java Certification',
    meta: '',
    kind: 'Certification',
  },
  {
    id: 'infosys',
    issuer: 'Infosys',
    title: 'GenAI for IT, Java Foundation Certification',
    meta: '',
    kind: 'Certification',
  },
  {
    id: 'ieee-6g',
    issuer: 'IEEE ICSCN 2025',
    title: '6G Spectrum Mgmt.',
    meta: 'Paper ID: 1061',
    kind: 'Conference paper',
  },
  {
    id: 'ieee-fl',
    issuer: 'IEEE ICSCN 2025',
    title: 'Federated Learning Research',
    meta: 'Paper ID: 321',
    kind: 'Conference paper',
  },
]

export const sections = [
  { id: 'home', label: 'Start' },
  { id: 'about', label: 'About' },
  { id: 'lab', label: 'Tech Lab' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'certs', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
]
