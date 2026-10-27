import { useEffect, useRef, useState } from "react";
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
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [listError, setListError] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);
  const nameInput = useRef(null);
  const busy = saving || deletingId !== null;
  // FIX: Identify the manager's assigned company.
const isAdmin = user.role === "admin";
const assignedCompanyId =
  typeof user.company === "string"
    ? user.company
    : user.company?._id;

function canEditCompany(company) {
  return (
    isAdmin ||
    (user.role === "company" &&
      assignedCompanyId &&
      String(assignedCompanyId) === String(company._id))
  );
}

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

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormError("");
  }

  function startEditing(company) {
    setEditingId(company._id);
    setForm(Object.fromEntries(
      Object.keys(emptyForm).map((field) => [field, company[field] || ""])
    ));
    setFormError("");
    setActionError("");
    setMessage("");
    nameInput.current?.focus();
  }

  async function handleDelete(company) {
    if (busy || !window.confirm(`Delete "${company.name}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(company._id);
    setActionError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${company._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete company");
      }

      setCompanies((previous) => previous.filter((item) => item._id !== company._id));
      if (editingId === company._id) resetForm();
      setMessage("Company deleted successfully.");
    } catch (error) {
      setActionError(
        error.name === "TimeoutError"
          ? "Request timed out. Reload the list before trying again."
          : error.message || "Check that the backend is running."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    setSaving(true);
    setFormError("");
    setActionError("");
    setMessage("");

    try {
      const response = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
        signal: AbortSignal.timeout(15000),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || (editingId ? "Unable to update company" : "Unable to add company"));
      }

      resetForm();
      setMessage(editingId ? "Company updated successfully." : "Company added successfully.");
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
      {(isAdmin || (user.role === "company" && editingId)) && (
        <section className="dashboard-section company-admin-section">
          <h2>{editingId ? "Edit company" : "Add company"}</h2>
          <p>Enter the company’s public contact details.</p>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={busy} className="company-form">
              {fields.map((field) => (
                <label key={field.name} htmlFor={`company-${field.name}`}>
                  {field.label}
                  {field.required ? " *" : ""}

                  <input
                    ref={field.name === "name" ? nameInput : undefined}
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

              <div className="company-form-actions">
                <button type="submit" className="primary-button">
                  {saving ? "Saving..." : editingId ? "Save changes" : "Add company"}
                </button>
                {editingId && (
                  <button type="button" className="text-button" onClick={resetForm}>
                    Cancel edit
                  </button>
                )}
              </div>
            </fieldset>
          </form>

          {formError && (
            <p className="notice error" role="alert">{formError}</p>
          )}

        </section>
      )}

      <section className="dashboard-section company-list-section">
        <h2>Sponsorship companies</h2>

        {message && <p className="notice success" role="status">{message}</p>}
        {actionError && <p className="notice error" role="alert">{actionError}</p>}

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
               {/* FIX: Show Edit only for admins or this company's manager. */}
{canEditCompany(company) && (
  <div className="company-card-actions">
    <button
      type="button"
      className="text-button"
      disabled={busy}
      onClick={() => startEditing(company)}
      aria-label={`Edit ${company.name}`}
    >
      Edit
    </button>

    {/* FIX: Delete remains restricted to admins. */}
    {isAdmin && (
      <button
        type="button"
        className="company-delete-button"
        disabled={busy}
        onClick={() => handleDelete(company)}
        aria-label={`Delete ${company.name}`}
      >
        {deletingId === company._id ? "Deleting..." : "Delete"}
      </button>
    )}
  </div>
)}
              
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Companies;
