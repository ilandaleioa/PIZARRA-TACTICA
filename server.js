// Servidor Express para servir la app y convertir WEBM -> MP4
const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const fsSync = require('fs');
const { spawn } = require('child_process');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
function resolveFfmpegBin() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  const wingetPath = path.join(
    os.homedir(),
    'AppData',
    'Local',
    'Microsoft',
    'WinGet',
    'Packages',
    'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe',
    'ffmpeg-8.0.1-full_build',
    'bin',
    'ffmpeg.exe'
  );
  if (fsSync.existsSync(wingetPath)) return wingetPath;
  return 'ffmpeg';
}

const FFMPEG_BIN = resolveFfmpegBin();

async function runFfmpeg(args) {
  await new Promise((resolve, reject) => {
    const child = spawn(FFMPEG_BIN, args, { windowsHide: true });
    let stderr = '';
    child.stderr.on('data', d => { stderr += d.toString(); });
    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) return resolve();
      reject(new Error(stderr || `ffmpeg fallo con codigo ${code}`));
    });
  });
}

app.post('/api/convert-webm-to-mp4', express.raw({ type: 'video/webm', limit: '120mb' }), async (req, res) => {
  const inputBuffer = req.body;
  if (!Buffer.isBuffer(inputBuffer) || inputBuffer.length === 0) {
    return res.status(400).json({ error: 'Cuerpo WEBM vacio o invalido.' });
  }

  const id = randomUUID();
  const inFile = path.join(os.tmpdir(), `pizarra-${id}.webm`);
  const outFile = path.join(os.tmpdir(), `pizarra-${id}.mp4`);

  try {
    await fs.writeFile(inFile, inputBuffer);
    await runFfmpeg([
      '-y',
      '-i', inFile,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      outFile
    ]);

    const mp4 = await fs.readFile(outFile);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename=\"pizarra-tactica.mp4\"');
    return res.send(mp4);
  } catch (error) {
    console.error('Error convirtiendo WEBM a MP4:', error.message || error);
    return res.status(500).json({
      error: 'No se pudo convertir a MP4. Verifica que ffmpeg este instalado y accesible.',
      detail: error.message || String(error)
    });
  } finally {
    await Promise.allSettled([fs.unlink(inFile), fs.unlink(outFile)]);
  }
});

// Servir archivos estaticos (index.html, styles.css, app.js, etc.)
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
