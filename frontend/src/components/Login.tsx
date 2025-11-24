import React, { useState } from "react";
import "./Register.css";

interface LoginProps {
  onLoginSuccess?: (user: { id: number; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl =
    process.env.REACT_APP_API_URL ||
    "https://ci-cd-gruppexamination-yq4y.onrender.com/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!email || !password) {
      setMessage("E-post och lösenord krävs");
      setMessageType("error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Inloggning lyckades!");
        setMessageType("success");
        setPassword("");

        if (onLoginSuccess) {
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 300);
        }
      } else {
        setMessage(data.error || "Inloggning misslyckades. Försök igen.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Ett fel uppstod. Kontrollera att backend är igång.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Logga in</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">E-postadress</label>
            <input
              type="email"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Lösenord</label>
            <input
              type="password"
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ditt lösenord"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          {message && <div className={`message ${messageType}`}>{message}</div>}
          <button
            className="register-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loggar in..." : "Logga in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
