var myChart = null;

export function plotCounts(counts) {
    const ctx = document.getElementById('barChart');
    
    if (myChart) {
        myChart.destroy();
    }
    
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: Object.keys(counts),
        datasets: [{
            label: '# of Measurements',
            data: Object.values(counts),
        }]
        },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Counts'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Measurement Outcomes'
                }
            }
        }
        }
    });
}