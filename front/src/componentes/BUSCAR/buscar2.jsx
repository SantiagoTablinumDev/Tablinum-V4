
import './buscar.css'
import axios from 'axios';
import React from "react";
import { useEffect, useState } from 'react';
import dino from "../img/dinoGif.gif";
import {useTranslation} from "react-i18next"
import { filtrarDatos, getDatos, getDatos2, getFilo, Toast, getGeneroEspecie, getPartes, subespecimen, fechaActual, getDatos4 } from "../../store/action";
import printCatalogo from '../../FUNCIONES/pdf';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Menu from "../NAVBAR/menu";
import { BiSortAlt2, BiPrinter} from 'react-icons/bi';
import { useAuth0 } from "@auth0/auth0-react";
import Swal from 'sweetalert2'
import { useRef } from "react";
import { url } from '../../URL.js'
import { Button } from "../userCollec/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../userCollec/ui/select.tsx";
import { Input } from "../userCollec/ui/input";
import { Checkbox } from "../userCollec/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../userCollec/ui/card";
import { Badge } from "../userCollec/ui/badge";
import { Separator } from "../userCollec/ui/separator.tsx";
import { ScrollArea } from "../userCollec/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../userCollec/ui/table.tsx";
import { ImageWithFallback } from '../userCollec/figma/ImageWithFallback';
import { Printer, ArrowUpDown } from 'lucide-react';

export default function Buscar() {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [search, setSearch] = useState({ parametro: "", busqueda: "" })
  const [orden, setOrden] = useState('menor')
  const userD = useSelector((state) => state.usuario)
  const [preview, setPreview] = useState()
    const [especimenFiltrado, setEspecimenFiltrado] = useState([]);
  

  useEffect(() => {
    dispatch(getGeneroEspecie())

    dispatch(getPartes())
    dispatch(getFilo())


    if (userD.nivel === 4) {
      dispatch(getDatos4());
    } else if (userD.nivel === 3 || userD.nivel === 2 || userD.nivel === 1) {
      dispatch(getDatos2());
    }




  }, [userD])
  useEffect(() => {
  return () => {
    clearTimeout(hoverTimeout.current);
  };
}, []);
  const [t, i18n] = useTranslation("global")
  var especimenes = useSelector((state) => state.especimenes)

  const generoEspecie = useSelector((state) => state.generoEspecie)
  const [filter, setFilter] = useState({
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

  const dataToUse = especimenFiltrado.length === 0 ? espec : especimenFiltrado;
  
  const genero = [...new Set(espec?.map(e => e.genero).filter(Boolean))];
  const especie = [...new Set(espec?.map(e => e.especie).filter(Boolean))];
  const filogen = [...new Set(espec?.flatMap(e => e.posicionfilo || []).filter(Boolean))];
  const partes = [...new Set(espec?.flatMap(e => e.partesesqueletales || []).filter(Boolean))];
  const descubridor = [...new Set(espec?.map(e => e.descubridor).filter(Boolean))];
  const campana = [...new Set(espec?.map(e => e.campana).filter(Boolean))];
  const formacion = [...new Set(espec?.map(e => e.formacion).filter(Boolean))];
  const currentData = especimenFiltradoSort?.length > 0 ? especimenFiltradoSort : especSort;
  // Filter functions
  const applyFilters = () => {
    let filtered = [...especimenes];

    if (filter.genero) {
      filtered = filtered.filter(e => e.genero === filter.genero);
    }
    if (filter.especie) {
      filtered = filtered.filter(e => e.especie === filter.especie);
    }
    if (filter.filo) {
      filtered = filtered.filter(e => e.posicionfilo?.includes(filter.filo));
    }
    if (filter.partes) {
      filtered = filtered.filter(e => e.partesesqueletales?.includes(filter.partes));
    }
    if (filter.desc) {
      filtered = filtered.filter(e => e.descubridor === filter.desc);
    }
    if (filter.campa) {
      filtered = filtered.filter(e => e.campana === filter.campa);
    }
    if (filter.forma) {
      filtered = filtered.filter(e => e.formacion === filter.forma);
    }
    if (filter.prepa) {
      filtered = filtered.filter(e => e.url === 'si');
    }
    if (filter.numero) {
      filtered = filtered.filter(e => e.especimennumero === filter.numero);
    }

    setEspecimenFiltrado(filtered);
  };
 
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
    let bus=document.getElementById('preparacion').checked

    bus?dispatch(filtrarDatos({ parametro: 'prepara', busqueda: 'si' })):dispatch(filtrarDatos({ parametro: 'prepara', busqueda: '' }))
    
  }

  function selectHolotipo(e){
    filter.holo = e.target.value != 'todos' ? e.target.value : null;
    let bus= document.getElementById('holotipo').checked
   
    bus?dispatch(filtrarDatos({ parametro: 'holotipo', busqueda: true})):dispatch(filtrarDatos({ parametro: 'holotipo', busqueda: false}))
  }

  function selectNumero(e) {
    
    if(document.getElementById('num').value<=0){
      Toast.fire({      icon: 'error',
      title: t("NOVAL")
    }) 
    } else{

let count=0;
espec?.map(el=>{
if(el.especimennumero==document.getElementById('num').value + '000'){
  count++;
}
})
if(count>0){
  var id = document.getElementById('num').value + '000';
  dispatch(filtrarDatos({ parametro: 'numero', busqueda: id }))
}else{
  Toast.fire({      icon: 'error',
  title: t("NOESPEC")
}) 
}
   
  }
}
  useEffect(() => {
    applyFilters();
  }, [filter]);

  function selectDesde(e) {
    var desde = document.getElementById('desde').value + '000';
    var hasta = document.getElementById('hasta').value + '000';
    let dh=espec.filter(
      (ele) =>
        Number(ele.especimennumero) >= Number(desde) &&
        Number(ele.especimennumero) <= Number(hasta)
    );

    if(dh.length>0){
    dispatch(filtrarDatos({ parametro: 'desde', busqueda: [desde, hasta] }))
  }else{
    Toast.fire({
      icon: "error",
      title:  t("NOESPEC"),
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
    document.getElementById('preparacion').checked =false;
    document.getElementById('holotipo').checked =false;
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
    clearTimeout(hoverTimeout.current); // Cancela hover si hacemos click
    navigate(`/home/${elemento.especimennumero}`);
  };
  const coleccion = () => {
    console.log(especimenFiltrado)

        
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
}).then((result) => {
  if (result.isConfirmed) {
    console.log('Datos ingresados:', result.value);
    let numeroEsp = []
    especimenFiltrado.map(el => numeroEsp.push(el.especimennumero))
   let neuw = {
          usuario_id: userD.id,
          nombre: result.value.nombre,
          descripcion: result.value.descripcion,
          especimenes: numeroEsp,
          bochones: [],
        }; 
      axios.post(`${url}user_collection/create`, neuw)
       Toast.fire({icon: 'success',title: t("EXITO")}) 
  }
});
  }
  return (
     <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => printCatalogo('catalogo', "", "e")}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Imprimir Catálogo
                </Button>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="preparacion"
                    onCheckedChange={selectPrepara}
                  />
                  <label htmlFor="preparacion" className="text-sm cursor-pointer">
                    {t("ONPREP").toUpperCase()}
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="holotipo"
                    onCheckedChange={selectHolotipo}
                  />
                  <label htmlFor="holotipo" className="text-sm cursor-pointer">
                    {t("HOLOTIPO").toUpperCase()}
                  </label>
                </div>
                
                <Badge variant="secondary">
                  {currentData?.length || 0} {t("FILAS")}
                </Badge>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {especimenFiltradoSort?.length > 0 && userD.nivel < 3 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => printCatalogo('filtrado', especimenFiltrado, "e")}
                  >
                    {t("IMPSEL")}
                  </Button>
                )}
                
                {especimenFiltrado?.length > 0 && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={limpiarFiltros}
                    >
                      {t("CLEAN")}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={coleccion}
                    >
                      {t("AÑADIRCOLL")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Filters Grid */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {/* Género */}
              <div className="space-y-2 min-w-[140px] flex-1">
                <label className="text-xs">{t("GENRE")}</label>
                <Select onValueChange={selectGenero} disabled={genero?.length < 1}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={t("GENRE")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {genero.sort()?.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Especie */}
              <div className="space-y-2 min-w-[140px] flex-1">
                <label className="text-xs">{t("SPECIES")}</label>
                <Select onValueChange={selectEspecie} disabled={especie?.length < 2}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={t("SPECIES")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {especie.sort()?.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filogenética */}
              <div className="space-y-2 min-w-[140px] flex-1">
                <label className="text-xs">Filogenética</label>
                <Select onValueChange={selectFilo} disabled={filogen?.length < 2}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Filogenética" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {filogen.sort()?.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Partes */}
              <div className="space-y-2 min-w-[140px] flex-1">
                <label className="text-xs">{t("PARTS")}</label>
                <Select onValueChange={selectPartes} disabled={partes?.length < 2}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder={t("PARTS")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {partes.sort()?.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Descubridor */}
              <div className="space-y-2 min-w-[140px] flex-1">
                <label className="text-xs">Descubridor</label>
                <Select onValueChange={selectDescubridor} disabled={descubridor?.length < 2}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Descubridor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {descubridor.sort()?.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Campaña */}
              <div className="space-y-2 min-w-[140px] flex-1">
                <label className="text-xs">Campaña</label>
                <Select onValueChange={selectCampana} disabled={campana?.length < 2}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Campaña" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {campana.sort()?.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Formación */}
              <div className="space-y-2 min-w-[140px] flex-1">
                <label className="text-xs">Formación</label>
                <Select onValueChange={selectFormacion} disabled={formacion?.length < 2}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Formación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {formacion.sort()?.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Búsqueda por rango */}
              <div className="space-y-2 min-w-[200px] flex-1">
                <label className="text-xs">Rango</label>
                <div className="flex gap-1">
                  <Input 
                    id="desde"
                    type="text" 
                    placeholder="Desde" 
                    className="flex-1 text-sm"
                  />
                  <Input 
                    id="hasta"
                    type="text" 
                    placeholder="Hasta" 
                    className="flex-1 text-sm"
                  />
                  <Button size="sm" onClick={selectDesde} className="text-xs px-2">
                    OK
                  </Button>
                </div>
              </div>
              
              {/* Búsqueda por número */}
              <div className="space-y-2 min-w-[160px] flex-1">
                <label className="text-xs">Nº Especimen</label>
                <div className="flex gap-1">
                  <Input 
                    id="num"
                    type="number" 
                    placeholder="Número" 
                    className="flex-1 text-sm"
                  />
                  <Button size="sm" onClick={selectNumero} className="text-xs px-2">
                    OK
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[9%]">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={ordenar}
                        className="h-auto p-0 font-medium"
                      >
                        {t("ESPECNRO")} <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[10%]">{t("GENRE")}</TableHead>
                    <TableHead className="w-[10%]">{t("SPECIES")}</TableHead>
                    <TableHead className="w-[21%]">{t("FILO")}</TableHead>
                    <TableHead className="w-[21%]">{t("PARTS")}</TableHead>
                    <TableHead className="w-[10%]">{t("TRAINING")}</TableHead>
                    <TableHead className="w-[10%]">{t("DISCOVERER")}</TableHead>
                    <TableHead className="w-[10%]">{t("CAMPAIGN")}</TableHead>
                    <TableHead className="w-[9%]">{t("FIELD")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData?.map((elemento) => (
                    <TableRow 
                      key={elemento.especimennumero}
                      className={`transition-colors hover:bg-muted/50 ${
                        userD.nivel !== 4 ? 'cursor-pointer' : ''
                      }`}
                      onClick={userD.nivel !== 4 ? () => handleClickRow(elemento) : undefined}
                      onMouseEnter={userD.nivel !== 4 ? () => handleMouseEnter(elemento) : undefined}
                      onMouseLeave={userD.nivel !== 4 ? handleMouseLeave : undefined}
                    >
                      <TableCell className="text-center">
                        {subespecimen(elemento.especimennumero)}
                      </TableCell>
                      <TableCell className="text-center">{elemento.genero}</TableCell>
                      <TableCell className="text-center">{elemento.especie}</TableCell>
                      <TableCell className="text-center">
                        {elemento.posicionfilo?.length > 0 
                          ? elemento.posicionfilo.join('; ') 
                          : 'Sin Posición Filogenética'
                        }
                      </TableCell>
                      <TableCell className="text-center">
                        {elemento.partesesqueletales?.length > 0 
                          ? elemento.partesesqueletales.join('; ') 
                          : 'Sin Partes esqueléticas'
                        }
                      </TableCell>
                      <TableCell className="text-center">{elemento.formacion}</TableCell>
                      <TableCell className="text-center">{elemento.descubridor}</TableCell>
                      <TableCell className="text-center">{elemento.campana}</TableCell>
                      <TableCell className="text-center">{elemento.nrocampo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
