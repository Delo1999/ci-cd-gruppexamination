import React, { useMemo, useState } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import MeetupList, { Meetup } from "./components/MeetupList";
import MeetupDetail from "./components/MeetupDetail";

type View = "home" | "register" | "login";

const upcomingMeetups: Meetup[] = [
  {
    id: "meetup-1",
    title: "Frontend Fika & Live Coding",
    datetime: "12 december 2025 • 17:30",
    location: "Folkuniversitetet, Stockholm",
    host: "Evelina Berg",
    description:
      "Vi parar fika med live coding-sessioner där vi bygger UI-komponenter tillsammans och diskuterar bästa praxis.",
  },
  {
    id: "meetup-2",
    title: "DevOps Deep Dive",
    datetime: "15 december 2025 • 18:00",
    location: "Epicenter, Stockholm",
    host: "Farid Khalil",
    description:
      "Kvällsevent med fokus på CI/CD, monitorering och hur du skalar pipelines i molnet.",
  },
  {
    id: "meetup-3",
    title: "Design Systems After Work",
    datetime: "20 december 2025 • 16:00",
    location: "Folkuniversitetet, Göteborg",
    host: "Tove Lind",
    description:
      "Vi visar upp lokala design systems, pratar tokens och delar tips på hur man får produktteam att anamma dem.",
  },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>("home");
  const [loggedInUser, setLoggedInUser] = useState<{ email: string } | null>(
    null
  );
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredMeetups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return upcomingMeetups;
    }

    return upcomingMeetups.filter((meetup) => {
      const haystack =
        `${meetup.title} ${meetup.description} ${meetup.location} ${meetup.host}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm]);

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

    if (selectedMeetup) {
      return (
        <MeetupDetail
          meetup={selectedMeetup}
          onBack={() => setSelectedMeetup(null)}
        />
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

        <div className="meetup-search">
          <label htmlFor="meetup-search-input">Sök meetups</label>
          <input
            id="meetup-search-input"
            type="search"
            placeholder="Sök efter nyckelord, ämnen eller platser..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <MeetupList
          meetups={filteredMeetups}
          onSelect={(meetup) => setSelectedMeetup(meetup)}
        />
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
