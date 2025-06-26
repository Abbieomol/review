import { useEffect, useState } from "react";
import reviewLogo from "./assets/review.jpeg";
import "./App.css";


const backend_api_url = "http://127.0.0.1:8000/api/reviews/";

type Review = {
  id?: number;
  app_name: string;
  reviewer: string;
  review: string;
  comment?: string; // Optional field for comments
  rating: number;
  image: string; // base64 or URL
};

export default function App() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState<Review>({
    app_name: "",
    reviewer: "",
    review: "",
    rating: 1,
    image: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetch(backend_api_url)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

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

  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `${backend_api_url}${editingId}/` : backend_api_url;

  const formData = new FormData();
  formData.append("app_name", form.app_name);
  formData.append("reviewer", form.reviewer);
  formData.append("review", form.review);
  formData.append("comment", form.comment || ""); // Ensure comment is included
  formData.append("rating", form.rating.toString());

  if (form.image) {
    const blob = await (await fetch(form.image)).blob();
    formData.append("image", blob, "image.png");
  }

  try {
    const token = localStorage.getItem("access");
    const response = await fetch(url, {
      method,
      ...(token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {}),
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json();
      const message = errData.detail || "Something went wrong while saving the review.";
      setError(message);
      return;
    }

    const savedReview = await response.json();
    setReviews((prev) =>
      editingId
        ? prev.map((r) => (r.id === editingId ? savedReview : r))
        : [...prev, savedReview]
    );
    setForm({
      app_name: "",
      reviewer: "",
      review: "",
      comment: "",
      rating: 1,
      image: "",
    });
    setImagePreview(null);
    setEditingId(null);
  } catch {
    setError("Network error or server is down.");
  }
};
  const [error, setError] = useState<string | null>(null);  



  const editReview = (review: Review) => {
    setForm({
      app_name: review.app_name,
      reviewer: review.reviewer,
      review: review.review,
      comment: review.comment || "",
      rating: review.rating,
      image: review.image || "",
    });
    setImagePreview(review.image || null);
    if (typeof review.id === "number") {
      setEditingId(review.id);
    } else {
      setEditingId(null);
    }
  };

  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Pacifico&family=Quicksand:wght@500;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    document.body.style.backgroundColor = "#87ceeb";
    

    return () => {
      document.body.style.backgroundColor = "";
      document.head.removeChild(fontLink);
    };
  }, []);

  console.log('reviews',reviews)

  // Function to delete a review
  const deleteReview = async (id: number) => {
    try {
      const token = localStorage.getItem("access");
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
    } catch {
      setError("Network error or server is down.");
    }
  };

  return (
    <div className="app-container">
      <img src={reviewLogo} alt="Review Logo" className="review-logo review-logo-centered" />
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 shadow-xl rounded-2xl px-10 pt-8 pb-10 mb-8 border border-purple-200"
      >
        <div className="mb-6">
          <label className="block font-semibold mb-1">
            <span className="text-purple-700">App Name</span>
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            name="app_name"
            value={form.app_name}
            onChange={handleChange}
            className="w-full border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
            placeholder="Enter app name"
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">
            <span className="text-pink-700">Reviewer</span>
            <span className="text-red-600 ml-1">*</span>
          </label>
          <input
            type="text"
            name="reviewer"
            value={form.reviewer}
            onChange={handleChange}
            className="w-full border-2 border-pink-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            required
            placeholder="Enter reviewer name"
            title="Reviewer"
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">
            <span className="text-yellow-700">Comment</span>
            <span className="text-red-600 ml-1">*</span>
          </label>
          <textarea
            typeof="text"
            name="comment"
            value={form.comment}
            onChange={handleChange}
            className="w-full border-2 border-yellow-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            required
            placeholder="Write your review"
            title="Comment"
          />
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">
            <span className="text-green-700">Rating</span>
            <span className="text-red-600 ml-1">*</span>
          </label>
          <select
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full border-2 border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            title="Rating"
            required
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block font-semibold mb-1">
            <span className="text-blue-700">Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border-2 border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            title="Upload an image"
            placeholder="Choose an image file"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 rounded-lg shadow-md"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 font-semibold transition-all duration-300 ease-in-out hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {editingId ? "Update Review" : "Submit Review"}
        </button>
      </form>
      <div className="reviews-container custom-reviews-container">
        <h2 className="reviews-title custom-reviews-title">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet.</p>
        ) : (
          <div className="reviews-table-wrapper">
            <table className="reviews-table">
              <thead>
                <tr className="reviews-table-header-row">
                  <th className="reviews-table-header">App Name</th>
                  <th className="reviews-table-header">Reviewer</th>
                  <th className="reviews-table-header">Review</th>
                  <th className="reviews-table-header">Comment</th>
                  <th className="reviews-table-header">Rating</th>
                  <th className="reviews-table-header">Image</th>
                  <th className="reviews-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="reviews-table-row">
                    <td className="reviews-table-cell">{r.app_name}</td>
                    <td className="reviews-table-cell">{r.reviewer}</td>
                    <td className="reviews-table-cell review-text">{r.review}</td>
                    <td className="reviews-table-cell">{r.comment || "No comment"}</td>
                    <td className="reviews-table-cell">{r.rating}</td>
                    <td className="reviews-table-cell">
                      {r.image && (
                        <img
                          src={r.image}
                          alt="Review"
                          className="review-image"
                        />
                      )}
                    </td>
                    <td className="reviews-table-cell">
        <button
          type="button"
          onClick={() => r.id !== undefined && editReview(r)}
          className="edit-btn"
          title="Edit Review"
        >
          Edit
        </button>
                      <button
                        type="button"
                        onClick={() => r.id !== undefined && deleteReview(r.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

