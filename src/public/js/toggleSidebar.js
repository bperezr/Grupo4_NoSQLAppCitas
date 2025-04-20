document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.querySelector('.menu-toggle-unificado');
    const sidebar = document.querySelector('.sidebar');

    function toggleSidebar() {
        sidebar.classList.toggle('close');
        toggleButton.classList.toggle('rotate');

        const estadoSidebar = sidebar.classList.contains('close') ? 'closed' : 'open';
        localStorage.setItem('sidebarState', estadoSidebar);
    }

    function abrirMenu() {
        sidebar.classList.add('abierta');
    }

    function cerrarMenu() {
        sidebar.classList.remove('abierta');
    }

    function handleMenuToggle() {
        if (window.innerWidth <= 768) {
            abrirMenu();
        } else {
            toggleSidebar();
        }
    }

    window.handleMenuToggle = handleMenuToggle;
    window.abrirMenu = abrirMenu;
    window.cerrarMenu = cerrarMenu;

    const estadoGuardado = localStorage.getItem('sidebarState');
    if (window.innerWidth > 768) {
        if (estadoGuardado === 'closed') {
            sidebar.classList.add('close');
            toggleButton.classList.add('rotate');
        } else {
            sidebar.classList.remove('close');
            toggleButton.classList.remove('rotate');
        }
    }

    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('abierta') &&
            !sidebar.contains(e.target) &&
            !toggleButton.contains(e.target)) {
            cerrarMenu();
        }
    });
});
