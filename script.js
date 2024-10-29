let map;
let heatmap;
let counterElement;
let currentCount = 2500000;

// Ontario region data for heatmap with coordinates and shortage data
const regionData = [
  { region: "Bruce County", coordinates: [44.4011, -81.3779], population: 68000, residents_without_doctor: 12000 },
  { region: "Dufferin County", coordinates: [43.9622, -80.1036], population: 62000, residents_without_doctor: 10000 },
  { region: "Essex County", coordinates: [42.3149, -83.0364], population: 422000, residents_without_doctor: 56000 },
  { region: "Frontenac County", coordinates: [44.2312, -76.4860], population: 162000, residents_without_doctor: 21000 },
  { region: "Grey County", coordinates: [44.5592, -80.9343], population: 92000, residents_without_doctor: 15000 },
  { region: "Elgin County", coordinates: [42.7775, -81.1640], population: 91000, residents_without_doctor: 12000 },
  { region: "Hastings County", coordinates: [44.5703, -77.3803], population: 145000, residents_without_doctor: 21000 },
  { region: "Simcoe County", coordinates: [44.3894, -79.6903], population: 465000, residents_without_doctor: 63000 },
  { region: "Lambton County", coordinates: [42.7937, -82.2406], population: 132000, residents_without_doctor: 17000 },
  { region: "Lanark County", coordinates: [45.0000, -76.2500], population: 68000, residents_without_doctor: 10000 },
  { region: "Leeds and Grenville", coordinates: [44.6001, -75.9660], population: 101000, residents_without_doctor: 13000 },
  { region: "Middlesex County", coordinates: [42.9508, -81.2462], population: 500000, residents_without_doctor: 65576 },
  { region: "Oxford County", coordinates: [43.1796, -80.6024], population: 110000, residents_without_doctor: 13000 },
  { region: "Peterborough County", coordinates: [44.3001, -78.3197], population: 135000, residents_without_doctor: 20000 },
  { region: "Prescott and Russell", coordinates: [45.3384, -75.2328], population: 91000, residents_without_doctor: 14500 },
  { region: "Renfrew County", coordinates: [45.6400, -77.2500], population: 105000, residents_without_doctor: 16000 },
  { region: "Durham", coordinates: [43.9453, -78.8965], population: 690000, residents_without_doctor: 85000 },
  { region: "Halton", coordinates: [43.5167, -79.8833], population: 596000, residents_without_doctor: 42000 },
  { region: "Niagara", coordinates: [43.0896, -79.0849], population: 480000, residents_without_doctor: 72000 },
  { region: "Peel", coordinates: [43.7315, -79.7624], population: 1460000, residents_without_doctor: 65000 },
  { region: "Waterloo", coordinates: [43.4643, -80.5204], population: 387572, residents_without_doctor: 50000 },
  { region: "York", coordinates: [43.8838, -79.4343], population: 1250000, residents_without_doctor: 90000 },
  { region: "Toronto", coordinates: [43.6532, -79.3832], population: 2950000, residents_without_doctor: 415000 }
];

// Transform region data into heatmap data points
const heatmapData = regionData.map(region => ({
  location: new google.maps.LatLng(region.coordinates[0], region.coordinates[1]),
  weight: region.residents_without_doctor / region.population
}));

// Initialize the map
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 44.0, lng: -79.5 },
    zoom: 6,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#212121" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
      { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
      { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1b1b1b" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c2c" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] }
    ]
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    radius: 50,
    opacity: 0.7,
    gradient: [
      "rgba(0, 255, 0, 0)", // Transparent
      "rgba(0, 255, 0, 1)", // Green
      "rgba(255, 0, 0, 1)"  // Red for high intensity
    ]
  });

  counterElement = document.getElementById("counter");
  animateCounter();
}

// Animate the counter
function animateCounter() {
  setInterval(() => {
    const fluctuation = Math.floor(Math.random() * 10) - 5; // Random fluctuation between -5 and +5
    currentCount = Math.max(2500000 + fluctuation, 2495000); // Keep it around 2.5 million
    counterElement.textContent = currentCount.toLocaleString();

    // Add flip animation
    counterElement.style.animation = "none";
    setTimeout(() => counterElement.style.animation = "flip 1s ease", 50);
  }, 5000); // Adjusts every 5 seconds
}

// Initialize the map when the page loads
window.initMap = initMap;
