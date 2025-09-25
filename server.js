const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Ruta de la carpeta public
const PUBLIC_DIR = path.join(__dirname, 'public');

// Archivos JSON para la base de datos
const USERS_FILE = path.join(__dirname, 'users.json');
const FAVORITES_FILE = path.join(__dirname, 'favorites.json');

// Inicializar archivos JSON si no existen
function initializeJSONFiles() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(FAVORITES_FILE)) {
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify([], null, 2));
  }
}

// Recomendaciones de café por estado de ánimo
const moodRecommendations = {
  'feliz': { 
    name: "Caramel Macchiato", 
    desc: "Dulce y alegre como tu día", 
    emoji: "☕✨",
    color: "#ffd6cc"
  },
  'tranquilo': { 
    name: "Matcha Latte", 
    desc: "Calma y serenidad en cada sorbo", 
    emoji: "🍵🌿",
    color: "#cce7ff"
  },
  'energetico': { 
    name: "Espresso Doble", 
    desc: "Energía pura para conquistar el día", 
    emoji: "⚡🔥",
    color: "#e6ccff"
  },
  'productivo': { 
    name: "Cold Brew", 
    desc: "Enfoque claro y sostenido", 
    emoji: "👨‍💻💪",
    color: "#d1f0d1"
  }
};

// MIME types para diferentes archivos
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain'
};

// Función para determinar el tipo de contenido
function getContentType(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  return mimeTypes[extname] || 'application/octet-stream';
}

// Función para leer el cuerpo de la petición POST
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        resolve(body);
      }
    });
    req.on('error', reject);
  });
}

// Función para manejar las APIs
async function handleAPI(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // API de recomendaciones
    if (pathname.startsWith('/api/recommendation/') && method === 'GET') {
      const mood = pathname.split('/').pop();
      const recommendation = moodRecommendations[mood];
      
      if (recommendation) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, data: recommendation }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Estado de ánimo no encontrado' }));
      }
      return true;
    }

    // API de registro
    if (pathname === '/api/register' && method === 'POST') {
      const body = await getRequestBody(req);
      const { username, password } = body;

      if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Usuario y contraseña requeridos' }));
        return true;
      }

      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const userExists = users.find(user => user.username === username);

      if (userExists) {
        res.writeHead(409, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'El usuario ya existe' }));
        return true;
      }

      const newUser = { id: Date.now(), username, password };
      users.push(newUser);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: 'Usuario registrado exitosamente' }));
      return true;
    }

    // API de login
    if (pathname === '/api/login' && method === 'POST') {
      const body = await getRequestBody(req);
      const { username, password } = body;

      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        res.writeHead(200, { 
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': `user=${username}; Path=/; HttpOnly`
        });
        res.end(JSON.stringify({ success: true, user: { username } }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Credenciales inválidas' }));
      }
      return true;
    }

    // API para guardar favoritos
    if (pathname === '/api/favorites' && method === 'POST') {
      const body = await getRequestBody(req);
      const { coffee, mood } = body;
      const username = req.headers.cookie?.split('user=')[1]?.split(';')[0];

      if (!username) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Usuario no autenticado' }));
        return true;
      }

      const favorites = JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8'));
      const newFavorite = {
        id: Date.now(),
        username,
        coffee,
        mood,
        timestamp: new Date().toISOString()
      };
      
      favorites.push(newFavorite);
      fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));

      res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, message: 'Favorito guardado' }));
      return true;
    }

    // API para obtener favoritos
    if (pathname === '/api/favorites' && method === 'GET') {
      const username = req.headers.cookie?.split('user=')[1]?.split(';')[0];

      if (!username) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, error: 'Usuario no autenticado' }));
        return true;
      }

      const favorites = JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8'));
      const userFavorites = favorites.filter(fav => fav.username === username);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: true, data: userFavorites }));
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Error en API:', error);
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: false, error: 'Error interno del servidor' }));
    return true;
  }
}

// Función para servir archivos estáticos desde la carpeta public
function serveStaticFile(filePath, res) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`❌ Archivo no encontrado: ${filePath}`);
      res.writeHead(404, { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      });
      res.end(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>404 - MoodBrew</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              margin: 0;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            h1 { font-size: 3em; margin-bottom: 20px; }
            p { font-size: 1.2em; margin-bottom: 30px; }
            a { 
              color: #fff; 
              text-decoration: none; 
              background: rgba(255,255,255,0.2);
              padding: 10px 20px;
              border-radius: 25px;
              transition: background 0.3s ease;
            }
            a:hover { background: rgba(255,255,255,0.3); }
            .emoji { font-size: 5em; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="emoji">☕💔</div>
          <h1>404 - Archivo no encontrado</h1>
          <p>Lo sentimos, no pudimos encontrar lo que buscas.</p>
          <a href="/">← Volver a MoodBrew</a>
        </body>
        </html>
      `);
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        console.error(`❌ Error leyendo archivo: ${error.message}`);
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <title>500 - Error del Servidor</title>
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>500 - Error del Servidor</h1>
            <p>Ha ocurrido un error interno del servidor.</p>
            <p>Error: ${error.code}</p>
            <a href="/">← Volver a MoodBrew</a>
          </body>
          </html>
        `);
      } else {
        const contentType = getContentType(filePath);
        const headers = {
          'Content-Type': contentType,
          'Cache-Control': contentType.includes('text/html') ? 'no-cache' : 'max-age=86400',
          'X-Powered-By': 'MoodBrew Server'
        };

        if (contentType.startsWith('text/') || contentType.includes('javascript') || contentType.includes('json')) {
          headers['Content-Type'] += '; charset=utf-8';
        }

        res.writeHead(200, headers);
        res.end(content);
        console.log(`✅ Archivo servido: ${path.basename(filePath)} (${contentType})`);
      }
    });
  });
}

// Función para verificar la seguridad de la ruta
function isSecurePath(filePath, baseDir) {
  const resolvedPath = path.resolve(filePath);
  const resolvedBase = path.resolve(baseDir);
  return resolvedPath.startsWith(resolvedBase);
}

// Crear servidor HTTP
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`📡 ${method} ${pathname}`);

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Manejar APIs primero
  const apiHandled = await handleAPI(req, res);
  if (apiHandled) return;

  // Servir archivos estáticos para GET
  if (method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('405 - Método no permitido');
    return;
  }

  // Normalizar pathname
  pathname = pathname.replace(/\.\./g, '');
  pathname = decodeURIComponent(pathname);

  // Ruta raíz - servir index.html desde public
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Construir ruta completa del archivo en la carpeta public
  const filePath = path.join(PUBLIC_DIR, pathname);

  // Verificar seguridad de la ruta (solo permitir archivos dentro de public)
  if (!isSecurePath(filePath, PUBLIC_DIR)) {
    console.warn(`⚠️  Intento de acceso inseguro: ${pathname}`);
    res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>403 - Acceso Denegado</title>
      </head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; color: #d32f2f;">
        <h1>403 - Acceso Denegado</h1>
        <p>No tienes permisos para acceder a este recurso.</p>
        <a href="/" style="color: #1976d2;">← Volver a MoodBrew</a>
      </body>
      </html>
    `);
    return;
  }

  serveStaticFile(filePath, res);
});

// Inicializar archivos JSON
initializeJSONFiles();

// Verificar que la carpeta public existe
if (!fs.existsSync(PUBLIC_DIR)) {
  console.error('❌ La carpeta "public" no existe. Creándola...');
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  
  // Crear archivos básicos si no existen
  const basicHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MoodBrew - Café por Estado de Ánimo</title>
    <link href="/output.css" rel="stylesheet">
</head>
<body>
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-purple-800 mb-4">☕ MoodBrew</h1>
            <p class="text-lg text-gray-600">La carpeta public se ha creado automáticamente.</p>
            <p class="text-gray-500">Agrega tus archivos HTML, CSS y JS en la carpeta public.</p>
        </div>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), basicHTML);
}

// Manejar errores del servidor
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} ya está en uso.`);
    console.log('💡 Puedes intentar con otro puerto usando: PORT=3001 node server.js');
  } else if (err.code === 'EACCES') {
    console.error(`❌ Sin permisos para usar el puerto ${PORT}.`);
    console.log('💡 Intenta usar un puerto mayor a 1024.');
  } else {
    console.error('❌ Error del servidor:', err.message);
  }
  process.exit(1);
});

// Iniciar servidor
server.listen(PORT, HOST, () => {
  console.log('\n🚀 =======================================');
  console.log('   ☕ MoodBrew Server Iniciado ☕');
  console.log('🚀 =======================================');
  console.log(`📡 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📁 Sirviendo archivos desde: ${PUBLIC_DIR}`);
  console.log(`🌐 Host: ${HOST}`);
  console.log(`🔧 Proceso PID: ${process.pid}`);
  console.log('🚀 =======================================');
  console.log('💡 Presiona Ctrl+C para detener el servidor');
  console.log('☕ ¡Disfruta tu experiencia MoodBrew!\n');
});

// Manejo de cierre graceful
function gracefulShutdown(signal) {
  console.log(`\n🔄 Señal ${signal} recibida. Cerrando servidor...`);
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    console.log('👋 ¡Gracias por usar MoodBrew!');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️  Forzando cierre del servidor...');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));