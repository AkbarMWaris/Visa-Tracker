const fs = require('fs').promises;
const path = require('path');

const ALERTS_FILE = path.join(__dirname, 'alerts.json');

const initializeData = async () => {
  try {
    await fs.access(ALERTS_FILE);
    
  } catch {
    
    await fs.writeFile(ALERTS_FILE, JSON.stringify([], null, 2));
  }
};

const readAlerts = async () => {
  
  await initializeData();
  
  try {
    const data = await fs.readFile(ALERTS_FILE, 'utf8');
    const alerts = JSON.parse(data);    
    return alerts;
  } catch (error) {
    console.error('Read error:', error.message);
    return [];
  }
};

const writeAlerts = async (alerts) => {
  try {   
    await fs.writeFile(ALERTS_FILE, JSON.stringify(alerts, null, 2));
    console.log('File saved successfully');
  } catch (error) {
    console.error('Write error:', error.message);
    throw error;
  }
};

const filterAlerts = async (country, status) => {
  const alerts = await readAlerts();
  const filtered = alerts.filter(alert => 
    (!country || alert.country.toLowerCase().includes(country.toLowerCase())) &&
    (!status || alert.status.toLowerCase() === status.toLowerCase())
  );
  return filtered;
};

module.exports = { readAlerts, writeAlerts, filterAlerts };
