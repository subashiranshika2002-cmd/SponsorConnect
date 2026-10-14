import { useEffect, useState } from "react";
import "./Companies.css";

const API_URL = "http://localhost:5000/api/companies";

const emptyForm = {
  name: "",
  description: "",
  email: "",
  phone: "",
  website: "",
  address: "",
};

const fields = [
  { name: "name", label: "Company name", max: 150, required: true },
  { name: "email", label: "Company email", max: 254, required: true },
  { name: "phone", label: "Phone number", max: 40 },
  { name: "website", label: "Website", max: 500 },
  { name: "address", label: "Address", max: 500 },
];

function Companies({ user, token }) {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listError, setListError] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCompanies() {
      setLoading(true);
      setListError("");

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load companies");
        }

        if (!Array.isArray(data.companies)) {
          throw new Error("Unexpected company response");
        }

        setCompanies(data.companies);
      } catch (error) {
        if (!controller.signal.aborted) {
          setListError(
            error.message || "Check that the backend is running."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCompanies();

    return () => controller.abort();
  }, [refresh]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(15000),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add company");
      }

      setForm({ ...emptyForm });
      setMessage("Company added successfully.");
      setRefresh((previous) => previous + 1);
    } catch (error) {
      setFormError(
        error.name === "TimeoutError"
          ? "Request timed out. Reload the list before trying again."
          : error.message || "Check that the backend is running."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="companies-page">
      {user.role === "admin" && (
        <section className="dashboard-section company-admin-section">
          <h2>Add company</h2>
          <p>Enter the company’s public contact details.</p>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={saving} className="company-form">
              {fields.map((field) => (
                <label key={field.name} htmlFor={`company-${field.name}`}>
                  {field.label}
                  {field.required ? " *" : ""}

                  <input
                    id={`company-${field.name}`}
                    name={field.name}
                    type={
                      field.name === "email"
                        ? "email"
                        : field.name === "website"
                          ? "url"
                          : field.name === "phone"
                            ? "tel"
                            : "text"
                    }
                    value={form[field.name]}
                    onChange={updateForm}
                    required={field.required}
                    maxLength={field.max}
                    placeholder={
                      field.name === "website" ? "https://example.com" : ""
                    }
                  />
                </label>
              ))}

              <label htmlFor="company-description">
                Company description
                <textarea
                  id="company-description"
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  maxLength={2000}
                  rows={4}
                />
              </label>

              <button type="submit" className="primary-button">
                {saving ? "Saving..." : "Add company"}
              </button>
            </fieldset>
          </form>

          {formError && (
            <p className="notice error" role="alert">{formError}</p>
          )}

          {message && (
            <p className="notice success" role="status">{message}</p>
          )}
        </section>
      )}

      <section className="dashboard-section company-list-section">
        <h2>Sponsorship companies</h2>

        {loading && <p role="status">Loading companies...</p>}

        {listError && (
          <div>
            <p className="notice error" role="alert">{listError}</p>
            <button
              type="button"
              className="text-button"
              onClick={() => setRefresh((previous) => previous + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !listError && companies.length === 0 && (
          <p>No companies have been added yet.</p>
        )}

        {!loading && !listError && (
          <div className="company-grid">
            {companies.map((company) => (
              <article className="company-card" key={company._id}>
                <h3>{company.name}</h3>
                {company.description && <p>{company.description}</p>}

                <dl>
                  <dt>Email</dt>
                  <dd>{company.email}</dd>

                  {company.phone && (
                    <>
                      <dt>Phone</dt>
                      <dd>{company.phone}</dd>
                    </>
                  )}

                  {company.website && (
                    <>
                      <dt>Website</dt>
                      <dd>{company.website}</dd>
                    </>
                  )}

                  {company.address && (
                    <>
                      <dt>Address</dt>
                      <dd>{company.address}</dd>
                    </>
                  )}
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Companies;