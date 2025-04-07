document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('studentForm');
  const mentorSelect = document.getElementById('mentor');
  const existingName = document.getElementById('existingName');
  const newNameBlock = document.getElementById('newNameBlock');
  const nameInput = document.getElementById('name');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Автофокус на перше поле
  nameInput.focus();

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

  // Завантажити існуючих студентів
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
      nameInput.focus();
    }
  });

  // Валідація в реальному часі
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
  });

  const validateForm = (data) => {
    const errors = [];

    if (!data.name) {
      errors.push({ field: 'name', message: "Ім’я обов’язкове" });
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push({ field: 'email', message: "Невірний формат email" });
    }

    if (data.phone && !/^\+?\d{9,15}$/.test(data.phone)) {
      errors.push({ field: 'phone', message: "Телефон має містити 9–15 цифр" });
    }

    if (data.birth_date && new Date(data.birth_date) > new Date()) {
      errors.push({ field: 'birth_date', message: "Дата народження не може бути в майбутньому" });
    }

    if (data.start_date && data.offer_date &&
        new Date(data.offer_date) < new Date(data.start_date)) {
      errors.push({ field: 'offer_date', message: "Офер не може бути раніше початку навчання" });
    }

    return errors;
  };

  form.addEventListener('submit', async (e) => {
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

    // Очистити попередні помилки
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    const errors = validateForm(data);
    if (errors.length > 0) {
      errors.forEach(({ field }) => {
        const el = document.getElementById(field);
        if (el) el.classList.add('invalid');
      });

      alert("Будь ласка, виправ помилки у формі");
      return;
    }

    // UI-зміни кнопки
    submitBtn.disabled = true;
    submitBtn.textContent = "Збереження...";

    try {
      const res = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (result.success) {
        alert('Успішно збережено!');
        form.reset();
        newNameBlock.style.display = 'block';
        nameInput.focus();
      } else {
        alert(`Помилка: ${result.error}`);
      }

    } catch (err) {
      console.error('Помилка надсилання:', err);
      alert('Не вдалося надіслати форму');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Надіслати";
  });
});

document.querySelectorAll('input[type="date"]').forEach(input => {
  input.addEventListener('click', () => input.showPicker?.());
});