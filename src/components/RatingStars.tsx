import { Star } from 'lucide-react';

export default function RatingStars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const dims = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${dims} ${
            i <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i - 0.5 <= rating
              ? 'fill-amber-200 text-amber-400'
              : 'fill-gray-100 text-gray-300'
          }`}
        />
      ))}
      <span className={`${textSize} font-semibold text-gray-700 ml-1`}>{rating.toFixed(1)}</span>
    </div>
  );
}
