// ============ Тема (dark/light) ============
const themeToggle = document.getElementById('themeToggle');
const userTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = userTheme || (systemDark ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', initialTheme);
if (userTheme) document.documentElement.setAttribute('data-theme-user', 'true');
themeToggle.textContent = initialTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.documentElement.setAttribute('data-theme-user', 'true');
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ============ Reveal on scroll ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
document.querySelectorAll('.reveal-stagger').forEach((el) => observer.observe(el));

// ============ Прогресс-бар чтения ============
const progressBar = document.getElementById('scrollProgress');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

// ============ Кнопка «Наверх» ============
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 600) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============ Параллакс всего слоя пятен ============
const heroBg = document.querySelector('.hero-bg');

function updateParallax() {
  if (!heroBg) return;
  const y = window.scrollY;
  if (y > window.innerHeight) return;
  heroBg.style.transform = `translateY(${y * 0.2}px)`;
}

// Общий обработчик скролла — один на всё (производительность)
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateProgress();
      updateBackToTop();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
});

updateProgress();
updateBackToTop();

// ============ Scroll-spy (активная секция в навигации) ============
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach((s) => spyObserver.observe(s));

// ============ Tilt на карточках проектов ============
const cards = document.querySelectorAll('.project-card');

cards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    if (window.matchMedia('(hover: none)').matches) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============ Магнитные кнопки ============
const magneticButtons = document.querySelectorAll('.btn');

magneticButtons.forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    if (window.matchMedia('(hover: none)').matches) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ============ Форма → Make webhook ============
const WEBHOOK_URL = 'https://hook.eu1.make.com/ww1rpoh5vbiyelqh2t6bf47j2uuze1u8';

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Отправка...';

  const data = {
    name: form.name.value,
    contact: form.contact.value,
    message: form.message.value
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      status.textContent = 'Спасибо! Я свяжусь с вами.';
      form.reset();
    } else {
      status.textContent = 'Ошибка. Попробуйте позже.';
    }
  } catch (error) {
    status.textContent = 'Ошибка сети. Попробуйте позже.';
  }
});

// ============ Плавающая кнопка «Связаться» ============
const floatingContact = document.getElementById('floatingContact');

floatingContact.addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

// ============ Копирование контакта в клик ============
const contactLinks = document.querySelectorAll('.contact-links a');

contactLinks.forEach((link) => {
  link.addEventListener('click', async (e) => {
    const text = link.textContent.trim();
    // Копируем только @username, если он есть
    const match = text.match(/@[\w_]+/);
    if (!match) return;

    try {
      await navigator.clipboard.writeText(match[0]);
      const original = link.textContent;
      link.textContent = '✓ Скопировано: ' + match[0];
      setTimeout(() => { link.textContent = original; }, 1500);
    } catch (err) {
      // Если браузер запретил — молча пропускаем
    }
  });
});

// ============ Бургер-меню ============
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');

function toggleMenu(force) {
  const willOpen = force !== undefined ? force : !mobileMenu.classList.contains('open');
  burger.classList.toggle('open', willOpen);
  mobileMenu.classList.toggle('open', willOpen);
  burger.setAttribute('aria-expanded', willOpen);
  document.body.style.overflow = willOpen ? 'hidden' : '';
}

burger.addEventListener('click', () => toggleMenu());

mobileMenuLinks.forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    toggleMenu(false);
  }
});

// ============ FAQ — текст появляется по буквам ============
document.querySelectorAll('.faq-item').forEach((item) => {
  const p = item.querySelector('p');
  if (!p) return;
  const originalText = p.textContent.trim();

  item.addEventListener('toggle', () => {
    if (item.open) {
      p.innerHTML = '';
      const chars = [...originalText];
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'faq-char';
        // Пробелы неразрывные, чтобы переносы работали нормально
        span.textContent = char === ' ' ? '\u00A0' : char;
        // Задержка 0.012s на букву + плавное замедление на длинных текстах
        span.style.animationDelay = (i * 0.012) + 's';
        p.appendChild(span);
      });
    } else {
      // При закрытии возвращаем исходный текст, чтобы при следующем открытии всё началось заново
      p.textContent = originalText;
    }
  });
});