import { About } from '../components/About';
import { SEO } from '../components/SEO';

interface AboutPageProps {
  t: any;
}

export function AboutPage({ t }: AboutPageProps) {
  return (
    <div>
      <SEO
        title="About Us"
        description="Learn more about our passion for cycling and our commitment to quality bikes and services."
      />
      <About t={t} />
    </div>
  );
}
