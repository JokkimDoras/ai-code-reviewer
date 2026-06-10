'use client';
import { Clock } from 'lucide-react';

interface ReviewHistoryProps {
  reviews: any[];
  showReviews: boolean;
  setShowReviews: (show: boolean) => void;
  setReview: (summary: string) => void;
}

export function ReviewHistory({ reviews, showReviews, setShowReviews, setReview }: ReviewHistoryProps) {
  if (reviews.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-neutral-600 tracking-wider uppercase block">Review History</span>
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="text-[10px] text-neutral-500 hover:text-white"
        >
          {showReviews ? 'Hide' : 'Show'}
        </button>
      </div>
      {showReviews && (
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {reviews.map((r) => (
            <button
              key={r.id}
              onClick={() => setReview(r.summary)}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-white/[0.02] border border-transparent transition-all"
            >
              <span className="capitalize">{r.review_type}</span>
              <span className="text-neutral-600 ml-2">{new Date(r.created_at).toLocaleDateString()}</span>
              <span className="text-neutral-700 ml-2 text-[10px]">{new Date(r.created_at).toLocaleTimeString()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}