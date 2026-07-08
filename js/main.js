// ==================== MOBILE MENU TOGGLE ====================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        
        // Toggle icon between bars and times (X)
        const icon = mobileMenuBtn.querySelector('i');
        if (isExpanded) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// ==================== HEADER SCROLL EFFECT ====================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
});

// ==================== ACTIVE NAV LINK ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// ==================== STATISTICS COUNTER ANIMATION ====================
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const animateStats = () => {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };
        
        updateCounter();
    });
};

// Trigger animation when statistics section is in view
const statisticsSection = document.querySelector('.statistics');

const observerOptions = {
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
        }
    });
}, observerOptions);

if (statisticsSection) {
    statsObserver.observe(statisticsSection);
}

// ==================== SCROLL REVEAL ANIMATIONS ====================
const revealElements = document.querySelectorAll('.service-card, .feature-card, .package-card, .testimonial-card, .blog-card, .gallery-item, .contact-item');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== LAZY LOADING FOR IMAGES ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Trigger load
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== ADD LOADED CLASS TO IMAGES ====================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});

// ==================== SCROLL TO TOP BUTTON (Optional) ====================
const createScrollToTopButton = () => {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(button);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #d4af37 0%, #b8960c 100%);
            color: #061845;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Initialize scroll to top button
createScrollToTopButton();

// ==================== API DATA LOADING ====================
async function loadPackages() {
  try {
    const res = await API.packages.list();
    const packages = res.data;
    const grid = document.querySelector('.packages-grid');
    if (!grid || !packages || packages.length === 0) return;

    const packageHtml = (pkg) => {
      const features = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : (pkg.features || []);
      const featureList = features.length > 0
        ? features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')
        : '<li><i class="fas fa-check"></i> Full Event Planning</li>';
      const isFeatured = pkg.isFeatured;
      return `
        <div class="package-card ${isFeatured ? 'featured' : ''}">
          ${isFeatured ? '<div class="package-badge">Most Popular</div>' : ''}
          <div class="package-header">
            <h3 class="package-name">${pkg.name}</h3>
            <p class="package-price">KSh ${Number(pkg.price).toLocaleString()}</p>
          </div>
          <ul class="package-features">${featureList}</ul>
          <a href="booking.html?package=${pkg.id}" class="btn ${isFeatured ? 'btn-primary' : 'btn-outline'}">Choose ${pkg.name.split(' ')[0]}</a>
        </div>`;
    };

    grid.innerHTML = packages.map(packageHtml).join('');
  } catch (err) {
    console.error('Failed to load packages:', err);
  }
}

async function loadTestimonials() {
  try {
    const res = await API.testimonials.list();
    const testimonials = res.data;
    const grid = document.querySelector('.testimonials-grid');
    if (!grid || !testimonials || testimonials.length === 0) return;

    const starsHtml = (rating) => {
      let html = '';
      for (let i = 1; i <= 5; i++) {
        html += i <= rating
          ? '<i class="fas fa-star"></i>'
          : '<i class="far fa-star"></i>';
      }
      return html;
    };

    grid.innerHTML = testimonials.slice(0, 3).map(t => `
      <div class="testimonial-card">
        <div class="testimonial-rating">${starsHtml(t.rating || 5)}</div>
        <p class="testimonial-text">"${t.content}"</p>
        <div class="testimonial-author">
          <div class="author-info">
            <h4 class="author-name">${t.user?.name || 'Anonymous'}</h4>
            ${t.eventType ? `<p class="author-event">${t.eventType} Client</p>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load testimonials:', err);
  }
}

async function loadBlogs() {
  try {
    const res = await API.blogs.list({ limit: 3 });
    const blogs = res.data;
    const grid = document.querySelector('.blog-grid');
    if (!grid || !blogs || blogs.length === 0) return;

    grid.innerHTML = blogs.map(post => `
      <article class="blog-card">
        ${post.coverImage ? `<div class="blog-image"><img src="${post.coverImage}" alt="${post.title}"></div>` : ''}
        <div class="blog-content">
          <div class="blog-meta">
            <span class="blog-date"><i class="far fa-calendar"></i> ${new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt || post.content.substring(0, 120)}...</p>
          <a href="blog.html?slug=${post.slug}" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.error('Failed to load blogs:', err);
  }
}

async function loadGallery() {
  try {
    const res = await API.gallery.list();
    const images = res.data;
    const grid = document.querySelector('.gallery-grid');
    if (!grid || !images || images.length === 0) return;

    grid.innerHTML = images.map(img => `
      <div class="gallery-item">
        <img src="${img.imageUrl}" alt="${img.caption || 'Event photo'}">
        <div class="gallery-overlay">
          ${img.caption ? `<span class="gallery-category">${img.caption}</span>` : ''}
          ${img.category ? `<span class="gallery-category">${img.category}</span>` : ''}
        </div>
      </div>
    `).join('');
    initRevealObserver();
  } catch (err) {
    console.error('Failed to load gallery:', err);
  }
}

async function initializeData() {
  await Promise.allSettled([
    loadPackages(),
    loadTestimonials(),
    loadBlogs(),
    loadGallery(),
  ]);
}

function initRevealObserver() {
  const revealElements = document.querySelectorAll('.service-card, .feature-card, .package-card, .testimonial-card, .blog-card, .gallery-item, .contact-item');
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => observer.observe(el));
}

// ==================== AUTH UI ====================
function showAuthModal(tab = 'login') {
  const existing = document.querySelector('.auth-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-modal-content">
      <button class="auth-modal-close">&times;</button>
      <div class="auth-tabs">
        <button class="auth-tab ${tab === 'login' ? 'active' : ''}" data-tab="login">Login</button>
        <button class="auth-tab ${tab === 'register' ? 'active' : ''}" data-tab="register">Register</button>
      </div>
      <form id="auth-form" class="auth-form">
        <div id="auth-form-content"></div>
        <button type="submit" class="btn btn-primary auth-submit">${tab === 'login' ? 'Login' : 'Register'}</button>
        <p id="auth-error" class="auth-error"></p>
      </form>
      <div class="auth-divider"><span>or continue with</span></div>
      <button class="btn-google" onclick="window.location.href='${API.BASE_URL.replace('/api', '')}/auth/google'">
        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.98-5.97z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/></svg>
        Sign in with Google
      </button>
    </div>
  `;

  document.body.appendChild(modal);
  modal.querySelector('.auth-modal-close').onclick = () => modal.remove();
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

  const tabs = modal.querySelectorAll('.auth-tab');
  tabs.forEach(t => t.onclick = () => {
    tabs.forEach(tab => tab.classList.remove('active'));
    t.classList.add('active');
    renderAuthForm(t.dataset.tab);
  });

  renderAuthForm(tab);

  modal.querySelector('#auth-form').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.auth-submit');
    const errorEl = form.querySelector('#auth-error');
    const activeTab = form.closest('.auth-modal-content').querySelector('.auth-tab.active').dataset.tab;
    submitBtn.disabled = true;
    errorEl.textContent = '';

    try {
      if (activeTab === 'login') {
        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;
        await API.auth.login(email, password);
      } else {
        const name = form.querySelector('#reg-name').value;
        const email = form.querySelector('#reg-email').value;
        const password = form.querySelector('#reg-password').value;
        await API.auth.register({ name, email, password });
        await API.auth.login(email, password);
      }
      modal.remove();
      updateAuthUI();
      showToast('Successfully logged in!', 'success');
    } catch (err) {
      errorEl.textContent = err.message || 'An error occurred';
    } finally {
      submitBtn.disabled = false;
    }
  };
}

function renderAuthForm(tab) {
  const container = document.querySelector('#auth-form-content');
  if (!container) return;

  if (tab === 'login') {
    container.innerHTML = `
      <div class="form-group">
        <label for="login-email">Email</label>
        <input type="email" id="login-email" class="form-input" required placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label for="login-password">Password</label>
        <input type="password" id="login-password" class="form-input" required placeholder="Enter password">
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="form-group">
        <label for="reg-name">Full Name</label>
        <input type="text" id="reg-name" class="form-input" required placeholder="Your name">
      </div>
      <div class="form-group">
        <label for="reg-email">Email</label>
        <input type="email" id="reg-email" class="form-input" required placeholder="your@email.com">
      </div>
      <div class="form-group">
        <label for="reg-password">Password</label>
        <input type="password" id="reg-password" class="form-input" required placeholder="Min 6 characters" minlength="6">
      </div>
    `;
  }
}

function updateAuthUI() {
  const token = API.getToken();
  const bookBtn = document.querySelector('.book-btn');
  if (!bookBtn) return;

  if (token) {
    bookBtn.textContent = 'My Account';
    bookBtn.href = '#';
    bookBtn.onclick = (e) => {
      e.preventDefault();
      showAccountMenu();
    };
  } else {
    bookBtn.textContent = 'Login';
    bookBtn.href = '#';
    bookBtn.onclick = (e) => {
      e.preventDefault();
      showAuthModal('login');
    };
  }
}

function showAccountMenu() {
  const existing = document.querySelector('.account-menu');
  if (existing) existing.remove();

  const menu = document.createElement('div');
  menu.className = 'account-menu';
  menu.innerHTML = `
    <a href="#" data-action="bookings">My Bookings</a>
    <a href="#" data-action="quotes">My Quotes</a>
    <a href="#" data-action="review">Write a Review</a>
    <a href="#" data-action="logout">Logout</a>
  `;

  const btn = document.querySelector('.book-btn');
  btn.parentNode.appendChild(menu);

  menu.querySelectorAll('a').forEach(item => {
    item.onclick = async (e) => {
      e.preventDefault();
      menu.remove();
      const action = item.dataset.action;
      if (action === 'logout') {
        await API.auth.logout();
        updateAuthUI();
        showToast('Logged out successfully', 'success');
      } else {
        showToast(`${action} feature coming soon`, 'info');
      }
    };
  });

  document.addEventListener('click', function closeMenu(e) {
    if (!e.target.closest('.account-menu') && !e.target.closest('.book-btn')) {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }
  });
}

// ==================== FORM HANDLERS ====================
function setupContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      await API.contacts.submit({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || undefined,
        subject: formData.get('subject'),
        message: formData.get('message'),
      });
      form.reset();
      showToast('Message sent successfully! We will get back to you soon.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  };
}

function setupNewsletterForm() {
  const form = document.querySelector('#newsletter-form');
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const emailInput = form.querySelector('input[type="email"]');
    submitBtn.disabled = true;

    try {
      await API.newsletter.subscribe(emailInput.value);
      form.reset();
      showToast('Subscribed successfully!', 'success');
    } catch (err) {
      if (err.status === 409) {
        showToast('You are already subscribed!', 'info');
      } else {
        showToast(err.message || 'Failed to subscribe.', 'error');
      }
    } finally {
      submitBtn.disabled = false;
    }
  };
}

function setupBookingForm() {
  const form = document.querySelector('#booking-form');
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!API.getToken()) {
      showToast('Please login to make a booking', 'error');
      showAuthModal('login');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      await API.bookings.create({
        eventType: formData.get('eventType'),
        eventDate: formData.get('eventDate'),
        location: formData.get('location'),
        guestCount: parseInt(formData.get('guestCount')),
        packageId: formData.get('packageId') || undefined,
        notes: formData.get('notes') || undefined,
      });
      form.reset();
      showToast('Booking request submitted! We will contact you soon.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit booking.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  };
}

function setupQuoteForm() {
  const form = document.querySelector('#quote-form');
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (!API.getToken()) {
      showToast('Please login to request a quote', 'error');
      showAuthModal('login');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      await API.quotes.create({
        eventType: formData.get('eventType'),
        budget: formData.get('budget') || undefined,
        description: formData.get('description'),
      });
      form.reset();
      showToast('Quote request submitted! We will respond within 24 hours.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit quote request.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  };
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast-container');
  let container;
  if (existing) {
    container = existing;
  } else {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==================== BLOG PAGE ====================
async function loadAllBlogs() {
  try {
    const res = await API.blogs.list();
    const blogs = res.data;
    const grid = document.querySelector('#blog-grid');
    const loader = document.querySelector('#blog-loader');
    if (!grid) return;
    if (loader) loader.style.display = 'none';
    if (!blogs || blogs.length === 0) {
      grid.innerHTML = '<p style="text-align:center;padding:2rem;color:#999;">No blog posts yet. Check back soon!</p>';
      return;
    }

    grid.innerHTML = blogs.map(post => `
      <article class="blog-card">
        ${post.coverImage ? `<div class="blog-image"><img src="${post.coverImage}" alt="${post.title}" loading="lazy"></div>` : ''}
        <div class="blog-content">
          <div class="blog-meta">
            <span class="blog-date"><i class="far fa-calendar"></i> ${new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            ${post.category ? `<span class="blog-category">${post.category}</span>` : ''}
          </div>
          <h3 class="blog-title">${post.title}</h3>
          <p class="blog-excerpt">${post.excerpt || post.content.substring(0, 150)}...</p>
          <a href="blog.html?slug=${post.slug}" class="blog-link">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.error('Failed to load blogs:', err);
    const loader = document.querySelector('#blog-loader');
    if (loader) loader.textContent = 'Failed to load blog posts.';
  }
}

async function loadBlogPost(slug) {
  try {
    const res = await API.blogs.getBySlug(slug);
    const post = res.data;
    const detail = document.querySelector('#blog-detail');
    const list = document.querySelector('#blog-list');
    const content = document.querySelector('#blog-post-content');
    if (!detail || !content) return;

    if (list) list.style.display = 'none';
    detail.style.display = 'block';

    content.innerHTML = `
      <div class="blog-post">
        ${post.coverImage ? `<div class="blog-post-image"><img src="${post.coverImage}" alt="${post.title}" style="width:100%;border-radius:12px;margin-bottom:2rem;"></div>` : ''}
        <div class="blog-meta" style="margin-bottom:1rem;">
          <span class="blog-date"><i class="far fa-calendar"></i> ${new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          ${post.category ? `<span class="blog-category">${post.category}</span>` : ''}
        </div>
        <h1 style="font-size:2rem;color:var(--primary);margin-bottom:1.5rem;">${post.title}</h1>
        <div class="blog-post-content" style="line-height:1.8;color:#555;">${post.content}</div>
        ${post.author ? `<div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid #eee;"><strong>By:</strong> ${post.author.name || 'Bluefage Events'}</div>` : ''}
      </div>
    `;
    document.title = `${post.title} - Bluefage Events`;
  } catch (err) {
    console.error('Failed to load blog post:', err);
    document.querySelector('#blog-post-content').innerHTML = '<p style="text-align:center;padding:2rem;color:#ef4444;">Failed to load blog post.</p>';
  }
}

// ==================== PAGE-SPECIFIC INIT ====================
function isPage(page) {
  return window.location.pathname.includes(page);
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  const urlToken = getQueryParam('token');
  if (urlToken) {
    API.setToken(urlToken);
    window.history.replaceState({}, document.title, window.location.pathname);
    showToast('Signed in with Google!', 'success');
  } else if (getQueryParam('auth') === 'failed') {
    showToast('Google sign-in failed. Please try again.', 'error');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (isPage('blog.html')) {
    const slug = getQueryParam('slug');
    if (slug) {
      loadBlogPost(slug);
    } else {
      loadAllBlogs();
    }
    updateAuthUI();
  } else {
    initializeData();
    updateAuthUI();
    setupContactForm();
    setupNewsletterForm();
    setupBookingForm();
    setupQuoteForm();
  }
});

// ==================== FORM VALIDATION (For future forms) ====================
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone);
};

// ==================== PRELOADER (Optional) ====================
const hidePreloader = () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
};

window.addEventListener('load', hidePreloader);

console.log('Bluefage Events - Website loaded successfully');
