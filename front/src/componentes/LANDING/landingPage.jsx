import React, { useEffect, useState } from "react";
import { LogOutButton } from "./logout";
import { LoginButton } from "./login";
import { Perfil } from "./perfil";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { crearUsuario } from "../../store/action";
import tablinum from "../img/tablinumBlanco.png";
import { url } from "../../URL.js";
import axios from "axios";
import Swal from "sweetalert2";
import "./landingPage.css";

export default function LandingPageTablinum() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth0();
  const usuario1 = useSelector((state) => state.usuario);
  const dispatch = useDispatch();
  const [pinInput, setPinInput] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(
        crearUsuario({
          id: user.sub,
          correo: user.email,
          imagen: user.picture,
          nombre: user.name,
        })
      );
    }
  }, [isAuthenticated]);

  // Crear PIN
  function setPassWord(e) {
    e.preventDefault();

    Swal.fire({
      title: "¿Desea guardar el PIN?",
      toast: true,
      position: "bottom-end",
      showDenyButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        const pass = Number(e.target[0].value);
        const obj = { id: usuario1.id, contrasena: pass };
        axios
          .put(`${url}usuariosRoute/modificarUsuario`, obj)
          .then(() => navigate("/home"));
      }
    });
  }

  // Validar PIN
  function ingresar(e) {
    const pass = e.target.value;
    setPinInput(pass);

    if (pass.length === 4 && pass == usuario1.contrasena) {
      navigate("/home");
    }
  }

  return (
    <div className="login-container">

      {/* Panel derecha (login) */}
      <div className="login-panel">

        <div className="text-center mb-4">
          <img src={tablinum} className="logo-login" />
        </div>

        {/* NO está logueado */}
        {!isAuthenticated && (
          <div className="card p-4 shadow-lg login-card">
            <LoginButton />
          </div>
        )}

        {/* Está logueado */}
        {isAuthenticated && (
          <div className="card p-4 shadow-lg login-card text-center">

            <Perfil />

            {/* Crear PIN */}
            {usuario1?.contrasena == null ? (
              <form onSubmit={setPassWord} className="mt-4">
                <label className="form-label text-white">
                  Crear PIN (4 dígitos)
                </label>
                <input
                  type="password"
                  maxLength="4"
                  pattern="\d*"
                  required
                  className="form-control pin-input-small mb-3"
                />

                <button className="btn btn-success w-100" type="submit">
                  Guardar PIN
                </button>
              </form>
            ) : (
              /* Ingresar PIN */
              <div className="mt-4">
                <label className="form-label text-white">Ingresar PIN</label>
                <input
                  type="password"
                  maxLength="4"
                  pattern="\d*"
                  value={pinInput}
                  onChange={ingresar}
                  className="form-control pin-input-small"
                />
              </div>
            )}

            <div className="mt-4">
              <LogOutButton />
            </div>
          </div>
        )}

      </div>
      <p className="footer-text">
        Sistema de gestión museológica © 2025
      </p>
    </div>
  );
}
