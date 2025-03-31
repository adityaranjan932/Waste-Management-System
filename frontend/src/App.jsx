import "./App.css";
import Map from "./components/Map.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function App() {
  return (
    <ErrorBoundary>
      <Map />
    </ErrorBoundary>
  );
}

export default App;
