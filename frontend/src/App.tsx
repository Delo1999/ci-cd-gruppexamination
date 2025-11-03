import React, { useState } from "react";
import "./App.css";
import Register from "./components/Register";

const App: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  const handleRegisterSuccess = () => {
    // Hide register form and show success message
    setTimeout(() => {
      setShowRegister(false);
    }, 2000);
  };

  return (
    <div className="App">
      <header className="App-header">
        {!showRegister ? (
          <>
            <h1>Meetup App</h1>
            <p>Välkommen till Meetup App!</p>
            <p>
              API URL:{" "}
              {process.env.REACT_APP_API_URL || "http://localhost:3000/api"}
            </p>
            <button
              className="register-button-home"
              onClick={() => setShowRegister(true)}
            >
              Registrera dig
            </button>
          </>
        ) : (
          <>
            <button
              className="back-button"
              onClick={() => setShowRegister(false)}
            >
              ← Tillbaka till startsidan
            </button>
            <Register onRegisterSuccess={handleRegisterSuccess} />
          </>
        )}
      </header>
    </div>
  );
};

export default App;
