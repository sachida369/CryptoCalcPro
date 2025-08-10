import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { PriceHistoryPoint } from "@/types/crypto";

Chart.register(...registerables);

interface PriceChartProps {
  data: PriceHistoryPoint[];
  cryptocurrency: string;
  currency: string;
  className?: string;
}

export function PriceChart({ data, cryptocurrency, currency, className = "" }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = data.map(point => new Date(point.timestamp).toLocaleDateString());
    const prices = data.map(point => point.price);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${cryptocurrency.toUpperCase()} Price (${currency.toUpperCase()})`,
          data: prices,
          borderColor: '#00D4FF',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#00D4FF',
          pointHoverBorderColor: '#ffffff',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            titleColor: '#00D4FF',
            bodyColor: '#ffffff',
            borderColor: '#00D4FF',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              title: (context) => {
                return `${new Date(data[context[0].dataIndex].timestamp).toLocaleDateString()}`;
              },
              label: (context) => {
                const price = context.parsed.y;
                return `Price: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency === 'usd' ? 'USD' : currency.toUpperCase()
                }).format(price)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            border: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            ticks: {
              color: '#9CA3AF',
              maxTicksLimit: 6
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            border: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            ticks: {
              color: '#9CA3AF',
              callback: function(value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency === 'usd' ? 'USD' : currency.toUpperCase(),
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(value as number);
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, cryptocurrency, currency]);

  if (!data.length) {
    return (
      <div className={`glass-dark rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-center h-80 text-gray-400">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto mb-4"></div>
            <p>Loading price chart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-dark rounded-2xl p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-6 text-gray-200">
        {cryptocurrency.toUpperCase()} Price History
      </h3>
      <div className="relative h-80">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
