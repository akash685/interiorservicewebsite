export default function manifest() {
  return {
    name: 'Gupta Furniture Nashik',
    short_name: 'Gupta Furniture',
    description: 'Best furniture services in Nashik. Sofa cleaning, repair, and interior design.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#D81B60',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
