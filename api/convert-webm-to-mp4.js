// Serverless function – Vercel no incluye ffmpeg,
// así que devolvemos un error informativo.
module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  return res.status(501).json({
    error:
      'La conversión WEBM→MP4 requiere ffmpeg, que no está disponible en el entorno serverless de Vercel. ' +
      'Descarga el archivo WEBM directamente o ejecuta la app en local con server.js para convertir a MP4.'
  });
};
