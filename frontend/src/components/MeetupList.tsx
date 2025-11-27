import React from "react";

export type Meetup = {
  id: string;
  title: string;
  datetime: string;
  location: string;
  host: string;
  description: string;
};

type MeetupListProps = {
  meetups: Meetup[];
  onSelect: (meetup: Meetup) => void;
};

const MeetupList: React.FC<MeetupListProps> = ({ meetups, onSelect }) => {
  return (
    <section className="meetup-section">
      <header className="meetup-section-header">
        <p className="eyebrow">Kommande events</p>
        <h2>Utforska meetups du gillar</h2>
        <p className="supporting-copy">
          Hitta meetups som matchar dina intressen. Klicka på ett event för att
          se mer information och anmäl dig.
        </p>
      </header>

      {meetups.length === 0 ? (
        <div className="meetup-list-empty">
          <p>Inga meetups matchar din sökning.</p>
          <p>Justera dina nyckelord och försök igen.</p>
        </div>
      ) : (
        <div className="meetup-list">
          {meetups.map((meetup) => (
            <article key={meetup.id} className="meetup-card">
              <div className="meetup-card-body">
                <p className="meetup-card-datetime">{meetup.datetime}</p>
                <h3>{meetup.title}</h3>
                <p className="meetup-card-description">{meetup.description}</p>
                <div className="meetup-card-meta">
                  <span>📍 {meetup.location}</span>
                  <span>👤 {meetup.host}</span>
                </div>
              </div>
              <button
                className="meetup-card-button"
                onClick={() => onSelect(meetup)}
              >
                Visa mer
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MeetupList;
