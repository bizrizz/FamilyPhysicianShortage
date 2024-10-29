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

      // Add a marker for each region with a popup
      const marker = L.circleMarker(coordinates, {
        radius: 10,
        color: 'transparent',
        fillColor: getFillColor(intensity),
        fillOpacity: 0.7
      }).addTo(map);

      marker.bindPopup(
        `<strong>${region.region}</strong><br>Residents without a doctor: ${residents_without_doctor.toLocaleString()}<br>Contribution to total: ${((residents_without_doctor / totalResidentsWithoutDoctors) * 100).toFixed(2)}%`
      );

      return [...coordinates, intensity];
    });

    // Create heat map layer
    const heatLayer = L.heatLayer(heatMapData, {
      radius: 40,
      blur: 25,
      maxZoom: 8,
      gradient: {
        0.2: 'green',
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

// Utility function to determine fill color based on intensity
function getFillColor(intensity) {
  if (intensity > 0.7) return 'red';
  if (intensity > 0.4) return 'orange';
  if (intensity > 0.2) return 'yellow';
  return 'green';
}

// Counter functionality with flip effect on each digit
function startCounter(initialCount) {
  let currentCount = initialCount;
  updateCounterDisplay(currentCount);

  setInterval(() => {
    // Random fluctuation between -5 and +5 residents every 10 seconds
    currentCount += Math.floor(Math.random() * 11) - 5;
    updateCounterDisplay(currentCount);
  }, 10000); // 10-second interval for flip effect
}

// Update the counter display with individual digit flipping effect
function updateCounterDisplay(newCount) {
  const counterElement = document.getElementById('counter');
  const newDigits = newCount.toLocaleString().split('');
  
  // Clear the counter element and re-add each digit with animation
  counterElement.innerHTML = '';
  newDigits.forEach((digit, index) => {
    const digitElement = document.createElement('span');
    digitElement.className = 'digit';
    digitElement.textContent = digit;

    // Add flip effect only if it's a changing digit
    digitElement.classList.add("flip");
    setTimeout(() => digitElement.classList.remove("flip"), 500);

    counterElement.appendChild(digitElement);
  });
}
