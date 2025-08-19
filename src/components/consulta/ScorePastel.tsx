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
          '#C0392B', // rojo oscuro para Riesgo
          '#D4AC0D', // dorado/mustard para Neutral
          '#1E8449', // verde oscuro para Irrelevante
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
          size: 10,
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
