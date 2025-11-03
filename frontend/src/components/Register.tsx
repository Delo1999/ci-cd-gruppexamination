import React, { useState } from "react";
import "./Register.css";

interface RegisterProps {
  onRegisterSuccess?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    // Validation
    if (!email || !password || !confirmPassword) {
      setMessage("Alla fält måste fyllas i");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Lösenorden matchar inte");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message || "Registrering lyckades! Du kan nu logga in."
        );
        setMessageType("success");
        // Reset form
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Call success callback if provided
        if (onRegisterSuccess) {
          setTimeout(() => {
            onRegisterSuccess();
          }, 2000);
        }
      } else {
        setMessage(data.error || "Registrering misslyckades. Försök igen.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Ett fel uppstod. Kontrollera att backend är igång.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registrera dig</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-postadress</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minst 6 tecken"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Bekräfta lösenord</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Upprepa lösenordet"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          {message && <div className={`message ${messageType}`}>{message}</div>}
          <button
            type="submit"
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Registrerar..." : "Registrera"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
