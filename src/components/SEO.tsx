import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = '/favicon.svg',
  url,
}: SEOProps) {
  useEffect(() => {
    const baseTitle = 'Modern Bicycle Store';
    const finalTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const defaultDescription = 'Premium bicycles, expert repairs, and professional cycling services. Quality bikes for road, mountain, and city riding.';
    const baseUrl = 'https://modern-bicycle-store.netlify.app';

    document.title = finalTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let meta = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const finalDescription = description || defaultDescription;
    setMeta('description', finalDescription);
    if (keywords) setMeta('keywords', keywords);
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url || baseUrl, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:card', 'summary_large_image');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || baseUrl);
  }, [title, description, keywords, image, url]);

  return null;
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BicycleShop",
    "name": "Modern Bicycle Store",
    "image": "https://modern-bicycle-store.netlify.app/bike-shop-bg.jpg",
    "@id": "",
    "url": "https://modern-bicycle-store.netlify.app",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "",
      "postalCode": "",
      "addressCountry": ""
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "14:00"
      }
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
