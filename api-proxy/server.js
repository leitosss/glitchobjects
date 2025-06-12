require('dotenv').config(); // Carga las variables de entorno del archivo .env
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Para hacer peticiones HTTP en Node.js

const app = express();
const PORT = process.env.PORT || 3000; // El puerto donde correrá el intermediario

// Configura CORS para permitir que tu Live Server hable con este intermediario
// ASEGÚRATE de que la URL aquí abajo sea la que te da tu Live Server (normalmente http://127.0.0.1:5500)
app.use(cors({
    origin: 'http://127.0.0.1:5500' // <--- ¡Asegúrate de que esta URL coincida con tu Live Server!
}));
app.use(express.json()); // Para que el intermediario pueda leer los datos JSON que le envías

// Este es el "punto de entrada" para que tu sitio web hable con la IA a través del intermediario
app.post('/generate-content', async (req, res) => {
    const geminiApiKey = process.env.GEMINI_API_KEY; // Obtiene la clave API de tu archivo .env (¡seguro!)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

    try {
        // El intermediario hace la petición REAL a la API de Gemini
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body) // Reenvía lo que tu sitio le pidió a la IA
        });

        const data = await response.json();
        res.json(data); // Envía la respuesta de la IA de vuelta a tu sitio web
    } catch (error) {
        console.error('Error al reenviar la petición a la API de Gemini:', error);
        res.status(500).json({ error: 'Fallo al conectar con el servicio de IA a través del intermediario.' });
    }
});

// Inicia el intermediario
app.listen(PORT, () => {
    console.log(`El servidor intermediario está corriendo en http://localhost:${PORT}`);
    console.log(`Asegúrate de que tu Live Server esté corriendo en http://127.0.0.1:5500`);
});
