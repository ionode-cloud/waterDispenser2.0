import React from 'react';
import ReactApexChart from 'react-apexcharts';
import '../App.css';

function Analytics() {
  const cardData = [
    { title: 'Avg use of Water', value: '19min', unit: '/day' },
    { title: 'Avg Session Duration', value: '1h 24m', unit: '/session' },
    { title: 'Restore Water', value: '0.23', unit: '/day' },
    { title: 'Avg Consumption', value: '2.63 kWh', unit: '/day' },
    { title: 'Avg Revenue', value: '₹14.5', unit: '/day' },
    { title: 'Avg Session Cost', value: '₹64.4', unit: '' }
  ];

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false }
    },
    annotations: {
      yaxis: [
        {
          y: 8800,
          borderColor: '#00E396',
          label: {
            borderColor: '#00E396',
            style: {
              color: '#fff',
              background: '#00E396'
            },
            text: 'Y-axis annotation on 8800'
          }
        }
      ]
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Revenue Trend',
      align: 'left'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    }
  };

  const chartSeries = [
    {
      name: 'Revenue',
      data: [4500, 6000, 8800, 7000, 9400, 10200]
    }
  ];

  return (
    <div className="analytics-wrappe">
       <h2 class="home-card-title">Analytics</h2>
      <div className="card-grid">
        {cardData.map((card, index) => (
          <div key={index} className="stat-card">
            <p className="card-title">{card.title}</p>
            <h2 className="card-value">
              {card.value} <span className="card-unit">{card.unit}</span>
            </h2>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-container">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
        <div className="chart-container">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
        <div className="chart-container">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
        <div className="chart-container">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
        <div className="chart-container">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
        <div className="chart-container">
          <ReactApexChart options={chartOptions} series={chartSeries} type="line" height={350} />
        </div>
      </div>

    </div>
  );
}

export default Analytics;
