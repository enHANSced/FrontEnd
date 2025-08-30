// js/services/geminiService.js
const GEMINI_API_KEY = ""; // Tu clave API de Gemini (¡Mantén esto seguro y no lo subas a repositorios públicos!)
const API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

async function callGeminiAPI(prompt) {
    if (!GEMINI_API_KEY) {
        console.error("Gemini API Key no está configurada.");
        return "Servicio de IA no disponible: Clave API no configurada.";
    }




    
    const apiUrl = `${API_URL_TEMPLATE}${GEMINI_API_KEY}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error de API Gemini:", errorData);
            throw new Error(`Error de API: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`);
        }
        const result = await response.json();
        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts[0].text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Respuesta inesperada de Gemini API:", result);
            return "No se pudo obtener una respuesta válida del servicio de IA.";
        }
    } catch (error) {
        console.error("Error llamando a Gemini API:", error);
        return `Error al contactar el servicio de IA: ${error.message}`;
    }
}

export async function fetchGeminiMaintenance(vehicle) {
    if (!vehicle) return "Información del vehículo no proporcionada.";
    const prompt = `Proporciona una lista breve (3-5 puntos) de sugerencias clave de mantenimiento preventivo para un ${vehicle.make} ${vehicle.model} año ${vehicle.year} con ${vehicle.mileage} km. Enfócate en lo más relevante para este tipo de vehículo y su uso. Formato: lista de viñetas (usando '*' o '-').`;
    const suggestions = await callGeminiAPI(prompt);
    return suggestions.replace(/\n/g, '<br>').replace(/(\*|-)\s*/g, '• ');
}

export async function fetchGeminiQuestions(vehicle) {
    if (!vehicle) return "Información del vehículo no proporcionada.";
    const prompt = `Genera una lista de 5 preguntas importantes y específicas que un cliente debería hacer al considerar comprar un auto usado ${vehicle.make} ${vehicle.model} año ${vehicle.year}, que ha sido reparado. Considera su historial de reparaciones conocido: "${vehicle.repairs || 'No especificado'}". Enfócate en preguntas que ayuden a evaluar la calidad de la reparación y la confiabilidad futura del vehículo. Formato: lista numerada.`;
    const questions = await callGeminiAPI(prompt);
    return questions.replace(/\n/g, '<br>');
}