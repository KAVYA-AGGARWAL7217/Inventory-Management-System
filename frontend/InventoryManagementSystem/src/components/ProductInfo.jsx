import React, { useState } from 'react';
import '../styles/ProductInfo.css';

const ProductInfo = () => {
  // Sample product data matching your first screenshot
  const sampleProduct = {
    name: 'Maggi',
    id: '456567',
    category: 'Instant food',
    expiry: '13/4/23',
    threshold: 12,
    supplier: {
      name: 'Ronald Martin',
      contact: '98789 86757'
    },
    locations: [
      { name: 'Sulu Branch', stock: 15 },
      { name: 'Singanalu Branch', stock: 19 }
    ],
    openingStock: 40,
    remainingStock: 34,
    onTheWay: 15,
    buyingPrice: 430,
    quantity: 43,
    unit: 'Packets',
    availability: 'In-stock'
  };

  // Sample product list matching your second screenshot
  const productList = [
    { name: 'Maggi', id: '456567', expiry: '13/4/23', availability: 'In-stock' },
    { name: 'Bru', id: '456568', expiry: '21/12/22', availability: 'Out of stock' },
    { name: 'Red Bull', id: '456569', expiry: '5/12/22', availability: 'In-stock' },
    { name: 'Boom Vita', id: '456570', expiry: '8/12/22', availability: 'Out of stock' },
    { name: 'Harlicks', id: '456571', expiry: '9/1/23', availability: 'In-stock' },
    { name: 'Harpic', id: '456572', expiry: '9/1/23', availability: 'In-stock' },
    { name: 'Ariel', id: '456573', expiry: '15/12/23', availability: 'Out of stock' },
    { name: 'Scotch Brite', id: '456574', expiry: '6/6/23', availability: 'In-stock' },
    { name: 'Coca cola', id: '456575', expiry: '11/11/22', availability: 'Low stock' }
  ];

  const [view, setView] = useState('list'); // 'list', 'details', 'form'
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(sampleProduct); // Using sample data for demo
    setView('details');
  };

  return (
    <div className="inventory-system">
      {view === 'list' && (
        <div className="list-view">
          <h1>Overall Inventory</h1>
          
          <div className="categories-section">
            <h2>Categories</h2>
            <div className="category-count">14 <span>Last 7 days</span></div>
          </div>
          
          <div className="products-section">
            <h2>Products</h2>
            <ul className="product-list">
              {productList.map((product, index) => (
                <li 
                  key={index} 
                  onClick={() => handleProductClick(product)}
                  className={`product-item ${product.availability.toLowerCase().replace(' ', '-')}`}
                >
                  {product.name}
                </li>
              ))}
            </ul>
            <div className="pagination">
              <button>Previous</button>
              <button>Next</button>
            </div>
          </div>
          
          <div className="low-stocks-section">
            <h2>Low Stocks</h2>
            <div className="expiry-dates">
              {productList.map((product, index) => (
                <div key={index} className="expiry-item">
                  {product.expiry}
                </div>
              ))}
            </div>
          </div>
          
          <div className="not-in-stock-section">
            <h2>Not in stock</h2>
            <div className="availability-options">
              <div className="availability-option">In-stock</div>
              <div className="availability-option">Out of stock</div>
              <div className="availability-option">Low stock</div>
            </div>
            <button className="download-btn">Download all</button>
          </div>
        </div>
      )}

      {view === 'details' && selectedProduct && (
        <div className="details-view">
          <h1>{selectedProduct.name}</h1>
          
          <div className="tabs">
            <div className="tab active">Overview</div>
            <div className="tab">Purchases</div>
            <div className="tab">Adjustments</div>
            <div className="tab">History</div>
          </div>
          
          <div className="details-content">
            <div className="section">
              <h3>Primary Details</h3>
              <DetailRow label="Product name" value={selectedProduct.name} />
              <DetailRow label="Product ID" value={selectedProduct.id} />
              <DetailRow label="Product category" value={selectedProduct.category} />
              <DetailRow label="Expiry Date" value={selectedProduct.expiry} />
              <DetailRow label="Threshold Value" value={selectedProduct.threshold} />
            </div>
            
            <div className="section">
              <h3>Supplier Details</h3>
              <DetailRow label="Supplier name" value={selectedProduct.supplier.name} />
              <DetailRow label="Contact Number" value={selectedProduct.supplier.contact} />
            </div>
            
            <div className="section">
              <h3>Stock Locations</h3>
              <DetailRow label="Sulu Branch" value={selectedProduct.locations[0].stock} />
              <DetailRow label="Singanalu Branch" value={selectedProduct.locations[1].stock} />
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="edit-btn">Edit</button>
            <button className="download-btn">Download</button>
          </div>
          
          <div className="stock-summary">
            <SummaryCard title="Opening Stock" value={selectedProduct.openingStock} />
            <SummaryCard title="Remaining Stock" value={selectedProduct.remainingStock} />
            <SummaryCard title="On the way" value={selectedProduct.onTheWay} />
            <SummaryCard title="Threshold value" value={selectedProduct.threshold} />
          </div>
          
          <button className="back-btn" onClick={() => setView('list')}>
            Back to List
          </button>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="summary-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default ProductInfo;