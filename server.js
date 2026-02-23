// Servidor Express para servir la app
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos (index.html, styles.css, app.js, etc.)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
