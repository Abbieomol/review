import React from "react";
import type { Review } from "../types/review";

interface Props {
  reviews: Review[];
  onDelete: (id: number) => void;
}

const ReviewList: React.FC<Props> = ({ reviews, onDelete }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Total Reviews: {reviews.length}
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border rounded shadow bg-gray-50 relative"
          >
            <button
              onClick={() => onDelete(review.id)}
              className="absolute top-2 right-2 text-red-500 font-bold"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold">{review.appName}</h3>
            <p>
              <strong>By:</strong> {review.reviewer}
            </p>
            <p>
              <strong>Rating:</strong> {review.rating}/5
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
