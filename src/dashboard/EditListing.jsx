import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { privateInstance } from "../api/axios";

export const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await privateInstance.get(`/listing/${id}`);
        const listing = res.data.listing;

        setImage(listing.image);

        // Dates come back as full ISO strings from Mongo — date inputs
        // need just the yyyy-mm-dd portion or they render empty
        reset({
          title: listing.title,
          type: listing.type,
          origin: listing.origin,
          destination: listing.destination,
          continent: listing.continent,
          price: listing.price,
          currency: listing.currency,
          seatsAvailable: listing.seatsAvailable,
          departureDate: listing.departureDate
            ? listing.departureDate.slice(0, 10)
            : "",
          returnDate: listing.returnDate ? listing.returnDate.slice(0, 10) : "",
          duration: listing.duration,
          description: listing.description,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await privateInstance.put(`/listing/${id}`, data);

      setSuccess("Listing updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await privateInstance.delete(`/listing/${id}`);
      navigate("/dashboard/listings");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing");
    }
  };

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (error && !success) return <p style={styles.error}>{error}</p>;

  return (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Edit Listing</h1>
          <p style={styles.subtitle}>Update or remove this listing</p>
        </div>
        <button
          style={styles.backBtn}
          onClick={() => navigate("/dashboard/listings")}
        >
          ← Back to listings
        </button>
      </div>

      {success && <p style={styles.success}>{success}</p>}
      {error && <p style={styles.errorBanner}>{error}</p>}

      <div style={styles.formCard}>
        {image && (
          <div style={styles.imagePreviewWrap}>
            <img src={image} alt="Current listing" style={styles.imagePreview} />
            <p style={styles.imageNote}>
              Current image — replacing it isn't supported yet.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
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
              <input type="date" style={styles.input} {...register("returnDate")} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Duration (optional)</label>
              <input style={styles.input} {...register("duration")} />
            </div>
          </div>

          <div style={{ ...styles.field, marginBottom: "20px" }}>
            <label style={styles.label}>Description</label>
            <textarea style={styles.textarea} {...register("description")} />
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              style={styles.deleteBtn}
              onClick={handleDelete}
            >
              Delete listing
            </button>
            <button type="submit" style={styles.submitBtn} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#111",
    marginBottom: "4px",
    letterSpacing: "-0.5px",
  },
  subtitle: { fontSize: "13px", color: "#888" },
  backBtn: {
    padding: "10px 18px",
    background: "#fff",
    color: "#111",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  formCard: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  imagePreviewWrap: { marginBottom: "24px" },
  imagePreview: {
    width: "220px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #eee",
    display: "block",
    marginBottom: "8px",
  },
  imageNote: { fontSize: "12px", color: "#999" },
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
    width: "100%",
    boxSizing: "border-box",
    minHeight: "100px",
    resize: "vertical",
  },
  fieldError: { color: "#c00", fontSize: "12px", marginTop: "4px" },
  formActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
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
  deleteBtn: {
    padding: "11px 24px",
    background: "#fff",
    color: "#e00",
    border: "1px solid #e00",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
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
  errorBanner: {
    background: "#fff0f0",
    border: "1px solid #fcc",
    color: "#c00",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
  },
  loading: { color: "#888", fontSize: "14px" },
  error: { color: "#c00", fontSize: "14px" },
};