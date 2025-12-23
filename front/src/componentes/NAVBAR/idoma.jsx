import { useState, useEffect } from "react";
  // tu ruta real
import {useTranslation} from "react-i18next"       // tu config real
import esp from '../img/espana.png'
import eng from '../img/reino-unido.png'
export default function LanguageSwitcher() {
        const [t, i18n] = useTranslation("global")
  const [lang, setLang] = useState(i18n.language);

 const [flip, setFlip] = useState(false);

  const toggleLang = () => {
    // activa animación
    setFlip(true);

    // cambia el idioma
    const nextLang = lang === "es" ? "en" : "es";
    i18n.changeLanguage(nextLang);
    setLang(nextLang);

    // resetea el flip después de la animación
    setTimeout(() => setFlip(false), 300);
  };

  return (
    <button className={`icon-lng ${flip ? "flip" : ""}`} onClick={toggleLang}>
      <img
        src={lang === "es" ? esp : eng}
        width="30px"
        height="30px"
        className="lang-flag"
      />
    </button>
  );
}
