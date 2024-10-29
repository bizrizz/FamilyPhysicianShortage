document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([51.2538, -85.3232], 6); // Centered on Ontario

    // Dark basemap layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
    }).addTo(map);

    // Initialize total shortage to 2.5 million
    let totalShortage = 2500000;

    // Display initial counter
    const counterElement = document.getElementById("counter");
    counterElement.innerText = totalShortage.toLocaleString();

    // Set up heatmap data array
    const heatData = [];

    // Fetch the data and create heatmap and counter fluctuations
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.REGIONS.forEach(region => {
                const { shortage_level, residents_without_doctor, municipalities } = region;

                // Map shortage levels to heat intensity
                let intensity;
                switch (shortage_level) {
                    case "severe": intensity = 1.0; break;
                    case "moderate": intensity = 0.6; break;
                    case "mild": intensity = 0.3; break;
                    default: intensity = 0.1;
                }

                municipalities.forEach(municipality => {
                    const lat = municipality.lat || region.lat;
                    const lng = municipality.lng || region.lng;
                    if (lat && lng) {
                        heatData.push([lat, lng, intensity]);
                    }
                });
            });

            // Apply heatmap layer
            L.heatLayer(heatData, {
                radius: 20,
                blur: 15,
                maxZoom: 10,
                gradient: {
                    0.1: 'blue',
                    0.3: 'lime',
                    0.6: 'orange',
                    1.0: 'red'
                }
            }).addTo(map);

            // Function to simulate fluctuations in shortage
            function fluctuateCounter() {
                const fluctuation = Math.floor(Math.random() * 2000) * (Math.random() < 0.5 ? -1 : 1);
                const fluctuatedValue = Math.max(totalShortage + fluctuation, 0);
                counterElement.innerText = fluctuatedValue.toLocaleString();
            }

            // Start fluctuations every second
            setInterval(fluctuateCounter, 1000);
        })
        .catch(error => console.error("Error loading data:", error));
});
