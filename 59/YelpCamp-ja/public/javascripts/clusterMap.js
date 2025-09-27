// YelpCamp-ja/public/javascripts/clusterMap.js

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    // container: 'map',
    container: 'cluster-map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/standard',
    config: {
        basemap: {
            theme: 'monochrome',
            // lightPreset: 'night'
            lightPreset: 'light'
        }
    },
    // center: [-103.5917, 40.6699],
    center: [139, 39],
    // zoom: 3
    zoom: 4
});

// console.log(campgrounds);
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
// console.log('Map読込完了!!');
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    // map.addSource('earthquakes', {
    map.addSource('campgrounds', {
        type: 'geojson',
        generateId: true,
        // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        // data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        data: {
            features:campgrounds
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        // source: 'earthquakes',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://docs.mapbox.com/style-spec/reference/expressions/#step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                // '#51bbd6',
                // 100,
                '#7986CB',
                20,
                // '#f1f075',
                // 750,
                '#29B6F6',
                40,
                // '#f28cb1'
                '#FF9800'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                15,
                // 100,
                20,
                20,
                // 750,
                40,
                25
            ],
            'circle-emissive-strength': 1
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        // source: 'earthquakes',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        // source: 'earthquakes',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
            'circle-emissive-strength': 1
        }
    });

    // inspect a cluster on click
    map.addInteraction('click-clusters', {
        type: 'click',
        target: { layerId: 'clusters' },
        handler: (e) => {
// console.log('クラスターclick!!');
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            // map.getSource('earthquakes').getClusterExpansionZoom(
            map.getSource('campgrounds').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        }
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.addInteraction('click-unclustered-point', {
        type: 'click',
        target: { layerId: 'unclustered-point' },
        handler: (e) => {
            const { popupMarkup } = e.feature.properties;
// console.log('unclusteredクリック!!');
            const coordinates = e.feature.geometry.coordinates.slice();
            // const mag = e.feature.properties.mag;
            // const tsunami =
            //     e.feature.properties.tsunami === 1 ? 'yes' : 'no';

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    // `magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`
                    // `<h4>キャンプ場</h4>`
                    popupMarkup
                )
                .addTo(map);
        }
    });

    // Change the cursor to a pointer when the mouse is over a cluster of POIs.
    map.addInteraction('clusters-mouseenter', {
        type: 'mouseenter',
        target: { layerId: 'clusters' },
        handler: () => {
// console.log('クラスターマウスエンター!!');            
            map.getCanvas().style.cursor = 'pointer';
        }
    });

    // Change the cursor back to a pointer when it stops hovering over a cluster of POIs.
    map.addInteraction('clusters-mouseleave', {
        type: 'mouseleave',
        target: { layerId: 'clusters' },
        handler: () => {
            map.getCanvas().style.cursor = '';
        }
    });

    // Change the cursor to a pointer when the mouse is over an individual POI.
    map.addInteraction('unclustered-mouseenter', {
        type: 'mouseenter',
        target: { layerId: 'unclustered-point' },
        handler: () => {
            map.getCanvas().style.cursor = 'pointer';
        }
    });

    // Change the cursor back to a pointer when it stops hovering over an individual POI.
    map.addInteraction('unclustered-mouseleave', {
        type: 'mouseleave',
        target: { layerId: 'unclustered-point' },
        handler: () => {
            map.getCanvas().style.cursor = '';
        }
    });
});
