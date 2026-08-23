const header = document.querySelector('[data-header]');
const menu = document.querySelector('[data-menu]');
const menuButton = document.querySelector('[data-menu-button]');

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
});

menu.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Öppna meny');
  }
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const bookingForm = document.querySelector('#booking-form');

if (bookingForm) {
  const fields = [...bookingForm.querySelectorAll('input:not([type="hidden"]), select, textarea')];
  const status = bookingForm.querySelector('.form-status');
  const success = bookingForm.querySelector('.form-success');
  const error = bookingForm.querySelector('.form-error');
  const submitButton = bookingForm.querySelector('.form-submit');

  const clearFieldError = (field) => {
    field.removeAttribute('aria-invalid');
    field.closest('.form-field')?.querySelector('.field-error')?.remove();
  };

  const setFieldError = (field, message) => {
    clearFieldError(field);
    field.setAttribute('aria-invalid', 'true');
    const fieldError = document.createElement('p');
    fieldError.className = 'field-error';
    fieldError.textContent = message;
    field.closest('.form-field')?.appendChild(fieldError);
  };

  const validate = () => {
    let firstInvalidField = null;
    fields.forEach((field) => {
      clearFieldError(field);
      let message = '';
      if (field.required && !String(field.value || '').trim()) message = 'Fyll i det här fältet.';
      else if (field.type === 'email' && field.value && !field.validity.valid) message = 'Ange en giltig e-postadress.';
      if (message) {
        setFieldError(field, message);
        if (!firstInvalidField) firstInvalidField = field;
      }
    });
    firstInvalidField?.focus();
    return !firstInvalidField;
  };

  fields.forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });

  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    success.hidden = true;
    error.hidden = true;
    if (!validate()) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Skickar…';
    try {
      const response = await fetch(bookingForm.action, { method: 'POST', body: new FormData(bookingForm), headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Formuläret kunde inte skickas');
      bookingForm.reset();
      success.hidden = false;
    } catch (formError) {
      error.hidden = false;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Skicka förfrågan';
      status.focus({ preventScroll: true });
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}
