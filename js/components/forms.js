// js/components/forms.js

export function initForms() {
    const appointmentForm = document.getElementById('appointment-form');
    const appointmentSubmissionMessage = document.getElementById('appointment-submission-message');
    const appointmentDateInput = document.getElementById('appointment-date');

    const generalContactForm = document.getElementById('contact-form-general');
    const generalFormSubmissionMessage = document.getElementById('general-form-submission-message');

    const cambiarAutoForm = document.getElementById('cambiar-auto-form');
    const cambiarAutoMensaje = document.getElementById('cambiar-auto-mensaje');

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

    if (cambiarAutoForm && cambiarAutoMensaje) {
        cambiarAutoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Validación de archivos (máximo 5 fotos, cada una <= 5MB)
            const fotosInput = document.getElementById('cambiar-fotos');
            if (fotosInput && fotosInput.files.length > 5) {
                cambiarAutoMensaje.innerHTML = '<p class="text-red-600 font-semibold text-lg">Solo puedes subir hasta 5 fotos.</p>';
                setTimeout(() => { cambiarAutoMensaje.innerHTML = ''; }, 7000);
                return;
            }
            if (fotosInput) {
                for (let i = 0; i < fotosInput.files.length; i++) {
                    if (fotosInput.files[i].size > 5 * 1024 * 1024) {
                        cambiarAutoMensaje.innerHTML = '<p class="text-red-600 font-semibold text-lg">Cada foto debe pesar máximo 5MB.</p>';
                        setTimeout(() => { cambiarAutoMensaje.innerHTML = ''; }, 7000);
                        return;
                    }
                }
            }
            cambiarAutoMensaje.innerHTML = '<p class="text-green-600 font-semibold text-lg">¡Solicitud enviada! Nos pondremos en contacto contigo para cotizar el cambio de tu auto.</p>';
            cambiarAutoForm.reset();
            setTimeout(() => { cambiarAutoMensaje.innerHTML = ''; }, 7000);
        });
    }
}