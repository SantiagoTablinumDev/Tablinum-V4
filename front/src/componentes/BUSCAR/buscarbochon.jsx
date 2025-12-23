
import axios from 'axios';
import './buscar.css'
import React from "react";
import { useEffect, useState } from 'react';
import dino from "../img/dinoGif.gif";
import {useTranslation} from "react-i18next"
import printCatalogo from '../../FUNCIONES/pdf';
import { filtrarDatosBochon, getBochones, getFilo, getGeneroEspecie, getPartes, fechaActual,Toast,subespecimen } from "../../store/action";
import { useDispatch, useSelector } from "react-redux";
import { BiExit, BiSortAlt2, BiPrinter } from 'react-icons/bi';
import { useNavigate } from "react-router-dom";
import Menu from "../NAVBAR/menu";
import Swal from 'sweetalert2'
import { useRef } from "react";
import { url } from '../../URL.js'

export default function BuscarBochon() {
  const [t, i18n] = useTranslation("global")
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [search, setSearch] = useState({ parametro: "", busqueda: "" })
  const [orden, setOrden] = useState('menor')
  const userD = useSelector((state) => state.usuario)
    const [preview, setPreview] = useState()
  var a = 0;
  useEffect(() => {
    dispatch(getGeneroEspecie())

    dispatch(getPartes())
    dispatch(getFilo())
    dispatch(getBochones());

 const pos = sessionStorage.getItem("scrollPosition");
  if (pos) {
    window.scrollTo(0, parseInt(pos));
  }


  }, [])

  var bochones = useSelector((state) => state.bochones)
  var bochonesFiltrados = useSelector((state) => state.bochones_filtrados)
  const generoEspecie = useSelector((state) => state.generoEspecie)


  const filogenia = useSelector((state) => state.filo)
  const partesEsq = useSelector((state) => state.partes)
  const [filter, setErrors] = useState({
    genero: false,
    especie: false,
    filo: false,
    partes: false,
    desc: false,
    campa: false,
    numero: false,
    soloBochon: false,
    prepa: false,
    forma:false
  })
  let bochons = bochones.data;

  if (bochonesFiltrados?.length === 0) {
    var genero = [];
    var especie = [];
    var filogen = [];
    var descubridor = [];
    var partes = [];
    var campana = [];
    var formacion = [];

    generoEspecie?.map(e => {

      let generoB = [];
      let especieB = [];


      bochons?.map(el => {
        generoB?.push(el.genero)
        especieB?.push(el.especie)
      })

      if (generoB?.includes(e.genero)) {
        genero?.push(e.genero)
      }

      e.especie?.map(el => {
        if (!especie?.includes(el) && el != '' && especieB?.includes(el))
          especie?.push(el)
      })
    })
    filogenia.map(e => {
      filogen.push(e.filo)
    })
    partesEsq.map(e => {
      partes.push(e)
    })
    bochons?.map(e => {
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
    var formacion = [];


    bochonesFiltrados?.map(e => {
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


  function onSubmit(e) {
    e.preventDefault();
    if (!search) {
      dispatch(getBochones())
    } else {
      dispatch(filtrarDatosBochon(search))


    }
  }

  function selectGenero(e) {
    filter.genero = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatosBochon({ parametro1: 'genero', busqueda1: e.target.value }))
  }

  function selectEspecie(e) {
    filter.especie = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatosBochon({ parametro1: 'especie', busqueda1: e.target.value }))
  }
  function selectFormacion(e) {
    filter.forma = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatosBochon({ parametro1: 'formacion', busqueda1: e.target.value }))
  }

  function selectFilo(e) {
    filter.filo = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatosBochon({ parametro1: 'filo', busqueda1: e.target.value }))
  }

  function selectPartes(e) {
    filter.partes = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatosBochon({ parametro1: 'partes', busqueda1: e.target.value }))

  }

  function selectDescubridor(e) {
    filter.desc = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatosBochon({ parametro1: 'descubridor', busqueda1: e.target.value }))
  }

  function selectCampana(e) {
    filter.campa = e.target.value != 'todos' ? e.target.value : null;
    dispatch(filtrarDatosBochon({ parametro1: 'campana', busqueda1: e.target.value }))
  }
console.log(bochons)

  function selectNumero(e) {
    var id = document.getElementById('num').value;

    if(id>=0){
      let count=0;
      bochons?.map(el=>{
if(el.bochonnumero==document.getElementById('num').value){
  count++;
}
})
 if(count>0){
  dispatch(filtrarDatosBochon({ parametro1: 'numero', busqueda1: id }))
 }else{
  Toast.fire({
    icon: "error",
    title: t("NOBOCH"),
  });
 }
     
    }else{
      Toast.fire({
        icon: "error",
        title: t("NOBOCH"),
      });
     }

   
  }

  function selectPrepara(e) {

    let bus = document.getElementById('preparacion').checked
    filter.prepa = bus;

    bus ? dispatch(filtrarDatosBochon({ parametro1: 'prepara', busqueda1: 'si' })) : dispatch(filtrarDatosBochon({ parametro1: 'prepara', busqueda1: 'no' }))

  }
  function soloBochones(e) {

    if (e.target.checked) {
      dispatch(filtrarDatosBochon({ parametro1: 'solobochon', busqueda1: 'si' }))
    } else {
      dispatch(filtrarDatosBochon({ parametro1: 'solobochon', busqueda1: 'no' }))

    }
  }

  if (bochonesFiltrados?.length === 1) {
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
    filter.forma=false;
    dispatch(filtrarDatosBochon({ parametro1: 'limpiar' }))
    document.getElementsByClassName('select').value = '';
    document.getElementById('solo-bochon').checked = false;
    document.getElementById('preparacion').checked = false;
  }

  function SortArray(x, y) {
    if (orden == 'menor') {
      if (Number(x.bochonnumero) < Number(y.bochonnumero)) { return -1; }
      if (Number(x.bochonnumero) > Number(y.bochonnumero)) { return 1; }
      return 0;
    } else {
      if (Number(x.bochonnumero) > Number(y.bochonnumero)) { return -1; }
      if (Number(x.bochonnumero) < Number(y.bochonnumero)) { return 1; }
      return 0;
    }
  }
  var bochons1 = bochons?.sort(SortArray)
  var bochonsFilter = bochonesFiltrados?.sort(SortArray)

  function ordenar() {
    if (orden === 'menor') {
      bochons1 = bochons?.sort(SortArray)
      bochonsFilter = bochonesFiltrados?.sort(SortArray)
      setOrden('mayor')
    } else {
      bochons1 = bochons?.sort(SortArray)
      bochonsFilter = bochonesFiltrados?.sort(SortArray)
      setOrden('menor')
    }
  }


  function selectDesde(e) {
    var desde = document.getElementById('desde').value;
    var hasta = document.getElementById('hasta').value;

    let dh=bochons.filter(
      (ele) =>
        Number(ele.bochonnumero) >= Number(desde) &&
        Number(ele.bochonnumero) <= Number(hasta)
    );

    if(dh.length>0){
      dispatch(filtrarDatosBochon({ parametro1: 'desde', busqueda1: [desde, hasta] }))
    }else{
      Toast.fire({
        icon: "error",
        title:  t("NOBOCH"),
      });
    }

    
  }
    const hoverTimeout = useRef(null);
 const handleMouseEnter = (elemento) => {
    hoverTimeout.current = setTimeout(() => {
      
      axios.get(`${url}bochonRoute/bochon/especimen/id?id=${elemento.bochonnumero}`)
        .then((response) => {
          console.log(response)
          const data = response.data;

          Swal.fire({
            title: `<strong>Ficha de Bochon</strong>`,
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
                <p><b>Bochon Nº:</b> ${data.bochonnumero}</p>
                <p><b>Especimen Nº:</b> ${subespecimen(data.especimennumero)}</p>
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
    navigate(`/home/bochon/${elemento.bochonnumero}`);
  };
 
  let clase
  return (
    <div className="container34">
      <Menu activo={1} />
      <div class="contenedor">
        <button className="btn-flotante" onClick={() => navigate("/home/crear/bochon")}>
  <span className="icono">+</span>
  <span>{t("CREATE.BOCHONS")}</span>
</button>
        <div class='nav'>
          <div className="cabeceraBochon">
            <div>
              <span tooltip={t("COMPLE")} flow='right'><label onClick={(e) => { printCatalogo('catalogo',"","b") }}><BiPrinter className='printi' /></label></span>
              <label class='txt2' onClick={e => selectPrepara(e)}>{t("ONPREP").toLocaleUpperCase()}  <input class="form-check-input mt-1" type="checkbox" id="preparacion" /></label>

              <label class='txt2'>{t("SOLOB")} <input type="checkbox" class="form-check-input mt-1" id='solo-bochon' onClick={e => soloBochones(e)}></input></label>
              <label class='txt3' >{ bochonesFiltrados?.length>0? bochonesFiltrados?.length+' '+t("FILAS"):bochons1?.length +' '+t("FILAS")}</label> 
            </div>
            <div class='div-flex'>
              {bochonsFilter?.length > 0 && userD.nivel < 3 ?
                <span flow='left'><h6 onClick={e => printCatalogo('filtrado',bochonesFiltrados,"b")} class='limpiar'>{t("IMPSEL")} </h6></span> : null
              }
              {bochonesFiltrados?.length > 0 ? <h6 onClick={limpiarFiltros} class='limpiar'>{t("CLEAN")} </h6> : ''}
            </div>
          </div>
          <div class="selecto">
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectGenero(e)}>
                {filter?.genero ? <option value='todos' >GÉNERO</option> : <option selected='true' value='todos' >{t("GENRE").toUpperCase()}</option>}
                {genero.sort()?.map(e => {
                  return filter?.genero === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectEspecie(e)}>
                {filter?.especie ? <option value='todos' >ESPECIE</option> : <option selected='true' value='todos' >{t("SPECIES").toUpperCase()}</option>}
                {especie.sort()?.map(e => {
                  return filter?.especie === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectFilo(e)}>
                <option value='todos' >{t("PHYLOGENETICS").toUpperCase()}</option>
                {filogen.sort()?.map(e => {
                  return filter?.filo === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectPartes(e)}>
                <option value='todos' >{t("PARTS").toUpperCase()}</option>
                {partes.sort()?.map(e => {
                  return filter?.partes === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectDescubridor(e)}>
                <option value='todos'>{t("DISCOVERER").toUpperCase()}</option>
                {descubridor.sort()?.map(e => {
                  return filter?.desc === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectCampana(e)}>
                <option value='todos' selected={filter?.campa ? 'false' : 'true'}>{t("CAMPAIGN").toUpperCase()}</option>
                {campana.sort()?.map(e => {
                  return filter?.campa === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <select class="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => selectFormacion(e)} >
                <option value='todos' selected={filter?.forma ? 'false' : 'true'}>{t("TRAINING").toUpperCase()}</option>
                {formacion.sort()?.map(e => {
                  return filter.forma === e ? <option value={e} selected='true'>{e}</option> : <option value={e}>{e}</option>
                })}
              </select>
            </div>
            <div class="filters">
              <div class="busq">
                <div className="desde">
                  <input type="text" id='desde' placeholder={t("SINCE")}  class='buscar124' />
                  <input type="text" id='hasta' placeholder={t("UNTIL")} class='buscar124' />
                </div>
                <h4 onClick={selectDesde} class='boton' >{t("SEARCH")}</h4></div>

            </div>
            <div class="filters">
              <div class="busq">

                <input type="number" id='num' placeholder="NÚMERO DE BOCHON" class='buscar12' />
                <h4 onClick={selectNumero} class='boton' id='num' >{t("SEARCH")}</h4></div>
            </div>
          </div>
        </div>
        <div id="main-container">
          {
            !bochons ? <div class='spiner'>
              <img src={dino} width='250px'></img>
            </div>
              :
              <div id="content">
                <table class="tabloni">
                  <thead className='tabli-head'>
                    <tr className='ordenar3'>
                      <th width='9%' onClick={() => ordenar()} ><p class='ordenar'>Nro<BiSortAlt2 /></p></th>
                      <th width='10%'><p class='ordenar2'>{t("GENRE")}</p></th>
                      <th width='10%'><p class='ordenar2'>{t("SPECIES")}</p></th>
                      <th width='21%'><p class='ordenar2'>{t("FILO")}</p></th>
                      <th width='21%'><p class='ordenar2'>{t("PARTS")} </p></th>
                      <th width='10%'><p class='ordenar2'>{t("TRAINING")}</p></th>
                      <th width='10%'><p class='ordenar2'>{t("DISCOVERER")}</p></th>
                      <th width='10%'><p class='ordenar2'>{t("CAMPAIGN")}</p></th>
                      <th width='9%'><p class='ordenar2'>{t("FIELD")}</p></th>
                    </tr>
                  </thead>
                  <div className="tebodi">
                    <tbody className="ordenar4">
                      {
                        bochonsFilter?.length > 0 ? bochonesFiltrados.map((elemento) => {
                          if (elemento.especimennumero > 0) {
                            clase = 'danger1'

                          } else {
                            clase = 'pase1'
                          }
                          return (

                            <tr key={elemento.bochonnumero} class={clase} 
                                onClick={() => handleClickRow(elemento)}
                                onMouseEnter={() => handleMouseEnter(elemento)}
                                onMouseLeave={handleMouseLeave}> 
                              <td width='9%' align='center'><p>{elemento.bochonnumero}</p></td>
                              <td width='10%' align='center'><p class='datosCur3'>{elemento.genero}</p></td>
                              <td width='10%' align='center'><p class='datosCur3'>{elemento.especie}</p></td>
                              <td width='21%' align='center'>{elemento.posicionfilo.length > 0 ? elemento.posicionfilo.map(e => { return e + "; " }) : <p>Sin Posición Filogenética</p>}</td>
                              <td width='21%' align='center'>{elemento.partesesqueletales.length > 0 ? elemento.partesesqueletales.map(e => { return e + "; " }) : <p>Sin Partes esqueléticas</p>}</td>
                              <td width='10%' align='center'>{elemento.formacion}</td>
                              <td width='10%' align='center'>{elemento.descubridor}</td>
                              <td width='10%' align='center'>{elemento.campana}</td>
                              <td width='9%' align='center'>{elemento.nrocampo}</td>
                            </tr>
                          );
                        }) :
                          bochons1?.map((elemento) => {
                            if (elemento.especimennumero > 0) {
                              clase = 'danger1'

                            } else {
                              clase = 'pase1'
                            }
                            return (

                              <tr key={elemento.bochonnumero} 
                              class={clase} 
                              onClick={() => handleClickRow(elemento)}
                                onMouseEnter={() => handleMouseEnter(elemento)}
                                onMouseLeave={handleMouseLeave}> 
                                <td width='9%' align='center'><p>{elemento.bochonnumero}</p></td>
                                <td width='10%' align='center'><p class='datosCur3'>{elemento.genero}</p></td>
                                <td width='10%' align='center'><p class='datosCur3'>{elemento.especie}</p></td>
                                <td width='21%' align='center'>{elemento.posicionfilo.length > 0 ? elemento.posicionfilo.map(e => { return e + "; " }) : <p>Sin Posición Filogenética</p>}</td>
                                <td width='21%' align='center'>{elemento.partesesqueletales.length > 0 ? elemento.partesesqueletales.map(e => { return e + "; " }) : <p>Sin Partes esqueléticas</p>}</td>
                                <td width='10%' align='center'>{elemento.formacion}</td>
                                <td width='10%' align='center'>{elemento.descubridor}</td>
                                <td width='10%' align='center'>{elemento.campana}</td>
                                <td width='9%' align='center'>{elemento.nrocampo}</td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </div>
                </table>
              </div>
          }
        </div>
      </div>
    </div>
  )
}