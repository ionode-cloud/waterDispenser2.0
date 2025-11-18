import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const [state] = React.useState({
    series: [{
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2]
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        position: 'top',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }
      },
      title: {
        text: 'Monthly Infastructure of User',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444',
          fontSize: '16px'
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300
            },
            dataLabels: {
              style: {
                fontSize: '10px'
              }
            },
            title: {
              offsetY: 300,
              style: {
                fontSize: '14px'
              }
            }
          }
        },
        {
          breakpoint: 420,
          options: {
            chart: {
              height: 280
            },
            dataLabels: {
              style: {
                fontSize: '9px'
              }
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: {
                  fontSize: '10px'
                }
              }
            },
            title: {
              offsetY: 270,
              style: {
                fontSize: '12px'
              }
            }
          }
        },
        {
          breakpoint: 360,
          options: {
            chart: {
              height: 260
            },
            dataLabels: {
              style: {
                fontSize: '8px'
              }
            },
            xaxis: {
              labels: {
                rotate: -60,
                style: {
                  fontSize: '9px'
                }
              }
            },
            title: {
              offsetY: 250,
              style: {
                fontSize: '11px'
              }
            }
          }
        }
      ]
    }
  });

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={state.options.chart.height}
      />
    </div>
  );
};

export default ApexChart;
