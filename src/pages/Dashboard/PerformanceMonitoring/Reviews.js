import React, { useEffect, useState } from "react";
import _api from "../../../utils/apis/_api";
import { Rating } from "@mui/material";
import toast from "react-hot-toast";

export default function Reviews() {
  const [reviewData, setReviewData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const GetReviews = async () => {
    setLoading(true);
    try {
      const res = await _api.get(`/triec-feedback/admin/${sessionStorage.getItem("userID")}/user-reviews`);
      const reviews = res.data.data.attribites;
      setReviewData(reviews);

      // Average rating
      const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
      const avgRating = totalRating / reviews.length;
      setAverageRating(avgRating);
    } catch (error) {
      if (error?.response?.data?.errors) {
        const apiErrors = error?.response?.data?.errors;
        const errorMessage = apiErrors?.map((err) => err.detail)?.join(", ");
        toast.error(errorMessage, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      }
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
        return;
      } else {
        toast.error("An error occurred", {
          duration: 3000,
          position: "top-center",
          className: "custom-toast",
        });
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetReviews();
  }, []);

  return (
    <div className="reviews">
      <div className="reviews-header">Application Performance</div>

      <div className="review-container">
        {loading ? (
          <div className="load center-loading">
            <svg viewBox="25 25 50 50">
              <circle r="20" cy="50" cx="50"></circle>
            </svg>
          </div>
        ) : (
          <>
            <div className="rating">
              <div className="review-heading"> Intake Form (Mentor & Mentee) </div>
              <div className="average-score">{averageRating.toFixed(1)}</div>
              <div className="star-rating">
                <Rating value={averageRating} readOnly precision={0.5} />
              </div>
              <div className="review-count">{reviewData.length} Reviews</div>
            </div>

            <div className="comments">
              {reviewData.map((reviewObj, index) => (
                <div key={index} className="review-item">
                  <p>{reviewObj.comments || "No comment provided"}</p>
                </div>
              ))}
              {reviewData.map((reviewObj, index) => (
                <div key={index} className="review-item">
                  <p>{reviewObj.comments || "No comment provided"}</p>
                </div>
              ))}
              {reviewData.map((reviewObj, index) => (
                <div key={index} className="review-item">
                  <p>{reviewObj.comments || "No comment provided"}</p>
                </div>
              ))}
              {reviewData.map((reviewObj, index) => (
                <div key={index} className="review-item">
                  <p>{reviewObj.comments || "No comment provided"}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
