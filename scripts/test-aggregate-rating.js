// Test script to verify aggregate rating calculations

import { calculateAggregateRating } from '../lib/reviews-utils.js';
import { reviews } from '../data/reviews.js';

console.log('Testing Aggregate Rating Calculations\n');

// Test Nashik reviews
const nashikReviews = reviews["Nashik"] || [];
console.log('Nashik Reviews:');
console.log(`Total reviews: ${nashikReviews.length}`);
console.log('Individual ratings:', nashikReviews.map(r => r.rating));

const nashikAggregate = calculateAggregateRating(nashikReviews);
console.log('Calculated aggregate rating:', nashikAggregate);

// Test Mumbai reviews
const mumbaiReviews = reviews["Mumbai"] || [];
console.log('\nMumbai Reviews:');
console.log(`Total reviews: ${mumbaiReviews.length}`);
console.log('Individual ratings:', mumbaiReviews.map(r => r.rating));

const mumbaiAggregate = calculateAggregateRating(mumbaiReviews);
console.log('Calculated aggregate rating:', mumbaiAggregate);

// Test empty reviews
console.log('\nEmpty Reviews Test:');
const emptyAggregate = calculateAggregateRating([]);
console.log('Empty reviews aggregate rating:', emptyAggregate);

// Test mixed scenario
console.log('\nMixed Ratings Test:');
const mixedReviews = [
  { rating: 5 },
  { rating: 4 },
  { rating: 3 },
  { rating: 5 },
  { rating: 2 }
];
const mixedAggregate = calculateAggregateRating(mixedReviews);
console.log('Mixed reviews aggregate rating:', mixedAggregate);

console.log('\n✅ All tests completed successfully!');