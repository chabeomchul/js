import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StatsChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        label: "값",
        data: data.map((d) => d.value),
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: 350, marginTop: 30 }}>
      <Bar data={chartData} />
    </div>
  );
}