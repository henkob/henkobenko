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
