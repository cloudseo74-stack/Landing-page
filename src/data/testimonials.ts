// Publish only verified customer text. Add the original source URL and a rating only when verified.
export type Testimonial = { name: string; text: string; sourceUrl: string; rating?: number };
export const testimonials: Testimonial[] = [];
export const testimonialPlaceholders = [
  { label: 'Local & airport journeys', note: 'Verified customer feedback will be added here.' },
  { label: 'Outstation & family trips', note: 'Verified customer feedback will be added here.' },
  { label: 'Sightseeing experiences', note: 'Verified customer feedback will be added here.' },
];
