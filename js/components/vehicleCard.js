// js/components/vehicleCard.js
import { formatPrice, getEstadoProcesoLabel } from '../utils/helpers.js';

export function createVehicleCardHTML(vehicle) {
    if (!vehicle) return '';

    let estadoProcesoHTML = '';
    if (vehicle.estadoProceso) {
        let bgColor = 'bg-sky-100';
        let textColor = 'text-sky-700';
        if (vehicle.estadoProceso === 'EN_REPARACION') { bgColor = 'bg-amber-100'; textColor = 'text-amber-700'; }
        else if (vehicle.estadoProceso === 'EN_TRANSITO') { bgColor = 'bg-indigo-100'; textColor = 'text-indigo-700'; }
        estadoProcesoHTML = `<span class="inline-block ${bgColor} ${textColor} text-xs font-semibold px-2.5 py-1 rounded-full mb-2 self-start">${getEstadoProcesoLabel(vehicle.estadoProceso)}</span>`;
    }

    const placeholderImage = 'https://placehold.co/600x400/cbd5e1/475569?text=Imagen+No+Disponible&font=Montserrat';
    const imageSrc = vehicle.image || placeholderImage;

    return `
        <div class="vehicle-card bg-white rounded-xl shadow-xl overflow-hidden flex flex-col card-hover reveal-on-scroll content-item">
            <div class="relative group">
                <img src="${imageSrc}" alt="${vehicle.make || 'Vehículo'} ${vehicle.model || ''}" class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105">
                <span class="absolute top-3 right-3 bg-sky-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">${vehicle.year || 'N/A'}</span>
                ${vehicle.estadoProceso === 'LISTO_PARA_VENTA' ? `<span class="absolute top-3 left-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">Disponible</span>` : ''}
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-2xl font-bold montserrat text-slate-800 mb-1">${vehicle.make || 'Vehículo'} ${vehicle.model || ''}</h3>
                ${estadoProcesoHTML}
                ${vehicle.statusTag ? `<span class="inline-block bg-slate-200 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 self-start">${vehicle.statusTag}</span>` : ''}
                <p class="text-sm text-slate-600 mb-4 flex-grow">${vehicle.shortDescription || 'Descripción no disponible.'}</p>
                <div class="flex justify-between items-center mb-4 text-sm text-slate-500">
                    <span><svg class="w-4 h-4 inline mr-1 align-middle text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>${vehicle.mileage ? vehicle.mileage.toLocaleString('es-HN') : 'N/A'} km</span>
                    <span><svg class="w-4 h-4 inline mr-1 align-middle text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path></svg>${vehicle.transmission || 'N/A'}</span>
                </div>
                <p class="text-3xl font-bold text-sky-700 mb-5">${vehicle.price ? formatPrice(vehicle.price) : 'Precio a Consultar'}</p>
                <button data-action="showDetail" data-id="${vehicle.id}" class="mt-auto w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-md shadow-md hover:shadow-lg transform hover:scale-105">
                    Ver Detalles
                </button>
            </div>
        </div>
    `;
}