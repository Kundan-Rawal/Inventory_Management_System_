import React from "react";
import "./index.css"; // Re-use the existing CSS for consistency

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: "350px" }}>
        <div className="modal-header">
          <h3 style={{ color: "#ef4444" }}>Confirm Deletion</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <p style={{ color: "#64748b", lineHeight: "1.5" }}>
          Are you sure you want to delete this product? <br />
          <strong>This action cannot be undone.</strong>
        </p>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn-save"
            style={{ backgroundColor: "#ef4444", border: "none" }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
