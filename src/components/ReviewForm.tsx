import React, { useState } from "react";
type Review = {
  id: number;
  appName: string;
  reviewer: string;
  rating: number;
  comment: string;
};

interface Props {
  onAddReview: (review: Review) => void;
}

const ReviewForm: React.FC<Props> = ({ onAddReview }) => {
  const [review, setReview] = useState<
    Omit<Review, "id">
  >({
    appName: "",
    reviewer: "",
    rating: 0,
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.appName || !review.reviewer || !review.rating) return;
    onAddReview({ ...review, id: Date.now() });
    setReview({ appName: "", reviewer: "", rating: 0, comment: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Add a Review</h2>
      <input
        type="text"
        placeholder="App name"
        className="block w-full p-2 border rounded mb-3"
        value={review.appName}
        onChange={(e) => setReview({ ...review, appName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Your name"
        className="block w-full p-2 border rounded mb-3"
        value={review.reviewer}
        onChange={(e) => setReview({ ...review, reviewer: e.target.value })}
      />
      <input
        type="number"
        placeholder="Rating (1–5)"
        className="block w-full p-2 border rounded mb-3"
        min={1}
        max={10}
        value={review.rating}
        onChange={(e) =>
          setReview({ ...review, rating: Number(e.target.value) })
        }
      />
      <textarea
        placeholder="Comment"
        className="block w-full p-2 border rounded mb-3"
        value={review.comment}
        onChange={(e) => setReview({ ...review, comment: e.target.value })}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
