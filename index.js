const API_BASE_URL = 'https://fakestoreapi.com'; // URL base de la API de Fake Store para el proyecto de pre entrega 

async function handleRequest() { // Función principal que maneja las solicitudes HTTP a la API de Fake Store desde la terminal
  const args = process.argv.slice(2); // Extrae los argumentos pasados desde la terminal, omitiendo los dos primeros elementos (node y el archivo index.js)
  const method = args[0]?.toUpperCase();
  const endpoint = args[1];

  if (!method || !endpoint) {
    console.error('❌ Comando incompleto. Ejemplos de uso:');
    console.error('  npm run start -- GET products');
    console.error('  npm run start -- GET products/15');
    console.error('  npm run start -- POST products "T-Shirt-Rex" 300 "remeras"');
    console.error('  npm run start -- DELETE products/7');
    return;
  }

  const url = `${API_BASE_URL}/${endpoint}`;
  let options = { method };

  try {
    // Manejo según el método HTTP
    if (method === 'POST') {
      // Usamos destructuring para extraer title, price y category de los argumentos restantes
      const [title, price, category] = args.slice(2);

      if (!title || !price || !category) {
        console.error('❌ Faltan datos. Estructura requerida: POST products <title> <price> <category>');
        return;
      }

      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify({
        title,
        price: Number(price),
        category,
        description: 'Nuevo producto agregado desde la terminal',
        image: 'https://i.imgur.com/ZLK2Jx2.jpg'
      });
    } else if (method !== 'GET' && method !== 'DELETE') {
      console.error(`❌ Método HTTP no soportado: ${method}`);
      return;
    }

    console.log(`🌐 Ejecutando [${method}] en ${url}...\n`);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Respuesta de la API:\n', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Hubo un error en la operación:', error.message);
  }
}

handleRequest();