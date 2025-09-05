import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function SensorLineChart({ data, sensorType, color }) {
  const chartData = {
    labels: data.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label:
          sensorType === "potenciometro" ? "Valor ADC" : "Temperatura (°C)",
        data: data,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: sensorType === "potenciometro",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#666",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: color,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
}

export function GaugeChart({ value, max, color, label, unit }) {
  const percentage = (value / max) * 100;

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: [color, "#e0e0e0"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="gauge-container">
      <div className="gauge-chart">
        <Doughnut data={data} options={options} />
        <div className="gauge-center">
          <div className="gauge-value" style={{ color }}>
            {value}
          </div>
          <div className="gauge-unit">{unit}</div>
          <div className="gauge-label">{label}</div>
        </div>
      </div>
    </div>
  );
}

export function TemperatureGauge({ temperature }) {
  const getTempColor = (temp) => {
    if (temp < 10) return "#2196F3";
    if (temp < 25) return "#4CAF50";
    if (temp < 35) return "#FF9800";
    return "#F44336";
  };

  const tempColor = getTempColor(temperature);
  const normalizedTemp = Math.max(
    0,
    Math.min(100, ((temperature + 10) / 60) * 100)
  );

  return (
    <GaugeChart
      value={temperature}
      max={100}
      color={tempColor}
      label="Temperatura"
      unit="°C"
    />
  );
}

export function PotentiometerGauge({ value }) {
  const percentage = (value / 4095) * 100;
  const color = `hsl(${percentage * 1.2}, 70%, 50%)`;

  return (
    <GaugeChart
      value={value}
      max={4095}
      color={color}
      label="Potenciómetro"
      unit="ADC"
    />
  );
}
