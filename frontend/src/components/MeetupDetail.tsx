import React from "react";
import { Meetup } from "./MeetupList";

type MeetupDetailProps = {
  meetup: Meetup;
  spotsLeft: number;
  isFull: boolean;
  registrationMessage: { type: "success" | "error"; text: string } | null;
  onRegister: () => void;
  onBack: () => void;
};

const MeetupDetail: React.FC<MeetupDetailProps> = ({
  meetup,
  spotsLeft,
  isFull,
  registrationMessage,
  onRegister,
  onBack,
}) => {
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
            <li>
              <strong>Platser:</strong>{" "}
              {isFull
                ? "Fullbokat – inga platser kvar"
                : `${spotsLeft} av ${meetup.capacity} platser kvar`}
            </li>
          </ul>
        </div>
      </div>

      {registrationMessage && (
        <div
          className={`registration-message registration-message-${registrationMessage.type}`}
          role="status"
        >
          {registrationMessage.text}
        </div>
      )}

      <button
        className="register-button-home"
        onClick={onRegister}
        disabled={isFull}
      >
        {isFull ? "Fullbokad" : "Anmäl dig"}
      </button>
    </section>
  );
};

export default MeetupDetail;
