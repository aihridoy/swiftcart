"use client";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 } },
  },
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom" } },
};

export default function DashboardCharts({ userCount, productCount, orderCount }) {
  const labels = ["Users", "Products", "Orders"];
  const counts = [userCount, productCount, orderCount];
  const colors = ["#3b82f6", "#10b981", "#8b5cf6"];

  const barChartData = {
    labels,
    datasets: [{ label: "Count", data: counts, backgroundColor: colors, borderRadius: 6 }],
  };

  const pieChartData = {
    labels,
    datasets: [{ data: counts, backgroundColor: colors }],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-800 uppercase mb-4">Overview</h2>
        <div className="h-72">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-800 uppercase mb-4">Distribution</h2>
        <div className="h-72">
          <Pie data={pieChartData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
}
