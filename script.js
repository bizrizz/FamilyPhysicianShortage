// Initialize the map
const map = L.map('map').setView([51.2538, -85.3232], 6);

// Add dark tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to fetch and process data
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    let totalResidentsWithoutDoctors = 2500000 + Math.floor(Math.random() * 10000 - 5000); // Random start around 2.5 million
    const heatMapData = data.REGIONS.map(region => {
      const { coordinates, residents_without_doctor, population } = region;
      const intensity = residents_without_doctor / population; // Ratio
      return [...coordinates, intensity];
    });

    // Create heat map layer
    L.heatLayer(heatMapData, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      gradient: {
        0.1: 'green',
        0.4: 'yellow',
        0.7: 'orange',
        1.0: 'red'
      }
    }).addTo(map);

    // Start the counter
    startCounter(totalResidentsWithoutDoctors);
  })
  .catch(error => console.error('Error loading data:', error));

// Counter functionality
let counterElement = document.getElementById('counter');

function startCounter(initialCount) {
  let currentCount = initialCount;
  setInterval(() => {
    // Small random fluctuation between -10 and +10
    currentCount += Math.floor(Math.random() * 21) - 10;
    counterElement.innerText = `${(currentCount / 1000000).toFixed(2)} million`;
  }, 1000);
}
