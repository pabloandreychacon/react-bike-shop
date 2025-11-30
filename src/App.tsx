import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { GoToTop } from "./components/GoToTop";
import { Home } from "./pages/Home";
import { BikesPage } from "./pages/BikesPage";
import { ServicesPage } from "./pages/ServicesPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminPage } from "./pages/AdminPage";
import { useTranslation, Language } from "./utils/i18n";

export default function App() {
  const [language, setLanguage] = useState<Language>("es");
  const t = useTranslation(language);

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header
          language={language}
          setLanguage={setLanguage}
          t={t}
        />
        <Routes>
          <Route path="/" element={<Home t={t} language={language} />} />
          <Route path="/bikes" element={<BikesPage t={t} language={language} />} />
          <Route path="/services" element={<ServicesPage t={t} language={language} />} />
          <Route path="/about" element={<AboutPage t={t} />} />
          <Route
            path="/contact"
            element={<ContactPage t={t} />}
          />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer t={t} />
        <GoToTop />
      </div>
    </BrowserRouter>
  );
}