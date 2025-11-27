import React from "react";
import { Meetup } from "./MeetupList";

type MeetupDetailProps = {
  meetup: Meetup;
  onBack: () => void;
};

const MeetupDetail: React.FC<MeetupDetailProps> = ({ meetup, onBack }) => {
  return (
    <section className="meetup-detail">
      <button className="back-button" onClick={onBack}>
        ← Tillbaka till meetups
      </button>

      <header>
        <p className="eyebrow">Meetup</p>
        <h2>{meetup.title}</h2>
        <p className="meetup-card-datetime">{meetup.datetime}</p>
      </header>

      <div className="meetup-detail-grid">
        <div className="meetup-detail-card">
          <h3>Beskrivning</h3>
          <p>{meetup.description}</p>
        </div>

        <div className="meetup-detail-card">
          <h3>Detaljer</h3>
          <ul>
            <li>
              <strong>Plats:</strong> {meetup.location}
            </li>
            <li>
              <strong>Värd:</strong> {meetup.host}
            </li>
          </ul>
        </div>
      </div>

      <button className="register-button-home">Intresseanmälan</button>
    </section>
  );
};

export default MeetupDetail;
