import React, { useState } from 'react';
import '../styles/Inventory.css'; 
import '../styles/Supplier.css'
const Suppliers = ({ suppliers: initialSuppliers = [], onSuppliersChange }) => {
  // State management
  const [localSuppliers, setLocalSuppliers] = useState(initialSuppliers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    product: '',
    contactNumber: '',
    email: '',
    type: 'Taking Return',
    onTheWay: ''
  });

  // Sync local suppliers when props change
  React.useEffect(() => {
    setLocalSuppliers(initialSuppliers);
  }, [initialSuppliers]);

  // Constants
  const itemsPerPage = 5;
  const totalPages = Math.ceil(localSuppliers.length / itemsPerPage);

  // Update suppliers in both local and parent state
  const updateSuppliers = (updatedSuppliers) => {
    setLocalSuppliers(updatedSuppliers);
    if (onSuppliersChange) {
      onSuppliersChange(updatedSuppliers);
    }
  };

  // Supplier summary data
  const supplierSummary = {
    totalSuppliers: localSuppliers.length,
    takingReturn: localSuppliers.filter(s => s.type === 'Taking Return').length,
    notTakingReturn: localSuppliers.filter(s => s.type === 'Not Taking Return').length,
    withItemsOnWay: localSuppliers.filter(s => s.onTheWay && s.onTheWay !== '-').length
  };

  // Supplier filtering and sorting
  const filteredSuppliers = localSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
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
  const currentItems = sortedSuppliers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // CRUD Operations
  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.product || !newSupplier.contactNumber || !newSupplier.email) {
      alert('Please fill all required fields');
      return;
    }

    const supplierToAdd = {
      ...newSupplier,
      id: Math.max(...localSuppliers.map(s => s.id), 0) + 1,
      onTheWay: newSupplier.onTheWay || '-'
    };

    const updatedSuppliers = [...localSuppliers, supplierToAdd];
    updateSuppliers(updatedSuppliers);
    resetNewSupplierForm();
    setShowAddForm(false);
    setCurrentPage(Math.ceil((localSuppliers.length + 1) / itemsPerPage));
  };

  const handleUpdateSupplier = (updatedSupplier) => {
    const updatedSuppliers = localSuppliers.map(s => 
      s.id === updatedSupplier.id ? updatedSupplier : s
    );
    updateSuppliers(updatedSuppliers);
    setSelectedSupplier(null);
  };

  const handleDeleteSupplier = (id) => {
    const updatedSuppliers = localSuppliers.filter(s => s.id !== id);
    updateSuppliers(updatedSuppliers);
    setSelectedSupplier(null);
    setCurrentPage(1);
  };

  const resetNewSupplierForm = () => {
    setNewSupplier({
      name: '',
      product: '',
      contactNumber: '',
      email: '',
      type: 'Taking Return',
      onTheWay: ''
    });
  };

  // Helper functions
  const getTypeClass = (type) => {
    switch (type.toLowerCase()) {
      case 'taking return': return 'taking-return';
      case 'not taking return': return 'not-taking-return';
      default: return '';
    }
  };

  // Supplier Detail View Component
  const SupplierDetailView = ({ supplier, onUpdate, onDelete, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSupplier, setEditedSupplier] = useState({ ...supplier });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedSupplier(prev => ({
        ...prev,
        [name]: name === 'onTheWay' ? (value === '' ? '-' : value) : value
      }));
    };

    const handleSave = () => {
      onUpdate(editedSupplier);
      setIsEditing(false);
    };

    return (
      <div className="inventory-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Supplier Details</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          {isEditing ? (
            <div className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Supplier Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={editedSupplier.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Product*</label>
                  <input
                    name="product"
                    value={editedSupplier.product}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Contact Number*</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={editedSupplier.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={editedSupplier.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Type*</label>
                  <select
                    name="type"
                    value={editedSupplier.type}
                    onChange={handleChange}
                    className={getTypeClass(editedSupplier.type)}
                  >
                    <option value="Taking Return">Taking Return</option>
                    <option value="Not Taking Return">Not Taking Return</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>On the way</label>
                  <input
                    type="number"
                    name="onTheWay"
                    value={editedSupplier.onTheWay === '-' ? '' : editedSupplier.onTheWay}
                    onChange={handleChange}
                    placeholder="Leave empty if none"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          ) : (
            <div className="view-model">
              <div className="supplier-info">
                <h3>{supplier.name}</h3>
                <div className="detail-grid">
                  <div className="form-group">
                    <span className="detail-label">Product:</span>
                    <span className="detail-value">{supplier.product}</span>
                  </div>
                  <div className="form-group">
                    <span className="detail-label">Contact Number:</span>
                    <span className="detail-value">{supplier.contactNumber}</span>
                  </div>
                  <div className="form-group">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{supplier.email}</span>
                  </div>
                  <div className="form-group">
                    <span className="detail-label">Type:</span>
                    <span className={`detail-value ${getTypeClass(supplier.type)}`}>
                      {supplier.type}
                    </span>
                  </div>
                  <div className="form-group">
                    <span className="detail-label">On the way:</span>
                    <span className="detail-value">
                      {supplier.onTheWay === '-' ? 'None' : supplier.onTheWay}
                    </span>
                  </div>
                </div>
                
                <div className="supplier-actions">
                  <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit Supplier</button>
                  <button className="btn-danger" onClick={() => onDelete(supplier.id)}>Delete Supplier</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="inventory-dashboard">
      <div className="dashboard-header">
        <h1>Supplier Management</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Supplier
          </button>
        </div>
      </div>
      
      <div className="summary-grid">
        <div className="summary-card accent-blue">
          <div className="card-content">
            <h3>Total Suppliers</h3>
            <h2>{supplierSummary.totalSuppliers}</h2>
            <div className="card-trend positive">+{Math.floor(Math.random() * 5) + 1}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-green">
          <div className="card-content">
            <h3>Taking Return</h3>
            <h2>{supplierSummary.takingReturn}</h2>
            <div className="card-trend positive">+{Math.floor(Math.random() * 3)}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-orange">
          <div className="card-content">
            <h3>Not Taking Return</h3>
            <h2>{supplierSummary.notTakingReturn}</h2>
            <div className="card-trend negative">-{Math.floor(Math.random() * 3)}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-purple">
          <div className="card-content">
            <h3>Items On the Way</h3>
            <h2>{supplierSummary.withItemsOnWay}</h2>
            <div className="card-trend positive">+{Math.floor(Math.random() * 4) + 1}% from last month</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17L15 12L9 7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="inventory-table-section">
        <div className="table-header">
          <h2>Suppliers</h2>
          <div className="search-filter">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th 
                  onClick={() => requestSort('name')}
                  className={sortConfig.key === 'name' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Supplier
                    {sortConfig.key === 'name' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('product')}
                  className={sortConfig.key === 'product' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Product
                    {sortConfig.key === 'product' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('contactNumber')}
                  className={sortConfig.key === 'contactNumber' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Contact
                    {sortConfig.key === 'contactNumber' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('type')}
                  className={sortConfig.key === 'type' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Type
                    {sortConfig.key === 'type' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('onTheWay')}
                  className={sortConfig.key === 'onTheWay' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    On the way
                    {sortConfig.key === 'onTheWay' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.product}</td>
                    <td>{supplier.contactNumber}</td>
                    <td>
                      <span className={`status-badge ${getTypeClass(supplier.type)}`}>
                        {supplier.type}
                      </span>
                    </td>
                    <td>{supplier.onTheWay === '-' ? 'None' : supplier.onTheWay}</td>
                    <td>
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSupplier(supplier);
                        }}
                        title="View Details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No suppliers found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="pagination">
          <button 
            onClick={handlePrevious} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span>Page {currentPage} of {Math.ceil(sortedSuppliers.length / itemsPerPage)}</span>
          <button 
            onClick={handleNext} 
            disabled={currentPage === Math.ceil(sortedSuppliers.length / itemsPerPage)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Add Supplier Modal */}
      {showAddForm && (
        <div className="inventory-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Supplier</h2>
              <button className="close-btn" onClick={() => {
                setShowAddForm(false);
                resetNewSupplierForm();
              }}>×</button>
            </div>
            
            <div className="add-product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Supplier Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                    placeholder="Enter supplier name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Product*</label>
                  <input
                    name="product"
                    value={newSupplier.product}
                    onChange={(e) => setNewSupplier({...newSupplier, product: e.target.value})}
                    placeholder="Enter product supplied"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Contact Number*</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={newSupplier.contactNumber}
                    onChange={(e) => setNewSupplier({...newSupplier, contactNumber: e.target.value})}
                    placeholder="Enter contact number"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Type*</label>
                  <select
                    name="type"
                    value={newSupplier.type}
                    onChange={(e) => setNewSupplier({...newSupplier, type: e.target.value})}
                    className={getTypeClass(newSupplier.type)}
                  >
                    <option value="Taking Return">Taking Return</option>
                    <option value="Not Taking Return">Not Taking Return</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>On the way</label>
                  <input
                    type="number"
                    name="onTheWay"
                    value={newSupplier.onTheWay}
                    onChange={(e) => setNewSupplier({...newSupplier, onTheWay: e.target.value})}
                    placeholder="Enter quantity if items are on the way"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    resetNewSupplierForm();
                  }}
                >
                  Discard
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleAddSupplier}
                >
                  Add Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedSupplier && (
        <SupplierDetailView 
          supplier={selectedSupplier}
          onUpdate={handleUpdateSupplier}
          onDelete={handleDeleteSupplier}
          onClose={() => setSelectedSupplier(null)}
        />
      )}
    </div>
  );
};

export default Suppliers;