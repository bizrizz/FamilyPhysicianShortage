document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map
    const map = L.map('map').setView([51.2538, -85.3232], 6); // Centered on Ontario

    // Black background layer using CartoDB basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
    }).addTo(map);

    // Fetch the data and create the heatmap
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.REGIONS.forEach(region => {
                const { shortage_level, municipalities } = region;
                
                // Map shortage levels to colors
                let color;
                switch (shortage_level) {
                    case "severe": color = "red"; break;
                    case "moderate": color = "orange"; break;
                    case "mild": color = "yellow"; break;
                    default: color = "white";
                }

                municipalities.forEach(municipality => {
                    // Create a circle for each municipality
                    const lat = municipality.lat || region.lat; // Use lat/lng if specified
                    const lng = municipality.lng || region.lng;
                    if (lat && lng) {
                        L.circle([lat, lng], {
                            color,
                            fillColor: color,
                            fillOpacity: 0.7,
                            radius: 10000 // Adjust radius for visualization
                        }).addTo(map).bindPopup(
                            `<strong>${municipality.name || municipality}</strong><br>Population: ${region.population}<br>Shortage Level: ${shortage_level}`
                        );
                    }
                });
            });
        })
        .catch(error => console.error("Error loading data:", error));
});
