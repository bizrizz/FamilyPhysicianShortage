let map;
let counterValue = Math.floor(2500000 + Math.random() * 50000); // Initial count close to 2.5 million
const fluctuationRange = 10; // Range of fluctuation per update
const updateInterval = 5000; // Update every 5 seconds

// Initialize Google Map and Heatmap
function initMap() {
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

    // Sample heatmap data
    const heatMapData = [
        { location: new google.maps.LatLng(44.0, -81.0), weight: 0.5 },
        { location: new google.maps.LatLng(43.7, -79.4), weight: 2 },
        { location: new google.maps.LatLng(46.3, -79.5), weight: 3 },
        // Add more coordinates and weights as needed
    ];

    // Configure heatmap
    const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapData,
        map: map,
        radius: 40,
        opacity: 0.6,
        gradient: ["#00ff00", "#ffff00", "#ff8000", "#ff0000"],
    });

    // Start counter animation
    animateCounter();
}

// Counter animation function
function animateCounter() {
    const counterElement = document.getElementById("counter");

    setInterval(() => {
        const fluctuation = Math.floor(Math.random() * fluctuationRange * 2 - fluctuationRange);
        counterValue = Math.max(2500000, counterValue + fluctuation);

        // Update display with formatted number and animate flip effect
        const newCounterValue = counterValue.toLocaleString("en-US");
        counterElement.innerHTML = ""; // Clear previous counter display

        newCounterValue.split("").forEach((digit, index) => {
            const digitContainer = document.createElement("div");
            digitContainer.className = "digit-container";

            const digitDiv = document.createElement("div");
            digitDiv.className = "digit";
            digitDiv.innerText = digit;

            digitContainer.appendChild(digitDiv);
            counterElement.appendChild(digitContainer);

            // Trigger flip effect with delay for each digit
            setTimeout(() => {
                digitDiv.classList.add("flip");
            }, index * 100); // Stagger animation for each digit
        });
    }, updateInterval);
}
