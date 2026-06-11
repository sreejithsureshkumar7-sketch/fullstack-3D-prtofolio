const house = document.getElementById('house3d');
const stage = document.querySelector('.house-stage');

stage.addEventListener('mousemove', (e) => {
  const rect = stage.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateY = (x / rect.width - 0.5) * 35;
  const rotateX = (0.5 - y / rect.height) * 18;
  house.style.animation = 'none';
  house.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

stage.addEventListener('mouseleave', () => {
  house.style.animation = 'float 4s ease-in-out infinite';
  house.style.transform = '';
});

const form = document.getElementById('contactForm');
const statusText = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusText.textContent = 'Sending...';
  const data = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      statusText.textContent = 'Message sent successfully!';
      form.reset();
    } else {
      statusText.textContent = result.error || 'Something went wrong';
    }
  } catch (error) {
    statusText.textContent = 'Backend not running. Deploy backend or run npm start.';
  }
});
