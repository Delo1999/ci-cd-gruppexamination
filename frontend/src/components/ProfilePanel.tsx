import React from "react";
import { Meetup } from "./MeetupList";

type ProfilePanelProps = {
  loggedInEmail: string | null;
  upcoming: Meetup[];
  past: Meetup[];
  onSelect: (meetup: Meetup) => void;
  onBackHome: () => void;
};

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  loggedInEmail,
  upcoming,
  past,
  onSelect,
  onBackHome,
}) => {
  const upcomingSorted = [...upcoming].sort(
    (a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
  );
  const pastSorted = [...past].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );

  const renderMeetupCard = (meetup: Meetup) => (
    <li key={meetup.id} className="profile-meetup-card">
      <div>
        <p className="meetup-card-datetime">{meetup.datetime}</p>
        <h4>{meetup.title}</h4>
        <p className="profile-meetup-meta">
          📍 {meetup.location} · 👤 {meetup.host}
        </p>
      </div>
      <button className="profile-meetup-link" onClick={() => onSelect(meetup)}>
        Visa detaljer →
      </button>
    </li>
  );

  return (
    <section className="profile-panel">
      <button className="back-button" onClick={onBackHome}>
        ← Tillbaka
      </button>

      <header>
        <p className="eyebrow">Min profil</p>
        <h2>Hej {loggedInEmail || "gäst"}!</h2>
        <p className="supporting-copy">
          Här kan du se dina kommande anmälningar och tidigare meetups du har
          deltagit i.
        </p>
      </header>

      {!loggedInEmail ? (
        <div className="profile-empty-state">
          <p>Logga in för att börja spara dina anmälningar.</p>
        </div>
      ) : (
        <>
          <section className="profile-section">
            <div className="profile-section-header">
              <h3>Kommande anmälningar</h3>
              <span>{upcoming.length} st</span>
            </div>
            {upcoming.length === 0 ? (
              <p className="profile-empty-state">
                Du har inga kommande meetups ännu.
              </p>
            ) : (
              <ul className="profile-meetup-list">
                {upcomingSorted.map(renderMeetupCard)}
              </ul>
            )}
          </section>

          <section className="profile-section">
            <div className="profile-section-header">
              <h3>Tidigare meetups</h3>
              <span>{past.length} st</span>
            </div>
            {past.length === 0 ? (
              <p className="profile-empty-state">
                Inga tidigare meetups ännu – du är på god väg!
              </p>
            ) : (
              <ul className="profile-meetup-list">
                {pastSorted.map(renderMeetupCard)}
              </ul>
            )}
          </section>
        </>
      )}
    </section>
  );
};

export default ProfilePanel;
