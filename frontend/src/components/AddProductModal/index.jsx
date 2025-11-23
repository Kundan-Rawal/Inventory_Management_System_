import React, { useState } from "react";
import "./index.css"; // We will create this CSS next

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    unit: "",
    stock: 0,
    status: "In Stock",
    image: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form after submit
    setFormData({
      name: "",
      category: "",
      brand: "",
      unit: "",
      stock: 0,
      status: "In Stock",
      image: "",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Product</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Unit (e.g., pcs, kg)</label>
              <input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
