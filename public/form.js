document.addEventListener('DOMContentLoaded', async () => {
    const mentorSelect = document.getElementById('mentor');
  
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
  
    // Логіка показу / приховування поля ім’я
    const existingName = document.getElementById('existingName');
    const newNameBlock = document.getElementById('newNameBlock');
    const nameInput = document.getElementById('name');
  
    existingName.addEventListener('change', () => {
      if (existingName.value) {
        newNameBlock.style.display = 'none';
        nameInput.removeAttribute('required');
      } else {
        newNameBlock.style.display = 'block';
        nameInput.setAttribute('required', true);
      }
    });
  
    // Обробка форми
    document.getElementById('studentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const data = {
        name: existingName.value || nameInput.value,
        birth_date: document.getElementById('birth_date')?.value || null,
        phone: document.getElementById('phone')?.value || null,
        email: document.getElementById('email')?.value || null,
        start_date: document.getElementById('start_date')?.value || null,
        offer_date: document.getElementById('offer_date')?.value || null,
        mentor: mentorSelect.value,
        status: document.getElementById('status')?.value || null
      };
  
      try {
        const res = await fetch('/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
  
        const result = await res.json();
        alert(result.success ? 'Успішно збережено!' : `Помилка: ${result.error}`);
      } catch (err) {
        console.error('Помилка надсилання:', err);
        alert('Не вдалося надіслати форму');
      }
    });

    if (result.success) {
        alert('Успішно збережено!');
        document.getElementById('studentForm').reset();
        newNameBlock.style.display = 'block'; // Показати поле нового імені знову
      } else {
        alert(`Помилка: ${result.error}`);
      }
      
  });  