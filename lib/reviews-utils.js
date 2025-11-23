// Utility functions for calculating review statistics and generating proper SEO schemas

/**
 * Calculate aggregate rating statistics from reviews array
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {Object|null} - Object containing ratingValue, ratingCount, bestRating, worstRating or null if no reviews
 */
export function calculateAggregateRating(reviews) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;
  
  // Round to 1 decimal place
  const ratingValue = Math.round(averageRating * 10) / 10;
  
  // Find min and max ratings
  const ratings = reviews.map(r => r.rating);
  const worstRating = Math.min(...ratings);
  const bestRating = Math.max(...ratings);

  return {
    ratingValue: ratingValue.toString(),
    ratingCount: totalReviews.toString(),
    bestRating: bestRating.toString(),
    worstRating: worstRating.toString()
  };
}

/**
 * Generate proper review schema with aggregate rating
 * @param {Array} reviews - Array of review objects
 * @param {Object} options - Additional options for schema generation
 * @returns {Object} - Complete schema object with reviews and aggregateRating
 */
export function generateReviewSchema(reviews, options = {}) {
  const {
    name = "Gupta Furniture & Interior",
    url = "https://www.guptafurniturenashik.in",
    type = "LocalBusiness"
  } = options;

  const aggregateData = calculateAggregateRating(reviews);

  const schema = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name,
    "url": url,
  };

  if (aggregateData) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateData.ratingValue,
      "ratingCount": aggregateData.ratingCount,
      "bestRating": aggregateData.bestRating,
      "worstRating": aggregateData.worstRating
    };
  }

  if (reviews && reviews.length > 0) {
    schema.review = reviews.map(review => ({
      "@type": "Review",
      "datePublished": review.datePublished,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewBody": review.text
    }));
  }

  return schema;
}

/**
 * Generate Service schema with proper aggregate rating
 * @param {Object} service - Service object from database
 * @param {Array} reviews - Array of reviews for this service/location
 * @returns {Object} - Service schema with aggregateRating
 */
export function generateServiceSchemaWithReviews(service, reviews = []) {
  const aggregateData = calculateAggregateRating(reviews);
  
  // Ensure image is an absolute URL
  let imageUrl = service.image;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `https://www.guptafurniturenashik.in${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  }
  
  // Using Product type instead of Service because Google Rich Results
  // only supports aggregateRating on Product (and LocalBusiness, etc), not generic Service.
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": service.name,
    "description": service.description,
    "image": imageUrl || "https://www.guptafurniturenashik.in/hero.png",
    "brand": {
      "@type": "LocalBusiness",
      "name": "Gupta Furniture & Interior",
      "image": "https://www.guptafurniturenashik.in/logo.png",
      "url": "https://www.guptafurniturenashik.in",
      "telephone": "+91 9511641912",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Nashik",
        "addressLocality": "Nashik",
        "addressRegion": "Maharashtra",
        "postalCode": "422001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.9975",
        "longitude": "73.7898"
      },
      "priceRange": service.priceRange || "₹₹₹",
      "areaServed": [
        { "@type": "City", "name": "Nashik" },
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Pune" }
      ]
    },
    "url": `https://www.guptafurniturenashik.in/services/${service.slug}`
  };

  if (aggregateData) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": aggregateData.ratingValue,
      "ratingCount": aggregateData.ratingCount,
      "bestRating": aggregateData.bestRating,
      "worstRating": aggregateData.worstRating
    };
  }

  return schema;
}