// YelpCamp-ja/public/javascripts/showPageMap.js

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    // style: 'mapbox://styles/mapbox/streets-v11', // style URL
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    // projection: 'globe', // display the map as a globe
    zoom: 10, // starting zoom
    // center: [-74.5, 40] // starting position [lng, lat]
    center: campground.geometry.coordinates
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// map.addControl(new mapboxgl.NavigationControl());
// map.scrollZoom.disable();

// map.on('style.load', () => {
//     map.setFog({}); // Set the default atmosphere style
// });

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
    // .setLngLat([12.554729, 55.70651]) // 経度、緯度
    // .setLngLat([-74.5, 40]) // 経度、緯度
    .setLngLat(campground.geometry.coordinates) // 経度、緯度
    .setPopup(  // popup
        new mapboxgl.Popup({ offset: 15 })
        .setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`)
    )
    .addTo(map);