// js/utils/helpers.js
export function formatPrice(price) {
    return `LPS ${new Intl.NumberFormat('es-HN').format(price)}`;
}

export function getEstadoProcesoLabel(estado) {
    const labels = {
        "LISTO_PARA_VENTA": "Listo para Venta",
        "EN_REPARACION": "En Reparación",
        "EN_TRANSITO": "En Tránsito",
        "EN_DIAGNOSTICO": "En Diagnóstico",
        "VENDIDO": "Vendido"
    };
    return labels[estado] || estado;
}

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};
const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

export function observeElementsForAnimation(parentElement = document) {
    const elementsToAnimate = parentElement.querySelectorAll('.reveal-on-scroll');
    elementsToAnimate.forEach(el => scrollObserver.observe(el));
}