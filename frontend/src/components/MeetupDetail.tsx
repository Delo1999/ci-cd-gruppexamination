import React, { useMemo, useState } from "react";
import { Meetup, Review } from "./MeetupList";

type MeetupDetailProps = {
  meetup: Meetup;
  spotsLeft: number;
  isFull: boolean;
  registrationMessage: { type: "success" | "error"; text: string } | null;
  reviews: Review[];
  onSubmitReview: (review: {
    author: string;
    rating: number;
    comment: string;
  }) => void;
  onRegister: () => void;
  onUnregister?: () => void;
  isRegistered?: boolean;
  onBack: () => void;
};

const MeetupDetail: React.FC<MeetupDetailProps> = ({
  meetup,
  spotsLeft,
  isFull,
  registrationMessage,
  reviews,
  onSubmitReview,
  onRegister,
  onUnregister,
  isRegistered = false,
  onBack,
}) => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState<number | "">("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return null;
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const handleReviewSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (reviewRating === "" || reviewComment.trim().length < 5) {
      setReviewError("Välj ett betyg och skriv minst 5 tecken.");
      return;
    }

    onSubmitReview({
      author: reviewAuthor,
      rating: Number(reviewRating),
      comment: reviewComment,
    });

    setReviewAuthor("");
    setReviewRating("");
    setReviewComment("");
    setReviewError(null);
    setReviewFeedback("Tack! Din recension har sparats.");
    setIsReviewFormOpen(false);
  };

  const renderStars = (rating: number) => {
    const filled = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return `${filled}${empty}`;
  };

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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

      <div className="meetup-detail-actions">
        <button
          className="register-button-home"
          onClick={onRegister}
          disabled={isFull || isRegistered}
        >
          {isFull ? "Fullbokad" : isRegistered ? "Redan anmäld" : "Anmäl dig"}
        </button>
        {isRegistered && onUnregister && (
          <button className="unregister-button" onClick={onUnregister}>
            Avregistrera
          </button>
        )}
      </div>

      <section className="review-section">
        <div className="review-section-header">
          <div>
            <p className="eyebrow">Recensioner</p>
            {averageRating ? (
              <h3>
                {averageRating} / 5 · {reviews.length}{" "}
                {reviews.length === 1 ? "recension" : "recensioner"}
              </h3>
            ) : (
              <h3>Bli först med en recension</h3>
            )}
          </div>
          <button
            className="review-toggle-button"
            onClick={() => {
              setIsReviewFormOpen((prev) => !prev);
              setReviewError(null);
              setReviewFeedback(null);
            }}
          >
            {isReviewFormOpen ? "Avbryt" : "Betygsätt och recensera"}
          </button>
        </div>

        {reviewFeedback && (
          <p className="review-feedback" role="status">
            {reviewFeedback}
          </p>
        )}

        {isReviewFormOpen && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <label>
              Namn (valfritt)
              <input
                type="text"
                value={reviewAuthor}
                onChange={(event) => setReviewAuthor(event.target.value)}
                placeholder="Skriv ditt namn"
              />
            </label>
            <label>
              Betyg
              <select
                value={reviewRating}
                onChange={(event) =>
                  setReviewRating(
                    event.target.value ? Number(event.target.value) : ""
                  )
                }
              >
                <option value="">Välj betyg</option>
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} / 5
                  </option>
                ))}
              </select>
            </label>
            <label>
              Recension
              <textarea
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Dela dina insikter..."
                rows={4}
              />
            </label>

            {reviewError && (
              <p className="review-error" role="alert">
                {reviewError}
              </p>
            )}

            <button
              type="submit"
              className="register-button-home"
              disabled={reviewRating === "" || reviewComment.trim().length < 5}
            >
              Skicka recension
            </button>
          </form>
        )}

        {reviews.length > 0 && (
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-card">
                <div className="review-card-header">
                  <span className="review-author">{review.author}</span>
                  <span
                    className="review-rating"
                    aria-label={`${review.rating} av 5`}
                  >
                    {renderStars(review.rating)}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <span className="review-date">
                  {formatDate(review.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
};

export default MeetupDetail;
