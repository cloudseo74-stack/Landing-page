import LandingPage from '@/components/LandingPage';
import { business } from '@/config/business';
const structuredData = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name: business.name,
  telephone: business.phone, email: business.email, taxID: business.gst,
  address: { '@type': 'PostalAddress', streetAddress: 'G 17, Ground Floor, Amravati Commercial Complex, Near BIT Extension, Lalpur', addressLocality: 'Ranchi', addressRegion: 'Jharkhand', postalCode: '834001', addressCountry: 'IN' },
  hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Taxi and travel services', itemListElement: [{ '@type': 'Offer', itemOffered: { '@type': 'TaxiService', name: 'Local, airport and outstation taxi service', areaServed: { '@type': 'City', name: 'Ranchi' } } }] },
};
export default function Home() { return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /><LandingPage /></>; }
