import React, { useState } from 'react';
import './AlertForm.css';

const AlertForm = ({ onAlertCreated }) => {
  const [formData, setFormData] = useState({
    country: '', city: '', visaType: 'Tourist'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ country: '', city: '', visaType: 'Tourist' });
        onAlertCreated(); // 👈 TELL PARENT TO REFRESH
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="alert-form">
      <h2>Create New Alert</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <input
            type="text"
            placeholder="Country (e.g., India)"
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="City (e.g., Patna)"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <select
            value={formData.visaType}
            onChange={(e) => setFormData({...formData, visaType: e.target.value})}
          >
            <option value="Tourist">Tourist</option>
            <option value="Business">Business</option>
            <option value="Student">Student</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </form>
    </section>
  );
};

export default AlertForm;
