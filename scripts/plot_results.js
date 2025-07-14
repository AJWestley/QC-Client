var chart = [null, null, null];
var data = null
var selectedPlot = 0;
var hasStateVector = false;
var hasProbabilities = false;

export function createPlots(counts, stateVector, probs) {
    plotCounts(counts);
    if (stateVector) {
        plotStateVector(stateVector);
        hasStateVector = true;
    } else {
        hasStateVector = false;
    }
    if (probs) {
        plotProbabilities(probs);
        hasProbabilities = true;
    } else {
        hasProbabilities = false;
    }
    updatePlotVisibility();
}

function getAmplitude(complexNum) {
    return complexNum ? Math.sqrt(complexNum.re ** 2 + complexNum.im ** 2) : 0;
}

function plotCounts(counts) {
    const ctx = document.getElementById('barChart');

    data = counts;
    
    if (chart[0]) {
        chart[0].destroy();
    }

    if (data) {
        document.getElementById('exportDropdownBtn').disabled = false;
    } else {
        document.getElementById('exportDropdownBtn').disabled = true;
        return;
    }
    
    chart[0] = new Chart(ctx, {
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

function plotStateVector(stateVector) {
    const ctx = document.getElementById('stateVectorChart');

    if (chart[1]) {
        chart[1].destroy();
    }
    
    const amplitudes = stateVector.map(complexNum => getAmplitude(complexNum));
    const labels = stateVector.map((_, index) => `|${index}>`);

    chart[1] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'State Vector Amplitudes',
                data: amplitudes,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
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
                        text: 'Amplitude'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'State'
                    }
                }
            }
        }
    });
}

function plotProbabilities(probabilities) {
    const ctx = document.getElementById('probChart');
    if (chart[2]) {
        chart[2].destroy();
    }

    chart[2] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(probabilities),
            datasets: [{
                label: 'Probabilities',
                data: Object.values(probabilities),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
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
                        text: 'Probability'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Measurement Outcome'
                    }
                }
            }
        }
    });
}

function updatePlotVisibility() {
    const selector = document.getElementById('plot-selector');
    const selectedValue = selector.value;

    // Hide everything first
    document.getElementById('barChart').style.display = 'none';

    document.getElementById('stateVectorChart').style.display = 'none';
    document.getElementById('stateVectorMsg').style.display = 'none';

    document.getElementById('probChart').style.display = 'none';
    document.getElementById('probChartMsg').style.display = 'none';

    if (selectedValue === '0') {
        document.getElementById('barChart').style.display = 'block';
    } else if (selectedValue === '1') {
        if (hasStateVector) {
            document.getElementById('stateVectorChart').style.display = 'block';
        } else {
            document.getElementById('stateVectorMsg').style.display = 'block';
        }
    } else if (selectedValue === '2') {
        if (hasProbabilities) {
            document.getElementById('probChart').style.display = 'block';
        } else {
            document.getElementById('probChartMsg').style.display = 'block';
        }
    }

    selectedPlot = parseInt(selectedValue, 10);
}

document.getElementById('plot-selector').addEventListener('change', updatePlotVisibility);


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
    if (!chart[selectedPlot]) {
        console.error('No plot to save');
        return;
    }

    const link = document.createElement('a');
    link.href = chart[selectedPlot].toBase64Image();
    link.download = 'measurement_plot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});