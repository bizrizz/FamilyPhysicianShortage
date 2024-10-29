let map;
let counterValue = Math.floor(2500000 + Math.random() * 50000); // Initial count around 2.5 million
const fluctuationRange = 10; // Range of fluctuation per update
const updateInterval = 5000; // Interval for counter update in milliseconds

// Initialize the Google Map and Heatmap
function initMap() {
  // Existing map configuration with no change to the API or map appearance
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: { lat: 44.0, lng: -79.5 },
    mapTypeId: "roadmap",
    styles: [
      {
        elementType: "geometry",
        stylers: [{ color: "#1d2c4d" }],
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#8ec3b9" }],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1a3646" }],
      },
    ],
  });

  // Prepare data for heatmap using pre-existing coordinates in JSON
  const heatMapData = data.REGIONS.map(region => ({
    location: new google.maps.LatLng(region.latitude, region.longitude),
    weight: region.residents_without_doctor / 1000,
  }));

  // Apply heatmap layer with specified properties
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData,
    map: map,
    radius: 40,
    opacity: 0.7,
    gradient: ["#0000ff", "#00ff00", "#ffff00", "#ff8000", "#ff0000"], // Custom gradient
  });

  // Initialize and animate the counter
  animateCounter();
}

// Counter animation and update function
function animateCounter() {
  const counterElement = document.getElementById("counter");

  setInterval(() => {
    // Generate a fluctuation within the specified range
    const fluctuation = Math.floor(Math.random() * fluctuationRange * 2 - fluctuationRange);
    counterValue = Math.max(2500000, counterValue + fluctuation); // Ensure value stays above 2.5 million

    // Convert counter value to string with commas for readability
    const newCounterValue = counterValue.toLocaleString("en-US");

    // Update counter display with flip effect
    counterElement.innerHTML = ""; // Clear previous counter display
    newCounterValue.split("").forEach((digit, index) => {
      const digitContainer = document.createElement("div");
      digitContainer.className = "digit-container";

      const digitDiv = document.createElement("div");
      digitDiv.className = "digit";
      digitDiv.dataset.value = digit;
      digitDiv.innerText = digit;

      digitContainer.appendChild(digitDiv);
      counterElement.appendChild(digitContainer);

      // Apply flip animation
      setTimeout(() => {
        digitDiv.classList.add("flip");
      }, index * 100); // Stagger animation for each digit
    });
  }, updateInterval);
}
