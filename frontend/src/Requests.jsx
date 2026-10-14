import { useEffect, useRef, useState } from "react";
import "./Requests.css";

const API_URL = "http://localhost:5000/api";

const emptyForm = {
  company: "",
  eventName: "",
  eventDate: "",
  location: "",
  expectedAudience: "",
  description: "",
  requestedSupport: "",
  sponsorBenefits: "",
};

const inputFields = [
  {
    name: "eventName",
    label: "Event name",
    type: "text",
    maxLength: 150,
  },
  {
    name: "eventDate",
    label: "Event date",
    type: "date",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    maxLength: 300,
  },
  {
    name: "expectedAudience",
    label: "Expected audience",
    type: "number",
    min: 1,
    max: 10000000,
    step: 1,
  },
];

const textFields = [
  {
    name: "description",
    label: "Event description",
    max: 5000,
  },
  {
    name: "requestedSupport",
    label: "Requested support",
    max: 2000,
    placeholder: "Example: LKR 50,000, refreshments, or equipment",
  },
  {
    name: "sponsorBenefits",
    label: "Benefits for the sponsor",
    max: 2000,
    placeholder: "Example: Logo on posters and recognition during the event",
  },
];

function Requests({ user, token }) {
  const [form, setForm] = useState({ ...emptyForm });
  const [companies, setCompanies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [proposal, setProposal] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPage() {
      setLoading(true);
      setLoadError("");

      try {
        async function readData(path, authenticated = false) {
          const response = await fetch(`${API_URL}/${path}`, {
            signal: controller.signal,
            headers: authenticated
              ? { Authorization: `Bearer ${token}` }
              : {},
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Unable to load requests");
          }

          return data;
        }

        const [companyData, requestData] = await Promise.all([
          readData("companies"),
          readData("requests/mine", true),
        ]);

        if (
          !Array.isArray(companyData.companies) ||
          !Array.isArray(requestData.requests)
        ) {
          throw new Error("Unexpected response from the server");
        }

        setCompanies(companyData.companies);
        setRequests(requestData.requests);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(error.message || "Unable to load the page");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => controller.abort();
  }, [token, refresh]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function submitRequest(event) {
    event.preventDefault();
    setSubmitError("");
    setMessage("");

    if (proposal && proposal.size > 5 * 1024 * 1024) {
      setSubmitError("The PDF must be 5 MB or smaller.");
      return;
    }

    if (proposal && !/\.pdf$/i.test(proposal.name)) {
      setSubmitError("Please select a PDF document.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([name, value]) => {
        formData.append(name, value);
      });

      if (proposal) {
        formData.append("proposal", proposal);
      }

      const response = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: AbortSignal.timeout(30000),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not submit your request");
      }

      setForm({ ...emptyForm });
      setProposal(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(data.message || "Your sponsorship request was submitted.");
      setRefresh((previous) => previous + 1);
    } catch (error) {
      setSubmitError(
        error.name === "TimeoutError"
          ? "Request timed out. Reload your requests before submitting again."
          : error.message || "Could not submit your request."
      );
    } finally {
      setSaving(false);
    }
  }

  async function downloadFile(requestId) {
    setDownloadError("");

    try {
      const response = await fetch(
        `${API_URL}/requests/${requestId}/proposal`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: AbortSignal.timeout(30000),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "proposal.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setDownloadError(
        error.message || "Could not download the PDF."
      );
    }
  }

  if (loading) {
    return (
      <section className="dashboard-section" role="status">
        Loading your requests...
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="dashboard-section">
        <p className="notice error" role="alert">
          {loadError}
        </p>

        <button
          className="text-button"
          type="button"
          onClick={() => setRefresh((previous) => previous + 1)}
        >
          Try again
        </button>
      </section>
    );
  }

  return (
    <div className="requests-page">
      {["user", "admin"].includes(user.role) && (
        <section className="dashboard-section">
          <h2>Submit a sponsorship request</h2>

          {companies.length === 0 ? (
            <p>
              An admin must add a company before you can submit a request.
            </p>
          ) : (
            <form onSubmit={submitRequest}>
              <fieldset disabled={saving} className="request-form">
                <label htmlFor="request-company">
                  Sponsorship company

                  <select
                    id="request-company"
                    name="company"
                    value={form.company}
                    onChange={updateForm}
                    required
                  >
                    <option value="">Select a company</option>

                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </label>

                {inputFields.map((field) => (
                  <label
                    key={field.name}
                    htmlFor={`request-${field.name}`}
                  >
                    {field.label}

                    <input
                      id={`request-${field.name}`}
                      name={field.name}
                      type={field.type}
                      value={form[field.name]}
                      onChange={updateForm}
                      maxLength={field.maxLength}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      required
                    />
                  </label>
                ))}

                {textFields.map((field) => (
                  <label
                    key={field.name}
                    htmlFor={`request-${field.name}`}
                  >
                    {field.label}

                    <textarea
                      id={`request-${field.name}`}
                      name={field.name}
                      value={form[field.name]}
                      onChange={updateForm}
                      maxLength={field.max}
                      placeholder={field.placeholder}
                      rows={4}
                      required
                    />
                  </label>
                ))}

                <label htmlFor="proposal-file">
                  Attach proposal PDF — optional

                  <input
                    id="proposal-file"
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(event) => {
                      setProposal(event.target.files?.[0] || null);
                    }}
                  />

                  <small>One PDF document, maximum 5 MB.</small>
                </label>

                <button className="primary-button" type="submit">
                  {saving ? "Submitting..." : "Submit request"}
                </button>
              </fieldset>
            </form>
          )}

          {submitError && (
            <p className="notice error" role="alert">
              {submitError}
            </p>
          )}

          {message && (
            <p className="notice success" role="status">
              {message}
            </p>
          )}
        </section>
      )}

      <section className="dashboard-section">
        <h2>My sponsorship requests</h2>

        {downloadError && (
          <p className="notice error" role="alert">
            {downloadError}
          </p>
        )}

        {requests.length === 0 && (
          <p>You have not submitted any requests yet.</p>
        )}

        <div className="request-list">
          {requests.map((request) => (
            <article className="request-card" key={request._id}>
              <span className="request-status">
                {request.status}
              </span>

              <h3>{request.eventName}</h3>

              <p>
                <strong>Company:</strong>{" "}
                {request.company?.name || "Company unavailable"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {request.eventDate?.slice(0, 10)}
              </p>

              <p>
                <strong>Location:</strong> {request.location}
              </p>

              <p>
                <strong>Expected audience:</strong>{" "}
                {request.expectedAudience}
              </p>

              {request.proposalName && (
                <p>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => downloadFile(request._id)}
                  >
                    Download proposal: {request.proposalName}
                  </button>
                </p>
              )}

              <details>
                <summary>View proposal details</summary>

                <h4>Event description</h4>
                <p>{request.description}</p>

                <h4>Requested support</h4>
                <p>{request.requestedSupport}</p>

                <h4>Sponsor benefits</h4>
                <p>{request.sponsorBenefits}</p>
              </details>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Requests;