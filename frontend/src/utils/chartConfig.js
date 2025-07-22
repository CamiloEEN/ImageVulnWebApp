export function createDefaultChartData(redArray, greenArray, blueArray) {
  const labels = Array.from({ length: 256 }, (_, i) => i);

  return {
    labels,
    datasets: [
      {
        label: 'Red',
        data: redArray,
        borderColor: 'red',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Green',
        data: greenArray,
        borderColor: 'green',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Blue',
        data: blueArray,
        borderColor: 'blue',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };
}

//Solo se usa para testear
export const data = {
  labels: Array.from({ length: 256 }, (_, i) => i),
  datasets: [
    {
      label: 'Red',
      data: Array.from({ length: 256 }, (_, i) => i),           // ← tu vector de 256 valores para rojo
      borderColor: 'red',
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
    {
      label: 'Green',
      data: Array.from({ length: 256 }, (_, i) => i),         // ← tu vector de 256 valores para verde
      borderColor: 'green',
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
    {
      label: 'Blue',
      data: Array.from({ length: 256 }, (_, i) => i),          // ← tu vector de 256 valores para azul
      borderColor: 'blue',
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
  ],
};

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Intensidad original',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Intensidad transformada',
      },
      min: 0,
      max: 255,
    },
  },
};

