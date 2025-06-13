// G-Sprach Landing - Node.js Express Server
// Minimal server with Brevo proxy and Stripe fake endpoint

const express = require('express');
const fetch = require('node-fetch').default;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// CORS headers for API endpoints
app.use('/api/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Fake Stripe checkout endpoint
app.post('/create-checkout', (req, res) => {
  console.log('Stripe checkout request:', req.body);
  
  // Return fake session ID
  res.json({
    id: "sess_test"
  });
});

// Brevo API proxy endpoint
app.post('/brevo', async (req, res) => {
  try {
    const brevoApiKey = process.env.BREVO_KEY;
    
    if (!brevoApiKey) {
      return res.status(500).json({ 
        error: 'BREVO_KEY not configured' 
      });
    }

    console.log('Brevo request:', req.body);

    // Proxy request to Brevo API
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(req.body)
    });

    const brevoData = await brevoResponse.text();
    
    if (!brevoResponse.ok) {
      console.error('Brevo API error:', brevoResponse.status, brevoData);
      return res.status(brevoResponse.status).json({ 
        error: 'Brevo API error',
        details: brevoData 
      });
    }

    // Try to parse JSON, fallback to text if parsing fails
    let responseData;
    try {
      responseData = JSON.parse(brevoData);
    } catch (e) {
      responseData = { message: brevoData };
    }

    res.json(responseData);

  } catch (error) {
    console.error('Brevo proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`G-Sprach Landing server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Brevo API Key configured: ${!!process.env.BREVO_KEY}`);
  console.log(`Stripe Secret Key configured: ${!!process.env.STRIPE_SK}`);
});

