import { useEffect, useState } from 'react'
import './App.css'
import heroImage from './assets/hero.png'
import { supabase } from './lib/supabaseClient'

const tracks = [
  'Computational Engineering & HPC',
  'Computational Fluid Dynamics & Aerodynamics',
  'Finite Element Analysis & Structural Mechanics',
  'AI / ML for Engineering & Space',
  'Intelligent Machining & Digital Manufacturing',
  'Space Propulsion, Cryogenics & Thermal Systems',
  'Satellite Technology & Space Systems',
  'Space Robotics & Autonomous Systems',
  'Remote Sensing, Earth Observation & GIS',
  'Space Technology Applications & NewSpace',
]

const programmeItems = [
  'Keynote addresses by eminent experts',
  'Plenary lectures',
  'Technical paper presentations',
  'Panel discussions',
  'Workshops',
  'Innovation showcases',
  'Industry exhibitions',
  'Networking sessions',
]

const registrationTiers = [
  { category: 'Student / Research Scholar', amount: '₹500', note: 'Per delegate' },
  { category: 'Faculty / Academician', amount: '₹1000', note: 'Per delegate' },
  { category: 'Industry / Professional', amount: '₹1500', note: 'Per delegate' },
  { category: 'International Delegate', amount: '$50', note: 'Per delegate' },
]

const leadMembers = [
  { role: 'Chief Patron', name: 'Janab Shahal Hassan Musaliar', detail: 'Chairman, TKM Trust' },
  { role: 'Patron', name: 'Dr. A. Sadiq', detail: 'Principal, TKM College of Engineering' },
  { role: 'Conference Chair', name: 'Dr. K. E. Reby Roy', detail: 'Academic Director, ISRO–TKMCE Centre of Excellence' },
  { role: 'Organizing Secretary', name: 'Rinshad', detail: 'Student Director, ISRO–TKMCE Centre of Excellence' },
]
const paperGuidelines = [
  'Full paper length: 8–12 pages, including figures, tables and references',
  'Page size: A4 (210 × 297 mm) with 25 mm margins on all four sides',
  'Use a single-column layout throughout the paper',
  'Abstract: 250–300 words, self-contained, with no citations, figures or equations',
  'Keywords: 4–6 keywords',
  'Paper title: preferably concise, specific and under 15 words',
  'Submit the paper as a single PDF file of 10 MB or less',
  'File name: PaperID_FirstAuthorSurname.pdf',
]

const paperStructure = [
  'Title, authors and affiliations',
  'Corresponding author details',
  'Abstract and 4–6 keywords',
  'Nomenclature, if symbols are used',
  '1. Introduction',
  '2. Materials and Methods / Mathematical Formulation',
  '3. Numerical or Experimental Procedure and Validation',
  '4. Results and Discussion',
  '5. Conclusions',
  'Acknowledgements',
  'Declaration of Competing Interest',
  'Author Contributions',
  'Data Availability',
  'References',
  'Appendix (optional)',
]

const paperChecklist = [
  'Figures are at least 300 dpi, embedded where first discussed and cited in the text',
  'Tables are editable text, embedded where first discussed and cited in the text',
  'Equations are numbered consecutively and SI units are used',
  'References are numbered in order of first citation and include DOI where available',
  '25 or more peer-reviewed sources are normally expected, with emphasis on recent work',
  'Review version is prepared for double-blind peer review',
  'Similarity is below 15% excluding references',
  'Any assistive use of AI tools is disclosed in the acknowledgements',
  'At least one author of every accepted paper must register and present the work',
]
const committees = [
  'Technical Program',
  'Publications',
  'Finance',
  'Registration',
  'Publicity & Media',
  'Website & IT',
  'Hospitality & Logistics',
  'Industry & International Relations',
  'Student Coordination',
]
const committeeMembers = [
  {
    name: 'Registration & Reception',
    members: [
      'Afrah Aneez',
      'Arun Krishnan A.N.',
      'Muhammed Sinan T.P.',
      'Bhavya B.',
      'Gowri D.L.',
    ],
  },
  {
    name: 'Technical Programme',
    members: [
      'George Chrysostom',
      'Mohamed Sinan',
      'Athul Bastian',
      'Midhun S.T.',
      'Shamil',
    ],
  },
  {
    name: 'Publicity & Media',
    members: [
      'Abhinav',
      'Bhagath',
      'Megha',
      'Aleena',
      'Isra',
      'Avanthika',
      'Abhishek T.M.',
      'Muhasina S.',
      'Arjun S.',
    ],
  },
  {
    name: 'Student Coordination',
    members: [
      'Devaprabha D.',
      'Nidhin Sabu',
      'Aleesha Prasad',
      'Safhana',
      'Prarthana',
    ],
  },
  {
    name: 'Publications',
    members: [
      'Akshara Rajeev K.',
      'Jobina T. Panicker',
      'Hridhya S.B.',
      'Sahal Muhammed',
      'Shahana Hussain',
    ],
  },
  {
    name: 'Hospitality & Logistics',
    members: [
      'Safa Mariyam',
      'Ann Tresa Joseph',
    ],
  },
  {
    name: 'Industry & International Relations',
    members: [
      'Daisy Treesa Bastian',
      'Muflih',
      'Goutham Krishna B.',
      'Krishnaraj S.',
      'Midhu Maria Baiju',
    ],
  },
  {
    name: 'Website & IT',
    members: [
      'Sreenandana A.S.',
      'Afna V.P.',
    ],
  },
  {
    name: 'Finance',
    members: [
      'Devi Nandana',
      'Abhijith S. Das',
      'Jishna Janardhanan',
    ],
  },
]

const partners = [
  { role: 'Space Agency', name: 'ISRO', location: 'Indian Space Research Organisation · India' },
  { role: 'Research Institute', name: 'North American Space Institute (NASI)', location: 'Cocoa, Florida · USA' },
  { role: 'Industry Partner', name: 'Space Copy Inc.', location: 'Edmonton, Canada · Delaware & California, USA' },
]

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [countdown, setCountdown] = useState({ days: '000', hours: '00', minutes: '00', seconds: '00' })
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    author_names: '',
    author_email: '',
    affiliation: '',
    track: tracks[0],
    pdfFile: null,
  })
  const [submissionState, setSubmissionState] = useState({
    submitted: false,
    submissionId: '',
    success: false,
    error: '',
    busy: false,
  })

  useEffect(() => {
    const targetTime = new Date('2026-10-02T00:00:00+05:30').getTime()

    const updateCountdown = () => {
      const diff = targetTime - Date.now()
      if (diff <= 0) {
        setCountdown({ days: '000', hours: '00', minutes: '00', seconds: '00' })
        return
      }

      const days = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      setCountdown({
        days: String(days).padStart(3, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
      })
    }

    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setFormData((prev) => ({ ...prev, pdfFile: file }))
  }

  const validateSubmission = () => {
    if (!formData.title.trim()) return 'Please enter the paper title.'
    if (!formData.abstract.trim()) return 'Please enter the abstract.'
    if (!formData.author_names.trim()) return 'Please enter the author names.'
    if (!formData.author_email.trim()) return 'Please enter an author email.'
    if (!formData.affiliation.trim()) return 'Please enter the college or affiliation.'
    if (!formData.pdfFile) return 'Please upload the paper PDF.'
    if (formData.pdfFile.type !== 'application/pdf') return 'Only PDF files are allowed.'
    if (formData.pdfFile.size > 10 * 1024 * 1024) return 'PDF file size must be 10MB or less.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmissionState((prev) => ({ ...prev, error: '', busy: true }))

    const validationError = validateSubmission()
    if (validationError) {
      setSubmissionState({ submitted: false, submissionId: '', success: false, error: validationError, busy: false })
      return
    }

    try {
      const filePath = `${Date.now()}-${formData.pdfFile.name.replace(/\s+/g, '_')}`
      const { error: uploadError } = await supabase.storage.from('papers').upload(filePath, formData.pdfFile)

      if (uploadError) {
        console.error('Supabase upload error', uploadError)
        const message = uploadError.message || 'Upload failed. Confirm your Supabase Storage bucket "papers" exists.'
        throw new Error(message)
      }

      const { data: urlData, error: urlError } = supabase.storage.from('papers').getPublicUrl(filePath)
      if (urlError) {
        console.error('Supabase getPublicUrl error', urlError)
        const message = urlError.message || 'Failed to get the public URL. Confirm the "papers" storage bucket is configured.'
        throw new Error(message)
      }

      const pdfUrl = urlData?.publicUrl
      if (!pdfUrl) {
        throw new Error('Could not get uploaded PDF URL. Ensure the "papers" bucket exists and is public.')
      }

const submissionId = crypto.randomUUID()

const { error: insertError } = await supabase
  .from('submissions')
  .insert([
    {
      id: submissionId,
      title: formData.title,
      abstract: formData.abstract,
      author_names: formData.author_names,
      author_email: formData.author_email,
      affiliation: formData.affiliation,
      track: formData.track,
      pdf_url: pdfUrl,
    },
  ])

if (insertError) {
  console.error('Supabase insert error', insertError)
  throw new Error(insertError.message || 'Failed to save submission.')
}

setSubmissionState({ submitted: true, submissionId, success: true, error: '', busy: false })
      setFormData({ title: '', abstract: '', author_names: '', author_email: '', affiliation: '', track: tracks[0], pdfFile: null })
    } catch (submissionError) {
      console.error('Paper submission error', submissionError)
      const message = submissionError?.message || String(submissionError)
      setSubmissionState({ submitted: false, submissionId: '', success: false, error: message, busy: false })
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSubmissionState({ submitted: false, submissionId: '', success: false, error: '', busy: false })
    setFormData({ title: '', abstract: '', author_names: '', author_email: '', affiliation: '', track: tracks[0], pdfFile: null })
  }

  return (
    <div className="app-shell">
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top" onClick={() => setIsMenuOpen(false)}>
            <span className="dot" />
            <span className="y">ZYNEXA<i> 2026</i></span>
          </a>
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`} id="navLinks">
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#tracks" onClick={() => setIsMenuOpen(false)}>Tracks</a>
            <a href="#programme" onClick={() => setIsMenuOpen(false)}>Programme</a>
            <a href="#papers" onClick={() => setIsMenuOpen(false)}>Papers</a>
            <a href="#dates" onClick={() => setIsMenuOpen(false)}>Dates</a>
            <a href="#register" onClick={() => setIsMenuOpen(false)}>Register</a>
            <a href="#host" onClick={() => setIsMenuOpen(false)}>Host</a>
            <a href="#committee" onClick={() => setIsMenuOpen(false)}>Committee</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
            <button type="button" className="nav-cta" onClick={() => setIsModalOpen(true)}>
              Submit Paper →
            </button>
          </nav>
          <button type="button" className="burger" onClick={() => setIsMenuOpen((open) => !open)} aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-glow" />
          <div className="wrap hero-in">
            <div className="badge-row">
              <span className="pill live">Hybrid · On-site & Online</span>
              <span className="pill">Kollam, India</span>
              <span className="pill">The Flagship International Symposium</span>
            </div>

            <h1 className="wordmark">
              ZYNEXA<span className="yr">2026</span>
            </h1>
            <p className="expand">
              <em>Z</em>enith of <em>Y</em>oung Researchers in <em>N</em>ext-generation <em>EX</em>ploration and <em>A</em>erospace
            </p>
            <p className="hero-sub">
              The flagship international symposium of the ISRO–TKMCE Centre of Excellence, bringing together ISRO scientists, researchers, industry and students.
            </p>

            <div className="hero-visual" aria-hidden="true">
              <div className="hero-figure">
                <img src={heroImage} alt="" />
              </div>
            </div>

            <div className="hero-meta">
              <div className="hm">
                <span className="k">Dates</span>
                <span className="v cy">02–04 October 2026</span>
              </div>
              <div className="hm">
                <span className="k">Venue</span>
                <span className="v">TKM College of Engineering</span>
              </div>
              <div className="hm">
                <span className="k">Organised by</span>
                <span className="v">TKMCE · ISRO–TKMCE CoE</span>
              </div>
            </div>

            <div className="cta-row">
              <button type="button" className="btn primary" onClick={() => setIsModalOpen(true)}>
                Register Now →
              </button>
              <a className="btn ghost" href="#papers">Submit an Abstract</a>
            </div>

            <div className="countdown" aria-label="Time remaining until the symposium">
              <div className="cd-label">T–Minus to Launch</div>
              <div className="cd-units">
                <div className="cd-u">
                  <div className="n">{countdown.days}</div>
                  <div className="l">Days</div>
                </div>
                <div className="cd-u">
                  <div className="n">{countdown.hours}</div>
                  <div className="l">Hrs</div>
                </div>
                <div className="cd-u">
                  <div className="n">{countdown.minutes}</div>
                  <div className="l">Min</div>
                </div>
                <div className="cd-u">
                  <div className="n">{countdown.seconds}</div>
                  <div className="l">Sec</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="about">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">The Symposium</span>
              <h2 className="sec">About <b>ZYNEXA 2026</b></h2>
              <p className="sec-lead">
                ZYNEXA 2026 is the flagship international symposium of the ISRO–TKMCE Centre of Excellence at TKM College of Engineering, Kollam — a premier global platform bringing together scientists, researchers, academicians, industry leaders, technology innovators, policymakers, entrepreneurs and students from around the world.
              </p>
            </div>
            <div className="highlights reveal">
              <div className="hi">
                <div className="ic">// FORMAT</div>
                <p><b>Hybrid symposium</b> across three days, on-site in Kollam and streamed online for global delegates.</p>
              </div>
              <div className="hi">
                <div className="ic">// SCOPE</div>
                <p><b>10 research tracks</b> spanning computational engineering, space systems and aerospace.</p>
              </div>
              <div className="hi">
                <div className="ic">// VOICES</div>
                <p><b>ISRO keynotes</b>, invited talks and expert panels alongside contributed papers.</p>
              </div>
              <div className="hi">
                <div className="ic">// RECOGNITION</div>
                <p><b>Best Paper</b> and Best Presentation awards, with selected papers routed to proceedings.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="tracks">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Themes & Tracks</span>
              <h2 className="sec">Ten flight paths for <b>your research</b></h2>
              <p className="sec-lead">Submit to any of the ten tracks below. Each accepts full papers for oral or poster presentation.</p>
            </div>
            <div className="track-grid reveal">
              {tracks.map((track, index) => (
                <div className="track" key={track}>
                  <span className="num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="t">{track}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="programme">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">The Experience</span>
              <h2 className="sec">Three days of <b>ideas in motion</b></h2>
              <p className="sec-lead">Beyond the papers, ZYNEXA 2026 is built for exchange — keynotes and panels alongside hands-on workshops, showcases and dedicated time to connect with scientists, industry experts and entrepreneurs.</p>
            </div>
            <div className="prog-grid reveal">
              {programmeItems.map((item, index) => (
                <div className="prog" key={item}>
                  <div className="pn">{String(index + 1).padStart(2, '0')}</div>
                  <div className="pt">{item}</div>
                </div>
              ))}
            </div>
            <div className="domains reveal">
              <div className="dh">// Domains in focus</div>
              <div className="tags">
                {['Space Technology', 'Artificial Intelligence', 'Robotics', 'Advanced Manufacturing', 'Computational Engineering', 'Sustainable Energy', 'Smart Systems', 'Materials Science', 'Aerospace', 'Digital Transformation'].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="papers">
          <div className="wrap">
            <div className="grid-2">
              <div className="reveal">
                <span className="eyebrow">Call for Papers</span>
                <h2 className="sec">From a 300-word abstract <b>to the stage</b></h2>
                <p className="sec-lead">Begin with a concise abstract. Accepted authors are invited to submit a full paper for oral or poster presentation, with standout work advancing further.</p>
                <ul className="ticks" style={{ marginTop: '28px' }}>
                  <li><b>Abstract (300 words)</b> → full paper for paper / poster presentation</li>
                  <li><b>Selected papers</b> forwarded to the proceedings or a partner journal</li>
                  <li><b>Keynotes by ISRO scientists</b>, invited talks & expert panels</li>
                  <li><b>Best Paper & Best Presentation</b> awards for outstanding contributions</li>
                </ul>
                <div className="cta-row" style={{ marginTop: '32px' }}>
                  <button type="button" className="btn primary" onClick={() => setIsModalOpen(true)}>Submit Paper →</button>
                </div>
              </div>
              <div className="card reveal">
                <h3>Submission at a glance</h3>
                <ul className="ticks">
                  <li><b>Opens</b> — 27 July 2026</li>
                  <li><b>Abstract deadline</b> — 15 August 2026</li>
                  <li><b>Acceptance</b> — 31 August 2026</li>
                  <li><b>Camera-ready paper</b> — 10 September 2026</li>
                </ul>
                <p style={{ marginTop: '20px', color: 'var(--muted)', fontSize: '.9rem' }}>Formats: oral presentation, poster. #ZYNEXA2026 · Innovate · Collaborate · Explore</p>
              </div>
            </div>            <div className="grid-2 reveal" style={{ marginTop: '28px' }}>
              <div className="card">
                <h3>Full paper format</h3>
                <ul className="ticks">
                  {paperGuidelines.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3>Required paper structure</h3>
                <ul className="ticks">
                  {paperStructure.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid-2 reveal" style={{ marginTop: '24px' }}>
              <div className="card">
                <h3>Figures, tables & equations</h3>
                <ul className="ticks">
                  <li>Figures must be at least <b>300 dpi</b> and legible in greyscale.</li>
                  <li>Figures must fit within the <b>160 mm</b> text width.</li>
                  <li>Axis labels and legends should be at least <b>8 pt</b> after scaling.</li>
                  <li>Number figures and tables consecutively and refer to each in the text.</li>
                  <li>Embed each figure and table where it is first discussed rather than grouping them at the end.</li>
                  <li>Equations should be numbered consecutively and <b>SI units</b> must be used.</li>
                </ul>
              </div>

              <div className="card">
                <h3>Review & originality</h3>
                <ul className="ticks">
                  <li>Submissions undergo <b>double-blind peer review</b>.</li>
                  <li>For review, remove author names, affiliations and acknowledgements.</li>
                  <li>Similarity above <b>15%</b>, excluding references, leads to desk rejection.</li>
                  <li>Papers must not be generated wholesale by AI tools.</li>
                  <li>Any assistive use of AI tools must be disclosed in the acknowledgements.</li>
                  <li>At least one author of every accepted paper must register and present the work, in person or online.</li>
                </ul>
              </div>
            </div>

            <div className="card reveal" style={{ marginTop: '24px' }}>
              <h3>Submission checklist</h3>
              <ul className="ticks">
                {paperChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p style={{ marginTop: '20px', color: 'var(--muted)', fontSize: '.9rem' }}>
                Official full-paper format: <b>8–12 pages · A4 · Single column · 25 mm margins · PDF ≤ 10 MB</b>
              </p>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="dates">
          <div className="wrap">
            <div className="grid-2">
              <div className="reveal">
                <span className="eyebrow">Launch Sequence</span>
                <h2 className="sec">Important <b>dates</b></h2>
                <p className="sec-lead">Every milestone on the road to lift-off. Mark them early — the countdown at the top of the page tracks the same target.</p>
              </div>
              <div className="reveal">
                <div className="timeline">
                  {[
                    ['27 Jul 2026', 'Abstract submission opens'],
                    ['15 Aug 2026', 'Abstract submission deadline'],
                    ['31 Aug 2026', 'Notification of acceptance'],
                    ['10 Sep 2026', 'Full / camera-ready paper'],
                    ['20 Sep 2026', 'Early-bird registration closes'],
                  ].map(([date, event], index) => (
                    <div className="tl" key={date}>
                      <span className="node" />
                      <div className="date">{date}</div>
                      <div className="ev">{event}</div>
                    </div>
                  ))}
                  <div className="tl launch">
                    <span className="node" />
                    <div className="date">02–04 Oct 2026 · Lift-off</div>
                    <div className="ev">ZYNEXA 2026 Symposium</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="register">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Registration</span>
              <h2 className="sec">Delegate <b>categories</b></h2>
              <p className="sec-lead">Choose the category that fits you. Registration includes all sessions, the symposium kit and an e-certificate.</p>
            </div>
            <div className="reg-grid reveal">
              {registrationTiers.map((tier) => (
                <div className="price" key={tier.category}>
                  <div className="cat">{tier.category}</div>
                  <div className="amt">{tier.amount}</div>
                  <div className="note">{tier.note}</div>
                </div>
              ))}
            </div>
            <div className="incl reveal">
              <span>✦ All sessions</span>
              <span>✦ Symposium kit</span>
              <span>✦ E-certificate</span>
              <span>✦ Early-bird closes 20 Sep 2026</span>
            </div>
            <p className="fine reveal">Indicative fees — final amounts & early-bird discount to be confirmed. Registration includes sessions, symposium kit & e-certificate.</p>
            <div className="cta-row reveal" style={{ marginTop: '28px' }}>
              <button type="button" className="btn primary" onClick={() => setIsModalOpen(true)}>Register at tkmce.ac.in/zynexa2026 →</button>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="host">
          <div className="wrap">
            <div className="grid-2">
              <div className="reveal">
                <span className="eyebrow">Host Institution · Estd. 1958</span>
                <h2 className="sec">TKM College of <b>Engineering</b></h2>
                <p className="sec-lead">Founded in 1958 by Janab Thangal Kunju Musaliar, TKMCE is Kerala's first government-aided engineering institution and one of the state's premier autonomous engineering colleges, set on a serene 25-acre green campus at Karicode, Kollam.</p>
                <div className="stat-strip">
                  <div className="stat"><div className="n">4,100+</div><div className="l">Students</div></div>
                  <div className="stat"><div className="n">₹10 Cr</div><div className="l">National & intl. research funding</div></div>
                  <div className="stat"><div className="n">100+</div><div className="l">Doctoral scholars</div></div>
                  <div className="stat"><div className="n">30+</div><div className="l">National / intl. MoUs</div></div>
                </div>
              </div>
              <div className="card reveal">
                <h3>A campus built for research</h3>
                <ul className="ticks">
                  <li>All departments are <b>KTU research centres</b> driving doctoral research</li>
                  <li><b>National & international research funding</b> worth crores across sponsored projects</li>
                  <li>AICTE <b>Margadarshan</b> mentor institute · SEEDS-97 startup incubator</li>
                  <li>Heritage <b>Indo-Saracenic</b> campus, honoured with Kerala Sree Puraskaram</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="centre">
          <div className="wrap">
            <div className="grid-2">
              <div className="reveal">
                <span className="eyebrow">Powered by ISRO & TKMCE</span>
                <h2 className="sec">ISRO–TKMCE <b>Centre of Excellence</b></h2>
                <p className="sec-lead">The ISRO–TKMCE Centre of Excellence in Computational Engineering & Intelligent Machining was established through a Memorandum of Understanding between ISRO and TKM College of Engineering, Kollam on 17 July 2023.</p>
                <div className="tags">
                  {['Computational Engineering', 'CFD', 'FEA', 'AI / ML', 'Intelligent Machining', 'Digital Manufacturing', 'Space Technology'].map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="people">
                  <div className="person">
                    <div className="av">RR</div>
                    <div><div className="nm">Dr. K. E. Reby Roy</div><div className="rl">Academic Director · Professor, Mechanical Engineering</div></div>
                  </div>
                  <div className="person">
                    <div className="av">RP</div>
                    <div><div className="nm">Rinshad PPK</div><div className="rl">Student Director</div></div>
                  </div>
                </div>
              </div>
              <div className="card reveal">
                <h3>What the Centre does</h3>
                <ul className="ticks">
                  <li>Joint research projects with ISRO</li>
                  <li>Student & faculty internships and exchange</li>
                  <li>Expert lectures & faculty development programmes</li>
                  <li>Consultancy, prototyping & technology transfer</li>
                </ul>
              </div>
            </div>

            <div className="partners reveal">
              <div className="ph">// Global partnerships</div>
              <div className="partner-grid">
                {partners.map((partner) => (
                  <div className="partner" key={partner.name}>
                    <div className="role">{partner.role}</div>
                    <div className="pname">{partner.name}</div>
                    <div className="ploc">{partner.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section id="committee">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Organising Committee</span>
              <h2 className="sec">The team behind <b>ZYNEXA 2026</b></h2>
              <p className="sec-lead">A dedicated committee drawn from TKMCE and the ISRO–TKMCE Centre of Excellence steers every part of the symposium — from technical programme to hospitality.</p>
            </div>
            <div className="lead-grid reveal">
              {leadMembers.map((member) => (
                <div className="lead-card" key={member.name}>
                  <span className="lr">{member.role}</span>
                  <span className="ln">{member.name}</span>
                  <span className="la">{member.detail}</span>
                </div>
              ))}
            </div>
            <div className="committees reveal">
              <div className="ch">// Working committees</div>
              <div className="committee-grid">
                {committees.map((committee, index) => (
                  <div className="committee" key={committee}>
                    <span className="cn">{String(index + 1).padStart(2, '0')}</span>
                    <span className="ct">{committee}</span>
                  </div>
                ))}
              </div>
            </div>
                  <div className="committees reveal" style={{ marginTop: '28px' }}>
        <div className="ch">// Committee members</div>

        <div className="grid-2">
          {committeeMembers.map((committee) => (
            <div className="card" key={committee.name}>
              <h3>{committee.name}</h3>

              <ul className="ticks">
                {committee.members.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
          </div>
        </section>

        <div className="divider" />

        <section id="contact">
          <div className="wrap">
            <div className="sec-head reveal">
              <span className="eyebrow">Get in Touch</span>
              <h2 className="sec">Connect with <b>the team</b></h2>
              <p className="sec-lead">Questions on abstracts, registration or travel? Reach the organising team directly.</p>
            </div>
            <div className="contact-grid reveal">
              <div className="cbox">
                <h3>Organising team</h3>
                <div className="crow">
                  <span className="k">Academic Director</span>
                  <span className="v">Dr. K. E. Reby Roy<small>ISRO–TKMCE Centre of Excellence</small><a href="tel:+919656522333">+91 96565 22333</a></span>
                </div>
                <div className="crow">
                  <span className="k">Student Director</span>
                  <span className="v">Rinshad PPK<small>ISRO–TKMCE Centre of Excellence</small><a href="tel:+917736496897">+91 77364 96897</a></span>
                </div>
                <div className="crow">
                  <span className="k">Email</span>
                  <span className="v"><a href="mailto:zynexa2026@tkmce.ac.in">zynexa2026@tkmce.ac.in</a></span>
                </div>
                <div className="crow">
                  <span className="k">Web</span>
                  <span className="v"><a href="https://www.tkmce.ac.in" target="_blank" rel="noreferrer">www.tkmce.ac.in</a></span>
                </div>
              </div>
              <div className="cbox">
                <h3>Venue & travel</h3>
                <div className="crow">
                  <span className="k">Venue</span>
                  <span className="v">ISRO–TKMCE Centre of Excellence<small>TKM College of Engineering, Karicode, Kollam – 691005, Kerala, India</small></span>
                </div>
                <div className="crow">
                  <span className="k">By rail</span>
                  <span className="v">~6 km from Kollam Jn. Railway Station</span>
                </div>
                <div className="crow">
                  <span className="k">By air</span>
                  <span className="v">~65 km from Trivandrum Intl. Airport</span>
                </div>
                <div className="crow">
                  <span className="k">Mode</span>
                  <span className="v">Hybrid · On-site & Online</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-in">
            <div>
              <div className="foot-brand">ZYNEXA<i> 2026</i></div>
              <div className="foot-org">Organised by TKMCE · ISRO–TKMCE Centre of Excellence</div>
              <p className="foot-note">Zenith of Young Researchers in Next-generation EXploration and Aerospace.</p>
            </div>
            <div className="foot-links">
              <a href="#about">About</a>
              <a href="#tracks">Themes & Tracks</a>
              <a href="#programme">Programme</a>
              <a href="#papers">Call for Papers</a>
              <a href="#dates">Important Dates</a>
              <a href="#register">Registration</a>
            </div>
            <div className="foot-links">
              <a href="#host">Host Institution</a>
              <a href="#centre">The Centre</a>
              <a href="#committee">Committee</a>
              <a href="#contact">Contact</a>
              <button type="button" className="text-link" onClick={() => setIsModalOpen(true)}>Register →</button>
              <a href="mailto:zynexa2026@tkmce.ac.in">zynexa2026@tkmce.ac.in</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>02–04 October 2026 · Hybrid · Kollam, India</span>
            <span>#ZYNEXA2026 · Innovate · Collaborate · Explore</span>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Paper Submission</p>
                <h3>Submit your conference paper</h3>
              </div>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="Close submission form">×</button>
            </div>

            {submissionState.success ? (
              <div className="success-state">
                <h4>Paper submitted successfully.</h4>
                <p>Your submission ID is <strong>{submissionState.submissionId}</strong>. Please save this reference for future queries.</p>
                <button type="button" className="btn primary" onClick={closeModal}>Close</button>
              </div>
            ) : (
              <form className="registration-form" onSubmit={handleSubmit}>
                <div className="modal-grid">
                  <label className="field">
                    <span>Paper title</span>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter the paper title"
                    />
                  </label>
                  <label className="field">
                    <span>Authors</span>
                    <input
                      name="author_names"
                      value={formData.author_names}
                      onChange={handleChange}
                      required
                      placeholder="Author names separated by commas"
                    />
                  </label>
                  <label className="field">
                    <span>Author email</span>
                    <input
                      type="email"
                      name="author_email"
                      value={formData.author_email}
                      onChange={handleChange}
                      required
                      placeholder="contact@email.com"
                    />
                  </label>
                  <label className="field">
                    <span>Affiliation</span>
                    <input
                      name="affiliation"
                      value={formData.affiliation}
                      onChange={handleChange}
                      required
                      placeholder="College / organisation"
                    />
                  </label>
                </div>
                <label className="field field-full">
                  <span>Abstract</span>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleChange}
                    rows="4"
                    required
                    placeholder="Enter the paper abstract"
                  />
                </label>
                <div className="modal-grid">
                  <label className="field">
                    <span>Track</span>
                    <select name="track" value={formData.track} onChange={handleChange}>
                      {tracks.map((track) => (
                        <option key={track} value={track}>
                          {track}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>PDF upload</span>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} required />
                  </label>
                </div>
                {submissionState.error && <p className="form-error">{submissionState.error}</p>}
                <div className="form-actions">
                  <button type="button" className="btn ghost" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn primary" disabled={submissionState.busy}>
                    {submissionState.busy ? 'Submitting…' : 'Submit Paper'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
