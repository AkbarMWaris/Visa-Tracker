import React from 'react';
import './AlertTable.css';
import { toast } from 'react-toastify';

const AlertTable = ({ alerts, onRefresh, refreshKey }) => {
  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      onRefresh(); 
    } catch (error) {
      console.error('Update error:', error);
    }
  };



const deleteAlert = async (id) => {
  const confirmed = await new Promise((resolve) => {
    toast(
      (t) => (
        <span>
          Delete this alert?
          <button
            onClick={async () => {
              toast.dismiss(t.id);  
              resolve(true);      
            }}
            style={{
              marginLeft: 8,
              padding: "4px 8px",
              fontSize: 12,
              border: "none",
              borderRadius: 4,
              backgroundColor: "#dc3545",
              color: "white",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            style={{
              marginLeft: 8,
              padding: "4px 8px",
              fontSize: 12,
              border: "none",
              borderRadius: 4,
              backgroundColor: "#6c757d",
              color: "white",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </span>
      ),
      { 
        autoClose: false,  
        toastId: `delete-confirm-${id}` 
      }
    );
  });

  
  if (confirmed) {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/alerts/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      toast.success('Alert deleted successfully!');
      onRefresh();  
    } catch (error) {
      toast.error('❌ Failed to delete alert');
      console.error('Delete error:', error);
    }
  }
};

  return (
    <section className="alert-table">
      <div className="table-header">
        <h2>Visa Alerts ({alerts.length})</h2>
        <button onClick={onRefresh} className="filter-btn">Refresh</button>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state">No alerts found. Create one above!</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Country</th>
                <th>City</th>
                <th>Visa Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id || alert._id}>
                  <td>{alert.country}</td>
                  <td>{alert.city}</td>
                  <td>{alert.visaType}</td>
                  <td>
                    <span className={`status ${alert.status?.toLowerCase()}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td>{new Date(alert.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select 
                      value={alert.status}
                      onChange={(e) => updateStatus(alert.id || alert._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Booked">Booked</option>
                      <option value="Expired">Expired</option>
                    </select>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteAlert(alert.id || alert._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AlertTable;
