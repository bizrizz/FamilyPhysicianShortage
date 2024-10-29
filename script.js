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
    let totalResidentsWithoutDoctors = 0;
    const heatMapData = data.REGIONS.map(region => {
      const { coordinates, residents_without_doctor, population } = region;
      const intensity = residents_without_doctor / population; // Ratio
      totalResidentsWithoutDoctors += residents_without_doctor;
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
    // Random fluctuation
    currentCount += Math.floor(Math.random() * 1000) - 500;
    counterElement.innerText = `${(currentCount / 1000000).toFixed(2)} million`;
  }, 1000);
}
