// Initialize the map
const map = L.map('map').setView([43.6532, -79.3832], 6);

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

// Counter functionality with individual digit flip effect
function startCounter(initialCount) {
  let currentCount = initialCount;
  renderCounterDisplay(currentCount);

  setInterval(() => {
    // Random fluctuation between -5 and +5 residents every 10 seconds
    currentCount += Math.floor(Math.random() * 11) - 5;
    renderCounterDisplay(currentCount);
  }, 5000); // 10-second interval for flip effect
}

// Render the counter display with individual digit flipping effect
function renderCounterDisplay(newCount) {
  const counterElement = document.getElementById('counter');
  const newDigits = newCount.toLocaleString().split('');

  // Get the current digits displayed in the counter
  const currentDigits = Array.from(counterElement.children).map(span => span.textContent);

  // Update each digit, only flipping those that change
  newDigits.forEach((digit, index) => {
    let digitElement = counterElement.children[index];

    if (!digitElement) {
      // If the span does not exist, create it
      digitElement = document.createElement('span');
      digitElement.className = 'digit';
      counterElement.appendChild(digitElement);
    }

    if (digitElement.textContent !== digit) {
      // Only apply flip effect if the digit has changed
      digitElement.classList.add('flip');
      digitElement.textContent = digit;
      setTimeout(() => digitElement.classList.remove('flip'), 500);
    }
  });
}
