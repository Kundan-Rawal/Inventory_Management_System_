import React from "react";

const Header = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categories,
  handleFileUpload,
  onAddClick,
}) => {
  return (
    <header className="header">
      <h1>Inventory Management</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="file-actions">
          <button
            onClick={onAddClick}
            className="btn-import"
            style={{ backgroundColor: "#16a34a", marginRight: "10px" }}
          >
            + Add Product
          </button>
          <label className="btn-import">
            Import CSV
            <input type="file" hidden onChange={handleFileUpload} />
          </label>

          <a
            href="https://inventory-management-system-oh0r.onrender.com/api/products/export"
            target="_blank"
            className="btn-export"
            rel="noreferrer"
          >
            Export CSV
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
