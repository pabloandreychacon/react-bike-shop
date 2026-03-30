import { Contact } from '../components/Contact';

interface ContactPageProps {
  t: any;
}

export function ContactPage({ t }: ContactPageProps) {
  return (
    <div>
      <Contact t={t} />
    </div>
  );
}
