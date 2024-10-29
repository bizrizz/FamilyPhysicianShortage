document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([51.2538, -85.3232], 6); // Centered on Ontario

    // Black background layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
    }).addTo(map);

    let totalShortage = 0; // Initialize total shortage counter

    // Fetch data.json and create the heatmap and counter
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            data.REGIONS.forEach(region => {
                const { shortage_level, residents_without_doctor, municipalities } = region;

                // Accumulate total residents without a doctor
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
                    const name = typeof municipality === "string" ? municipa
