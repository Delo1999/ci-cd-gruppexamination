import React, { useMemo, useState } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import MeetupList, { Meetup, Review } from "./components/MeetupList";
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
    capacity: 40,
    registrations: 28,
    reviews: [
      {
        id: "review-1",
        author: "Karin Holm",
        rating: 5,
        comment: "Väldigt inspirerande kväll och tydliga live coding-exempel.",
        createdAt: "2025-11-10T17:00:00.000Z",
      },
      {
        id: "review-2",
        author: "Jonas Månsson",
        rating: 4,
        comment: "Bra energi men jag hade velat se mer om testning.",
        createdAt: "2025-11-12T18:30:00.000Z",
      },
    ],
  },
  {
    id: "meetup-2",
    title: "DevOps Deep Dive",
    datetime: "15 december 2025 • 18:00",
    location: "Epicenter, Stockholm",
    host: "Farid Khalil",
    description:
      "Kvällsevent med fokus på CI/CD, monitorering och hur du skalar pipelines i molnet.",
    capacity: 35,
    registrations: 35,
    reviews: [
      {
        id: "review-3",
        author: "Maya Rydberg",
        rating: 5,
        comment:
          "Fick konkreta tips på hur vi kan korta ner våra releasecykler.",
        createdAt: "2025-11-18T19:20:00.000Z",
      },
    ],
  },
  {
    id: "meetup-3",
    title: "Design Systems After Work",
    datetime: "20 december 2025 • 16:00",
    location: "Folkuniversitetet, Göteborg",
    host: "Tove Lind",
    description:
      "Vi visar upp lokala design systems, pratar tokens och delar tips på hur man får produktteam att anamma dem.",
    capacity: 30,
    registrations: 11,
    reviews: [
      {
        id: "review-4",
        author: "Elin Björk",
        rating: 4,
        comment:
          "Kul att se praktiska exempel på tokens och naming-konventioner.",
        createdAt: "2025-11-05T16:45:00.000Z",
      },
    ],
  },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>("home");
  const [loggedInUser, setLoggedInUser] = useState<{ email: string } | null>(
    null
  );
  const [selectedMeetup, setSelectedMeetup] = useState<Meetup | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [meetupReviews, setMeetupReviews] = useState<Record<string, Review[]>>(
    () =>
      upcomingMeetups.reduce((acc, meetup) => {
        acc[meetup.id] = meetup.reviews ?? [];
        return acc;
      }, {} as Record<string, Review[]>)
  );
  const [meetupRegistrations, setMeetupRegistrations] = useState<
    Record<string, number>
  >(() =>
    upcomingMeetups.reduce((acc, meetup) => {
      acc[meetup.id] = meetup.registrations;
      return acc;
    }, {} as Record<string, number>)
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

  const meetupsWithRegistrations = useMemo(
    () =>
      upcomingMeetups.map((meetup) => ({
        ...meetup,
        registrations:
          meetupRegistrations[meetup.id] ?? meetup.registrations ?? 0,
        reviews: meetupReviews[meetup.id] ?? meetup.reviews ?? [],
      })),
    [meetupRegistrations, meetupReviews]
  );

  const filteredMeetups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return meetupsWithRegistrations;
    }

    return meetupsWithRegistrations.filter((meetup) => {
      const haystack =
        `${meetup.title} ${meetup.description} ${meetup.location} ${meetup.host}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [meetupsWithRegistrations, searchTerm]);

  const handleSelectMeetup = (meetup: Meetup) => {
    setSelectedMeetup(meetup);
    setRegistrationMessage(null);
  };

  const handleRegisterForMeetup = (meetup: Meetup) => {
    setMeetupRegistrations((prev) => {
      const currentRegistrations = prev[meetup.id] ?? meetup.registrations ?? 0;

      if (currentRegistrations >= meetup.capacity) {
        setRegistrationMessage({
          type: "error",
          text: "Denna meetup är tyvärr fullbokad.",
        });
        return prev;
      }

      setRegistrationMessage({
        type: "success",
        text: "Du är nu anmäld! Vi har skickat en bekräftelse till din e-post.",
      });

      return {
        ...prev,
        [meetup.id]: currentRegistrations + 1,
      };
    });
  };

  const handleSubmitReview = (
    meetupId: string,
    reviewData: { author: string; rating: number; comment: string }
  ) => {
    setMeetupReviews((prev) => {
      const newReview: Review = {
        id: `review-${meetupId}-${Date.now()}`,
        author: reviewData.author.trim() || "Anonym deltagare",
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
        createdAt: new Date().toISOString(),
      };

      const currentReviews = prev[meetupId] ?? [];

      return {
        ...prev,
        [meetupId]: [newReview, ...currentReviews],
      };
    });
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

    if (selectedMeetup) {
      const meetupFromState =
        meetupsWithRegistrations.find(
          (meetup) => meetup.id === selectedMeetup.id
        ) ?? selectedMeetup;
      const spotsLeft = Math.max(
        meetupFromState.capacity - meetupFromState.registrations,
        0
      );
      const isFull = spotsLeft === 0;

      return (
        <MeetupDetail
          meetup={meetupFromState}
          spotsLeft={spotsLeft}
          isFull={isFull}
          registrationMessage={registrationMessage}
          reviews={meetupFromState.reviews ?? []}
          onSubmitReview={(review) =>
            handleSubmitReview(meetupFromState.id, review)
          }
          onRegister={() => handleRegisterForMeetup(meetupFromState)}
          onBack={() => {
            setSelectedMeetup(null);
            setRegistrationMessage(null);
          }}
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

        <MeetupList meetups={filteredMeetups} onSelect={handleSelectMeetup} />
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
