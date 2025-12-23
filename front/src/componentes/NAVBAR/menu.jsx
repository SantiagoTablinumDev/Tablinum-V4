import './menu.css';
import { FiSettings } from "react-icons/fi";
import { MdCollectionsBookmark } from "react-icons/md";
import { useAuth0 } from "@auth0/auth0-react";
import tablinum from "../img/verte.png"
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { BiQrScan, BiLogOut } from "react-icons/bi";
import React, { useState } from "react";
import { useTranslation } from "react-i18next"
import LanguageSwitcher from './idoma';
import FloatingChat from './FloatingChat.jsx';

export default function Menu({ activo }) {
  const { isAuthenticated, user, logout } = useAuth0();
  const [t, i18n] = useTranslation("global")
  const userD = useSelector((state) => state.usuario)
  const navigate = useNavigate()
  const usuario1 = useSelector((state) => state.usuario)
  const codigo = useSelector((state) => state.qrs)

  const [lang, setLang] = useState(i18n.language);

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }
  const handleAI = async (msg) => {
    const res = await fetch("http://localhost:3003/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: msg })
    });
    const data = await res.json();
    console.log(data);
    return data; // tu API

  };

  return (
    <div className='padre'>
      <div>
        <div className='nav-Bar1'>
          <div className='logo-home'>
            <img src={tablinum} width="100%" className='imag' onClick={() => navigate(`/home`)} alt="Tablinum Logo" />
          </div>
          {
            userD.nivel >= 3 ?
              <div className='botones' id='botones'>
                <h4 className={`botonCito ${activo === 0 ? 'active2' : ''}`} onClick={() => navigate(`/home`)} ><p className='pboton'>Catalogo Especímenes</p></h4>
              </div> :
              <div className="botones" id='botones'>

                <h4 className={`botonCito ${activo === 0 ? 'active2' : ''}`} onClick={() => navigate(`/home`)} ><p className='pboton'>{t("SPECIMENS")}</p></h4>

                <h4 className={`botonCito ${activo === 1 ? 'active2' : ''}`} onClick={() => navigate(`/home/bochon`)} > <p className="pboton">{t("BOCHONS")}</p> </h4>

                <h4 class="botonCito" onClick={() => navigate(`/home/crear/especimen`)}>  <p className="pboton">+ {t("CREATE.SPECIMENS")}</p> </h4>

                <h4 class="botonCito" onClick={() => navigate(`/home/crear/bochon`)} > <p className="pboton">+ {t("CREATE.BOCHONS")}</p> </h4>

                <h4 className={`botonCito ${activo === 2 ? 'active2' : ''}`} onClick={() => navigate(`/home/prestamos`)} > <p className="pboton">{t("LOANS")}</p> </h4>

                <FloatingChat onSendMessage={handleAI} />
                {
                  codigo[0] ? <span tooltip='Códigos QR' flow='left'><a href={`/home/plantillaqr/${codigo}`} target='_blank' rel="noreferrer" > <BiQrScan color='white' width='80px' /> </a></span> : null
                }

                {
                  userD.nivel <= 2 ?
                    <>
                      {/* <MdCollectionsBookmark size='20px' className={`boton-icono ${activo === 5 ? 'active-icon' : ''}`} onClick={() => navigate(`/home/usercol`)} /> */}
                      {/*  <h4 className="botonCito">{t("USERCOL")}</h4> */}
                      <h4 class="botonCito" onClick={() => navigate(`/home/usercol`)}>  <p className="pboton">{t("USERCOLMENU")}</p> </h4>

                    </>
                    : <></>
                }
              </div>

          }
          <div className='lang'>
            <div className='langTXT'>
              Idioma / Language
            </div>

            <div className='langbot'>
              <LanguageSwitcher />
            </div>
          </div>
          <div className='perfil'>
            <div>
              {user?.picture ? <img src={user?.picture} className='img-perfil' width='70%' height='50%' alt="User Profile"></img> : <></>}
            </div>
            <div>
              <div>
                <span tooltip={t("USER")} flow='left'>
                  <FiSettings size='20px' className='boton-icono' onClick={() => navigate(`/home/setting/${usuario1.id}`)} />
                </span>
              </div>

              <div>
                <span tooltip={t("LOG")} flow='left'>
                  <BiLogOut size='20px' className='boton-icono' onClick={() => logout({ returnTo: window.location.origin })} />
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}