// js/services/vehicleService.js
import { allVehicles as mockVehicles } from '../data/vehicles.js';

// En el futuro, esta función podría obtener datos de una API real.
export async function getAllVehicles() {
    // Simula una llamada a API
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockVehicles);
        }, 100); // Simula un pequeño retraso de red
    });
}

export async function getVehicleById(id) {
    return new Promise(resolve => {
        const vehicle = mockVehicles.find(v => v.id === parseInt(id));
        setTimeout(() => {
            resolve(vehicle);
        }, 50);
    });
}

export async function getFeaturedVehicles(count = 3) {
    return new Promise(resolve => {
        const featured = mockVehicles.filter(v => v.estadoProceso === "LISTO_PARA_VENTA").slice(0, count);
        setTimeout(() => {
            resolve(featured);
        }, 80);
    });
}

export async function getInventoryVehicles() {
    // Por ahora, muestra todos los listos para venta por defecto en el inventario.
    // Podrías añadir lógica para paginación o filtros por defecto aquí si la API lo soportara.
    return new Promise(resolve => {
        const inventory = mockVehicles.filter(v => v.estadoProceso === "LISTO_PARA_VENTA");
        setTimeout(() => {
            resolve(inventory);
        }, 120);
    });
}