// ============ Тема (dark/light) ============
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ============ Плавное появление блоков ============
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealElements.forEach((el) => observer.observe(el));

// ============ Форма обратной связи → Make webhook ============
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