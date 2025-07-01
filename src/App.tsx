import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import reviewLogo from "./assets/review.jpeg";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound.tsx";
import "./App.css";

const backend_api_url = "http://127.0.0.1:8000/api/reviews/";
const REVIEWS_PER_PAGE = 6;

type Review = {
  id?: number;
  customer_name: string;
  served_by: string;
  review: string;
  comment?: string;
  rating: number;
  image?: string;
};

function ReviewApp() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState<Review>({
    customer_name: "",
    served_by: "",
    review: "",
    comment: "",
    rating: 1,
    image: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) return;

    fetch(backend_api_url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Unexpected data format:", data);
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setReviews([]);
      });
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "rating" ? Number(value) : value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    toast.success(editingId ? "Review updated successfully!" : "Review uploaded successfully!");
    if (!token) {
      setError("You must be logged in to submit a review.");
      return;
    } 
    if (form.customer_name.trim() === "" || form.served_by.trim() === "") {
      setError("Customer name and served by fields cannot be empty.");
      return;
    }
    if (form.review.trim() === "") {
      setError("Please select a review option.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${backend_api_url}${editingId}/` : backend_api_url;

    const formData = new FormData();
    formData.append("customer_name", form.customer_name);
    formData.append("served_by", form.served_by);
    formData.append("review", form.review);
    formData.append("comment", form.comment || "");
    formData.append("rating", form.rating.toString());

    if (form.image) {
      const blob = await (await fetch(form.image)).blob();
      formData.append("image", blob, "image.png");
    }

    try {
      const response = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.detail || "Something went wrong while saving the review.");
        return;
      }

      const savedReview = await response.json();
      setReviews((prev) =>
        editingId
          ? prev.map((r) => (r.id === editingId ? savedReview : r))
          : [...prev, savedReview]
      );
      setForm({
        customer_name: "",
        served_by: "",
        review: "",
        comment: "",
        rating: 1,
        image: "",
      });
      setImagePreview(null);
      setEditingId(null);
      setStep(1);
      setSuccessMessage(editingId ? "Review updated successfully." : "Review uploaded successfully.");
    } catch {
      setError("Network error or server is down.");
    }
  };

  const editReview = (review: Review) => {
    setForm({
      customer_name: review.customer_name,
      served_by: review.served_by,
      review: review.review,
      comment: review.comment || "",
      rating: review.rating,
      image: review.image || "",
    });
    setImagePreview(review.image || null);
    setEditingId(typeof review.id === "number" ? review.id : null);
    setStep(1);
  };

  const deleteReview = async (id: number) => {
    try {
      const response = await fetch(`${backend_api_url}${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        setError("Failed to delete review.");
        return;
      }
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setSuccessMessage("Review deleted successfully.");
    } catch {
      setError("Network error or server is down.");
    }
    toast.success("Review deleted successfully!");
  
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  return (
    <div className="app-container">
      <div className="top-bar">
        <img src={reviewLogo} alt="Review Logo" className="review-logo" />
        <button onClick={handleLogout} className="logout-btn top-right">
          Logout
        </button>
      </div>

      {error && <div className="login-error">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="review-form">
        {step === 1 && (
          <>
            <input
              type="text"
              name="customer_name"
              placeholder="Your Name"
              value={form.customer_name}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setStep(2)}>Next</button>
          </>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
/>


        {step === 2 && (
          <>
            <input
              type="text"
              name="served_by"
              placeholder="Name of the person who served you"
              value={form.served_by}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={() => setStep(1)}>Previous</button>
            <button type="button" onClick={() => setStep(3)}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <label htmlFor="review-select" className="visually-hidden">Review</label>
            <select
              id="review-select"
              name="review"
              value={form.review}
              onChange={handleChange}
              required
              aria-label="Review"
            >
              <option value="">Select a review</option>
              <option value="poor">Poor</option>
              <option value="fair">Fair</option>
              <option value="average">Average</option>
              <option value="good">Good</option>
              <option value="excellent">Excellent</option>
            </select>
            <input
              type="text"
              name="comment"
              placeholder="(optional)"
              value={form.comment}
              onChange={handleChange}
            />
            <input
              type="number"
              name="rating"
              min={1}
              max={5}
              value={form.rating}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              title="Upload an image"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
            <div>
              <button type="button" onClick={() => setStep(2)}>Previous</button>
              <button type="submit">{editingId ? "Update" : "Add"} Review</button>
            </div>
          </>
        )}
      </form>

      <div className="reviews-list">
        <h2>Reviews</h2>
        <ul className="card-grid">
          {paginatedReviews.map((review) => (
            <li key={review.id} className="card-item review-list-item">
              <strong>{review.customer_name}</strong> by {review.served_by} - Rating: {review.rating}
              <br />
              {review.review}
              {review.comment && <div>Comment: {review.comment}</div>}
              {review.image && (
                <div>
                  <img src={review.image} alt="Review" className="review-image" />
                </div>
              )}
              <div className="review-actions">
                <button onClick={() => editReview(review)}>Edit</button>{" "}
                <button onClick={() => review.id && deleteReview(review.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("access"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <ReviewApp /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
