let voltageData = [];
let labels = [];
let chart;

document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('chart');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Station A Voltage',
                data: voltageData,
                borderWidth: 2,
                borderColor: '#16a34a',
                tension: 0.25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
                y: { beginAtZero: true, suggestedMax: 280 }
            }
        }
    });

    fetchData();
    setInterval(fetchData, 2000);
});

function fetchData() {
    fetch('/data')
    .then(res => res.json())
    .then(data => {
        const statusBox = document.getElementById('statusBox');
        statusBox.innerText = data.status;
        statusBox.className =
            "status-indicator " + (data.status === "ON" ? "status-on" : "status-off");

        const stationsDiv = document.getElementById('stations');
        stationsDiv.innerHTML = "";

        let anyFault = false;

        for (let key in data.stations) {
            const s = data.stations[key];
            if (s.fault === "FAULT") anyFault = true;

            stationsDiv.innerHTML += `
                <div class="station ${s.fault === "FAULT" ? "fault" : "normal"}">
                    <strong>Station ${key}</strong><br>
                    Voltage: ${s.voltage} V<br>
                    Status: ${s.fault}
                </div>
            `;
        }

        if (data.status === "ON" && data.stations["A"]) {
            voltageData.push(data.stations["A"].voltage);
            labels.push(new Date().toLocaleTimeString());

            if (voltageData.length > 10) {
                voltageData.shift();
                labels.shift();
            }
            chart.update();
        }

        document.body.style.backgroundColor =
            anyFault ? "#2a0d0d" : "#0b0f14";
    })
    .catch(err => console.error("Fetch error:", err));
}

function controlSystem(action) {
    fetch('/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
    })
    .then(() => fetchData());
}