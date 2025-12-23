import Menu from "../NAVBAR/menu";
import logoMuseo from '../img/logomuseogrande.png';
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import './prestamos.css'
import { getDatos2, subespecimen, Toast, getBochones } from "../../store/action";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import axios from "axios"
import { BiPrinter } from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";
import { url } from '../../URL.js'
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next"

export function Prestamos() {
    const navigate = useNavigate()
    let dispatch = useDispatch()
    let especimenes = useSelector((state) => state.especimenes)
    let bochones = useSelector((state) => state.bochones.data)
    let usuario = useSelector((state) => state.usuario)
    const [catalogo, setCatalogo] = useState()
    let espec = especimenes;
    let bochon = bochones;
    const { isAuthenticated, user } = useAuth0();
    const [prestamo, setPrestamo] = useState({ tipoprestamo: 'Préstamo' })
    let fecha = obtenerFecha()
    const [listapres, setListapres] = useState()
    const [prestamoFilter, setPrestamoFilter] = useState()
    const [numerosSort, setNumerosSort] = useState()
    const [numb, setNumb] = useState(0)
    const [espeSelect, setEspectSelect] = useState()
    const [numerosEspe, setNumerosEspe] = useState([])
    const [t, i18n] = useTranslation("global")

    function traerPrestamos() {
        axios.get(`${url}prestamosRoute/prestamos`)
            .then(res => setListapres(res.data))
    }
    useEffect(() => {
        dispatch(getDatos2())
        dispatch(getBochones())

        traerPrestamos()

    }, [numb])



    function obtenerFecha() {
        let fechaActual
        let date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        if (month < 10) {
            fechaActual = year + '-0' + month + '-' + day /* day + '/0' + month + '/' + year */
        } else {
            fechaActual = year + '-' + month + '-' + day
        }
        if (day < 10) {
            fechaActual = year + '-0' + month + '-' + '0' + day
        }
        return fechaActual
    }
    function detallePrestamo(e, elemento) {
        let fecha1 = obtenerFecha()
        let put = { especimennumero: elemento.numeroespecimen, prestado: false }
        let update = { id: elemento.id, fechadevolucion: fecha1, devuelto: true }
        let idPrestamo = elemento.id
        if (elemento.devuelto) {
            const { value: formValues } = Swal.fire({
                title: `${elemento.tipoprestamo}`,
                html:
                    `<div class="modal-detalle-content">` +
                    `<div class="modal-row"><span class="modal-label">${t("LOAN_BY")}</span> <span class="modal-value">${elemento.emisor}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("RESEARCHER")}</span> <span class="modal-value">${elemento.investigador}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("MAIL")}</span> <span class="modal-value">${elemento.correo}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("CONT")}</span> <span class="modal-value">${elemento.contacto}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("INSTITUTION")}</span> <span class="modal-value">${elemento.institucion}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("SPECIMEN_NUM")}</span> <span class="modal-value">${elemento.tipoprestamo.includes("bochon") ? elemento.numeroespecimen.map(el => { return (el) }) : elemento.numeroespecimen.map(el => { return (subespecimen(el)) })}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("LOAN_DATE")}</span> <span class="modal-value">${elemento.fechaprestamo}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("EST_RETURN_DATE")}</span> <span class="modal-value">${elemento.fechadevolucionest}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("COMMENT")}</span> <span class="modal-value">${elemento.comentarios != null ? elemento.comentarios : t("NO_COMMENTS")}</span></div>` +
                    `</div>`,
                showCloseButton: true,
                showDenyButton: true,
                showConfirmButton: true,
                denyButtonText: t("VOLVER"),
                confirmButtonText: t("ELI"),
                preConfirm: () => {

                    return [
                        axios.delete(`${url}prestamosRoute/eliminarPrestamos?id=` + idPrestamo)
                            .then(res => {
                                if (res.status == 200) {
                                    Swal.fire(
                                        t("-PRESTA"),
                                        t("VOLVER"),
                                        'success'
                                    )
                                    setTimeout(() => { traerPrestamos() }, "1000")
                                    traerPrestamos()
                                } else { Swal.fire(t("SOMETHING_WRONG"), '', 'warning') }
                            })

                    ]
                }
            })
            if (formValues) {
                Swal.fire(JSON.stringify(formValues))
            }

        } else {
            const { value: formValues } = Swal.fire({
                title: `${elemento.tipoprestamo}`,
                html:
                    `<div class="modal-detalle-content">` +
                    `<div class="modal-row"><span class="modal-label">${t("LOAN_BY")}</span> <span class="modal-value">${elemento.emisor}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("RESEARCHER")}</span> <span class="modal-value">${elemento.investigador}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("MAIL")}</span> <span class="modal-value">${elemento.correo}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("CONT")}</span> <span class="modal-value">${elemento.contacto}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("INSTITUTION")}</span> <span class="modal-value">${elemento.institucion}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("SPECIMEN_NUM")}</span> <span class="modal-value">${elemento.tipoprestamo.includes("bochon") ? elemento.numeroespecimen.map(el => { return (el) }) : elemento.numeroespecimen.map(el => { return (subespecimen(el)) })}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("LOAN_DATE")}</span> <span class="modal-value">${elemento.fechaprestamo}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("EST_RETURN_DATE")}</span> <span class="modal-value">${elemento.fechadevolucionest}</span></div>` +
                    `<div class="modal-row"><span class="modal-label">${t("COMMENT")}</span> <span class="modal-value">${elemento.comentarios != null ? elemento.comentarios : t("NO_COMMENTS")}</span></div>` +
                    `</div>`,



                showCloseButton: true,
                showDenyButton: true,

                denyButtonText: t("VOLVER"),

                confirmButtonText: t("DEVO"),
                preConfirm: () => {
                    Swal.fire(
                        t("PREACT"),
                        t("VOLVER"),
                        'success'
                    )
                    return [
                        axios.put(`${url}prestamosRoute/prestamos`, update),
                        axios.put(`${url}modificarespre`, put),
                        setTimeout(() => { traerPrestamos() }, "1000"),
                        traerPrestamos(),

                    ]
                }
            })
            if (formValues) {
                Swal.fire(JSON.stringify(formValues))
            }
        }

    }

    //console.log(especimenes,"especimen")
    //console.log(bochon,"bochones")
    function changeInput(e) {
        setPrestamo({
            ...prestamo,
            [e.target.name]: e.target.value
        })
    }

    function submitPrestamo(e) {

        let obj = {
            emisor: user?.name,
            fechaprestamo: fecha,
            tipoprestamo: prestamo.tipoprestamo + "/" + catalogo,
            investigador: prestamo.investigador,
            correo: prestamo.correo,
            contacto: prestamo.contacto,
            numeroespecimen: numerosEspe,
            institucion: prestamo.institucion,
            comentarios: prestamo.comentarios,
            fechadevolucionest: prestamo.fechadevolucionest,

        }

        let investi = document.getElementById('investigador').value
        let put = { especimennumero: numerosEspe, prestado: true, catalog: catalogo }
        if (!numerosEspe) {
            Toast.fire({ icon: 'warning', title: t("-NUM") })

        }

        else {
            axios.post(`${url}prestamosRoute/prestamos`, obj)
                .then(res => { Toast.fire({ icon: 'success', title: t("+PRESTA") }) })
            axios.put(`${url}modificarespre`, put)
            traerPrestamos()
            setPrestamo(null)
            setNumb(numb + 1)
        }

    } let back = 'white'


    function filtrarPrestamo(e) {
        e.preventDefault()
        if (e.target.value.length === 0) {
            setPrestamoFilter(listapres)
        } else {
            if (!e.target.value.includes('-')) {
                //     console.log(e.target.value,listapres)

                let result = listapres?.filter(el => el.numeroespecimen.includes(e.target.value + '000'))

                setPrestamoFilter(result)
            } else {
                //  console.log(e.target.value)
                let result = listapres?.filter(el => el.numeroespecimen.includes(e.target.value.replace('-', '')))
                setPrestamoFilter(result)
            }

        }

    }

    function prestamoORconsulta(e) {
        setPrestamo({
            ...prestamo,
            tipoprestamo: e.target.value
        })
    }
    function filtrarEspecimen(e, value) {

        //  console.log()
        setNumerosEspe([...numerosEspe, e.target.value])
        if (e.target.value.length === 0) {
            setEspectSelect()
        }
        else {
            if (catalogo === "coleccion") {
                let especimenSelect = espec.filter(el => el.especimennumero === e.target.value)
                setEspectSelect(especimenSelect)

            } else {
                let bochonselect = bochon.filter(el => el.bochonnumero === e.target.value)
                setEspectSelect(bochonselect)
            }
        }

    }

    let style = {
        color: "green",
        fontStyle: "oblique"
    }
    function eliminarNumero(el, e) {
        e.preventDefault()
        let cambio = numerosEspe.filter(occ => occ !== el)
        setNumerosEspe(cambio)


    }
    let numeroEspecimenes = espec?.map(el => el.especimennumero)
    let numeroBochones = bochon?.map(el => el.bochonnumero)
    function SortArray(x, y) {
        if (Number(x) < Number(y)) { return -1; }
        if (Number(x) > Number(y)) { return 1; }
        return 0;
    }

    function imprimirPDF(e) {
        //console.log(e)
        var select = []
        // console.log(e)
        var params2 = listapres.filter(el => el.id === e)
        var params = params2[0]
        //console.log(params)
        if (params.tipoprestamo.includes("bochon")) {
            if (bochon.length > 0) {
                params.numeroespecimen?.map(el => {
                    var x = bochones?.filter(eleme => eleme.bochonnumero === el)

                    return select.push(x[0])


                })
            }
        } else {
            if (especimenes.length > 0) {


                params.numeroespecimen?.map(el => {
                    var x = especimenes?.filter(eleme => eleme.especimennumero === el)

                    return select.push(x[0])


                })
            }
        }
        //console.log(params)
        var x = 80;

        const doc = new jsPDF();
        doc.addImage(logoMuseo, 10, 10, 60, 25)
        doc.setFontSize(12)
        doc.text(t("PDF_INSTITUTE"), 65, 12);

        doc.setFontSize(10)
        doc.text(t("PDF_CATALOG"), 83, 17);
        doc.setFontSize(10)
        doc.text(t("PDF_DATE"), 169, 21);
        doc.setFontSize(10)
        doc.text(formato(fecha), 168, 25);
        doc.rect(70, 28, 90, 10); // empty square
        doc.setFontSize(11)
        if (params.tipoprestamo.includes("bochon")) {
            doc.text(params.tipoprestamo.includes("Préstamo") ? t("PDF_LOAN_BOCHON") : t("PDF_CONSULT_BOCHON"), 90, 34)
        } else {
            doc.text(params.tipoprestamo.includes("Préstamo") ? t("PDF_LOAN_SPECIMENS") : t("PDF_CONSULT_SPECIMENS"), 90, 34)
        }
        doc.rect(30, 40, 150, 30); // empty square
        doc.setTextColor(100);
        doc.text(t("PDF_RESEARCHER"), 32, 45)
        doc.setTextColor(0, 0, 0);
        doc.text(55, 45, params.investigador)
        doc.setTextColor(100);
        doc.text(t("PDF_INSTITUTION"), 32, 55)
        doc.setTextColor(0, 0, 0);
        doc.text(params.institucion, 52, 55)
        doc.setTextColor(100);
        doc.text(t("PDF_ENDORSEMENT"), 32, 65)
        doc.setTextColor(0, 0, 0);
        doc.text(params.emisor, 57, 65)

        select?.map(el => {
            doc.setFont(undefined, 'regular');
            if (params.tipoprestamo.includes("bochon")) {
                doc.text(t("PDF_BOCHON_PREFIX") + el.bochonnumero, 32, x);
            } else {
                doc.text(t("PDF_SPECIMEN_PREFIX") + subespecimen(el.especimennumero), 32, x);
            }
            doc.setFont(undefined, 'italic');
            doc.text(el.genero + ' / ' + el.especie, 80, x)

            x = x + 10;

        })
        doc.line(20, x, 185, x); // horizontal line
        doc.setFont(undefined, 'regular');
        !params.comentarios ? doc.text(t("PDF_NO_OBSERVATIONS"), 32, x + 10) : doc.text(t("PDF_OBSERVATIONS") + params.comentarios, 32, x + 10);
        doc.setFont(undefined, 'bold');
        doc.text(t("PDF_RETURN_DATE") + formato(params?.fechadevolucionest), 32, x + 25);

        doc.text('_ _ _ _ _ _ _ _ _ _ _ _                                                         _ _ _ _ _ _ _ _ _ _ _ _ ', 32, x + 45)
        doc.text(params.emisor, 30, x + 55)
        doc.text(params.investigador, 135, x + 55)

        doc.save(params.tipoprestamo.includes("Préstamo") ? t("PDF_FILENAME_LOAN") + params.investigador + '.pdf' : t("PDF_FILENAME_CONSULT") + params.investigador + '.pdf');


    }


    // let numerosSort = numeroEspecimenes?.sort(SortArray12)

    function formato(texto) {
        return texto.replace(/^(\d{4})-(\d{2})-(\d{2}||\d{1})$/g, '$3-$2-$1');
    }
    function SortArray(x, y) {
        if (x.updatedAt > y.updatedAt) { return -1; }
        if (x.updatedAt < y.updatedAt) { return 1; }
        return 0;
    }
    function SortArray12(x, y) {
        if (Number(x) < Number(y)) { return -1; }
        if (Number(x) > Number(y)) { return 1; }
        return 0;
    }
    let listPrestamosOrder = listapres?.sort(SortArray)
    let prestamoFilterOrder = prestamoFilter?.sort(SortArray)
    function SelecCatalogo(value) {
        setNumerosEspe([])
        if (value === 'coleccion') {
            //  console.log(value)
            setCatalogo("coleccion")
            setNumerosSort(numeroEspecimenes?.sort(SortArray12))
        } else {
            setCatalogo("bochon")
            setNumerosSort(numeroBochones?.sort(SortArray12))
        }
    }
    // console.log(numerosSort, "numeros")

    return (
        <div className='container34'>

            <datalist id='prestamo-numero-especimen'>
                {
                    listapres?.map(eleme => { return <option>{eleme.numeroespecimen}</option> })
                    //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

                }

            </datalist>
            <datalist id='numeroespecimen'>
                {
                    espec?.map(eleme => { return <option>{eleme.especimennumero}</option> })
                    //especiefiltrada?.forEach(ele => {return <option>{ele}</option>})

                }

            </datalist>
            <Menu activo={4} />
            <div className="contenido34">
                <div className="cabecera">
                    <div className="apre">
                        {t("PRELIS")}
                    </div>
                </div>
                <div className='cont'>
                    <div className='crear-prest'>
                        <div className="cab-pres">
                            <h4 className="hhh">{t("INPRE")}</h4>
                        </div>

                        <form type='submit' onSubmit={(e) => { submitPrestamo(e) }} className='formulario-prestamo'>
                            <div className='form-prest'>
                                <div className='conte-div'>
                                    <label>{t("TYPE")}:</label>
                                    <select className="sdsd" onChange={(e) => prestamoORconsulta(e)} required>
                                        <option >{t("SELECT_OPTION")}</option>
                                        <option value='Préstamo' selected>{t("LOAN_OPTION")}</option>
                                        <option value='Consulta'>{t("CONSULTATION_OPTION")}</option>
                                    </select>
                                </div><div className='conte-div'>
                                    <label>{t("COLLECTION_LABEL")}</label>
                                    <select className="sdsd" onChange={(e) => SelecCatalogo(e.target.value)} required>
                                        <option >{t("SELECT_OPTION")}</option>
                                        <option value='coleccion'>{t("COLLECTION_OPTION")}</option>
                                        <option value='sinpreparar'>{t("UNPREPARED_OPTION")}</option>
                                    </select>
                                </div>
                                <div className="conte-div">
                                    <label>{t("INVES")}:</label>
                                    <input type='text' required name='investigador' id='investigador' className="sdsd" onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div">
                                    <label>{t("MAIL")}:</label>
                                    <input className="sdsd" type='text' name='correo' id='correo' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div">
                                    <label>{t("CONT")}:</label>
                                    <input className="sdsd" type='text' name='contacto' id='contacto' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div">
                                    <label>{t("INSTI")}:</label>
                                    <input className="sdsd" type='text' name='institucion' id='institucion' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <div className="conte-div2">
                                    <label>{t("ESPECNRO")}:</label>
                                    <select onChange={(e) => { filtrarEspecimen(e) }} required className="sdsd">
                                        <option value=''>{t("SEL")}</option>
                                        {
                                            catalogo === "coleccion" ?
                                                numerosSort?.map(eleme => { return <option value={eleme}>{subespecimen(eleme)}</option> })
                                                :
                                                numerosSort?.map(eleme => { return <option value={eleme}>{eleme}</option> })
                                        }
                                    </select>
                                    <div className='gen-selected'>
                                        {
                                            espeSelect ? <p style={style}>{espeSelect[0]?.genero + " " + espeSelect[0]?.especie}</p> : null
                                        }
                                    </div>
                                    {/* <input  className="sdsd" type='text' list='numeroespecimen' id='especimennumero'name='numeroespecimen' required onChange={(e)=> {filtrarEspecimen(e)}}/> */}
                                </div>
                                <div className='numeros-de-especimen'>
                                    {catalogo === "coleccion" ?
                                        (numerosEspe ? numerosEspe?.map(el => { return <div onClick={(e) => eliminarNumero(el, e)} className='caca-prestamos'><span tooltip="click para eliminar" >{subespecimen(el)}</span></div> }) : null)
                                        :
                                        (numerosEspe ? numerosEspe?.map(el => { return <div onClick={(e) => eliminarNumero(el, e)} className='caca-prestamos'><span tooltip="click para eliminar" >{el}</span></div> }) : null)
                                    }
                                </div>
                                <div className="conte-div">
                                    <label >{t("EST")}</label>
                                    <input className="sdsd" type='date' required name='fechadevolucionest' id='fechadevolucionest' onChange={(e) => { changeInput(e) }} />
                                </div>
                                <p>{t("COMENT")}</p>
                                <textarea type='text' className='text-pres' placeholder={t("DELIVERY_DETAIL_PLACEHOLDER")} name='comentarios' onChange={(e) => { changeInput(e) }} />
                                <button type="submit" className='boton-prest'>{t("+PRES")}</button>
                            </div>
                        </form>
                    </div>
                    <div className='lista-prest'>
                        <div className='buscar-prestamo'>

                            <h4 className="hhh">{t("BUS")}:</h4>
                            <input type="number" id='num-prestamo' placeholder={t("INGRE")} onChange={(e) => { filtrarPrestamo(e) }} className='buscar-prestamo-input'></input>

                        </div>


                        <div id="main-container234">
                            {
                                !listapres ?
                                    <div className='spiner'>
                                        <div className="spinner-border text-success" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                    :
                                    <table className="rwd_auto fontsize2 papa1"> {/* Aplica la clase 'papa1' a la tabla */}
                                        <thead className="tabli-headP">
                                            <tr className="trHead">
                                                <th width='17%'>{t("FEPRE")}</th>
                                                <th width='13%'>{t("TYPE")}</th>
                                                <th width='15%'>{t("ESPECNRO")}</th>
                                                <th width='15%'>{t("INVES")}</th>
                                                <th width='15%'>{t("FEDEV")}</th>
                                                <th width='6%'>{t("DEVO")} </th>
                                                <th width='7%'>PDF</th> {/* Nueva columna para el icono de impresión */}
                                            </tr>
                                        </thead>
                                        <tbody className="bodyPres">
                                            {
                                                prestamoFilterOrder?.length > 0 ?
                                                    prestamoFilterOrder?.map((elemento) => {
                                                        let back = elemento.fechadevolucionest < fecha && elemento.devuelto === false ? 'tr2Rojo' : ''; // Clase condicional para filas rojas

                                                        var cont = 0;
                                                        return (
                                                            <tr key={elemento?.id} onClick={(e) => detallePrestamo(e, elemento)} className={back}>
                                                                <td width='17%'>{formato(elemento?.fechaprestamo)}</td>
                                                                <td width='15%'>{elemento.tipoprestamo}</td>
                                                                <td width='17%'>
                                                                    {
                                                                        elemento.tipoprestamo.includes("bochon") ?
                                                                            elemento.especimennumero
                                                                            :
                                                                            (elemento?.numeroespecimen.map(el => {
                                                                                cont++;
                                                                                return cont < elemento?.numeroespecimen.length ? subespecimen(el) + " / " : subespecimen(el);
                                                                            }))
                                                                    }
                                                                </td>
                                                                <td width='19%'>{elemento?.investigador}</td>
                                                                <td width='15%'>{formato(elemento?.fechadevolucionest)}</td>
                                                                {elemento?.fechadevolucion ? <td width='11%'>{formato(elemento?.fechadevolucion)}</td> : <td width='10%'>{t("PENDING")}</td>}
                                                                <td onClick={(e) => {
                                                                    e.stopPropagation(); // Evita que el evento se propague a la fila
                                                                    imprimirPDF(elemento?.id)
                                                                }}>
                                                                    <BiPrinter fontSize='20px' />
                                                                </td>

                                                            </tr>
                                                        );
                                                    })
                                                    :
                                                    listPrestamosOrder?.map((elemento) => {
                                                        let back = elemento?.fechadevolucionest < fecha && elemento?.devuelto === false ? 'tr2Rojo' : '';

                                                        var cont = 0;
                                                        return (
                                                            <tr key={elemento?.id} onClick={(e) => detallePrestamo(e, elemento)} className={back}>
                                                                <td width='17%'>{formato(elemento?.fechaprestamo)}</td>
                                                                <td width='13%'>{elemento.tipoprestamo}</td>
                                                                <td width='17%'>
                                                                    {
                                                                        elemento.tipoprestamo.includes("bochon") ?
                                                                            (elemento?.numeroespecimen.map(el => {
                                                                                cont++;
                                                                                return cont < elemento?.numeroespecimen.length ? el + " / " : el;
                                                                            }))
                                                                            :
                                                                            (elemento?.numeroespecimen.map(el => {
                                                                                cont++;
                                                                                return cont < elemento?.numeroespecimen.length ? subespecimen(el) + " / " : subespecimen(el);
                                                                            }))
                                                                    }
                                                                </td>
                                                                <td width='18%'>{elemento?.investigador}</td>
                                                                <td width='15%'>{formato(elemento?.fechadevolucionest)}</td>
                                                                {elemento?.fechadevolucion ? <td width='10%'>{formato(elemento?.fechadevolucion)}</td> : <td width='8%'>{t("PENDING")}</td>}
                                                                <td onClick={(e) => {
                                                                    e.stopPropagation(); // Evita que el evento se propague a la fila
                                                                    imprimirPDF(elemento?.id)
                                                                }}>
                                                                    <BiPrinter fontSize='20px' />
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                            }
                                        </tbody>
                                    </table>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}