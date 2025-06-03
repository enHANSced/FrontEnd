// js/components/filters.js
import { getAllVehicles } from '../services/vehicleService.js'; // Para obtener rangos de precios, marcas, etc.
import { formatPrice } from '../utils/helpers.js';

const filterMake = document.getElementById('filter-make');
const filterYear = document.getElementById('filter-year');
const filterFuel = document.getElementById('filter-fuel');
const filterCondition = document.getElementById('filter-condition');
const filterPriceRange = document.getElementById('filter-price-range');
const filterPriceValue = document.getElementById('filter-price-value');
const applyFiltersButton = document.getElementById('apply-filters-button');
const resetFiltersButton = document.getElementById('reset-filters-button');

let allLocalVehicles = []; // Almacenará los vehículos para filtrar del lado del cliente

export async function populateFilters() {
    allLocalVehicles = await getAllVehicles(); // Carga todos para extraer opciones

    if (filterMake) {
        const makes = [...new Set(allLocalVehicles.map(v => v.make))].sort();
        filterMake.innerHTML = '<option value="">Todas</option>'; // Reset
        makes.forEach(make => filterMake.innerHTML += `<option value="${make}">${make}</option>`);
    }
    if (filterYear) {
        const years = [...new Set(allLocalVehicles.map(v => v.year))].sort((a, b) => b - a);
        filterYear.innerHTML = '<option value="">Todos</option>'; // Reset
        years.forEach(year => filterYear.innerHTML += `<option value="${year}">${year}</option>`);
    }
    if (filterFuel) {
        const fuels = [...new Set(allLocalVehicles.map(v => v.tipoCombustible).filter(Boolean))].sort();
        filterFuel.innerHTML = '<option value="">Todos</option>'; // Reset
        fuels.forEach(fuel => filterFuel.innerHTML += `<option value="${fuel}">${fuel}</option>`);
    }
    // filterCondition ya tiene opciones estáticas en HTML

    if (filterPriceRange && filterPriceValue) {
        const prices = allLocalVehicles.map(v => v.price).filter(Boolean);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 100000;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 2000000;
        filterPriceRange.min = minPrice;
        filterPriceRange.max = maxPrice;
        filterPriceRange.value = maxPrice;
        filterPriceValue.textContent = formatPrice(maxPrice);
    }
}

export function getAppliedFilters() {
    return {
        make: filterMake ? filterMake.value : "",
        year: filterYear ? (filterYear.value ? parseInt(filterYear.value) : "") : "",
        fuel: filterFuel ? filterFuel.value : "",
        condition: filterCondition ? filterCondition.value : "",
        maxPrice: filterPriceRange ? parseInt(filterPriceRange.value) : Infinity
    };
}

export function applyClientSideFilters(vehicles) {
    const filters = getAppliedFilters();
    return vehicles.filter(v =>
        (filters.make ? v.make === filters.make : true) &&
        (filters.year ? v.year === filters.year : true) &&
        (filters.fuel ? v.tipoCombustible === filters.fuel : true) &&
        (filters.condition ? v.estadoProceso === filters.condition : true) &&
        (v.price <= filters.maxPrice)
    );
}

export function resetAllFilters(callbackDisplayVehicles) {
    if (filterMake) filterMake.value = "";
    if (filterYear) filterYear.value = "";
    if (filterFuel) filterFuel.value = "";
    if (filterCondition) filterCondition.value = "";
    if (filterPriceRange && allLocalVehicles.length > 0) {
        const prices = allLocalVehicles.map(v => v.price).filter(Boolean);
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 2000000;
        filterPriceRange.value = maxPrice;
        if (filterPriceValue) filterPriceValue.textContent = formatPrice(maxPrice);
    } else if (filterPriceRange) { // Fallback si no hay vehículos cargados aún
        filterPriceRange.value = filterPriceRange.max;
        if (filterPriceValue) filterPriceValue.textContent = formatPrice(parseInt(filterPriceRange.max));
    }
    
    // También limpia la búsqueda del inventario si existe
    const inventorySearchInput = document.getElementById('inventorySearchInput');
    if (inventorySearchInput) {
        inventorySearchInput.value = '';
    }
    
    // Llama a la función para volver a mostrar los vehículos (probablemente todos o un conjunto por defecto)
    if (callbackDisplayVehicles) callbackDisplayVehicles();
}


export function initFilters(callbackDisplayVehicles) {
    if (filterPriceRange && filterPriceValue) {
        filterPriceRange.addEventListener('input', (e) => {
            filterPriceValue.textContent = formatPrice(parseInt(e.target.value));
        });
    }
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', () => {
            if (callbackDisplayVehicles) callbackDisplayVehicles();
        });
    }
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', () => resetAllFilters(callbackDisplayVehicles));
    }
}