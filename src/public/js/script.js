const hamburger = document.getElementById('hamburger');
const linksNav = document.getElementById('linksNav');

hamburger.addEventListener('click', () => {
    if (linksNav.style.display === 'flex' || linksNav.style.display === 'block') {
        linksNav.style.display = 'none';
    } else {
        linksNav.style.display = 'block';
    }
});