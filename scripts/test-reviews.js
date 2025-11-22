const { reviews } = require('../data/reviews');

console.log('Reviews loaded successfully');
console.log('Nashik reviews:', reviews['Nashik']?.length);
console.log('Mumbai reviews:', reviews['Mumbai']?.length);
