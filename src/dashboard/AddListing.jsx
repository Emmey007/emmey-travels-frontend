import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateInstance } from "../api/axios";

// File inputs can't be restored programmatically for security reasons
// (browsers block setting input[type=file].value via JS), so the image
// field is intentionally excluded from persistence — everything else
// survives a reload or a navigate-away-and-back.
const STORAGE_KEY = "addListingFormData";

const getSavedValues = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

export const AddListing = () => {
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: getSavedValues() });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Persist every field except the file input on every change
  useEffect(() => {
    const subscription = watch((values) => {
      const { image, ...rest } = values;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "image") {
          formData.append("image", data.image[0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      await privateInstance.post("/listing", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      sessionStorage.removeItem(STORAGE_KEY);
      reset();
      setSuccess("Listing created successfully");
      setTimeout(() => navigate("/dashboard/listings"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Add Listing</h1>
      <p style={styles.subtitle}>Create a new travel listing</p>

      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                placeholder="e.g. Lagos to Dubai Flight"
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p style={styles.fieldError}>{errors.title.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Type</label>
              <select
                style={styles.input}
                {...register("type", { required: "Type is required" })}
              >
                <option value="">Select type</option>
                <option value="flight">Flight</option>
                <option value="bus">Bus</option>
                <option value="ship-cruise">Ship Cruise</option>
                <option value="boat-cruise">Boat Cruise</option>
              </select>
              {errors.type && (
                <p style={styles.fieldError}>{errors.type.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Origin</label>
              <input
                style={styles.input}
                placeholder="e.g. Lagos"
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("origin", { required: "Origin is required" })}
              />
              {errors.origin && (
                <p style={styles.fieldError}>{errors.origin.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Destination</label>
              <input
                style={styles.input}
                placeholder="e.g. Dubai"
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("destination", {
                  required: "Destination is required",
                })}
              />
              {errors.destination && (
                <p style={styles.fieldError}>{errors.destination.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Continent</label>
              <select
                style={styles.input}
                {...register("continent", {
                  required: "Continent is required",
                })}
              >
                <option value="">Select continent</option>
                <option value="Africa">Africa</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Americas">Americas</option>
                <option value="Oceania">Oceania</option>
              </select>
              {errors.continent && (
                <p style={styles.fieldError}>{errors.continent.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Price (₦)</label>
              <input
                type="number"
                style={styles.input}
                placeholder="e.g. 250000"
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("price", { required: "Price is required" })}
              />
              {errors.price && (
                <p style={styles.fieldError}>{errors.price.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Currency</label>
              <select style={styles.input} {...register("currency")}>
                <option value="NGN">NGN (₦)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Seats Available</label>
              <input
                type="number"
                style={styles.input}
                placeholder="e.g. 50"
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("seatsAvailable", {
                  required: "Seats is required",
                })}
              />
              {errors.seatsAvailable && (
                <p style={styles.fieldError}>{errors.seatsAvailable.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Departure Date</label>
              <input
                type="date"
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("departureDate", {
                  required: "Departure date is required",
                })}
              />
              {errors.departureDate && (
                <p style={styles.fieldError}>{errors.departureDate.message}</p>
              )}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Return Date (optional)</label>
              <input
                type="date"
                style={styles.input}
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("returnDate")}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Duration (optional)</label>
              <input
                style={styles.input}
                placeholder="e.g. 6 hours"
                onFocus={(e) => (e.target.style.borderColor = "#111")}
                onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                {...register("duration")}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Image</label>
              <input
                type="file"
                accept="image/*"
                style={styles.input}
                {...register("image", { required: "Image is required" })}
              />
              {errors.image && (
                <p style={styles.fieldError}>{errors.image.message}</p>
              )}
              <p style={styles.imageHint}>
                Note: the selected image can't be restored after a reload —
                you'll need to re-select it if the page refreshes.
              </p>
            </div>
          </div>

          <div style={{ ...styles.field, gridColumn: "span 2" }}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              placeholder="Describe the travel experience..."
              onFocus={(e) => (e.target.style.borderColor = "#111")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
              {...register("description")}
            />
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate("/dashboard/listings")}
            >
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Creating..." : "Create listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "4px",
    letterSpacing: "-0.5px",
  },
  subtitle: { fontSize: "13px", color: "#888", marginBottom: "24px" },
  formCard: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  field: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "11px 13px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#111",
    background: "#fff",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "11px 13px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    color: "#111",
    background: "#fff",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
    minHeight: "100px",
    resize: "vertical",
  },
  fieldError: { color: "#c00", fontSize: "12px", marginTop: "4px" },
  imageHint: {
    fontSize: "11px",
    color: "#999",
    marginTop: "6px",
    lineHeight: "1.5",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
  },
  cancelBtn: {
    padding: "11px 24px",
    background: "#fff",
    color: "#111",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  submitBtn: {
    padding: "11px 24px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  error: {
    background: "#fff0f0",
    border: "1px solid #fcc",
    color: "#c00",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  success: {
    background: "#f0faf0",
    border: "1px solid #c3e6c3",
    color: "#2d7a2d",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },
};