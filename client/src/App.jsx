import React, { useState, useEffect } from 'react';
import AlertForm from './components/AlertForm';
import AlertTable from './components/AlertTable';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [alerts, setAlerts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/alerts');
      const data = await response.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
      setAlerts([]);
    }
  };

  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    fetchAlerts();
  };

  useEffect(() => {
    fetchAlerts();
  }, [refreshKey]);

  return (
    <div className="App">
     <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <header className="app-header">
        <h1>🪪 The Flying Panda Visa Slot Tracker</h1>
      </header>
      <main className="app-main">
        <AlertForm onAlertCreated={handleRefresh} />
        <AlertTable alerts={alerts} onRefresh={handleRefresh} refreshKey={refreshKey} />
      </main>
    </div>
  );
}

export default App;
