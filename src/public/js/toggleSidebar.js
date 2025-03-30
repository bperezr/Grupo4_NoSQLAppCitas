const toggleButton = document.querySelector('.header__btn');
const sidebar = document.querySelector('.sidebar');

function toggleSidebar() {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');

    const estadoSidebar = sidebar.classList.contains('close') ? 'closed' : 'open';
    localStorage.setItem('sidebarState', estadoSidebar);
}

window.addEventListener('DOMContentLoaded', () => {
    const estadoGuardado = localStorage.getItem('sidebarState');
    if (estadoGuardado === 'closed') {
        sidebar.classList.add('close');
        toggleButton.classList.add('rotate');
    } else {
        sidebar.classList.remove('close');
        toggleButton.classList.remove('rotate');
    }
});