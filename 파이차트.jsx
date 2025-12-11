import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Pie3DLike() {
  const data = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [30, 45, 25],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        hoverOffset: 10,
        borderWidth: 1,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: "bottom" }
    },
    layout: { padding: 10 },
    animation: {
      animateRotate: true,
      animateScale: true,
    }
  };

  return <Pie data={data} options={options} />;
}