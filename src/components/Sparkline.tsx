import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SparklineProps {
  data: number[];
}

export const Sparkline: React.FC<SparklineProps> = ({ data }) => {
  const chartData = {
    labels: data.map((_, index) => index.toString()), 
    datasets: [
      {
        data,
        borderColor: data[0] < data[data.length - 1] ? 'green' : (data[0] > data[data.length - 1] ? 'red' : 'gray'),
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: 1,
        pointRadius: 1, 
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false, 
      },
      y: {
        display: false, 
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
    },
  };

  return (
    <div className="w-24 h-12">
      <Line data={chartData} options={options} />
    </div>
  );
};
