import overviewImage from "./assets/sponsor-overview.png";
import { useState } from "react";
import "./Dashboard.css";
import Companies from "./Companies";
import Requests from "./Requests";
import Messages from "./Messages";

const pages = [
  "Overview",
  "Companies",
  "My requests",
  "Messages",
  "Profile",
];

function Dashboard({ user, token, onLogout })  {
  const [activePage, setActivePage] = useState("Overview");

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h2>SponsorConnect</h2>
        <p className="sidebar-description">
          Find support for your next event.
        </p>

        <nav aria-label="Dashboard navigation">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={activePage === page ? "nav-item active" : "nav-item"}
              aria-current={activePage === page ? "page" : undefined}
              onClick={() => setActivePage(page)}
            >
              {page}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="dashboard-logout"
          onClick={onLogout}
        >
          Log out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">YOUR WORKSPACE</p>
            <h1>{activePage}</h1>
          </div>

          <span className="dashboard-user">{user.full_name}</span>
        </header>

{activePage === "Overview" && (
  <div className="sc-overview">
    {/* Welcome banner with a working navigation button */}
    <section className="dashboard-banner sc-overview-banner">
      <h2>Welcome, {user.full_name}!</h2>

      <p>
        Find potential sponsors and manage your event proposals
        in one place.
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={() => setActivePage("Companies")}
      >
        Explore companies <span aria-hidden="true">→</span>
      </button>
    </section>

    {/* Illustration and journey share one panel */}
    <section
      className="sc-journey-panel"
      aria-labelledby="sponsorship-journey-title"
    >
      <div className="sc-journey-art">
        <img
          src={overviewImage}
          alt="SponsorConnect brings events, proposals, partnerships and communication together"
        />
      </div>

      <div className="sc-journey-content">
        <h2 id="sponsorship-journey-title">
          Your sponsorship journey
        </h2>

        <ol className="sc-journey-steps">
          <li>Find a company that suits your event.</li>
          <li>Submit event details and your proposal document.</li>
          <li>Check your submitted requests.</li>
          <li>Discuss the proposal through messages.</li>
        </ol>
      </div>
    </section>
  </div>
)}

        {activePage === "Companies" && (
  <Companies user={user} token={token} />
)}

               {activePage === "My requests" && (
          <Requests user={user} token={token} />
        )}

        {activePage === "Messages" && (
          <Messages user={user} token={token} />
        )} 

        {activePage === "Messages" && (
          <section className="dashboard-section">
            <h2>Company conversations</h2>
            <p>
              We will add conversations linked to each sponsorship request.
            </p>
          </section>
        )}

        {activePage === "Profile" && (
          <section className="dashboard-section">
            <h2>Your account</h2>
            <dl className="dashboard-profile">
              <dt>Full name</dt>
              <dd>{user.full_name}</dd>

              <dt>Email</dt>
              <dd>{user.email}</dd>

              <dt>Current account role</dt>
              <dd>{user.role}</dd>
            </dl>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;