// Initialize the map
const map = L.map('map').setView([51.2538, -85.3232], 6);

// Add a dark tile layer for background
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch data and create heat map
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    let totalResidentsWithoutDoctors = 2500000 + Math.floor(Math.random() * 10000 - 5000);
    const heatMapData = data.REGIONS.map(region => {
      const { coordinates, residents_without_doctor, population } = region;
      const intensity = residents_without_doctor / population; // Ratio for intensity
      return [...coordinates, intensity];
    });

    // Create heat map layer
    const heatLayer = L.heatLayer(heatMapData, {
      radius: 30,
      blur: 25,
      maxZoom: 8,
      gradient: {
        0.1: 'green',
        0.4: 'yellow',
        0.7: 'orange',
        1.0: 'red'
      }
    });
    heatLayer.addTo(map);

    // Start the counter
    startCounter(totalResidentsWithoutDoctors);
  })
  .catch(error => console.error('Error loading data or creating heat map:', error));

// Counter functionality with minor fluctuations
let counterElement = document.getElementById('counter');

function startCounter(initialCount) {
  let currentCount = initialCount;
  setInterval(() => {
    // Random fluctuation between -5 and +5 residents every 10 seconds
    currentCount += Math.floor(Math.random() * 11) - 5;
    // Update counter with flip-clock style animation
    counterElement.innerText = currentCount.toLocaleString();
    counterElement.style.transition = "transform 0.5s";
    counterElement.style.transform = "scaleY(1.05)";
    setTimeout(() => {
      counterElement.style.transform = "scaleY(1)";
    }, 500);
  }, 10000); // 10-second interval for flip effect
}


