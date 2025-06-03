// js/main.js
import { getFeaturedVehicles, getInventoryVehicles, getAllVehicles as fetchAllVehiclesData } from './services/vehicleService.js';
import { createVehicleCardHTML } from './components/vehicleCard.js';
import { displayVehicleDetail } from './components/vehicleDetail.js';
import { initNavigation, showSection } from './components/navigation.js';
import { populateFilters, initFilters, applyClientSideFilters, resetAllFilters } from './components/filters.js';
import { initForms } from './components/forms.js';
import { observeElementsForAnimation } from './utils/helpers.js';

const featuredVehiclesContainer = document.getElementById('featured-vehicles-grid');
const inventoryGridContainer = document.getElementById('inventory-grid');
const noResultsMessage = document.getElementById('no-results-message');
const heroSearchInput = document.getElementById('heroSearchInput');
const heroSearchButton = document.getElementById('heroSearchButton');
const inventorySearchInput = document.getElementById('inventorySearchInput');
const inventorySearchButton = document.getElementById('inventorySearchButton');
const clearInventorySearchButton = document.getElementById('clearInventorySearchButton');

let currentInventoryVehicles = []; // Almacena los vehículos actualmente mostrados en el inventario
let allVehiclesData = []; // Almacena todos los vehículos para búsquedas y filtros del lado del cliente


async function displayVehiclesInGrid(vehicles, container) {
    if (!container) return;
    container.innerHTML = '';
    const hasResults = vehicles && vehicles.length > 0;

    if (noResultsMessage) {
        noResultsMessage.classList.toggle('hidden', hasResults);
    }

    if (hasResults) {
        vehicles.forEach(vehicle => {
            container.innerHTML += createVehicleCardHTML(vehicle);
        });
    }
    observeElementsForAnimation(container);
}

async function loadFeaturedVehicles() {
    const featured = await getFeaturedVehicles(3); // Obtiene 3 destacados
    displayVehiclesInGrid(featured, featuredVehiclesContainer);
}

async function loadAndDisplayInventoryVehicles() {
    // Carga inicial de todos los vehículos para el filtro del lado del cliente.
    // Podrías optar por cargar solo los necesarios si la API soporta filtros potentes.
    if (allVehiclesData.length === 0) {
        allVehiclesData = await fetchAllVehiclesData();
    }

    let vehiclesToFilter = allVehiclesData;

    // Si hay una búsqueda activa en el inventario, aplica primero la búsqueda
    if (inventorySearchInput && inventorySearchInput.value.trim()) {
        const searchTerm = inventorySearchInput.value.toLowerCase().trim();
        vehiclesToFilter = allVehiclesData.filter(v => {
            const searchText = `${v.make} ${v.model} ${v.year} ${v.tipoCombustible || ''} ${v.transmission || ''}`.toLowerCase();
            return searchText.includes(searchTerm);
        });
    }

    // Aplica los filtros actuales a los datos cargados (o a los resultados de búsqueda)
    currentInventoryVehicles = applyClientSideFilters(vehiclesToFilter);
    displayVehiclesInGrid(currentInventoryVehicles, inventoryGridContainer);
}


function performHeroSearch() {
    const searchTerm = heroSearchInput.value.toLowerCase().trim();
    if (!searchTerm) {
        // Si la búsqueda está vacía, resetea filtros y muestra el inventario filtrado
        resetAllFilters(loadAndDisplayInventoryVehicles);
    } else {
        const results = allVehiclesData.filter(v =>
            `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(searchTerm)
        );
        currentInventoryVehicles = results; // Actualiza la lista de inventario actual
        displayVehiclesInGrid(results, inventoryGridContainer);
    }
    showSection('inventory');
}

function performInventorySearch() {
    const searchTerm = inventorySearchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        // Si la búsqueda está vacía, muestra todos los vehículos con filtros aplicados
        loadAndDisplayInventoryVehicles();
        return;
    }

    // Busca en todos los vehículos y luego aplica los filtros
    const searchResults = allVehiclesData.filter(v => {
        const searchText = `${v.make} ${v.model} ${v.year} ${v.tipoCombustible || ''} ${v.transmission || ''}`.toLowerCase();
        return searchText.includes(searchTerm);
    });
    
    // Aplica los filtros actuales a los resultados de búsqueda
    const filteredResults = applyClientSideFilters(searchResults);
    currentInventoryVehicles = filteredResults;
    displayVehiclesInGrid(filteredResults, inventoryGridContainer);
}

function clearInventorySearch() {
    if (inventorySearchInput) {
        inventorySearchInput.value = '';
    }
    // Recarga el inventario con filtros aplicados pero sin búsqueda
    loadAndDisplayInventoryVehicles();
}


// Inicialización de la Aplicación
document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initForms();

    await populateFilters(); // Popula filtros ANTES de inicializarlos y cargar el inventario
    initFilters(loadAndDisplayInventoryVehicles); // Pasa la función para recargar el inventario

    await loadFeaturedVehicles();
    await loadAndDisplayInventoryVehicles(); // Carga inicial del inventario

    observeElementsForAnimation(); // Observa elementos en secciones visibles inicialmente

    // Event Listeners para elementos creados dinámicamente (usando delegación)
    if (featuredVehiclesContainer) {
        featuredVehiclesContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.vehicle-card button[data-action="showDetail"]');
            if (button) {
                const vehicleId = button.dataset.id;
                displayVehicleDetail(vehicleId); // displayVehicleDetail se encarga de mostrar la sección
            }
        });
    }

    if (inventoryGridContainer) {
        inventoryGridContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.vehicle-card button[data-action="showDetail"]');
            if (button) {
                const vehicleId = button.dataset.id;
                displayVehicleDetail(vehicleId);
            }
        });
    }

    if (heroSearchButton) {
        heroSearchButton.addEventListener('click', performHeroSearch);
    }
    if (heroSearchInput) {
        heroSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performHeroSearch();
        });
    }

    // Event Listeners para búsqueda del inventario
    if (inventorySearchButton) {
        inventorySearchButton.addEventListener('click', performInventorySearch);
    }
    if (inventorySearchInput) {
        inventorySearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performInventorySearch();
        });
        // Búsqueda en tiempo real mientras escribe (opcional)
        inventorySearchInput.addEventListener('input', () => {
            // Retraso para evitar múltiples búsquedas mientras escribe
            clearTimeout(inventorySearchInput.searchTimeout);
            inventorySearchInput.searchTimeout = setTimeout(performInventorySearch, 300);
        });
    }
    if (clearInventorySearchButton) {
        clearInventorySearchButton.addEventListener('click', clearInventorySearch);
    }
});