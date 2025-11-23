import React from "react";

const ProductTable = ({
  products,
  editingId,
  editFormData,
  setEditFormData,
  setEditingId,
  handleSave,
  handleEditClick,
  handleRowClick,
  selectedProductId,
  onSort,
  sortConfig,
  handleDelete,
}) => {
  // Helper to show arrow
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
  };

  // Helper style for clickable headers
  const headerStyle = { cursor: "pointer", userSelect: "none" };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Image</th>

            {/* --- UPDATED HEADERS (Added Unit & Brand) --- */}
            <th onClick={() => onSort("name")} style={headerStyle}>
              Name {getSortIndicator("name")}
            </th>
            <th onClick={() => onSort("unit")} style={headerStyle}>
              Unit {getSortIndicator("unit")}
            </th>
            <th onClick={() => onSort("category")} style={headerStyle}>
              Category {getSortIndicator("category")}
            </th>
            <th onClick={() => onSort("brand")} style={headerStyle}>
              Brand {getSortIndicator("brand")}
            </th>
            <th onClick={() => onSort("stock")} style={headerStyle}>
              Stock {getSortIndicator("stock")}
            </th>
            <th onClick={() => onSort("status")} style={headerStyle}>
              Status {getSortIndicator("status")}
            </th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              onClick={() => handleRowClick(p)}
              className={selectedProductId === p.id ? "selected-row" : ""}
            >
              <td>
                {p.image ? (
                  <img src={p.image} alt="prod" className="prod-img" />
                ) : (
                  <div className="prod-img"></div>
                )}
              </td>

              {editingId === p.id ? (
                /* --- EDIT MODE --- */
                <>
                  <td>
                    <input
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                    />
                  </td>
                  {/* Added Unit Input */}
                  <td>
                    <input
                      value={editFormData.unit}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          unit: e.target.value,
                        })
                      }
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>
                    <input
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                    />
                  </td>
                  {/* Added Brand Input */}
                  <td>
                    <input
                      value={editFormData.brand}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          brand: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          stock: e.target.value,
                        })
                      }
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                      }}
                      className="btn-save"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                /* --- VIEW MODE --- */
                <>
                  <td>{p.name}</td>
                  {/* Added Unit Display */}
                  <td>{p.unit}</td>
                  <td>{p.category}</td>
                  {/* Added Brand Display */}
                  <td>{p.brand}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        p.stock > 0 ? "instock" : "outstock"
                      }`}
                    >
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(p);
                      }}
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
