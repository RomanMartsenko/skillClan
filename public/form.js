document.addEventListener('DOMContentLoaded', async () => {
  const mentorSelect = document.getElementById('mentor');
  const existingName = document.getElementById('existingName');
  const newNameBlock = document.getElementById('newNameBlock');
  const nameInput = document.getElementById('name');

  // Завантажити менторів
  try {
    const res = await fetch('/data/mentors.json');
    const mentors = await res.json();
    mentors.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      mentorSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Не вдалося завантажити менторів:', err);
  }

  // Завантажити вже існуючі імена студентів
  try {
    const res = await fetch('/form');
    const students = await res.json();
    const uniqueNames = [...new Set(students.map(s => s.name))];

    uniqueNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      existingName.appendChild(option);
    });
  } catch (err) {
    console.error('Не вдалося завантажити студентів:', err);
  }

  existingName.addEventListener('change', () => {
    if (existingName.value) {
      newNameBlock.style.display = 'none';
      nameInput.removeAttribute('required');
    } else {
      newNameBlock.style.display = 'block';
      nameInput.setAttribute('required', true);
    }
  });

  // Основна валідація
  const validateForm = (data) => {
    const errors = [];

    if (!data.name) errors.push("Поле ім’я обов’язкове");
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Невірний email");
    if (data.phone && !/^\+?\d{9,15}$/.test(data.phone)) errors.push("Невірний телефон");
    if (data.birth_date && new Date(data.birth_date) > new Date()) errors.push("Дата народження не може бути в майбутньому");
    if (data.start_date && data.offer_date && new Date(data.offer_date) < new Date(data.start_date)) errors.push("Дата оферу не може бути раніше початку");

    return errors;
  };

  document.getElementById('studentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: existingName.value || nameInput.value.trim(),
      birth_date: document.getElementById('birth_date')?.value || null,
      phone: document.getElementById('phone')?.value || null,
      email: document.getElementById('email')?.value || null,
      start_date: document.getElementById('start_date')?.value || null,
      offer_date: document.getElementById('offer_date')?.value || null,
      mentor: mentorSelect.value,
      status: document.getElementById('status')?.value || null
    };

    const errors = validateForm(data);
    if (errors.length > 0) {
      alert("Помилки:\n" + errors.join('\n'));
      return;
    }

    try {
      const res = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (result.success) {
        alert('Успішно збережено!');
        document.getElementById('studentForm').reset();
        newNameBlock.style.display = 'block';
      } else {
        alert(`Помилка: ${result.error}`);
      }
    } catch (err) {
      console.error('Помилка надсилання:', err);
      alert('Не вдалося надіслати форму');
    }
  });
});