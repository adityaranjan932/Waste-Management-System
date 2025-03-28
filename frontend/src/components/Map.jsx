import { useEffect } from "react";
import { OlaMaps } from "olamaps-web-sdk";

const Map = () => {
  const apiKey = import.meta.env.VITE_OLA_MAPS_API_KEY; // vite k andr env variable ko access krne ka tareeqa

  if (!apiKey) {
    console.error(
      "VITE_OLA_MAPS_API_KEY is missing. Please set it in your environment variables."
    );
    return <div>Error: Map cannot be loaded. Missing API key.</div>;
  }

  useEffect(() => {
    const olaMaps = new OlaMaps({ apiKey });

    olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json",
      container: "map",
      center: [77.61648476788898, 12.931423492103944],
      zoom: 15,
    });
  }, [apiKey]);

  // geolocate.on("geolocate", (event) => {
  //   console.log("A geolocate event has occurred");
  // });
  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
};

export default Map;
