// js/components/navigation.js
import { observeElementsForAnimation } from '../utils/helpers.js';

const header = document.getElementById('header');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link'); // Incluye los del menú móvil también
const mainSections = document.querySelectorAll('main > section');

let lastActiveSectionId = 'home';
const navThreshold = 50;
// Almacena posiciones de scroll para cada sección
const scrollPositions = {};

export function updateNavbarState() {
    if (!header) return;
    const homeSection = document.getElementById('home');
    let isHomeSectionVisible = homeSection ? !homeSection.classList.contains('hidden') : false;
    const isAtTop = window.scrollY <= navThreshold;

    if (isAtTop && isHomeSectionVisible) {
        header.classList.remove('scrolled-nav');
        header.classList.add('transparent-nav');
    } else {
        header.classList.add('scrolled-nav');
        header.classList.remove('transparent-nav');
    }
}

export function showSection(sectionIdToShow, updateHistory = true, restoreScroll = false) {
    const currentActive = Array.from(mainSections).find(s => !s.classList.contains('hidden'));
    if (currentActive) {
        // Guarda la posición de scroll antes de cambiar sección
        scrollPositions[currentActive.id] = window.scrollY;
        lastActiveSectionId = currentActive.id;
    }

    mainSections.forEach(section => {
        section.classList.add('hidden');
    });

    const targetSection = document.getElementById(sectionIdToShow);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        if (updateHistory) {
            window.location.hash = `#${sectionIdToShow}`;
        }
        // Si restoreScroll es true, restaura la posición guardada; si no, va al top
        const scrollPosition = restoreScroll && scrollPositions[sectionIdToShow] !== undefined 
            ? scrollPositions[sectionIdToShow] 
            : 0;
        window.scrollTo(0, scrollPosition);
        observeElementsForAnimation(targetSection);
    } else {
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.classList.remove('hidden');
            if (updateHistory) window.location.hash = '#home';
            const homeScrollPosition = restoreScroll && scrollPositions['home'] !== undefined 
                ? scrollPositions['home'] 
                : 0;
            window.scrollTo(0, homeScrollPosition);
            observeElementsForAnimation(homeSection);
        }
    }
    updateActiveNavLinkUI(sectionIdToShow);
    updateNavbarState(); // Actualiza el estado de la navbar cada vez que se cambia de sección
}

export function getLastActiveSectionId() {
    return lastActiveSectionId;
}

function updateActiveNavLinkUI(activeSectionId) {
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${activeSectionId}`) {
            link.classList.add('active-nav');
        } else {
            link.classList.remove('active-nav');
        }
    });
}

export function initNavigation() {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Botones "Reservar Visita" en la navbar
    const navReserveBtn = document.getElementById('nav-reserve-visit-btn');
    const mobileReserveBtn = document.getElementById('mobile-reserve-visit-btn');
    if (navReserveBtn) navReserveBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('agendar-cita'); });
    if (mobileReserveBtn) mobileReserveBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('agendar-cita'); if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden'); });


    // Links en Hero y "Ver todo el inventario"
    const heroViewInventoryBtn = document.getElementById('hero-view-inventory-btn');
    const heroLearnProcessBtn = document.getElementById('hero-learn-process-btn');
    const viewAllInventoryLink = document.getElementById('view-all-inventory-link');

    if (heroViewInventoryBtn) heroViewInventoryBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('inventory'); });
    if (heroLearnProcessBtn) heroLearnProcessBtn.addEventListener('click', (e) => { e.preventDefault(); showSection('how-we-work'); });
    if (viewAllInventoryLink) viewAllInventoryLink.addEventListener('click', (e) => { e.preventDefault(); showSection('inventory'); });


    // Botón de volver en detalles del vehículo
    const backToInventoryButton = document.getElementById('back-to-inventory-button');
    if (backToInventoryButton) {
        backToInventoryButton.addEventListener('click', () => {
            showSection(getLastActiveSectionId() || 'inventory', true, true);
        });
    }


    window.addEventListener('scroll', updateNavbarState);
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showSection(hash, false); // No actualices el hash de nuevo
        } else {
            showSection('home', false);
        }
    });

    // Carga inicial de sección basada en Hash o default a 'home'
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showSection(initialHash, false);
    } else {
        showSection('home', false);
    }
    updateNavbarState(); // Llama una vez al cargar para setear estado inicial de navbar
}