// Initialize the map
let map = L.map('map').setView([0, 0], 2);

// Create a tile layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// get the earthquake data from the JSON URL
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
  .then(data => {
    // Loop through the earthquake features and add markers to the map
    data.features.forEach(feature => {
      let mag = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];
      let place = feature.properties.place;

      // Determine the marker size based on the magnitude 
      let markerSize = mag * 3;

      // Determine the marker color based on the depth 
      let markerColor = getColor(depth);

      // Create a circle marker for each earthquake and add a popup with additional information
      L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).bindPopup(`<strong>Magnitude: ${mag}</strong><br>Depth: ${depth} km<br>Location: ${place}`).addTo(map);
    });

    // Create a legend for the map data
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', 'info legend');
      let depths = [0, 50, 100, 150, 200, 300];
      let labels = [];

      for (let i = 0; i < depths.length; i++) {
        labels.push(`<i style="background:${getColor(depths[i] + 1)}"></i> ${depths[i]} km`);
      }

      div.innerHTML = labels.join('<br>');
      return div;
    };

    legend.addTo(map);
  });

// Function to determine marker color based on depth
function getColor(depth) {
  return depth > 300 ? '#041F1E' :
         depth > 200 ? '#1E2D2F' :
         depth > 150 ? '#C57B57' :
         depth > 100 ? '#F1AB86' :
         depth > 50 ? '#F7DBA7' :
                      '#F3E1C0';
}


