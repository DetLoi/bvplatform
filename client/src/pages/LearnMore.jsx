import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './LearnMore.module.css';
import UsersCarousel3D from '../components/UsersCarousel3D';
import SignupFormInline from '../components/SignupFormInline';
import { useEvents } from '../hooks/useEvents';
import { newsletterAPI } from '../services/api';
import { FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

const sections = [
  { key: 'summary', title: 'Summary', subtitle: 'What you get with Breakverse', bullets: [
    'Structured learning path for breakers',
    'Community-driven battles and events',
    'Motivating progress with badges and stats',
  ]},
  { key: 'users', title: 'Users', subtitle: 'Accounts, profiles, roles', bullets: [
    'Create and manage user profiles',
    'Roles: student, instructor, judge, admin',
    'Profile images, bios, and progression',
  ]},
  { key: 'moves', title: 'Moves', subtitle: 'Learn, master, progress', bullets: [
    'Structured move library by category and level',
    'Mastered vs pending moves',
    'XP and level calculation based on activity',
  ]},
  { key: 'badges', title: 'Badges', subtitle: 'Motivation through achievements', bullets: [
    'Category and level-based badges',
    'Auto-assigned when requirements met',
    'Grandmaster and special badges',
  ]},
  { key: 'battles', title: 'Battles', subtitle: 'Compete and grow', bullets: [
    'Create and join battles',
    'Judge voting and results',
    'Battle XP and level',
  ]},
  { key: 'events', title: 'Events', subtitle: 'Never miss what’s next', bullets: [
    'Curated events with focus on DK',
    'Dates, locations, and organizers',
  ]},
     { key: 'notifications', title: 'Notifications', subtitle: 'Stay informed', bullets: [
     'Level-up and badge-earned alerts',
     'Battle updates and approvals',
     'News and announcements',
   ]},
   { key: 'rules', title: 'System Rules', subtitle: 'Consistency and safety', bullets: [
    'Validation and sanitization on input',
    'Role-based access control',
    'Error handling and logging',
    <span><Link to="/terms" target="_blank" className={styles.bulletLink}>Terms of Service</Link> and <Link to="/policy" target="_blank" className={styles.bulletLink}>Privacy Policy</Link> compliance</span>,
  ]},
  { key: 'cta', title: 'Your path to Breakverse', subtitle: 'Create your account and start mastering today', bullets: [
    'Sign up free in minutes',
    'Verify your email to unlock features',
    'Track progress, earn badges, and join battles',
  ]},
];

export default function LearnMore() {
  const contentRef = useRef(null);
  const sectionRefs = useRef([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const location = useLocation();
  const { events } = useEvents();
  const isDanishEvent = (event) => {
    const danishKeywords = ['denmark', 'danmark', 'danish', 'dansk', 'copenhagen', 'aarhus', 'odense', 'aalborg'];
    const organizer = (event?.organizer || '').toLowerCase();
    const place = (event?.location || '').toLowerCase();
    return danishKeywords.some((k) => organizer.includes(k) || place.includes(k));
  };
  const upcomingDanishEvents = useMemo(() => {
    const list = (Array.isArray(events) ? events : []).filter(isDanishEvent);
    return list
      .slice()
      .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
      .slice(0, 4);
  }, [events]);
  const battlesImages = useMemo(() => [
    '/src/assets/battlesimages/dashboard.png',
    '/src/assets/battlesimages/battle01.png',
    '/src/assets/battlesimages/Battle02.png',
    '/src/assets/battlesimages/profile.png',
  ], []);
  const [battleIdx, setBattleIdx] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // idle | success | error

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, sections.length);
  }, []);

  // Robust active-section tracking using centerline to avoid off-by-one highlights
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rootRectTop = root.getBoundingClientRect().top;
        const centerY = root.clientHeight / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        sectionRefs.current.forEach((el, idx) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const elCenter = (r.top - rootRectTop) + r.height / 2;
          const dist = Math.abs(elCenter - centerY);
          if (dist < bestDist) {
            bestDist = dist;
            bestIdx = idx;
          }
        });
        setActiveIdx(bestIdx);
        ticking = false;
      });
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    // initialize once
    onScroll();
    return () => root.removeEventListener('scroll', onScroll);
  }, []);

  const progress = useMemo(() => ((activeIdx + 1) / sections.length) * 100, [activeIdx]);

  const scrollTo = (idx) => {
    const container = contentRef.current;
    if (!container) return;
    const target = sectionRefs.current[idx];
    const top = target?.offsetTop ?? idx * container.clientHeight;
    setActiveIdx(idx);
    container.scrollTo({ top, behavior: 'smooth' });
  };

  const next = () => scrollTo(Math.min(sections.length - 1, activeIdx + 1));
  const prev = () => scrollTo(Math.max(0, activeIdx - 1));

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const email = (newsletterEmail || '').trim();
    const ok = /.+@.+\..+/.test(email);
    if (!ok) {
      setNewsletterStatus('error');
      return;
    }
    try {
      await newsletterAPI.subscribe(email);
      setNewsletterStatus('success');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
      setNewsletterEmail('');
    } catch (err) {
      console.error('newsletter subscribe failed', err);
      setNewsletterStatus('error');
    }
  };

  // Handle hash navigation for smooth scrolling and animation trigger
  useEffect(() => {
    const hash = (location.hash || '').replace('#', '');
    const idx = sections.findIndex((s) => s.key === hash);
    if (idx >= 0) {
      setActiveIdx(idx);
      // ensure DOM painted before scroll
      requestAnimationFrame(() => scrollTo(idx));
    } else if (!location.hash) {
      setActiveIdx(0);
      requestAnimationFrame(() => scrollTo(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash]);

  // Keep URL hash in sync with active section so the header label updates while scrolling
  useEffect(() => {
    if (!location.pathname.startsWith('/learnmore')) return;
    const key = sections[activeIdx]?.key;
    if (!key) return;
    const newHash = `#${key}`;
    if (window.location.hash !== newHash) {
      // Replace state to avoid polluting history
      window.history.replaceState(null, '', `${window.location.pathname}${newHash}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx]);

  return (
    <div className={styles.pageRoot}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Breakverse Docs</div>
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <ul className={styles.navList}>
          {sections.map((s, idx) => (
            <li
              key={s.key}
              className={idx === activeIdx ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
              onClick={() => scrollTo(idx)}
            >
              <span className={idx === activeIdx ? `${styles.dot} ${styles.dotActive}` : styles.dot} />
              <span>{s.title}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.content} ref={contentRef}>
        <div className={styles.mobileProgress}>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        </div>
        {sections.map((s, idx) => (
          <section
            key={s.key}
            ref={(el) => (sectionRefs.current[idx] = el)}
            className={`${styles.section} ${idx <= activeIdx ? styles.sectionVisible : styles.sectionEnter}`}
            id={s.key}
          >
            <div>
              <h2 className={`${styles.title} ${styles.line}`} style={{ ['--delay']: '40ms' }}>{s.title}</h2>
              <p className={`${styles.subtitle} ${styles.line}`} style={{ ['--delay']: '120ms' }}>{s.subtitle}</p>
              <ul className={styles.bullets}>
                {s.bullets.map((b, i) => (
                  <li className={`${styles.bullet} ${styles.line}`} style={{ ['--delay']: `${180 + i * 90}ms` }} key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className={styles.visual} style={{ ['--vdelay']: '220ms' }}>
              {s.key === 'summary' ? (
                <img src="/src/assets/logo-white.png" alt="Breakverse" style={{ maxWidth: '260px', width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.45))' }} onError={(e)=>{ e.target.style.display='none'; }} />
              ) : s.key === 'users' ? (
                <UsersCarousel3D images={[
                  '/src/assets/User.jpg',
                  '/src/assets/benji.png',
                  '/src/assets/kien.png',
                  '/src/assets/ronway.png',
                  '/src/assets/luca.png',
                  '/src/assets/illwill.png',
                ]} />
              ) : s.key === 'badges' ? (
                <UsersCarousel3D images={[
                  '/src/assets/badges/beginner.png',
                  '/src/assets/badges/novice.png',
                  '/src/assets/badges/intermediate.png',
                  '/src/assets/badges/Advanced.png',
                  '/src/assets/badges/skilled.png',
                  '/src/assets/badges/master.png',
                  '/src/assets/badges/grandmaster.png',
                ]} />
              ) : s.key === 'battles' ? (
                <div className={styles.galleryTreadmill} aria-label="Battle gallery autoplay">
                  <div className={styles.treadmillTrack}>
                    {[...battlesImages, ...battlesImages].map((src, i) => (
                      <div key={i} className={styles.treadmillSlide}>
                        <img src={src} alt={`Battle ${i % battlesImages.length + 1}`} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : s.key === 'moves' ? (
                <UsersCarousel3D images={[
                  '/src/assets/badges/topbadge.png',
                  '/src/assets/badges/footwork.png',
                  '/src/assets/badges/freezes.png',
                  '/src/assets/badges/Powermoves.png',
                  '/src/assets/badges/Tricks.png',
                  '/src/assets/badges/Godown.png',
                  '/src/assets/badges/air.png',
                  '/src/assets/badges/ground.png',
                ]} />
                             ) : s.key === 'events' ? (
                 <div className={styles.eventsMini}>
                   <div className={styles.eventsMiniHeader}>Upcoming events in Denmark</div>
                   <div className={styles.eventsMiniList}>
                     {upcomingDanishEvents.map((ev) => (
                       <a
                         key={ev.id}
                         className={styles.eventMiniRow}
                         href={ev.website || '#'}
                         target={ev.website ? '_blank' : undefined}
                         rel={ev.website ? 'noreferrer' : undefined}
                       >
                         <div className={styles.eventMiniTitle}>{ev.title}</div>
                         <div className={styles.eventMiniMeta}>
                           <span className={styles.eventMiniItem}><FaCalendar /> {ev.date ? new Date(ev.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'TBA'}</span>
                           <span className={styles.eventMiniItem}><FaMapMarkerAlt /> {ev.location || 'Denmark'}</span>
                         </div>
                       </a>
                     ))}
                     {upcomingDanishEvents.length === 0 && (
                       <div className={`${styles.eventMiniRow} ${styles.eventMiniPlaceholder}`}>
                         <div className={styles.eventMiniTitle}>No Danish events yet</div>
                       </div>
                     )}
                   </div>
                 </div>
               ) : s.key === 'rules' ? (
                 <img 
                   src="/src/assets/safety.png" 
                   alt="Safety and System Rules" 
                   style={{ 
                     maxWidth: '300px', 
                     width: '100%', 
                     height: 'auto', 
                     objectFit: 'contain', 
                     filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.45))',
                     borderRadius: '12px'
                   }} 
                   onError={(e) => { e.target.style.display = 'none'; }} 
                 />
              ) : s.key === 'notifications' ? (
                <div className={styles.newsletter}>
                  <div className={styles.newsletterHeader}>Sign up for our newsletter</div>
                  <form className={styles.newsletterForm} onSubmit={handleNewsletterSubmit} noValidate>
                    <input
                      type="email"
                      className={styles.newsletterInput}
                      placeholder="you@example.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      aria-label="Email address"
                      required
                    />
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Subscribe</button>
                  </form>
                  {newsletterStatus === 'success' && (
                    <div className={styles.newsletterMsg}>Thanks! You’re on the list.</div>
                  )}
                  {newsletterStatus === 'error' && (
                    <div className={styles.newsletterMsgError}>Please enter a valid email.</div>
                  )}
                </div>
              ) : s.key === 'cta' ? (
                <SignupFormInline />
              ) : (
                <span>Placeholder visual for {s.title}</span>
              )}
            </div>

          </section>
        ))}

        <div className={styles.footerNav}>
          <button className={styles.btn} onClick={prev} disabled={activeIdx === 0}>Previous</button>
          <div style={{ color: '#cfd6e4' }}>{activeIdx + 1} / {sections.length}</div>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={next} disabled={activeIdx === sections.length - 1}>Next</button>
        </div>
      </main>
    </div>
  );
}

