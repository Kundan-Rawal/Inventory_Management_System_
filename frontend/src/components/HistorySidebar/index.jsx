import React from "react";

const HistorySidebar = ({ isOpen, onClose, product, history }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h3>History Log</h3>
        <button onClick={onClose}>×</button>
      </div>

      {product && (
        <div className="sidebar-content">
          <h4>{product.name}</h4>
          <ul className="history-list">
            {history.length === 0 ? (
              <li>No history yet.</li>
            ) : (
              history.map((log) => (
                <li key={log.id}>
                  <small>
                    {new Date(log.change_timestamp).toLocaleString()}
                  </small>
                  <div>
                    <strong>Stock:</strong> {log.old_stock}{" "}
                    <span className="arrow">→</span> {log.new_stock}
                  </div>
                  <div className="changed-by">By: {log.changed_by}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistorySidebar;
