import React, { useState } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";

type View = "home" | "register" | "login";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>("home");
  const [loggedInUser, setLoggedInUser] = useState<{ email: string } | null>(
    null
  );

  const handleRegisterSuccess = () => {
    setTimeout(() => {
      setActiveView("home");
    }, 2000);
  };

  const handleLoginSuccess = (user: { email: string }) => {
    setLoggedInUser(user);
    setActiveView("home");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const renderContent = () => {
    if (activeView === "register") {
      return (
        <>
          <button className="back-button" onClick={() => setActiveView("home")}>
            ← Tillbaka till startsidan
          </button>
          <Register onRegisterSuccess={handleRegisterSuccess} />
        </>
      );
    }

    if (activeView === "login") {
      return (
        <>
          <button className="back-button" onClick={() => setActiveView("home")}>
            ← Tillbaka till startsidan
          </button>
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      );
    }

    return (
      <>
        <h1>Meetup App</h1>
        <p>Välkommen till Meetup App!</p>
        <p>
          API URL:{" "}
          {process.env.REACT_APP_API_URL || "http://localhost:3000/api"}
        </p>

        {loggedInUser ? (
          <div className="logged-in-info">
            <p>Inloggad som {loggedInUser.email}</p>
            <button className="register-button-home" onClick={handleLogout}>
              Logga ut
            </button>
          </div>
        ) : (
          <div className="home-actions">
            <button
              className="register-button-home"
              onClick={() => setActiveView("register")}
            >
              Registrera dig
            </button>
            <button
              className="register-button-home"
              onClick={() => setActiveView("login")}
            >
              Logga in
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="App">
      <header className="App-header">{renderContent()}</header>
    </div>
  );
};

export default App;
