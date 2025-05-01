import React, { useState, useEffect } from 'react';
import '../styles/Inventory.css'; // Reusing the same styles

const Orders = ({ orders: initialOrders = [], onOrdersChange }) => {
  // State management
  const [localOrders, setLocalOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    product: '',
    orderValue: '',
    quantity: '',
    expectedDelivery: '',
    status: 'Confirmed',
    supplier: ''
  });

  // Sync local orders when props change
  useEffect(() => {
    setLocalOrders(initialOrders);
  }, [initialOrders]);

  // Constants
  const itemsPerPage = 5;
  const totalPages = Math.ceil(localOrders.length / itemsPerPage);

  // Update orders in both local and parent state
  const updateOrders = (updatedOrders) => {
    setLocalOrders(updatedOrders);
    if (onOrdersChange) {
      onOrdersChange(updatedOrders);
    }
  };

  // Order summary data
  const orderSummary = {
    totalOrders: localOrders.length,
    totalReceived: localOrders.filter(o => o.status === 'Delivered').length,
    totalReturned: localOrders.filter(o => o.status === 'Returned').length,
    onTheWay: localOrders.filter(o => o.status === 'Out for delivery').length,
    totalRevenue: localOrders.reduce((sum, order) => sum + Number(order.orderValue || 0), 0),
    totalCost: localOrders.reduce((sum, order) => sum + (order.status === 'Returned' ? Number(order.orderValue || 0) : 0), 0)
  };

  // Order filtering and sorting
  const filteredOrders = localOrders.filter(order =>
    order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...filteredOrders].sort((a, b) => {
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
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  // CRUD Operations
  const handleAddOrder = () => {
    if (!newOrder.product || !newOrder.orderValue || !newOrder.quantity || !newOrder.expectedDelivery) {
      alert('Please fill all required fields');
      return;
    }

    const orderToAdd = {
      ...newOrder,
      id: Math.max(...localOrders.map(o => o.id), 0) + 1,
      orderValue: Number(newOrder.orderValue),
      quantity: Number(newOrder.quantity)
    };

    const updatedOrders = [...localOrders, orderToAdd];
    updateOrders(updatedOrders);
    resetNewOrderForm();
    setShowAddForm(false);
    setCurrentPage(Math.ceil((localOrders.length + 1) / itemsPerPage));
  };

  const handleUpdateOrder = (updatedOrder) => {
    const updatedOrders = localOrders.map(o => 
      o.id === updatedOrder.id ? updatedOrder : o
    );
    updateOrders(updatedOrders);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = (id) => {
    const updatedOrders = localOrders.filter(o => o.id !== id);
    updateOrders(updatedOrders);
    setSelectedOrder(null);
    setCurrentPage(1);
  };

  const resetNewOrderForm = () => {
    setNewOrder({
      product: '',
      orderValue: '',
      quantity: '',
      expectedDelivery: '',
      status: 'Confirmed',
      supplier: ''
    });
  };

  // Helper functions
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'confirmed';
      case 'delayed': return 'delayed';
      case 'out for delivery': return 'out-for-delivery';
      case 'returned': return 'returned';
      case 'delivered': return 'delivered';
      default: return '';
    }
  };

  const formatCurrency = (value) => `¥${value}`;
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Order Detail View Component
  const OrderDetailView = ({ order, onUpdate, onDelete, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedOrder, setEditedOrder] = useState({ ...order });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedOrder(prev => ({
        ...prev,
        [name]: ['orderValue', 'quantity'].includes(name) 
          ? Number(value) || 0 
          : value
      }));
    };

    const handleSave = () => {
      onUpdate(editedOrder);
      setIsEditing(false);
    };

    return (
      <div className="inventory-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Order Details</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          {isEditing ? (
            <div className="edit-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product*</label>
                  <input
                    type="text"
                    name="product"
                    value={editedOrder.product}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Order Value (¥)*</label>
                  <input
                    type="number"
                    name="orderValue"
                    value={editedOrder.orderValue}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Quantity*</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editedOrder.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Expected Delivery*</label>
                  <input
                    type="date"
                    name="expectedDelivery"
                    value={editedOrder.expectedDelivery}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Status*</label>
                  <select
                    name="status"
                    value={editedOrder.status}
                    onChange={handleChange}
                    className={getStatusClass(editedOrder.status)}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={editedOrder.supplier}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              <div className="order-info">
                <h3>{order.product}</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order Value:</span>
                    <span className="detail-value">{formatCurrency(order.orderValue)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Quantity:</span>
                    <span className="detail-value">{order.quantity} Packets</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expected Delivery:</span>
                    <span className="detail-value">{formatDate(order.expectedDelivery)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Supplier:</span>
                    <span className="detail-value">{order.supplier || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit Order</button>
                  <button className="btn-danger" onClick={() => onDelete(order.id)}>Delete Order</button>
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
        <h1>Order Management</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Order
          </button>
        </div>
      </div>
      
      <div className="summary-grid">
        <div className="summary-card accent-blue">
          <div className="card-content">
            <h3>Total Orders</h3>
            <h2>{orderSummary.totalOrders}</h2>
            <div className="card-trend">Last 7 days</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10H21M7 3V5M17 3V5M6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-green">
          <div className="card-content">
            <h3>Total Received</h3>
            <h2>{orderSummary.totalReceived}</h2>
            <div className="card-trend">Last 7 days</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-purple">
          <div className="card-content">
            <h3>Revenue</h3>
            <h2>{formatCurrency(orderSummary.totalRevenue)}</h2>
            <div className="card-trend">Last 7 days</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V22M17 5L12 2L7 5M17 19L12 22L7 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-orange">
          <div className="card-content">
            <h3>Total Returned</h3>
            <h2>{orderSummary.totalReturned}</h2>
            <div className="card-trend">Last 7 days</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 17L15 12L9 7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-red">
          <div className="card-content">
            <h3>Cost</h3>
            <h2>{formatCurrency(orderSummary.totalCost)}</h2>
            <div className="card-trend">Last 7 days</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        
        <div className="summary-card accent-teal">
          <div className="card-content">
            <h3>On the way</h3>
            <h2>{orderSummary.onTheWay}</h2>
            <div className="card-trend">Ordered</div>
          </div>
          <div className="card-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="inventory-table-section">
        <div className="table-header">
          <h2>Orders</h2>
          <div className="search-filter">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search orders..."
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
            <button className="btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8L10 4M10 4L14 8M10 4V20M18 16L14 20M14 20L10 16M14 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filters
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th 
                  onClick={() => requestSort('product')}
                  className={sortConfig.key === 'product' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Products
                    {sortConfig.key === 'product' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('orderValue')}
                  className={sortConfig.key === 'orderValue' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Order Value
                    {sortConfig.key === 'orderValue' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('quantity')}
                  className={sortConfig.key === 'quantity' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Quantity
                    {sortConfig.key === 'quantity' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('expectedDelivery')}
                  className={sortConfig.key === 'expectedDelivery' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Expected Delivery
                    {sortConfig.key === 'expectedDelivery' && (
                      <span className="sort-arrow">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('status')}
                  className={sortConfig.key === 'status' ? 'active-sort' : ''}
                >
                  <div className="th-content">
                    Status
                    {sortConfig.key === 'status' && (
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
                currentItems.map((order) => (
                  <tr key={order.id}>
                    <td>{order.product}</td>
                    <td>{formatCurrency(order.orderValue)}</td>
                    <td>{order.quantity} Packets</td>
                    <td>{formatDate(order.expectedDelivery)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
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
                    No orders found matching your search criteria
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
          <span>Page {currentPage} of {Math.ceil(sortedOrders.length / itemsPerPage)}</span>
          <button 
            onClick={handleNext} 
            disabled={currentPage === Math.ceil(sortedOrders.length / itemsPerPage)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
      
      {/* Add Order Modal */}
      {showAddForm && (
        <div className="inventory-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Order</h2>
              <button className="close-btn" onClick={() => {
                setShowAddForm(false);
                resetNewOrderForm();
              }}>×</button>
            </div>
            
            <div className="add-product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product*</label>
                  <input
                    type="text"
                    name="product"
                    value={newOrder.product}
                    onChange={(e) => setNewOrder({...newOrder, product: e.target.value})}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Order Value (¥)*</label>
                  <input
                    type="number"
                    name="orderValue"
                    value={newOrder.orderValue}
                    onChange={(e) => setNewOrder({...newOrder, orderValue: e.target.value})}
                    placeholder="Enter order value"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Quantity*</label>
                  <input
                    type="number"
                    name="quantity"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                    placeholder="Enter quantity"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Expected Delivery*</label>
                  <input
                    type="date"
                    name="expectedDelivery"
                    value={newOrder.expectedDelivery}
                    onChange={(e) => setNewOrder({...newOrder, expectedDelivery: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Status*</label>
                  <select
                    name="status"
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                    className={getStatusClass(newOrder.status)}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Returned">Returned</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={newOrder.supplier}
                    onChange={(e) => setNewOrder({...newOrder, supplier: e.target.value})}
                    placeholder="Enter supplier name"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddForm(false);
                    resetNewOrderForm();
                  }}
                >
                  Discard
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleAddOrder}
                >
                  Add Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedOrder && (
        <OrderDetailView 
          order={selectedOrder}
          onUpdate={handleUpdateOrder}
          onDelete={handleDeleteOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;