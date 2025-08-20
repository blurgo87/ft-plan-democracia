import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export type ScorePieChartProps = {
  scores: {
    Riesgo: number;
    Neutral: number;
    Irrelevante: number;
  };
};

export default function ScorePieChart({ scores }: ScorePieChartProps) {
  const total = scores.Riesgo + scores.Neutral + scores.Irrelevante;

  const data = {
    labels: ['Riesgo', 'Neutral', 'Irrelevante'],
    datasets: [
      {
        data: [scores.Riesgo, scores.Neutral, scores.Irrelevante],
        backgroundColor: [
          '#FF6B6B', // rojo brillante → Riesgo
          '#FFD93D', // amarillo brillante → Neutral
          '#6EE7B7', // verde brillante → Irrelevante
        ],

        borderColor: '#fff',
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: 'Distribución del Análisis',
        font: {
          size: 12,
          weight: 'bold' as const,
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 15,
        },
        formatter: (value: number) => {
          const pct = (value / total) * 100;
          return `${pct.toFixed(1)}%`;
        },
      },
    },
  };

  return (
    <div style={{ width: '305px', height: '290px', margin: '0 auto' }}>
      <Pie data={data} options={options} />
    </div>
  );
};
