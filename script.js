// ===== Dark Mode Toggle =====
const darkModeBtn = document.getElementById('darkMode');
const htmlElement = document.documentElement;

// Initialize dark mode
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    htmlElement.setAttribute('data-theme', 'dark');
    darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
}

darkModeBtn.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = newTheme === 'dark' ? 'fa-sun' : 'fa-moon';
    darkModeBtn.innerHTML = `<i class="fas ${icon}"></i>`;
}

// ===== Mobile Menu Toggle =====
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle?.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', 
        menuToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
    );
});

// Close menu when link clicked
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
    });
});

// ===== Project Filter =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.classList.remove('hidden');
                // Trigger animation
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = '';
                }, 10);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== Contact Form Validation & Submission =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        formMessage.className = '';
        formMessage.textContent = '';
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Prepare form data
        const formData = new FormData(contactForm);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send to FormSubmit.co (free service - no backend needed)
            const response = await fetch('https://formsubmit.co/ajax/hiramuqaddas09@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccessMessage('Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
                clearErrors();
            } else {
                showErrorMessage('Failed to send message. Please try again.');
            }
        } catch (error) {
            // Fallback: Show local storage message
            showSuccessMessage('Message saved locally. I\'ll contact you soon!');
            saveFormLocally(formData);
            contactForm.reset();
            clearErrors();
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Form Validation =====
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Clear all errors first
    clearErrors();
    
    // Name validation
    if (!name) {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    if (!email) {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!subject) {
        showError('subjectError', 'Subject is required');
        isValid = false;
    } else if (subject.length < 3) {
        showError('subjectError', 'Subject must be at least 3 characters');
        isValid = false;
    }
    
    // Message validation
    if (!message) {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.parentElement.classList.add('error');
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.parentElement.classList.remove('error');
    });
}

function showSuccessMessage(message) {
    formMessage.textContent = message;
    formMessage.className = 'form-message success';
    setTimeout(() => {
        formMessage.className = '';
    }, 5000);
}

function showErrorMessage(message) {
    formMessage.textContent = message;
    formMessage.className = 'form-message error';
    setTimeout(() => {
        formMessage.className = '';
    }, 5000);
}

// ===== Local Storage Fallback =====
function saveFormLocally(formData) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const message = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    messages.push(message);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

// ===== Scroll Animation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe skill cards and project cards
document.querySelectorAll('.skill-card, .project-card').forEach(element => {
    observer.observe(element);
});

// ===== Smooth Active Link Highlight =====
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a:not(#darkMode)');

window.addEventListener('scroll', () => {
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
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        nav?.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
    }
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Log portfolio loaded
console.log('%cWelcome to Hira Muqaddas Portfolio!', 'color: #6c5ce7; font-size: 16px; font-weight: bold;');
console.log('Feel free to explore and get in touch!');