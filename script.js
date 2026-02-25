/* ═══════════════════════════════════════════════════════════════════
   THE SMILE EDIT – script.js
   Handles: nav scroll, hamburger menu, scroll-reveal, booking form
════════════════════════════════════════════════════════════════════ */

/* ─── CONFIG ─────────────────────────────────────────────────────── */
// Replace with the actual WhatsApp number (digits only, include country code)
const WHATSAPP_NUMBER = '919519721377';

/* ─── DOM REFS ───────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const bookingForm = document.getElementById('bookingForm');

/* ─── 1. STICKY NAV – add .scrolled class on scroll ─────────────── */
function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run on load

/* ─── 2. HAMBURGER MENU ──────────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));

  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ─── 3. SMOOTH SCROLL (backup for older browsers) ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = nav.getBoundingClientRect().height;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── 4. SCROLL REVEAL (Intersection Observer) ───────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly for a cascading effect
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
          : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = Math.min(siblingIndex * 80, 320);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── 5. BOOKING FORM → WHATSAPP ─────────────────────────────────── */
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('name');
    const phoneEl = document.getElementById('phone');
    const concernEl = document.getElementById('concern');
    const messageEl = document.getElementById('message');

    // Basic validation
    let hasError = false;
    [nameEl, phoneEl].forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = '#e05c5c';
        el.focus();
        hasError = true;
      } else {
        el.style.borderColor = '';
      }
    });

    if (phoneEl.value.trim() && !/^\d{10}$/.test(phoneEl.value.trim())) {
      phoneEl.style.borderColor = '#e05c5c';
      phoneEl.focus();
      showFieldError(phoneEl, 'Please enter a valid 10-digit phone number.');
      return;
    }

    if (hasError) return;

    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const concern = concernEl.value || 'General Enquiry';
    const notes = messageEl ? messageEl.value.trim() : '';

    const message = [
      `Hi Dr. Amrita! 👋`,
      ``,
      `I'd like to book a smile consultation at The Smile Edit.`,
      ``,
      `📋 *My Details:*`,
      `• Name: ${name}`,
      `• Phone: ${phone}`,
      `• Concern: ${concern}`,
      notes ? `• Notes: ${notes}` : '',
      ``,
      `Looking forward to hearing from you! 😊`,
    ].filter(Boolean).join('\n');

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Brief visual feedback
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    btnText.hidden = true;
    btnLoading.hidden = false;
    submitBtn.disabled = true;

    setTimeout(() => {
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      // Reset after opening
      btnText.hidden = false;
      btnLoading.hidden = true;
      submitBtn.disabled = false;
      bookingForm.reset();
    }, 600);
  });
}

/* ─── HELPER: show inline field error ───────────────────────────── */
function showFieldError(el, msg) {
  let errEl = el.parentElement.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'field-error';
    errEl.style.cssText = 'font-size:.78rem;color:#e05c5c;margin-top:.25rem;';
    el.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
  setTimeout(() => { errEl.textContent = ''; el.style.borderColor = ''; }, 3500);
}

/* ─── 6. INPUT BORDER RESET ON CHANGE ───────────────────────────── */
document.querySelectorAll('.form-input').forEach(el => {
  el.addEventListener('input', () => {
    el.style.borderColor = '';
  });
});

/* ─── 7. FLOATING WHATSAPP VISIBILITY ───────────────────────────── */
const floatingWA = document.getElementById('floatingWhatsapp');
if (floatingWA) {
  // Hide the floating button when the booking section is in full view
  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    const waObserver = new IntersectionObserver(
      ([entry]) => {
        floatingWA.style.opacity = entry.isIntersecting ? '0' : '1';
        floatingWA.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
        floatingWA.style.transform = entry.isIntersecting ? 'scale(0.8)' : '';
      },
      { threshold: 0.4 }
    );
    waObserver.observe(bookingSection);
  }
  floatingWA.style.transition = 'opacity 0.3s ease, transform 0.3s ease, box-shadow 0.35s ease';
}
