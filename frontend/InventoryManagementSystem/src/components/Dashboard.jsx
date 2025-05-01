import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import SalesIcon from '../assets/Sales.png';
import RevenueIcon from '../assets/Revenue.png';
import ProfitIcon from '../assets/Profit.png';
import CostIcon from '../assets/Cost.png';
import QuantityIcon from '../assets/Quantity.png';
import OnTheWayIcon from '../assets/On-the-way.png';
import PurchaseIcon from '../assets/Purchase.png';
import CancelIcon from '../assets/Cancel.png';
import ReturnIcon from '../assets/Profit1.png';
import SuppliersIcon from '../assets/Suppliers.png';
import CategoriesIcon from '../assets/Categories.png';
import Inventory from '../components/Inventory'
import ProductInfo from './ProductInfo';
import Report from './Report';
import Suppliers from './Supplier';
const dashboardData = {
    summaryData: {
      totalProfit: 21190,
      revenue: 18300,
      sales: 17432,
      netPurchaseValue: 117432,
      netSalesValue: 80432,
      momProfit: 30432,
      yoyProfit: 110432
    },
    profitRevenueData: {
      months: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      revenue: [220000, 180000, 200000, 240000, 260000, 280000, 300000],
      profit: [120000, 100000, 110000, 130000, 140000, 150000, 160000]
    },
    bestSellingCategories: [
      { name: 'Vegetable', turnOver: 26000, increaseBy: 3.2 },
      { name: 'Instant Food', turnOver: 22000, increaseBy: 2 },
      { name: 'Households', turnOver: 22000, increaseBy: 1.5 }
    ],
    bestSellingProducts: [
      { id: 23567, name: 'Tomato', category: 'Vegetable', remainingQuantity: '225 kg', 
        turnOver: 17000, increaseBy: 2.3, availability: 'Low stock' },
      { id: 25831, name: 'Onion', category: 'Vegetable', remainingQuantity: '200 kg', 
        turnOver: 12000, increaseBy: 1.3, availability: 'Out of stock' },
      { id: 56841, name: 'Maggi', category: 'Instant Food', remainingQuantity: '200 Packet', 
        turnOver: 10000, increaseBy: 1.3, availability: 'In-stock' },
      { id: 23567, name: 'Surf Excel', category: 'Household', remainingQuantity: '125 Packet', 
        turnOver: 9000, increaseBy: 1, availability: 'Low stock' }
    ]
  };
const salesData = {
  title: "Sales Overview",
  stats: [
    { value: "$832", icon: SalesIcon, label: "Sales" },
    { value: "$18300", icon: RevenueIcon, label: "Revenue" },
    { value: "$868", icon: ProfitIcon, label: "Profit" },
    { value: "$17432", icon: CostIcon, label: "Cost" }
  ]
};

const purchaseData = {
  title: "Purchase Overview",
  stats: [
    { value: 82, icon: PurchaseIcon, label: "Purchase" },
    { value: "$13573", icon: CostIcon, label: "Cost" },
    { value: 5, icon: CancelIcon, label: "Cancel" },
    { value: "$17432", icon: ReturnIcon, label: "Return" }
  ]
};

const inventoryData = {
  title: "Inventory Summary",
  stats: [
    { value: 868, icon: QuantityIcon, label: "Quantity in Hand" },
    { value: 200, icon: OnTheWayIcon, label: "To be received" }
  ]
};

const productData = {
  title: "Product Summary",
  stats: [
    { value: 31, icon: SuppliersIcon, label: "Number of Suppliers" },
    { value: 21, icon: CategoriesIcon, label: "Number of Categories" }
  ]
};

const topSellingData = {
  title: "Top Selling Stock",
  items: [
    { name: 'Surf Excel', sold: 30, remaining: 12, price: '$100' },
    { name: 'Rin', sold: 21, remaining: 15, price: '$207' },
    { name: 'Parle G', sold: 19, remaining: 17, price: '$105' }
  ]
};

const lowStockData = {
  title: "Low Quantity Stock",
  items: [
    { name: 'Tata Salt', remaining: '10 Packet' },
    { name: 'Lays', remaining: '15 Packet' },
    { name: 'Lays', remaining: '15 Packet' }
  ]
};

const orderData = {
  title: "Order Summary",
  items: [
    { month: 'Jan', ordered: 1200, delivered: 1000 },
    { month: 'Feb', ordered: 1900, delivered: 1800 },
    { month: 'Mar', ordered: 3000, delivered: 2800 },
    { month: 'Apr', ordered: 2500, delivered: 2400 },
    { month: 'May', ordered: 3800, delivered: 3500 }
  ]
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([
    { id: 1, name: 'Maggi', buyingPrice: 430, quantity: 43, threshold: 12, expiry: '2022-12-11', availability: 'In-stock', category: 'Instant Food', unit: 'Packets' },
    { id: 2, name: 'Bru', buyingPrice: 257, quantity: 22, threshold: 12, expiry: '2022-12-21', availability: 'Out of stock', category: 'Beverage', unit: 'Packets' },
    { id: 3, name: 'Red Bull', buyingPrice: 405, quantity: 36, threshold: 9, expiry: '2022-12-05', availability: 'In-stock', category: 'Beverage', unit: 'Cans' },
    { id: 4, name: 'Boom Vita', buyingPrice: 502, quantity: 14, threshold: 6, expiry: '2022-12-08', availability: 'Out of stock', category: 'Health', unit: 'Bottles' },
    { id: 5, name: 'Harlicks', buyingPrice: 530, quantity: 5, threshold: 5, expiry: '2023-01-09', availability: 'In-stock', category: 'Health', unit: 'Jars' },
    { id: 6, name: 'Harpic', buyingPrice: 605, quantity: 10, threshold: 5, expiry: '2023-01-09', availability: 'In-stock', category: 'Cleaning', unit: 'Bottles' },
    { id: 7, name: 'Ariel', buyingPrice: 408, quantity: 23, threshold: 7, expiry: '2023-12-15', availability: 'Out of stock', category: 'Cleaning', unit: 'Packets' },
    { id: 8, name: 'Scotch Brite', buyingPrice: 359, quantity: 43, threshold: 8, expiry: '2023-06-06', availability: 'In-stock', category: 'Cleaning', unit: 'Pieces' },
    { id: 9, name: 'Coca cola', buyingPrice: 205, quantity: 41, threshold: 10, expiry: '2022-11-11', availability: 'Low stock', category: 'Beverage', unit: 'Bottles' }
  ]);
  const [suppliers, setSuppliers] = useState(
    [
        {
          "name": "Priya Sharma",
          "product": "Laptop - Dell XPS 15",
          "contactNumber": "9876543210",
          "email": "priya.sharma@email.com",
          "type": "Taking Return",
          "onTheWay": "Yes"
        },
        {
          "name": "Amit Verma",
          "product": "Smartphone - Samsung Galaxy S24",
          "contactNumber": "8765432109",
          "email": "amit.verma@sample.org",
          "type": "Taking Return",
          "onTheWay": "No"
        },
        {
          "name": "Sneha Patel",
          "product": "Headphones - Sony WH-1000XM5",
          "contactNumber": "7654321098",
          "email": "sneha.patel.123@provider.net",
          "type": "Taking Return",
          "onTheWay": "Yes"
        },
        {
          "name": "Rahul Singh",
          "product": "Tablet - Apple iPad Pro 12.9-inch",
          "contactNumber": "6543210987",
          "email": "rahul.singh.tech@domain.com",
          "type": "Taking Return",
          "onTheWay": "No"
        },
        {
          "name": "Kavita Yadav",
          "product": "Smartwatch - Fitbit Sense 2",
          "contactNumber": "5432109876",
          "email": "kavita.yadav.fitness@email.co.in",
          "type": "Taking Return",
          "onTheWay": "Yes"
        },
        {
          "name": "Vikram Gupta",
          "product": "Gaming Console - PlayStation 5",
          "contactNumber": "4321098765",
          "email": "vikram.gupta.gaming@sample.com",
          "type": "Taking Return",
          "onTheWay": "No"
        },
        {
          "name": "Anjali Mishra",
          "product": "E-reader - Amazon Kindle Paperwhite",
          "contactNumber": "3210987654",
          "email": "anjali.mishra.books@provider.org",
          "type": "Taking Return",
          "onTheWay": "Yes"
        },
        {
          "name": "Suresh Kumar",
          "product": "Wireless Mouse - Logitech MX Master 3S",
          "contactNumber": "2109876543",
          "email": "suresh.kumar.office@domain.net",
          "type": "Taking Return",
          "onTheWay": "No"
        },
        {
          "name": "Deepika Reddy",
          "product": "Keyboard - Corsair K70 RGB PRO",
          "contactNumber": "1098765432",
          "email": "deepika.reddy.typing@email.com",
          "type": "Taking Return",
          "onTheWay": "Yes"
        },
        {
          "name": "Rohan Joshi",
          "product": "Monitor - LG 34WN80C-B",
          "contactNumber": "9012345678",
          "email": "rohan.joshi.techie@sample.co.in",
          "type": "Taking Return",
          "onTheWay": "No"
        }
      
  ])
  useEffect(()=>{
    console.log(products)
  },[products])
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const StatCard = ({ data, wide }) => (
    <div className={` stat-card ${wide ? 'wide-card ' : ''}`}>
      <h3>{data.title}</h3>
      <div className={`${wide ? 'stat-grid ' : 'summary-container'}`}>
        {data.stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <img src={stat.icon} className="stat-img" alt={stat.label} />
            <span className="stat-value">
              {stat.label.includes('$') ? formatCurrency(stat.value) : stat.value}
            </span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const DataTable = ({ data, wide}) => (
    <div className={`table-card ${wide ? 'wide-card' : ''}`}>
      <div className="table-header">
        <h3>{data.title}</h3>
        <button className="see-all">See All</button>
      </div>
      {data.title.includes('Top Selling') ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Sold Quantity</th>
              <th>Remaining Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.sold}</td>
                <td>{item.remaining}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="low-stock-list">
          {data.items.map((item, index) => (
            <div key={index} className="low-stock-item">
              <span className="stock-name">{item.name}</span>
              <span className="stock-quantity">Remaining Quantity: {item.remaining}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Chart Component
  const OrderChart = () => (
    <div className="chart-card">
      <h3>{orderData.title}</h3>
      <div className="bar-chart">
        {orderData.items.map((item, index) => (
          <div key={index} className="bar-container">
            <div className="bar-labels">
              <span>{item.month}</span>
            </div>
            <div className="bars">
              <div 
                className="bar ordered" 
                style={{ height: `${item.ordered / 50}px` }}
              ></div>
              <div 
                className="bar delivered" 
                style={{ height: `${item.delivered / 50}px` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color ordered"></div>
          <span>Ordered</span>
        </div>
        <div className="legend-item">
          <div className="legend-color delivered"></div>
          <span>Delivered</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>KANBAN</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search product, supplier, order" />
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {['dashboard', 'inventory', 'reports', 'suppliers', 'orders', 'manage', 'settings'].map((tab) => (
              <li 
                key={tab}
                className={activeTab === tab ? 'active' : ''} 
                onClick={() => setActiveTab(tab)}
              >
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </li>
            ))}
            <li className="logout">
              <span>Log Out</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="stats-container">
              <StatCard data={salesData} wide={true} />
              <StatCard data={inventoryData} wide={false}/>
            </div>

            {/* Summary Cards */}
            <div className="summary-container">
              <StatCard data={purchaseData} wide />
              <StatCard data={productData} />
            </div>

            {/* Charts Section */}
            <div className="charts-container">
              <div className="chart-card wide-card">
                <h3>Sales & Purchase</h3>
                <div className="chart-placeholder">Weekly Chart Here</div>
              </div>
              <OrderChart />
            </div>

            {/* Data Tables */}
            <div className="tables-container">
              <DataTable data={topSellingData} wide />
              <DataTable data={lowStockData} />
            </div>
          </>
        )}
        {
            activeTab=='inventory'&&(<Inventory products={products} onProductsChange={updatedProducts => setProducts(updatedProducts)} />)
        }
        {
            activeTab=='reports' && <Report summaryData={dashboardData.summaryData}
            profitRevenueData={dashboardData.profitRevenueData}
            bestSellingCategories={dashboardData.bestSellingCategories}
            bestSellingProducts={dashboardData.bestSellingProducts}/>
        }
        {
            activeTab=='suppliers'&&<Suppliers suppliers={suppliers} onSuppliersChange={updatedSuppliers => setSuppliers(updatedSuppliers)} 
          />
        }
      </div>
    </div>
  );
};

export default Dashboard;