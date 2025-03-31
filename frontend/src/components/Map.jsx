import { useEffect } from "react";
import { OlaMaps } from "olamaps-web-sdk";

const Map = () => {
  const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY;

  if (!apiKey) {
    console.error(
      "VITE_OLA_MAPS_API_KEY is missing. Please set it in your environment variables."
    );
    return <div>Error: Map cannot be loaded. Missing API key.</div>;
  }

  useEffect(() => {
    const olaMaps = new OlaMaps({ apiKey });

    const myMap = olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json",
      container: "map",
      center: [26.8632064, 80.9716], // Updated center to Bengaluru, India
      zoom: 15,
    });

    // Handle missing images in the map style
    myMap.on("styleimagemissing", (event) => {
      const { id } = event;
      console.warn(`Image "${id}" is missing. Adding a placeholder.`);
      myMap.addImage(id, {
        width: 1,
        height: 1,
        data: new Uint8Array([0, 0, 0, 0]), // Transparent 1x1 pixel
      });
    });

    // Add geolocate controls to the map
    const geolocate = olaMaps.addGeolocateControls({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    myMap.addControl(geolocate);

    // Use browser's geolocation API to get the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude && longitude) {
            myMap.setCenter([longitude, latitude]); // Center the map on the user's location
            myMap.on("load", () => {
              geolocate.trigger();
            });
            console.log("Marker added at:", { latitude, longitude }); // Log marker addition
            console.log("User location:", { latitude, longitude });
          } else {
            console.error("Invalid coordinates received from geolocation.");
          }
        },
        (error) => {
          console.error("Error getting user location:", error.message);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [apiKey]);

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default Map;
