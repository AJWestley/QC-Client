var myChart = null;
var data = null

export function plotCounts(counts) {
    const ctx = document.getElementById('barChart');

    data = counts;
    
    if (myChart) {
        myChart.destroy();
    }

    if (data) {
        document.getElementById('saveResultsBtn').disabled = false;
    } else {
        document.getElementById('saveResultsBtn').disabled = true;
        return;
    }
    
    myChart = new Chart(ctx, {
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

document.getElementById('saveResultsBtn').addEventListener('click', function() {
    if (!data) {
        console.error('No data to save');
        return;
    }

    // row 1 = all keys, row 2 = all values
    const csvContent = "data:text/csv;charset=utf-8," 
        + Object.keys(data).join(",") + "\n"
        + Object.values(data).join(",");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "measurement_counts.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
});