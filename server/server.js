const express = require('express');
const cors = require('cors');
const logger = require('./middleware/logger');
const { readAlerts, writeAlerts, filterAlerts } = require('./data/alerts');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());        
app.use(express.urlencoded({ extended: true }));  
app.use(logger);               

// Root route
app.get('/', (req, res) => {
  res.json({ message: '🪪 Visa Slot Tracker API - Working!' });
});

// GET /alerts
app.get('/alerts', async (req, res) => {
  try {
    const { country, status } = req.query;
    
    const alerts = country || status 
      ? await filterAlerts(country, status)
      : await readAlerts();
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /alerts
app.post('/alerts', async (req, res) => {
  try {
    const { country, city, visaType } = req.body;
    
    if (!country || !city || !visaType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const alerts = await readAlerts();
    const newAlert = {
      id: Date.now().toString(),
      country: country.trim(),
      city: city.trim(),
      visaType,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    alerts.unshift(newAlert);
    await writeAlerts(alerts);
    
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /alerts/:id  
app.put('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;  
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const alerts = await readAlerts();
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alerts[alertIndex].status = status;
    await writeAlerts(alerts);
    res.json(alerts[alertIndex]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /alerts/:id
app.delete('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const alerts = await readAlerts();
    const filteredAlerts = alerts.filter(alert => alert.id !== id);
    
    if (filteredAlerts.length === alerts.length) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await writeAlerts(filteredAlerts);
    res.status(204).send();
  } catch (error) {
    console.error('DELETE error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Error handling 
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
