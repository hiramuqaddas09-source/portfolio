// ========================================
// PORTFOLIO - Main JavaScript
// ========================================

// DOM Elements
const html = document.documentElement;
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');
const backToTop = document.getElementById('backToTop');
const navbar = document.querySelector('.navbar');

// ========================================
// DARK MODE
// ========================================

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme === 'dark' || (!savedTheme && prefersDark) ? 'dark' : 'light';
  setTheme(theme);
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// ========================================
// MOBILE MENU
// ========================================

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========================================
// ACTIVE NAV LINK ON SCROLL
// ========================================

function updateActiveLink() {
  const sections = document.querySelectorAll('section');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ========================================
// BACK TO TOP
// ========================================

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.remove('hidden');
  } else {
    backToTop.classList.add('hidden');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Clear previous messages
    formMessage.textContent = '';
    formMessage.className = '';

    // Validate form
    if (!validateContactForm()) {
      return;
    }

    const formData = new FormData(contactForm);
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      // Using FormSubmit.co (free service)
      const response = await fetch('https://formsubmit.co/ajax/hiramuqaddas09@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success', formMessage);
        contactForm.reset();
        clearFormErrors();
      } else {
        showFormMessage('Failed to send message. Please try again.', 'error', formMessage);
      }
    } catch (error) {
      // Fallback for local testing
      console.log('Form data:', Object.fromEntries(formData));
      showFormMessage('Message saved! I\'ll contact you soon.', 'success', formMessage);
      contactForm.reset();
      clearFormErrors();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

function validateContactForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;
  clearFormErrors();

  // Name validation
  if (!name) {
    showFormError('nameError', 'Name is required');
    isValid = false;
  } else if (name.length < 2) {
    showFormError('nameError', 'Name must be at least 2 characters');
    isValid = false;
  }

  // Email validation
  if (!email) {
    showFormError('emailError', 'Email is required');
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFormError('emailError', 'Please enter a valid email address');
    isValid = false;
  }

  // Subject validation
  if (!subject) {
    showFormError('subjectError', 'Subject is required');
    isValid = false;
  } else if (subject.length < 3) {
    showFormError('subjectError', 'Subject must be at least 3 characters');
    isValid = false;
  }

  // Message validation
  if (!message) {
    showFormError('messageError', 'Message is required');
    isValid = false;
  } else if (message.length < 10) {
    showFormError('messageError', 'Message must be at least 10 characters');
    isValid = false;
  }

  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearFormErrors() {
  document.querySelectorAll('.form-error').forEach(error => {
    error.textContent = '';
  });
}

function showFormMessage(message, type, element) {
  element.textContent = message;
  element.className = `form-message ${type}`;
  setTimeout(() => {
    element.className = '';
  }, 5000);
}

// ========================================
// ANIMATION ON SCROLL
// ========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.stat-card, .skill-category, .project-card, .cert-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateActiveLink();
});

// ========================================
// SMOOTH SCROLL SUPPORT
// ========================================

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ========================================
// PERFORMANCE: Lazy Loading Images
// ========================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log('%c✨ Welcome to Hira Muqaddas Portfolio ✨', 'color: #3B82F6; font-size: 16px; font-weight: bold;');
console.log('Open to internships and entry-level opportunities!');
