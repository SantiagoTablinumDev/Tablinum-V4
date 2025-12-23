
import './buscar.css'
import axios from 'axios';
import React from "react";
import { useEffect, useState } from 'react';
import dino from "../img/dinoGif.gif";
import { useTranslation } from "react-i18next"
import { filtrarDatos, getDatos, getDatos2, getFilo, Toast, getGeneroEspecie, getPartes, subespecimen, fechaActual, getDatos4 } from "../../store/action";
import printCatalogo from '../../FUNCIONES/pdf';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Menu from "../NAVBAR/menu";
import { BiSortAlt2, BiPrinter } from 'react-icons/bi';
import { useAuth0 } from "@auth0/auth0-react";
import Swal from 'sweetalert2'
import { useRef } from "react";
import { url } from '../../URL.js'

export default function Buscar() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [search, setSearch] = useState({ parametro: "", busqueda: "" })
  const [orden, setOrden] = useState('menor')
  const userD = useSelector((state) => state.usuario)
  const [preview, setPreview] = useState()

  useEffect(() => {
    dispatch(getGeneroEspecie())

    dispatch(getPartes())
    dispatch(getFilo())


    if (userD.nivel === 4) {
      dispatch(getDatos4());
    } else if (userD.nivel === 3 || userD.nivel === 2 || userD.nivel === 1) {
      dispatch(getDatos2());
    }
    const pos = sessionStorage.getItem("scrollPosition");
    if (pos) {
      window.scrollTo(0, parseInt(pos));
    }



  }, [userD])
  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeout.current);
    };
  }, []);
  const [t, i18n] = useTranslation("global")
  var especimenes = useSelector((state) => state.especimenes)
  var especimenFiltrado = useSelector((state) => state.especimenes_filtrados)
  const generoEspecie = useSelector((state) => state.generoEspecie)
  const [filter, setErrors] = useState({
    genero: false,
    especie: false,
    filo: false,
    partes: false,
    desc: false,
    campa: false,
    numero: false,
    prepa: false,
    forma: false,
    holo: false,
  })

  const filogenia = useSelector((state) => state.filo)
  const partesEsq = useSelector((state) => state.partes)
  var espec = especimenes;



  if (especimenFiltrado.length === 0) {
    var genero = [];
    var especie = [];
    var filogen = [];
    var descubridor = [];
    var partes = [];
    var campana = [];
    var prepara = [];
    var formacion = [];
    var holotipo = [];

    generoEspecie?.map(e => {


      let generoB = [];
      let especieB = [];


      espec?.map(el => {
        generoB?.push(el.genero)
        especieB?.push(el.especie)
      })

      if (generoB?.includes(e.genero)) {
        genero?.push(e.genero)
      }
      e.especie?.map(el => {
        if (!especie?.includes(el) && el != '' && especieB.includes(el))
          especie?.push(el)
      })
    })

    espec?.map(e => {
      if (e.url === 'si') {
        prepara.push(e.url)
      }
    })

    filogenia.map(e => {
      filogen.push(e.filo)
    })

    partesEsq.map(e => {
      partes.push(e)
    })


    espec?.map(e => {
      if (!descubridor.includes(e.descubridor)) {
        descubridor.push(e.descubridor)
      }

      if (!campana.includes(e.campana) && e.campana != '') {
        campana.push(e.campana)
      }
      if (!formacion.includes(e.formacion) && e.formacion != '') {
        formacion.push(e.formacion)
      }
    })
  } else {
    var genero = [];
    var especie = [];
    var filogen = [];
    var descubridor = [];
    var partes = [];
    var campana = [];
    var prepara = [];
    var formacion = [];


    especimenFiltrado.map(e => {

      if (e.url === 'si') {
        prepara.push(e.url)
      }

      if (!genero.includes(e.genero)) {
        genero.push(e.genero)
      }
      if (!especie.includes(e.especie)) {
        especie.push(e.especie)
      }

      e.posicionfilo?.map(el => {
        if (!filogen.includes(el)) {
          filogen.push(el)
        }
      })

      e.partesesqueletales?.map(el => {
        if (!partes.includes(el)) {
          partes.push(el)
        }
      })


      if (!descubridor.includes(e.descubridor)) {
        descubridor.push(e.descubridor)
      }

      if (!campana.includes(e.campana)) {
        campana.push(e.campana)
      }
      if (!formacion?.includes(e.formacion)) {
        formacion.push(e.formacion)
      }
    })
  }

  function selectGenero(e) {
    filter.genero = e.target.value != 'todos' ? e.target.value : null;

    dispatch(filtrarDatos({ parametro: 'genero', busqueda: e.target.value }))
  }

  function selectEspecie(e) {
    filter.especie = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatos({ parametro: 'especie', busqueda: e.target.value }))
  }
  function selectFormacion(e) {
    filter.forma = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatos({ parametro: 'formacion', busqueda: e.target.value }))
  }

  function selectFilo(e) {
    filter.filo = e.target.value != 'todos' ? e.target.value : null;

    dispatch(filtrarDatos({ parametro: 'filo', busqueda: e.target.value }))
  }

  function selectPartes(e) {
    filter.partes = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatos({ parametro: 'partes', busqueda: e.target.value }))

  }

  function selectDescubridor(e) {
    filter.desc = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatos({ parametro: 'descubridor', busqueda: e.target.value }))
  }

  function selectCampana(e) {
    filter.campa = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatos({ parametro: 'campana', busqueda: e.target.value }))
  }

  function selectPrepara(e) {
    filter.prepa = e.target.value != 'todos' ? e.target.value : null;
    let bus = document.getElementById('preparacion').checked

    bus ? dispatch(filtrarDatos({ parametro: 'prepara', busqueda: 'si' })) : dispatch(filtrarDatos({ parametro: 'prepara', busqueda: '' }))

  }

  function selectHolotipo(e) {
    filter.holo = e.target.value != 'todos' ? e.target.value : null;
    let bus = document.getElementById('holotipo').checked

    bus ? dispatch(filtrarDatos({ parametro: 'holotipo', busqueda: true })) : dispatch(filtrarDatos({ parametro: 'holotipo', busqueda: false }))
  }

  function selectNumero(e) {

    if (document.getElementById('num').value <= 0) {
      Toast.fire({
        icon: 'error',
        title: t("NOVAL")
      })
    } else {

      let count = 0;
      espec?.map(el => {
        if (el.especimennumero == document.getElementById('num').value + '000') {
          count++;
        }
      })
      if (count > 0) {
        var id = document.getElementById('num').value + '000';
        dispatch(filtrarDatos({ parametro: 'numero', busqueda: id }))
      } else {
        Toast.fire({
          icon: 'error',
          title: t("NOESPEC")
        })
      }

    }
  }

  function selectDesde(e) {
    var desde = document.getElementById('desde').value + '000';
    var hasta = document.getElementById('hasta').value + '000';
    let dh = espec.filter(
      (ele) =>
        Number(ele.especimennumero) >= Number(desde) &&
        Number(ele.especimennumero) <= Number(hasta)
    );

    if (dh.length > 0) {
      dispatch(filtrarDatos({ parametro: 'desde', busqueda: [desde, hasta] }))
    } else {
      Toast.fire({
        icon: "error",
        title: t("NOESPEC"),
      });
    }
  }

  if (especimenFiltrado?.length === 1) {
    filter.numero = 1
  }


  function limpiarFiltros(e) {
    filter.genero = false;
    filter.especie = false;
    filter.filo = false;
    filter.partes = false;
    filter.desc = false;
    filter.campa = false;
    filter.numero = false;
    filter.forma = false;



    dispatch(filtrarDatos({ parametro: 'limpiar' }))
    document.getElementsByClassName('select').value = '';
    document.getElementById('preparacion').checked = false;
    document.getElementById('holotipo').checked = false;
  }



  function SortArray(x, y) {
    if (orden == 'menor') {
      if (Number(x.especimennumero) < Number(y.especimennumero)) { return -1; }
      if (Number(x.especimennumero) > Number(y.especimennumero)) { return 1; }
      return 0;
    } else {
      if (Number(x.especimennumero) > Number(y.especimennumero)) { return -1; }
      if (Number(x.especimennumero) < Number(y.especimennumero)) { return 1; }
      return 0;
    }
  }

  var especSort = espec?.sort(SortArray)
  var especimenFiltradoSort = especimenFiltrado?.sort(SortArray)
  function ordenar() {
    if (orden === 'menor') {
      especSort = espec?.sort(SortArray)
      especimenFiltradoSort = especimenFiltrado?.sort(SortArray)
      setOrden('mayor')
    } else {
      especSort = espec?.sort(SortArray)
      especimenFiltrado?.sort(SortArray)
      setOrden('menor')
    }
  }

  const hoverTimeout = useRef(null);
  const handleMouseEnter = (elemento) => {
    hoverTimeout.current = setTimeout(() => {
      axios.get(`${url}especimenRoute/especimen/id?id=${elemento.especimennumero}`)
        .then((response) => {
          const data = response.data;

          Swal.fire({
            title: `<strong>Ficha de Especimen</strong>`,
            html: `
              <div style="
                text-align: left;
                font-family: Arial, sans-serif;
                background: #f9f9f9;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
              ">
                <h2 style="margin-bottom: 10px; color: #333;"><b>${data.genero} ${data.especie}</b></h2>
                <hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">
                <p><b>Especimen Nº:</b> ${subespecimen(data.especimennumero)}</p>
                <p><b>Bochon Nº:</b> ${data.bochonnumero}</p>
                <p><b>Sigla:</b> ${data.sigla}</p>
                <p><b>Subespecie:</b> ${data.subespecie}</p>
                <p><b>Periodo / Época:</b> ${data.periodo} / ${data.epoca}</p>
                <p><b>Piso / Cuenca / Formación:</b> ${data.piso} / ${data.cuenca} / ${data.formacion}</p>
                <p><b>Localidad:</b> ${data.localidad}</p>
                <p><b>Descubridor:</b> ${data.descubridor} (${data.fechadescubrimiento})</p>
                <p><b>Preparador:</b> ${data.preparador} (${data.preparacionfecha})</p>
                <p><b>Ubicación:</b> Armario1: ${data.armario1} [${data.estante1desde}-${data.estante1hasta}], 
                                            Armario2: ${data.armario2} [${data.estante2desde}-${data.estante2hasta}]</p>
                <p><b>Fragmentos:</b> ${data.cantidadfrag}</p>
                <p><b>Prestado:</b> ${data.prestado ? "Sí" : "No"}</p>
                <p><b>Comentario:</b> ${data.comentario}</p>
              </div>
            `,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: "Cerrar",
            width: "500px",
          });
        });
    }, 3000);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
  };

  const handleClickRow = (elemento) => {
    clearTimeout(hoverTimeout.current);
    sessionStorage.setItem("scrollPosition", window.scrollY); // Cancela hover si hacemos click
    navigate(`/home/${elemento.especimennumero}`);
  };

  const coleccion = () => {
    console.log(especimenFiltrado)

    // Nuevo modal con dos opciones: Crear nueva / Añadir a colección
    Swal.fire({
      title: '¿Qué deseas hacer?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Crear nueva',
      denyButtonText: 'Añadir a colección',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Flujo: Crear nueva colección (igual que antes)
        Swal.fire({
          title: 'Crear nueva colección',
          html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
            <input type="text" id="descripcion" class="swal2-input" placeholder="Descripción">
          `,
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value;
            const descripcion = Swal.getPopup().querySelector('#descripcion').value;
            if (!nombre || !descripcion) {
              Swal.showValidationMessage(`Por favor, completa ambos campos`);
              return false;
            }
            return { nombre, descripcion };
          }
        }).then((res) => {
          if (res.isConfirmed) {
            // preparar payload igual que en CreateCollectionModal
            const numeroEsp = especimenFiltrado.map(el => String(el.especimennumero));
            const neuw = {
              usuario_id: userD.id,
              nombre: res.value.nombre.trim(),
              descripcion: res.value.descripcion.trim(),
              especimenes: numeroEsp,
              bochones: [],
            };
            axios.post(`${url}user_collection/create`, neuw)
              .then(() => Toast.fire({ icon: 'success', title: t("EXITO") }))
              .catch(() => Toast.fire({ icon: 'error', title: t("ERROR") }))
          }
        })
      } else if (result.isDenied) {
        // Flujo: Añadir a colección existente
        axios.get(`${url}user_collection/getByUser/${userD.id}`)
          .then(({ data }) => {
            const collections = data || [];
            const options = collections.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
            if (!options) {
              Swal.fire('Info', 'No hay colecciones. Crea una nueva primero.', 'info');
              return;
            }
            Swal.fire({
              title: 'Selecciona colección',
              html: `<select id="selCol" class="swal2-select">${options}</select>`,
              showCancelButton: true,
              confirmButtonText: 'Añadir',
              preConfirm: () => {
                const colId = Swal.getPopup().querySelector('#selCol').value;
                if (!colId) {
                  Swal.showValidationMessage('Selecciona una colección');
                  return false;
                }
                return colId;
              }
            }).then((r2) => {
              if (r2.isConfirmed) {
                const colId = String(r2.value);
                const collection = collections.find(c => String(c.id) === colId);
                if (!collection) {
                  Swal.fire('Error', 'Colección no encontrada', 'error');
                  return;
                }

                // preparar arrays y unir sin duplicados (como en CreateCollectionModal)
                const nuevosSpecimens = especimenFiltrado.map(el => String(el.especimennumero));
                const mergedSpecimens = Array.from(new Set([...(collection.especimenes || []).map(String), ...nuevosSpecimens]))
                  .sort((a, b) => Number(b) - Number(a)); // mayor a menor

                const mergedBochones = Array.from(new Set([...(collection.bochones || []).map(String)]))
                  .sort((a, b) => Number(b) - Number(a));

                const updatedCollection = {
                  ...collection,
                  especimenes: mergedSpecimens,
                  bochones: mergedBochones,
                };

                axios.put(`${url}user_collection/update/${collection.id}`, updatedCollection)
                  .then(() => Toast.fire({ icon: 'success', title: t("EXITO") }))
                  .catch(() => Toast.fire({ icon: 'error', title: t("ERROR") }))
              }
            })
          })
          .catch(() => {
            Swal.fire('Error', 'No se pudieron cargar las colecciones', 'error')
          })
      }
    })
  }


  return (
    <div className="container34" id='tablita'>
      <Menu activo={0} />
      <div class="contenedor">
        <button className="btn-flotante" onClick={() => navigate("/home/crear/especimen")}>
          <span className="icono">+</span>
          <span>{t("CREATE.SPECIMENS")}</span>
        </button>
        <div class='nav'>
          <div className="cabeceraBochon">
            <div class='div-flex2'>
              <span tooltip={t("COMPLE")} flow='right'><label onClick={(e) => { printCatalogo('catalogo', "", "e") }}><BiPrinter className='printi' /></label></span>
              <label class='txt2' onClick={e => selectPrepara(e)}>{t("ONPREP").toLocaleUpperCase()} <input class="form-check-input mt-1" type="checkbox" id="preparacion" /></label>
              <label class='txt2' onClick={e => selectHolotipo(e)}>{t("HOLOTIPO").toLocaleUpperCase()} <input class="form-check-input mt-1" type="checkbox" id="holotipo" /></label>
              <label class='txt3' >{especimenFiltradoSort?.length > 0 ? especimenFiltradoSort.length + ' ' + t("FILAS") : especimenes.length + ' ' + t("FILAS")}</label>


            </div>
            <div class='div-flex'>
              {especimenFiltradoSort?.length > 0 && userD.nivel < 3 ? <h6 onClick={e => printCatalogo('filtrado', especimenFiltrado, "e")} class='limpiar'>{t("IMPSEL")} </h6> : null
              }

              {especimenFiltrado?.length > 0 ? <h6 onClick={limpiarFiltros} class='limpiar'>{t("CLEAN")} </h6> : ''}
              {especimenFiltrado?.length > 0 ? <h6 onClick={coleccion} class='limpiar'>{t("AÑADIRCOLL")} </h6> : ''}
            </div>

          </div>
          <div class="selecto">
            <div class="filters">

              <div className="mb-3">
                <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectGenero(e)} disabled={genero?.length < 1 ? true : false}>
                  {filter?.genero ? <option value='todos' >{t("GENRE").toUpperCase()}</option> : <option selected='true' value='todos' >{t("GENRE").toUpperCase()}</option>}
                  {genero.sort()?.map(e => {
                    return filter?.genero === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                  })}
                </select>
              </div>

            </div>
            <div class="filters">

              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectEspecie(e)} disabled={especie?.length < 2 ? true : false}>
                {filter?.especie ? <option value='todos' >{t("SPECIES").toUpperCase()}</option> : <option selected='true' value='todos' >{t("SPECIES").toUpperCase()}</option>}
                {especie.sort()?.map(e => {
                  return filter?.especie === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">

              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectFilo(e)} disabled={filogen?.length < 2 ? true : false}>
                <option value='todos' >{t("PHYLOGENETICS").toUpperCase()}</option>
                {filogen.sort()?.map(e => {
                  return filter?.filo === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">

              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectPartes(e)} disabled={partes?.length < 2 ? true : false}>
                <option value='todos' >{t("PARTS").toUpperCase()}</option>
                {partes.sort()?.map(e => {
                  return filter?.partes === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectDescubridor(e)} disabled={descubridor?.length < 2 ? true : false}>
                <option value='todos'>{t("DISCOVERER").toUpperCase()}</option>
                {descubridor.sort()?.map(e => {
                  return filter?.desc === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectCampana(e)} disabled={campana?.length < 2 ? true : false}>
                <option value='todos' selected={filter?.campa ? 'false' : 'true'}>{t("CAMPAIGN").toUpperCase()}</option>
                {campana.sort()?.map(e => {
                  return filter?.campa === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectFormacion(e)} disabled={formacion?.length < 2 ? true : false}>
                <option value='todos' selected={filter?.forma ? 'false' : 'true'}>{t("TRAINING").toUpperCase()}</option>
                {formacion.sort()?.map(e => {
                  return filter.forma === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">

              <div class="busq">
                <div className="desde">
                  <input type="text" id='desde' placeholder={t("SINCE")} class='buscar124' />
                  <input type="text" id='hasta' placeholder={t("UNTIL")} class='buscar124' />
                </div>
                <h4 onClick={selectDesde} class='boton' >{t("SEARCH")}</h4></div>
            </div>
            <div class="filters">

              <div class="busq">

                <input type="number" id='num' placeholder={t("ESPECNRO").toLocaleUpperCase()} class='buscar12' />
                <h4 onClick={selectNumero} class='boton' id='num' >{t("SEARCH")}</h4></div>
            </div>


          </div>
        </div>
        <div id="main-container">
          {
            !espec ?
              <div class='spiner'>
                <img src={dino} width='250px'></img>
              </div>
              :
              <div id="content">
                <table class="tabloni">
                  <thead className='tabli-head'>
                    <tr className='ordenar3' >
                      <th width='9%' onClick={() => ordenar()} ><p class='ordenar'>{t("ESPECNRO")}<BiSortAlt2 /></p></th>
                      <th width='10%'><p class='ordenar2'>{t("GENRE")}</p></th>
                      <th width='10%'><p class='ordenar2'>{t("SPECIES")}</p></th>
                      <th width='21%'><p class='ordenar2'>{t("FILO")}</p></th>
                      <th width='21%'><p class='ordenar2'>{t("PARTS")}</p></th>
                      <th width='10%'><p class='ordenar2'>{t("TRAINING")}</p></th>
                      <th width='10%'><p class='ordenar2'>{t("DISCOVERER")}</p></th>
                      <th width='10%'><p class='ordenar2'>{t("CAMPAIGN")}</p></th>
                      <th width='9%'><p class='ordenar2'>{t("FIELD")}</p></th>
                    </tr>
                  </thead>
                  <div className="tebodi">
                    <tbody className="ordenar4">
                      {
                        especimenFiltradoSort?.length > 0 ? especimenFiltradoSort.map((elemento) => {
                          {
                            return (
                              userD.nivel == 4 ?
                                <tr key={elemento.especimennumero} className='ordenar3'>
                                  <td width='9%' align='center'><p>{subespecimen(elemento.especimennumero)}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.genero}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.especie}</p></td>
                                  <td width='21%' align='center'>{elemento.posicionfilo.length > 0 ? elemento.posicionfilo.map(e => { return e + "; " }) : <p>Sin Posición Filogenética</p>}</td>
                                  <td width='21%' align='center'>{elemento.partesesqueletales.length > 0 ? elemento.partesesqueletales.map(e => { return e + "; " }) : <p>Sin Partes esqueléticas</p>}</td>
                                  <td width='10%' align='center'><p>{elemento.formacion}</p></td>
                                  <td width='10%' align='center'><p>{elemento.descubridor}</p></td>
                                  <td width='10%' align='center'><p>{elemento.campana}</p></td>
                                  <td width='9%' align='center'><p>{elemento.nrocampo}</p></td>
                                </tr>
                                :
                                <tr key={elemento.especimennumero}
                                  onClick={() => handleClickRow(elemento)}
                                  style={{ cursor: "pointer" }}
                                  className='ordenar3'
                                  onMouseEnter={() => handleMouseEnter(elemento)}
                                  onMouseLeave={handleMouseLeave}>                                  <td width='9%' align='center'><p>{subespecimen(elemento.especimennumero)}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.genero}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.especie}</p></td>
                                  <td width='21%' align='center'>{elemento.posicionfilo.length > 0 ? elemento.posicionfilo.map(e => { return e + "; " }) : <p>Sin Posición Filogenética</p>}</td>
                                  <td width='21%' align='center'>{elemento.partesesqueletales.length > 0 ? elemento.partesesqueletales.map(e => { return e + "; " }) : <p>Sin Partes esqueléticas</p>}</td>
                                  <td width='10%' align='center'><p>{elemento.formacion}</p></td>
                                  <td width='10%' align='center'><p>{elemento.descubridor}</p></td>
                                  <td width='10%' align='center'><p>{elemento.campana}</p></td>
                                  <td width='9%' align='center'><p>{elemento.nrocampo}</p></td>
                                </tr>
                            )
                          }
                        }) :
                          especSort?.map((elemento) => {
                            return (
                              userD.nivel == 4 ?
                                <tr key={elemento.especimennumero} className='ordenar3'>
                                  <td width='9%' align='center'><p>{subespecimen(elemento.especimennumero)}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.genero}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.especie}</p></td>
                                  <td width='21%' align='center'>{elemento.posicionfilo.length > 0 ? elemento.posicionfilo.map(e => { return e + "; " }) : <p>Sin Posición Filogenética</p>}</td>
                                  <td width='21%' align='center'>{elemento.partesesqueletales.length > 0 ? elemento.partesesqueletales.map(e => { return e + "; " }) : <p>Sin Partes esqueléticas</p>}</td>
                                  <td width='10%' align='center'><p>{elemento.formacion}</p></td>
                                  <td width='10%' align='center'><p>{elemento.descubridor}</p></td>
                                  <td width='10%' align='center'><p>{elemento.campana}</p></td>
                                  <td width='9%' align='center'><p>{elemento.nrocampo}</p></td>
                                </tr>
                                :
                                <tr key={elemento.especimennumero}
                                  onClick={() => handleClickRow(elemento)}
                                  style={{ cursor: "pointer" }}
                                  className='ordenar3'
                                  onMouseEnter={() => handleMouseEnter(elemento)}
                                  onMouseLeave={handleMouseLeave}>                                  <td width='9%' align='center'><p>{subespecimen(elemento.especimennumero)}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.genero}</p></td>
                                  <td width='10%' align='center'><p class='datosCur3'>{elemento.especie}</p></td>
                                  <td width='21%' align='center'>{elemento.posicionfilo.length > 0 ? elemento.posicionfilo.map(e => { return e + "; " }) : <p>Sin Posición Filogenética</p>}</td>
                                  <td width='21%' align='center'>{elemento.partesesqueletales.length > 0 ? elemento.partesesqueletales.map(e => { return e + "; " }) : <p>Sin Partes esqueléticas</p>}</td>
                                  <td width='10%' align='center'><p>{elemento.formacion}</p></td>
                                  <td width='10%' align='center'><p>{elemento.descubridor}</p></td>
                                  <td width='10%' align='center'><p>{elemento.campana}</p></td>
                                  <td width='9%' align='center'><p>{elemento.nrocampo}</p></td>
                                </tr>
                            );
                          })
                      }
                    </tbody>
                  </div>
                </table>
              </div>
          }
          <div id="elementH"></div>
        </div>
      </div>
    </div>
  )
}
