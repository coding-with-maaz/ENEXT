import StructuredData from './StructuredData';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified?: boolean;
}

interface ReviewSchemaProps {
  reviews: Review[];
  productName: string;
}

export default function ReviewSchema({ reviews, productName }: ReviewSchemaProps) {
  // Ensure reviews is an array
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return null;

  const aggregateRating = {
    '@type': 'AggregateRating',
    ratingValue: (
      reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
    ).toFixed(1),
    reviewCount: reviews.length,
    bestRating: '5',
    worstRating: '1',
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    aggregateRating,
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.name,
      },
      datePublished: review.date,
      reviewBody: review.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };

  return <StructuredData data={schema} />;
}

