var chart = null;
var data = null

export function plotCounts(counts) {
    const ctx = document.getElementById('barChart');

    data = counts;
    
    if (chart) {
        chart.destroy();
    }

    if (data) {
        document.getElementById('exportDropdownBtn').disabled = false;
    } else {
        document.getElementById('exportDropdownBtn').disabled = true;
        return;
    }
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
        labels: Object.keys(data),
        datasets: [{
            label: '# of Measurements',
            data: Object.values(data),
        }]
        },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 4,
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

document.getElementById('exportRawBtn').addEventListener('click', function() {
    if (!data) {
        console.error('No data to save');
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
        + Object.keys(data).join(",") + "\n"
        + Object.values(data).join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "measurement_counts.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
});

document.getElementById('exportPlotBtn').addEventListener('click', function() {
    if (!chart) {
        console.error('No plot to save');
        return;
    }

    const link = document.createElement('a');
    link.href = chart.toBase64Image();
    link.download = 'measurement_plot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});