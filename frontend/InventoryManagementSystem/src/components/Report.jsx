import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/Report.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Report = ({ 
  summaryData,
  profitRevenueData,
  bestSellingCategories,
  bestSellingProducts 
}) => {
  // Prepare profit & revenue line chart data
  const profitRevenueChartData = {
    labels: profitRevenueData.months,
    datasets: [
      {
        label: 'Revenue',
        data: profitRevenueData.revenue,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Profit',
        data: profitRevenueData.profit,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Filter out-of-stock and low-stock products
  const criticalProducts = bestSellingProducts.filter(
    product => product.availability === 'Out of stock' || product.availability === 'Low stock'
  );

  // Format currency with ¥ symbol
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(value).replace('JPY', '¥');
  };

  return (
    <div className="report-dashboard">
      <h1>Overview</h1>
      
      {/* Summary Cards - Modern Design */}
      <div className="report-summary-grid">
        {/* First Row */}
        <div className="report-stat-card accent-blue">
          <div className="stat-content">
            <h3>Total Profit</h3>
            <h2>{formatCurrency(summaryData.totalProfit)}</h2>
            <div className="stat-trend positive">+3.2% from last month</div>
          </div>
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20V10M18 20V14M6 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 4H21V6H3V4Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="report-stat-card accent-green">
          <div className="stat-content">
            <h3>Revenue</h3>
            <h2>{formatCurrency(summaryData.revenue)}</h2>
            <div className="stat-trend positive">+2.8% from last month</div>
          </div>
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V22M17 5L12 2L7 5M17 19L12 22L7 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="report-stat-card accent-purple">
          <div className="stat-content">
            <h3>Sales</h3>
            <h2>{formatCurrency(summaryData.sales)}</h2>
            <div className="stat-trend positive">+4.1% from last month</div>
          </div>
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 11L12 2L21 11V22H3V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 11H17V22H7V11Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Second Row */}
        <div className="report-stat-card accent-orange">
          <div className="stat-content">
            <h3>Net Purchase Value</h3>
            <h2>{formatCurrency(summaryData.netPurchaseValue)}</h2>
            <div className="stat-trend negative">-1.5% from last month</div>
          </div>
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="report-stat-card accent-teal">
          <div className="stat-content">
            <h3>Net Sales Value</h3>
            <h2>{formatCurrency(summaryData.netSalesValue)}</h2>
            <div className="stat-trend positive">+2.3% from last month</div>
          </div>
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10H21M7 3V5M17 3V5M6 21H18C19.1046 21 20 20.1046 20 19V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="report-stat-card accent-red">
          <div className="stat-content">
            <h3>MoM Profit</h3>
            <h2>{formatCurrency(summaryData.momProfit)}</h2>
            <div className="stat-trend positive">+5.7% from last month</div>
          </div>
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V18M12 6L7 11M12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="report-stat-card accent-indigo">
          <div className="stat-content">
            <h3>YoY Profit</h3>
            <h2>{formatCurrency(summaryData.yoyProfit)}</h2>
            <div className="stat-trend positive">+12.4% from last year</div>
          </div>
          <div className="stat-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20V10M18 20V14M6 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Profit & Revenue Chart */}
      <div className="report-chart-section">
        <h2>Profit & Revenue</h2>
        <div className="report-chart-container">
          <Line 
            data={profitRevenueChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Monthly Profit & Revenue Trends',
                  font: {
                    size: 16
                  }
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                }
              }
            }}
          />
        </div>
      </div>
      
      {/* Best Selling Categories */}
      <div className="report-table-section">
        <div className="report-table-header">
          <h2>Best selling category</h2>
          <div className="time-filter">Weekly</div>
        </div>
        <table className="report-dashboard-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Turn Over</th>
              <th>Increase By</th>
            </tr>
          </thead>
          <tbody>
            {bestSellingCategories.map((category, index) => (
              <tr key={index}>
                <td>{category.name}</td>
                <td>{formatCurrency(category.turnOver)}</td>
                <td className={category.increaseBy > 0 ? 'positive' : 'negative'}>
                  {category.increaseBy > 0 ? '↑' : '↓'} {category.increaseBy}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Best Selling Products (Critical Stock) */}
      <div className="report-table-section">
        <h2>Best selling products (Critical Stock)</h2>
        <table className="report-dashboard-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Product ID</th>
              <th>Category</th>
              <th>Remaining Quantity</th>
              <th>Turn Over</th>
              <th>Increase By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {criticalProducts.map((product, index) => (
              <tr key={index} className={`status-${product.availability.toLowerCase().replace(' ', '-')}`}>
                <td>{product.name}</td>
                <td>{product.id}</td>
                <td>{product.category}</td>
                <td>{product.remainingQuantity}</td>
                <td>{formatCurrency(product.turnOver)}</td>
                <td className={product.increaseBy > 0 ? 'positive' : 'negative'}>
                  {product.increaseBy > 0 ? '↑' : '↓'} {product.increaseBy}%
                </td>
                <td>
                  <span className={`status-badge ${product.availability.toLowerCase().replace(' ', '-')}`}>
                    {product.availability}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;