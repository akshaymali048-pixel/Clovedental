type StarRatingProps = {
  rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
  const safeRating = Math.max(1, Math.min(5, rating));

  return (
    <div
      className="flex gap-0.5 text-amber-400"
      aria-label={`${safeRating} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true">
          {index < safeRating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
