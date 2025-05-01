import React, { useState, useEffect,useRef } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '../styles/Inventory.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Inventory = ({ products: initialProducts = [], onProductsChange }) => {
  // State management
  const fileInputRef = useRef(null);

  const [localProducts, setLocalProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showCharts, setShowCharts] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    image:'',
    name: '',
    id: '',
    category: '',
    buyingPrice: '',
    quantity: '',
    unit: 'Packets',
    threshold: '',
    expiry: '',
    availability: 'In-stock'
  });

  // Sync local products when props change
  useEffect(() => {
    setLocalProducts(initialProducts);
  }, [initialProducts]);

  // Constants
  const itemsPerPage = 5;
  const totalPages = Math.ceil(localProducts.length / itemsPerPage);

  // Update products in both local and parent state
  const updateProducts = (updatedProducts) => {
    setLocalProducts(updatedProducts);
    if (onProductsChange) {
      onProductsChange(updatedProducts);
    }
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({...newProduct, image: reader.result})
      };
      reader.readAsDataURL(file); 
    }
  };
  // Inventory summary data
  const inventorySummary = {
    categories: [...new Set(localProducts.map(p => p.category))].length,
    totalProducts: localProducts.length,
    outOfStock: localProducts.filter(p => p.availability === 'Out of stock').length,
    lowStock: localProducts.filter(p => p.availability === 'Low stock').length,
    inStock: localProducts.filter(p => p.availability === 'In-stock').length
  };

  // Chart data
  const inventoryChartData = {
    labels: localProducts.map(product => product.name),
    datasets: [
      {
        label: 'Quantity in Stock',
        data: localProducts.map(product => product.quantity),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Threshold Value',
        data: localProducts.map(product => product.threshold),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const availabilityChartData = {
    labels: ['In-stock', 'Out of stock', 'Low stock'],
    datasets: [
      {
        data: [
          localProducts.filter(p => p.availability === 'In-stock').length,
          localProducts.filter(p => p.availability === 'Out of stock').length,
          localProducts.filter(p => p.availability === 'Low stock').length
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Product filtering and sorting
  const filteredProducts = localProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.availability.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // CRUD Operations
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.buyingPrice || 
        !newProduct.quantity || !newProduct.threshold || !newProduct.expiry) {
      alert('Please fill all required fields');
      return;
    }

    const productToAdd = {
      ...newProduct,
      id: newProduct.id || Math.max(...localProducts.map(p => p.id), 0) + 1,
      buyingPrice: Number(newProduct.buyingPrice),
      quantity: Number(newProduct.quantity),
      threshold: Number(newProduct.threshold)
    };

    const updatedProducts = [...localProducts, productToAdd];
    updateProducts(updatedProducts);
    resetNewProductForm();
    setShowAddForm(false);
    setCurrentPage(Math.ceil((localProducts.length + 1) / itemsPerPage));
  };

  const handleUpdateProduct = (updatedProduct) => {
    const updatedProducts = localProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    updateProducts(updatedProducts);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id) => {
    const updatedProducts = localProducts.filter(p => p.id !== id);
    updateProducts(updatedProducts);
    setSelectedProduct(null);
    setCurrentPage(1);
  };

  const resetNewProductForm = () => {
    setNewProduct({
        image:'',
      name: '',
      id: '',
      category: '',
      buyingPrice: '',
      quantity: '',
      unit: 'Packets',
      threshold: '',
      expiry: '',
      availability: 'In-stock'
    });
  };

  // Helper functions
  const getAvailabilityClass = (status) => {
    switch (status.toLowerCase()) {
      case 'in-stock': return 'in-stock';
      case 'out of stock': return 'out-of-stock';
      case 'low stock': return 'low-stock';
      default: return '';
    }
  };

  const formatCurrency = (value) => `₹${value}`;
  const formatQuantity = (value, unit) => `${value} ${unit || 'units'}`;

  // Product Detail View Component
  const ProductDetailView = ({ product, onUpdate, onDelete, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState({ ...product });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedProduct(prev => ({
        ...prev,
        [name]: ['buyingPrice', 'quantity', 'threshold'].includes(name) 
          ? Number(value) || 0 
          : value
      }));
    };

    const handleSave = () => {
      onUpdate(editedProduct);
      setIsEditing(false);
    };

    return (
      <div className="product-detail-view">
        <div className="product-detail-header">
          <h2>Product Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {isEditing ? (
          <div className="product-edit-form">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={editedProduct.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <input
                name="category"
                value={editedProduct.category}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Buying Price (₹)</label>
              <input
                type="number"
                name="buyingPrice"
                value={editedProduct.buyingPrice}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editedProduct.quantity}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={editedProduct.unit}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiry"
                value={editedProduct.expiry}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Threshold Value</label>
              <input
                type="number"
                name="threshold"
                value={editedProduct.threshold}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Availability</label>
              <select 
                name="availability" 
                value={editedProduct.availability} 
                onChange={handleChange}
                className={getAvailabilityClass(editedProduct.availability)}
              >
                <option value="In-stock">In-stock</option>
                <option value="Out of stock">Out of stock</option>
                <option value="Low stock">Low stock</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="product-details">
            <div className="product-image-placeholder"></div>
            
            <div className="product-info">
              <h3>{product.name}</h3>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Buying Price:</strong> {formatCurrency(product.buyingPrice)}</p>
              <p><strong>Quantity:</strong> {formatQuantity(product.quantity, product.unit)}</p>
              <p><strong>Threshold:</strong> {product.threshold}</p>
              <p><strong>Expiry Date:</strong> {product.expiry}</p>
              <p>
                <strong>Availability:</strong> 
                <span className={getAvailabilityClass(product.availability)}>
                  {product.availability}
                </span>
              </p>
            </div>
            
            <div className="product-actions">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(product.id)}>Delete</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="inventory-management">
      <h1>Overall Inventory</h1>
      
      <div className="dashboard-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <button 
            className={`btn-icon ${showCharts ? 'active' : ''}`}
            onClick={() => setShowCharts(!showCharts)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20V14M14 20V10M18 20V16M6 20V4M4 4H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Product
          </button>
        </div>
      </div>
      
      <div className="summary-grid">
        <div className="summary-card accent-blue">
          <div className="card-content">
            <h3>Total Products</h3>
            <h2>{inventorySummary.totalProducts}</h2>
            <div className="card-trend positive">+{Math.floor(Math.random() * 5) + 1}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10H21M7 3V5M17 3V5M6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-green">
          <div className="card-content">
            <h3>Categories</h3>
            <h2>{inventorySummary.categories}</h2>
            <div className="card-trend positive">+{Math.floor(Math.random() * 3)}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 11H20M4 11C2.89543 11 2 10.1046 2 9V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V9C22 10.1046 21.1046 11 20 11M4 11V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V11M12 11V17M12 17L9.5 14.5M12 17L14.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-purple">
          <div className="card-content">
            <h3>In Stock</h3>
            <h2>{inventorySummary.inStock}</h2>
            <div className="card-trend positive">+{Math.floor(Math.random() * 4) + 1}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-orange">
          <div className="card-content">
            <h3>Low Stock</h3>
            <h2>{inventorySummary.lowStock}</h2>
            <div className="card-trend negative">-{Math.floor(Math.random() * 3)}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-red">
          <div className="card-content">
            <h3>Out of Stock</h3>
            <h2>{inventorySummary.outOfStock}</h2>
            <div className="card-trend negative">-{Math.floor(Math.random() * 5) + 1}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.364 5.63604L5.63604 18.364M18.364 18.364L5.63604 5.63604M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="divider"></div>
      
      
      
      {showCharts && (
        <div className="charts-container">
          <div className="chart">
            <h3>Inventory Levels</h3>
            <Bar 
              data={inventoryChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Product Quantities vs Thresholds'
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
          
          <div className="chart">
            <h3>Stock Availability</h3>
            <Pie 
              data={availabilityChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Product Availability Distribution'
                  },
                }
              }}
            />
          </div>
        </div>
      )}
      
      {showAddForm && (
        <div className="add-product-form">
          <h2>New Product</h2>
          
          <div className="image-upload-section">
            <div className="upload-box">
              <p>Drag image here or</p>
              <input type="file" accept="image/*"onChange={handleImageUpload} ref={fileInputRef}  id="image" className="browse-btn"/>
            </div>
          </div>
          
          <div className="form-fields">
            <div className="form-group">
              <label>Product Name*</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category*</label>
              <input
                name="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Buying Price (₹)*</label>
              <input
                type="number"
                name="buyingPrice"
                value={newProduct.buyingPrice}
                onChange={(e) => setNewProduct({...newProduct, buyingPrice: e.target.value})}
                placeholder="Enter buying price"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Quantity*</label>
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                  placeholder="Enter quantity"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Unit</label>
                <select
                  name="unit"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                >
                  <option value="Packets">Packets</option>
                  <option value="Bottles">Bottles</option>
                  <option value="Cans">Cans</option>
                  <option value="Jars">Jars</option>
                  <option value="Pieces">Pieces</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Expiry Date*</label>
              <input
                type="date"
                name="expiry"
                value={newProduct.expiry}
                onChange={(e) => setNewProduct({...newProduct, expiry: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Threshold Value*</label>
              <input
                type="number"
                name="threshold"
                value={newProduct.threshold}
                onChange={(e) => setNewProduct({...newProduct, threshold: e.target.value})}
                placeholder="Enter threshold"
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Availability</label>
              <select
                name="availability"
                value={newProduct.availability}
                onChange={(e) => setNewProduct({...newProduct, availability: e.target.value})}
              >
                <option value="In-stock">In-stock</option>
                <option value="Out of stock">Out of stock</option>
                <option value="Low stock">Low stock</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              className="discard-btn"
              onClick={() => {
                setShowAddForm(false);
                resetNewProductForm();
              }}
            >
              Discard
            </button>
            <button 
              className="add-product-btn"
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>
      )}
      
      {selectedProduct && (
        <ProductDetailView 
          product={selectedProduct}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      
      <div className="divider"></div>
      
      <div className="products-header">
        <h2>Products</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <i className="search-icon">🔍</i>
        </div>
      </div>
      
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th 
                onClick={() => requestSort('name')}
                className={sortConfig.key === 'name' ? 'active-sort' : ''}
              >
                Products 
                {sortConfig.key === 'name' && (
                  <span className="sort-arrow">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => requestSort('buyingPrice')}
                className={sortConfig.key === 'buyingPrice' ? 'active-sort' : ''}
              >
                Buying Price 
                {sortConfig.key === 'buyingPrice' && (
                  <span className="sort-arrow">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => requestSort('quantity')}
                className={sortConfig.key === 'quantity' ? 'active-sort' : ''}
              >
                Quantity 
                {sortConfig.key === 'quantity' && (
                  <span className="sort-arrow">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => requestSort('threshold')}
                className={sortConfig.key === 'threshold' ? 'active-sort' : ''}
              >
                Threshold Value 
                {sortConfig.key === 'threshold' && (
                  <span className="sort-arrow">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => requestSort('expiry')}
                className={sortConfig.key === 'expiry' ? 'active-sort' : ''}
              >
                Expiry Date 
                {sortConfig.key === 'expiry' && (
                  <span className="sort-arrow">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => requestSort('availability')}
                className={sortConfig.key === 'availability' ? 'active-sort' : ''}
              >
                Availability 
                {sortConfig.key === 'availability' && (
                  <span className="sort-arrow">
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.id} onClick={() => setSelectedProduct(product)}>
                <td>{product.name}</td>
                <td>{formatCurrency(product.buyingPrice)}</td>
                <td>{formatQuantity(product.quantity, product.unit)}</td>
                <td>{product.threshold}</td>
                <td>{product.expiry}</td>
                <td className={getAvailabilityClass(product.availability)}>
                  {product.availability}
                </td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(sortedProducts.length / itemsPerPage)}</span>
        <button onClick={handleNext} disabled={currentPage === Math.ceil(sortedProducts.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Inventory;