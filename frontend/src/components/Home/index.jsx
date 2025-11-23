import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  fetchProducts,
  importCSV,
  updateProduct,
  getHistory,
  addProduct,
  deleteProduct,
} from "../../api.js";
import Header from "../Header";
import ProductTable from "../ProductTable";
import HistorySidebar from "../HistorySidebar";
import Navbar from "../navbar/index";
import AddProductModal from "../AddProductModal";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteProductModal";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [history, setHistory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  // Load Data
  useEffect(() => {
    loadProducts();
  }, [search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(search);
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))];
  }, [products]);

  const filteredProducts = products.filter((p) =>
    categoryFilter ? p.category === categoryFilter : true
  );

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await importCSV(file);
      toast.success(`Added: ${res.added}, Skipped: ${res.skipped}`);
      loadProducts();
    } catch (err) {
      toast.error("Import failed");
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditFormData(product);
  };

  const handleSave = async () => {
    try {
      // 1. Get the current user
      const currentUser = localStorage.getItem("username") || "Unknown";

      // 2. Add 'changed_by' to the data we send
      const dataToSend = {
        ...editFormData,
        changed_by: currentUser,
      };

      await updateProduct(editingId, dataToSend);
      toast.success("Product Updated");
      setEditingId(null);
      loadProducts();
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  const handleRowClick = async (product) => {
    if (editingId) return;
    setSelectedProduct(product);
    const logs = await getHistory(product.id);
    setHistory(logs);
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const handleAddProduct = async (newProductData) => {
    try {
      await addProduct(newProductData);
      toast.success("Product Added Successfully!");
      setIsAddModalOpen(false);
      loadProducts(); // Refresh table
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add product");
    }
  };

  const handleRequestDelete = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete); // Call API
      toast.success("Product Deleted Successfully"); // Show Toast

      // Cleanup
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      if (selectedProduct?.id === productToDelete) setSelectedProduct(null);

      loadProducts(); // Refresh Table
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filteredByCategory = products.filter((p) =>
    categoryFilter ? p.category === categoryFilter : true
  );

  const sortedProducts = useMemo(() => {
    let sortableItems = [...filteredByCategory];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numbers (Stock) vs Strings (Name) safely
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredByCategory, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              marginRight: "10px",
              alignSelf: "center",
              fontSize: "0.9rem",
            }}
          >
            User: <b>{localStorage.getItem("username")}</b>
          </span>
          <button
            onClick={handleLogout}
            className="btn-cancel"
            style={{ background: "#b60000ff", color: "white" }}
          >
            Logout
          </button>
        </div>
        <Navbar />
        <Header
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          handleFileUpload={handleFileUpload}
          onAddClick={() => setIsAddModalOpen(true)}
        />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ProductTable
            editingId={editingId}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            setEditingId={setEditingId}
            handleSave={handleSave}
            handleEditClick={handleEditClick}
            handleRowClick={handleRowClick}
            selectedProductId={selectedProduct?.id}
            products={sortedProducts}
            sortConfig={sortConfig}
            onSort={handleSort}
            handleDelete={handleRequestDelete}
          />
        )}
      </div>

      <HistorySidebar
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        history={history}
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />
    </div>
  );
};

export default Dashboard;
