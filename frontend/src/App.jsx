import { useState } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import loginImage from "./assets/sponser.png";

const API_URL = "http://localhost:5000/api/auth";

function App() {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  const isRegister = mode === "register";

  function switchMode() {
    setMode(isRegister ? "login" : "register");
    setMessage("");
    setError("");
    setPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const body = isRegister
        ? { full_name: fullName, email, password }
        : { email, password };

      const response = await fetch(`${API_URL}/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Request failed. Please try again.");
        return;
      }

      if (isRegister) {
        setMode("login");
        setPassword("");
        setMessage("Account created. Sign in with your email and password.");
      } else {
        if (!data.user || !data.token) {
          throw new Error("Unexpected login response");
        }

        setSession({
          user: data.user,
          token: data.token,
        });
        setPassword("");
      }
    } catch (requestError) {
      setError(
        requestError.name === "TimeoutError"
          ? "The request timed out. Please try again."
          : "Unable to complete the request. Check that your backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setSession(null);
    setPassword("");
    setError("");
    setMessage("");
  }

  if (session) {
  return (
    <Dashboard
      user={session.user}
      token={session.token}
      onLogout={logout}
    />
  );
}

  return (
    <main className="auth-layout">
      <section className="brand-panel">
        <p className="brand">SponsorConnect</p>

        <div className="brand-content">
          <span className="eyebrow">CONNECTIONS THAT MATTER</span>
          <h1>Build relationships.<br />Create opportunities.</h1>
          <img
  className="sponsor-login-image"
  src={loginImage}
  alt="A team collaborating in an office on sponsorship opportunities"
/>
          <p>
            A shared space for sponsorships, professional contacts,
            and meaningful partnerships.
          </p>
        </div>

        <p className="brand-footer">Your next partnership starts here.</p>
      </section>

      <section className="form-panel">
        <div className="form-card">
          <p className="eyebrow">WELCOME TO SPONSORCONNECT</p>

          <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>

          <p className="subtitle">
            {isRegister
              ? "Enter your details to get started."
              : "Sign in to your account."}
          </p>

          <form onSubmit={handleSubmit} aria-busy={loading}>
            <fieldset disabled={loading}>
              {isRegister && (
                <label htmlFor="full-name">
                  Full name
                  <input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                    maxLength={100}
                    required
                  />
                </label>
              )}

              <label htmlFor="email">
                Email address
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                  required
                />
              </label>

              <label htmlFor="password">
                Password
                <input
                  id="password"
                  type="password"
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  minLength={isRegister ? 8 : undefined}
                  required
                />
              </label>

              {isRegister && (
                <p className="password-hint">
                  Use at least 8 characters.
                </p>
              )}

              {error && (
                <p className="notice error" role="alert">
                  {error}
                </p>
              )}

              {message && (
                <p className="notice success" role="status">
                  {message}
                </p>
              )}

              <button className="primary-button" type="submit">
                {loading
                  ? "Please wait..."
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
              </button>
            </fieldset>
          </form>

          <p className="switch-text">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              className="text-button"
              onClick={switchMode}
              disabled={loading}
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;