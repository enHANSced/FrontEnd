// js/components/vehicleDetail.js
import { getVehicleById } from '../services/vehicleService.js';
import { fetchGeminiMaintenance, fetchGeminiQuestions } from '../services/geminiService.js';
import { formatPrice, getEstadoProcesoLabel, observeElementsForAnimation } from '../utils/helpers.js';
import { showSection } from './navigation.js'; // Para el botón de agendar cita

const vehicleDetailContent = document.getElementById('vehicle-detail-content');
const appointmentVehicleInterest = document.getElementById('appointment-vehicle-interest');


function updateMainImage(newSrcBase, vehicleMake, vehicleModel) {
    const mainImage = document.getElementById('mainVehicleImage');
    if (mainImage) {
        // Intenta construir la URL de la imagen grande
        mainImage.src = newSrcBase.includes('placehold.co') ? newSrcBase.replace('200x150', '800x600') : newSrcBase;
    }

    document.querySelectorAll('.detail-thumbnail').forEach(thumb => thumb.classList.remove('active-thumbnail'));
    // Encontrar la miniatura clickeada (esto puede ser más robusto con data-attributes en las miniaturas)
    const allThumbs = Array.from(document.querySelectorAll('.detail-thumbnail'));
    const clickedThumb = allThumbs.find(thumb => thumb.dataset.fullsrc === newSrcBase); // Usar un data-attribute
    if (clickedThumb) clickedThumb.classList.add('active-thumbnail');
}


function showLargeImage(src) {
    // Aquí implementarías un modal para mostrar la imagen grande
    alert(`Simulación: Mostrando imagen grande: ${src}`);
}

function prefillAppointmentForm(vehicleName) {
    if (appointmentVehicleInterest) {
        appointmentVehicleInterest.value = vehicleName;
    }
    showSection('agendar-cita'); // Asegúrate que navigation.js maneje bien el scroll y active nav
}

export async function displayVehicleDetail(vehicleId) {
    const vehicle = await getVehicleById(vehicleId);
    if (!vehicle || !vehicleDetailContent) {
        vehicleDetailContent.innerHTML = '<p class="text-red-500 text-center col-span-full">Vehículo no encontrado o error al cargar detalles.</p>';
        return;
    }

    let fotosAntesHtml = '';
    if (vehicle.fotosAntesReparacion && vehicle.fotosAntesReparacion.length > 0) {
        fotosAntesHtml = `
            <div class="mt-4 pt-4 border-t border-slate-200">
                <h5 class="text-lg font-semibold text-slate-700 mb-2">Fotos Antes de Reparación:</h5>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    ${vehicle.fotosAntesReparacion.map(fotoUrl => `<img src="${fotoUrl}" alt="Foto antes de reparación" class="rounded-md shadow-sm w-full h-auto object-cover cursor-pointer photo-before">`).join('')}
                </div>
            </div>`;
    }

    const placeholderImage = 'https://placehold.co/800x600/cbd5e1/475569?text=Imagen+Principal+No+Disponible&font=Montserrat';
    const mainImageSrc = vehicle.image ? vehicle.image.replace('600x400', '800x600') : placeholderImage;

    // Miniaturas de ejemplo (podrías tener un array de imágenes en tus datos)
    const thumbnailsData = [
        { small: vehicle.image ? vehicle.image.replace('?text=', '?text=Vista+Principal+').replace('600x400', '200x150') : 'https://placehold.co/200x150/cbd5e1/475569?text=Thumb1', full: vehicle.image ? vehicle.image.replace('600x400', '800x600') : placeholderImage },
        { small: vehicle.image ? vehicle.image.replace('?text=', '?text=Interior+').replace('600x400', '200x150') : 'https://placehold.co/200x150/cbd5e1/475569?text=Thumb2', full: vehicle.image ? vehicle.image.replace('?text=', '?text=Interior+Grande+').replace('600x400', '800x600') : placeholderImage },
        { small: vehicle.image ? vehicle.image.replace('?text=', '?text=Motor+').replace('600x400', '200x150') : 'https://placehold.co/200x150/cbd5e1/475569?text=Thumb3', full: vehicle.image ? vehicle.image.replace('?text=', '?text=Motor+Grande+').replace('600x400', '800x600') : placeholderImage },
        { small: vehicle.image ? vehicle.image.replace('?text=', '?text=Trasera+').replace('600x400', '200x150') : 'https://placehold.co/200x150/cbd5e1/475569?text=Thumb4', full: vehicle.image ? vehicle.image.replace('?text=', '?text=Trasera+Grande+').replace('600x400', '800x600') : placeholderImage },
    ];

    let thumbnailsHtml = `
        <div class="grid grid-cols-4 gap-2 mb-6">
            ${thumbnailsData.map((thumb, index) => `
                <img src="${thumb.small}" 
                     data-fullsrc="${thumb.full}" 
                     alt="Miniatura ${index + 1} de ${vehicle.make} ${vehicle.model}" 
                     class="detail-thumbnail rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity w-full h-auto object-cover ${index === 0 ? 'active-thumbnail' : ''}">
            `).join('')}
        </div>`;

    vehicleDetailContent.innerHTML = `
        <div class="lg:col-span-3 reveal-on-scroll content-item">
            <img id="mainVehicleImage" src="${mainImageSrc}" alt="${vehicle.make} ${vehicle.model}" class="w-full h-auto rounded-xl shadow-2xl object-cover mb-4">
            ${thumbnailsHtml}
            <div class="flex space-x-4 mt-4 mb-6">
                <button id="sim-360-btn" class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> Vista 360° (Simulada)
                </button>
                <button id="sim-engine-video-btn" class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Video Encendido (Simulado)
                </button>
            </div>
             <div class="mt-8 space-y-4">
                <button id="gemini-maintenance-btn" class="w-full btn-gemini flex items-center justify-center">
                    <span class="mr-2">✨</span> Sugerencias de Mantenimiento
                </button>
                <div id="gemini-maintenance-output" class="gemini-output hidden"></div>
                <button id="gemini-questions-btn" class="w-full btn-gemini flex items-center justify-center">
                    <span class="mr-2">✨</span> ¿Qué Preguntar sobre este Auto?
                </button>
                <div id="gemini-questions-output" class="gemini-output hidden"></div>
            </div>
        </div>
        <div class="lg:col-span-2 space-y-5 reveal-on-scroll content-item" style="transition-delay: 0.2s;">
            <h2 class="text-4xl sm:text-5xl font-bold montserrat text-slate-900">${vehicle.make} ${vehicle.model} <span class="text-3xl text-slate-500">(${vehicle.year})</span></h2>
            <p class="text-4xl font-bold text-sky-700">${formatPrice(vehicle.price)}</p>
            <div class="flex flex-wrap gap-2">
                <span class="inline-block bg-sky-100 text-sky-700 text-md font-semibold px-3 py-1 rounded-full">${getEstadoProcesoLabel(vehicle.estadoProceso)}</span>
                <span class="inline-block bg-slate-200 text-slate-700 text-md font-semibold px-3 py-1 rounded-full">${vehicle.statusTag || ''}</span>
            </div>
            
            <div class="pt-4 border-t border-slate-200">
                <h4 class="text-xl font-semibold text-slate-800 mb-2">Información Clave:</h4>
                <ul class="list-none text-slate-600 space-y-1.5 text-md">
                    <li><strong>VIN:</strong> ${vehicle.vin || 'N/A'}</li>
                    <li><strong>Fecha Compra Empresa:</strong> ${vehicle.fechaCompra || 'N/A'}</li>
                    <li><strong>Ubicación Actual:</strong> ${vehicle.ubicacionActual || 'Consultar'}</li>
                    <li><strong>Motor:</strong> ${vehicle.engine || 'N/A'} (${vehicle.cilindraje || 'N/A'})</li>
                    <li><strong>Combustible:</strong> ${vehicle.tipoCombustible || 'N/A'}</li>
                    <li><strong>Transmisión:</strong> ${vehicle.transmission || 'N/A'}</li>
                    <li><strong>Tracción:</strong> ${vehicle.drivetrain || 'N/A'}</li>
                    <li><strong>Kilometraje:</strong> ${vehicle.mileage ? vehicle.mileage.toLocaleString('es-HN') : 'N/A'} km</li>
                    <li><strong>¿Funciona y se conduce (Run & Drive)?:</strong> ${vehicle.esRunAndDrive ? 'Sí' : 'No'}</li>
                    <li><strong>¿Incluye servicio de grúa?:</strong> ${vehicle.incluyeGrua ? 'Sí' : 'No'}</li>
                </ul>
            </div>
            
            <div class="pt-4 border-t border-slate-200">
                <h4 class="text-xl font-semibold text-slate-800 mb-2">Características Destacadas:</h4>
                <ul class="list-disc list-inside text-slate-600 space-y-1 text-md pl-5">
                    ${(vehicle.features && vehicle.features.length > 0) ? vehicle.features.map(feature => `<li>${feature}</li>`).join('') : '<li>Características no especificadas.</li>'}
                </ul>
            </div>
            
            <div class="pt-4 border-t border-slate-200 bg-slate-50 p-5 rounded-xl shadow-inner">
                <h4 class="text-xl font-semibold text-slate-800 mb-2">Historial y Transparencia:</h4>
                <p class="text-slate-600 mb-1 text-md"><strong class="font-medium">Origen del Daño:</strong> ${vehicle.origenDano || 'No especificado'}</p>
                <p class="text-slate-600 mb-1 text-md"><strong class="font-medium">Detalle Adquisición:</strong> ${vehicle.history || 'No especificado'}</p>
                <p class="text-slate-600 text-md"><strong class="font-medium">Reparaciones Clave Realizadas:</strong> ${vehicle.repairs || 'No especificado'}</p>
                ${fotosAntesHtml}
            </div>
             <div class="pt-4 border-t border-slate-200">
                <h4 class="text-xl font-semibold text-slate-800 mb-2">Garantía:</h4>
                <p class="text-slate-600 text-md">${vehicle.terminosGarantia || 'Consultar términos y condiciones de garantía.'}</p>
            </div>
            <button id="detail-agendar-cita-btn" class="mt-6 w-full block text-center btn-primary text-lg">Me Interesa, Agendar Visita</button>
        </div>
    `;
    observeElementsForAnimation(vehicleDetailContent);
    attachDetailEventListeners(vehicle);
    // Mostrar la sección de detalles del vehículo
    showSection('vehicle-detail-section');
}

function attachDetailEventListeners(vehicle) {
    // Thumbnails
    vehicleDetailContent.querySelectorAll('.detail-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => updateMainImage(thumb.dataset.fullsrc, vehicle.make, vehicle.model));
    });

    // Fotos Antes (Modal Simulation)
    vehicleDetailContent.querySelectorAll('.photo-before').forEach(img => {
        img.addEventListener('click', () => showLargeImage(img.src));
    });

    // Botones Simulación 360 y Video
    const sim360Btn = document.getElementById('sim-360-btn');
    const simEngineVideoBtn = document.getElementById('sim-engine-video-btn');
    if (sim360Btn) sim360Btn.addEventListener('click', () => alert(`Simulación: Mostrando vista 360 del vehículo ${vehicle.make} ${vehicle.model}.`));
    if (simEngineVideoBtn) simEngineVideoBtn.addEventListener('click', () => alert(`Simulación: Reproduciendo video de encendido del motor para ${vehicle.make} ${vehicle.model}.`));


    // Botones Gemini
    const geminiMaintenanceBtn = document.getElementById('gemini-maintenance-btn');
    const geminiQuestionsBtn = document.getElementById('gemini-questions-btn');
    const geminiMaintenanceOutput = document.getElementById('gemini-maintenance-output');
    const geminiQuestionsOutput = document.getElementById('gemini-questions-output');

    if (geminiMaintenanceBtn && geminiMaintenanceOutput) {
        geminiMaintenanceBtn.addEventListener('click', async () => {
            geminiMaintenanceOutput.classList.remove('hidden');
            geminiMaintenanceOutput.innerHTML = '<p class="text-center animate-pulse">Generando sugerencias...</p>';
            geminiMaintenanceBtn.disabled = true;
            const suggestions = await fetchGeminiMaintenance(vehicle);
            geminiMaintenanceOutput.innerHTML = suggestions;
            geminiMaintenanceBtn.disabled = false;
        });
    }

    if (geminiQuestionsBtn && geminiQuestionsOutput) {
        geminiQuestionsBtn.addEventListener('click', async () => {
            geminiQuestionsOutput.classList.remove('hidden');
            geminiQuestionsOutput.innerHTML = '<p class="text-center animate-pulse">Generando preguntas...</p>';
            geminiQuestionsBtn.disabled = true;
            const questions = await fetchGeminiQuestions(vehicle);
            geminiQuestionsOutput.innerHTML = questions;
            geminiQuestionsBtn.disabled = false;
        });
    }

    // Botón "Me interesa, Agendar Visita"
    const agendarCitaBtn = document.getElementById('detail-agendar-cita-btn');
    if (agendarCitaBtn) {
        agendarCitaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prefillAppointmentForm(`${vehicle.make} ${vehicle.model} ${vehicle.year}`);
        });
    }

    // Botón Volver en detalle de vehículo
    const backBtn = document.getElementById('back-to-inventory-button');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('inventory', true, true);
        });
    }
}