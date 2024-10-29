document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([51.2538, -85.3232], 6); // Ontario center

    // Minimalistic dark map layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
    }).addTo(map);

    let totalShortage = 0; // Initialize counter

    // Load data, set up map markers, and calculate total shortage
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.REGIONS.forEach(region => {
                const { shortage_level, residents_without_doctor, municipalities } = region;

                // Sum up the shortage for the counter
                totalShortage += residents_without_doctor || 0;

                // Map shortage levels to colors
                let color;
                switch (shortage_level) {
                    case "severe": color = "red"; break;
                    case "moderate": color = "orange"; break;
                    case "mild": color = "yellow"; break;
                    default: color = "white";
                }

                municipalities.forEach(municipality => {
                    const name = typeof municipality === "string" ? municipality : municipality.name;
                    const lat = municipality.lat || region.lat;
                    const lng = municipality.lng || region.lng;
                    if (lat && lng) {
                        L.circle([lat, lng], {
                            color,
                            fillColor: color,
                            fillOpacity: 0.7,
                            radius: 10000
                        }).addTo(map).bindPopup(
                            `<strong>${name}</strong><br>Population: ${region.population || 'N/A'}<br>Shortage Level: ${shortage_level}`
                        );
                    }
                });
            });

            // Display initial counter value
            const counterElement = document.getElementById("counter");
            let displayedCount = 0;

            // Animate the counter to the total shortage
            function animateCounter() {
                if (displayedCount < totalShortage) {
                    displayedCount += Math.floor(Math.random() * 1000) + 500;
                    if (displayedCount > totalShortage) {
                        displayedCount = totalShortage;
                    }
                    counterElement.innerText = displayedCount.toLocaleString();
                    requestAnimationFrame(animateCounter);
                } else {
                    setInterval(() => fluctuateCounter(counterElement, totalShortage), 1000);
                }
            }

            // Function to simulate small fluctuations
            function fluctuateCounter(counterElement, baseValue) {
                const fluctuation = Math.floor(Math.random() * 200) * (Math.random() < 0.5 ? -1 : 1);
                const fluctuatedValue = Math.max(baseValue + fluctuation, 0);
                counterElement.innerText = fluctuatedValue.toLocaleString();
            }

            // Start the counter animation
            animateCounter();
        })
        .catch(error => console.error("Error loading data:", error));
});
