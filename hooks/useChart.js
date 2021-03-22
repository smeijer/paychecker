import Chart, { helpers } from 'chart.js';
import { useEffect, useRef } from 'react';

export function useChart({ labels, datasets }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const chart = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 16 / 9,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          display: true,
          position: 'bottom',
          align: 'center',
          labels: {
            fontColor: 'rgba(255, 255, 255, 1)',
          },
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                fontColor: 'rgba(255, 255, 255, 1)',
              },
              gridLines: {
                display: false,
                zeroLineWidth: 0,
                offsetGridLines: false,
                color: 'white',
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              display: true,
              ticks: {
                beginAtZero: true,
                padding: 10,
                color: 'white',
                fontColor: 'rgba(255, 255, 255, 1)',
              },
              gridLines: {
                zeroLineWidth: 0.5,
                lineWidth: 0.5,
                drawBorder: false,
                color: 'rgba(255, 255, 255, .5)',
              },
            },
          ],
        },
      },
    });

    return () => chart.destroy();
  }, [ref]);

  return [ref];
}
