// js/components/forms.js

export function initForms() {
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentSubmissionMessage = document.getElementById('appointment-submission-message');
    const appointmentDateInput = document.getElementById('appointment-date');

    const generalContactForm = document.getElementById('contact-form-general');
    const generalFormSubmissionMessage = document.getElementById('general-form-submission-message');

    if (appointmentDateInput) {
        appointmentDateInput.min = new Date().toISOString().split("T")[0];
    }

    if (appointmentForm && appointmentSubmissionMessage) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appointmentSubmissionMessage.innerHTML = '<p class="text-green-600 font-semibold text-lg">¡Cita solicitada con éxito! Nos pondremos en contacto contigo a la brevedad para confirmar todos los detalles.</p>';
            appointmentForm.reset();
            if (appointmentDateInput) {
                appointmentDateInput.min = new Date().toISOString().split("T")[0];
            }
            setTimeout(() => { appointmentSubmissionMessage.innerHTML = ''; }, 7000);
        });
    }

    if (generalContactForm && generalFormSubmissionMessage) {
        generalContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            generalFormSubmissionMessage.innerHTML = '<p class="text-green-600 font-semibold text-lg">¡Mensaje Enviado! Gracias por contactarnos, te responderemos pronto.</p>';
            generalContactForm.reset();
            setTimeout(() => { generalFormSubmissionMessage.innerHTML = ''; }, 7000);
        });
    }
}