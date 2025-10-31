import React from "react";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Meetup App</h1>
        <p>Frontend deployment till AWS S3 är konfigurerad!!!!!!!!</p>
        <p>API URL: {process.env.REACT_APP_API_URL || "Inte satt"}</p>
      </header>
    </div>
  );
};

export default App;
