import { Contact } from '../components/Contact';
import { SEO } from '../components/SEO';

interface ContactPageProps {
  t: any;
}

export function ContactPage({ t }: ContactPageProps) {
  return (
    <div>
      <SEO
        title="Contact Us"
        description="Get in touch with our team for bike inquiries, repairs, or any questions about our services."
      />
      <Contact t={t} />
    </div>
  );
}
