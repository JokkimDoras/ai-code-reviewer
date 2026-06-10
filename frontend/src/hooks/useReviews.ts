import { useState } from 'react';
import axios from 'axios';

export function useReviews(projectId: string) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [review, setReview] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewType, setReviewType] = useState('general');
  const [showReviews, setShowReviews] = useState(false);

  const fetchReviews = async (token: string) => {
    try {
      const res = await axios.get(`http://localhost:3001/projects/${projectId}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const reviewWithAI = async (code: string, filename: string) => {
    setReviewing(true);
    setReview(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3001/ai/review',
        { code, filename, reviewType, projectId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReview(res.data.review);
      if (token) fetchReviews(token);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewing(false);
    }
  };

  return {
    reviews,
    review,
    setReview,
    reviewing,
    reviewType,
    setReviewType,
    showReviews,
    setShowReviews,
    fetchReviews,
    reviewWithAI
  };
}