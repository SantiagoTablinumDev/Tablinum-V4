const expres = require("express");
const { Router } = require("express");
const { conn } = require("../db");
const rutas = Router();
const { Op } = require("sequelize");
const FileController = require("./FileController");
const fileController = new FileController();
const FileController1 = require("./FileController-imagen");
const fileController1 = new FileController1();
let fs = require("fs");
const { exec } = require("child_process");
require("dotenv").config();
const { DB_USER, DB_PASS, DB_HOST } = process.env;
const especimenRoutes = require("./especimen")
const bochonRoutes = require("./bochon.js")
const usuariosRoute = require("./usuarios.js")
const prestamosRoute = require("./prestamos.js")
const {
  especimen,
  generoespecie,
  periodoEpoca,
  filo,
  parte,
  prestamo,
  usuarios,
  bochon,
  formacioncuenca,
  user_collections
} = conn.models;

rutas.use("/especimenRoute", especimenRoutes)

rutas.use("/bochonRoute", bochonRoutes)

rutas.use("/usuariosRoute", usuariosRoute)

rutas.use("/prestamosRoute", prestamosRoute)

rutas.post("/user_collection/create", async (req, res) => {
  try {
    const nuevaColeccion = await user_collections.create(req.body);
    res.status(201).json(nuevaColeccion);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "No se pudo crear la colección" });
  }
});

// 📌 Obtener todas las colecciones
rutas.get("/user_collection/getAll", async (req, res) => {
  try {
    const colecciones = await user_collections.findAll();
    res.json(colecciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener colecciones" });
  }
});

// 📌 Obtener colecciones de un usuario
rutas.get("/user_collection/getByUser/:id", async (req, res) => {
  try {
    // primero buscamos las colecciones de ese usuario
    const colecciones = await user_collections.findAll({
      where: { usuario_id: req.params.id },
    });

    if (!colecciones || colecciones.length === 0) {
      return res.json([]);
    }

    // acumulamos todos los ids de especímenes y bochones en arrays
    const todosEspecimenesIds = colecciones.flatMap(c => c.especimenes || []);
    const todosBochonesIds = colecciones.flatMap(c => c.bochones || []);

    // buscamos los especímenes en la tabla especimen (si hay ids)
    let especimenesEncontrados = [];
    if (todosEspecimenesIds.length > 0) {
      especimenesEncontrados = await especimen.findAll({
        where: {
          especimennumero: todosEspecimenesIds, // Sequelize hace IN automáticamente
        },
      });
    }

    // buscamos los bochones en la tabla bochon (si hay ids)
    let bochonesEncontrados = [];
    if (todosBochonesIds.length > 0) {
      bochonesEncontrados = await bochon.findAll({
        where: {
          bochonnumero: todosBochonesIds,
        },
      });
    }

    // armamos la respuesta, agregando los especímenes y bochones a cada colección
    const respuesta = colecciones.map(c => {
      const especimenesDeColeccion = especimenesEncontrados.filter(e =>
        (c.especimenes || []).includes(e.especimennumero)
      );
      const bochonesDeColeccion = bochonesEncontrados.filter(b =>
        (c.bochones || []).includes(b.bochonnumero)
      );
      return {
        ...c.toJSON(),
        especimenes_detalle: especimenesDeColeccion,
        bochones_detalle: bochonesDeColeccion,
      };
    });

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener colecciones del usuario" });
  }
});

// 📌 Obtener colección por ID
rutas.get("/user_collection/get/:id", async (req, res) => {
  try {
    const coleccion = await user_collections.findByPk(req.params.id);
    if (!coleccion) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }
    res.json(coleccion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la colección" });
  }
});

// 📌 Actualizar colección
rutas.put("/user_collection/update/:id", async (req, res) => {
  try {
    const [updated] = await user_collections.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }

    // volvemos a buscar la colección ya actualizada
    const coleccionActualizada = await user_collections.findByPk(req.params.id);

    if (!coleccionActualizada) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }

    // obtenemos los ids de especímenes
    const especimenesIds = coleccionActualizada.especimenes || [];

    // buscamos los especímenes en la tabla especimen
    const especimenesEncontrados = await especimen.findAll({
      where: {
        especimennumero: especimenesIds,
      },
    });

    // armamos la respuesta igual que en el GET
    const respuesta = {
      ...coleccionActualizada.toJSON(),
      especimenes_detalle: especimenesEncontrados,
    };

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al actualizar la colección" });
  }
});

// 📌 Eliminar colección
rutas.delete("/user_collection/delete/:id", async (req, res) => {
  try {
    const deleted = await user_collections.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Colección no encontrada" });
    }

    res.json({ message: "Colección eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la colección" });
  }
});

// modificacion de especimen si esta prestado o no 

rutas.put("/modificarespre", async (req, res) => {
  if (req.body.catalog === "coleccion") {
    req.body.especimennumero.map((el) => {
      try {
        let update = especimen.update(
          {
            prestado: req.body.prestado,
          },
          {
            where: {
              especimennumero: el,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    });

  } else {
    req.body.especimennumero.map((el) => {
      try {
        let update = bochon.update(
          {
            prestado: req.body.prestado,
          },
          {
            where: {
              bochonnumero: el,
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    });
  }
});

// get de tablas para POST

rutas.get("/tablas/", async (req, res) => {
  const { parametro, indice } = req.query;
  try {
    if (parametro === "genero") {
      let genero = await generoespecie.findAll();
      res.send(genero);
    }

    if (parametro === "formacion") {
      let genero = await formacioncuenca.findAll();
      res.send(genero);
    }

    if (parametro === "periodos") {
      var tabla = [
        {
          periodo: "Cámbrico",
          epoca: [
            {
              nombre: "Terreneuviano",
              piso: ["Fortuniano", "Piso 2"],
            },
            {
              nombre: "Serie 2",
              piso: ["Piso 3", "Piso 4"],
            },
            {
              nombre: "Miaolingio",
              piso: ["Wuliuano", "Drumiano", "Guzhangiano"],
            },
            {
              nombre: "Furongiano",
              piso: ["Paibiano", "Jiangshaniano", "Piso 10"],
            },
          ],
        },
        {
          periodo: "Ordovícico",
          epoca: [
            {
              nombre: "Superior",
              piso: ["Sandbiano", "Katiano", "Hirnantiano"],
            },
            {
              nombre: "Medio",
              piso: ["Dapingiano", "Darriwiliano"],
            },
            {
              nombre: "Inferior",
              piso: ["Tremadociano", "Floiano"],
            },
          ],
        },
        {
          periodo: "Silúrico",
          epoca: [
            {
              nombre: "Llandovery",
              piso: ["Rhuddaniano", "Aeroniano", "Telychiano"],
            },
            {
              nombre: "Wenlock",
              piso: ["Sheinwoodiano", "Homeriano"],
            },
            {
              nombre: "Ludlow",
              piso: ["Gorstiano", "Ludfordiano"],
            },
            {
              nombre: "Pridoli",
              piso: [],
            },
          ],
        },
        {
          periodo: "Dévonico",
          epoca: [
            {
              nombre: "Inferior",
              piso: ["Lochkoviano", "Pragiano", "Emsiano"],
            },
            {
              nombre: "Medio",
              piso: ["Eifeliano", "Givetiano"],
            },
            {
              nombre: "Superior",
              piso: ["Frasniano", "Famenniano"],
            },
          ],
        },
        {
          periodo: "Carbonífero Mississippiano",
          epoca: [
            {
              nombre: "Inferior",
              piso: ["Tournaisiano"],
            },
            {
              nombre: "Medio",
              piso: ["Viseano"],
            },
            {
              nombre: "Superior",
              piso: ["Serpukhoviano"],
            },
          ],
        },
        {
          periodo: "Carbonífero Pennsylvaniano",
          epoca: [
            {
              nombre: "Inferior",
              piso: ["Bashkiriano"],
            },
            {
              nombre: "Medio",
              piso: ["Moscovian"],
            },
            {
              nombre: "Superior",
              piso: ["Kasimoviano", "Gzheliano"],
            },
          ],
        },
        {
          periodo: "Pérmico",
          epoca: [
            {
              nombre: "Inferior / Cisuraliense",
              piso: ["Asseliano", "Sakmariano", "Artinskiano", "Kunguriano"],
            },
            {
              nombre: "Medio / Guadalupianse",
              piso: ["Roadiano", "Wordiano", "Capitaniano"],
            },
            {
              nombre: "Superior / Lopingiense",
              piso: ["Wuchiapingiano", "Changhsingiano"],
            },
          ],
        },
        {
          periodo: "Triásico",
          epoca: [
            {
              nombre: "Inferior / Temprano)",
              piso: ["Induano", "Olenekiano"],
            },
            {
              nombre: "Medio",
              piso: ["Anisiano", "Ladiniano"],
            },
            {
              nombre: "Superior / Tardío",
              piso: ["Carniano", "Noriano", "Raetiano"],
            },
          ],
        },
        {
          periodo: "Jurásico",
          epoca: [
            {
              nombre: "Inferior / Temprano)",
              piso: [
                "Hetangiano",
                "Sinemuriano",
                "Pliensbachiano",
                "Toarciano",
              ],
            },
            {
              nombre: "Medio",
              piso: ["Aaleniano", "Bajociano", "Batoniano", "Calloviano"],
            },
            {
              nombre: "Superior / Tardío",
              piso: ["Oxfordiano", "Kimeridgiano", "Titoniano"],
            },
          ],
        },
        {
          periodo: "Cretácico",
          epoca: [
            {
              nombre: "Inferior / Temprano",
              piso: [
                "Berriasiano",
                "Valanginiano",
                "Hauteriviano",
                "Barremiano",
                "Aptiano",
                "Albiano",
              ],
            },
            {
              nombre: "Superior / Tardío",
              piso: [
                "Cenomaniano",
                "Turoniano",
                "Coniaciano",
                "Santoniano",
                "Campaniano",
                "Maastrichtiano",
              ],
            },
          ],
        },
        {
          periodo: "Paleogeno (Terceario Temprano)",
          epoca: [
            {
              nombre: "Paleoceno",
              piso: ["Daniense", "Selandiano", "Thanetiano"],
            },
            {
              nombre: "Eoceno",
              piso: ["Ypresiano", "Luteciano", "Bartoniano", "Priaboniano"],
            },
            {
              nombre: "Oligoceno",
              piso: ["Rupelieno", "Chattiano"],
            },
          ],
        },
        {
          periodo: "Neogeno",
          epoca: [
            {
              nombre: "Neoceno",
              piso: [
                "Aquitaniano",
                "Burdigaliano",
                "Langhiano",
                "Serravalliano",
                "Tortoniano",
                "Mesiniano",
              ],
            },
            {
              nombre: "Plioceno",
              piso: ["Zancleano", "Piacenziano"],
            },
          ],
        },
        {
          periodo: "Cuaternario",
          epoca: [
            {
              nombre: "Pleistoceno",
              piso: [
                "Gelasiano",
                "Calabriano",
                "Chibaniano",
                "Tarantiano ó Superior",
              ],
            },
            {
              nombre: "Holoceno",
              piso: ["Groenlandiano", "Norgripiano", "Megalayano"],
            },
          ],
        },
      ];
      res.send(tabla);
    }

    if (parametro === "epocas") {
      let epoca = await periodoEpoca.findAll();
      const envio = [];
      epoca.map((e) => {
        if (indice == e.periodo) {
          let obj = {
            epoca: e.epoca,
            piso: e.piso,
          };
          envio.push(obj);
        }
      });
      res.send(envio);
    }

    if (parametro === "partes") {
      let partes = await parte.sequelize.query(
        "select principal,secundaria from partes"
      );
      res.send(partes[0]);
    }

    if (parametro === "filo") {
      let filog = await filo.findAll();
      res.send(filog);
    }
  } catch (e) {
    res.send(e).status(404);
  }
});

rutas.post("/tablas/", async (req, res) => {
  const { modelo, primario, secundario } = req.query;

  if (modelo === "genero") {
    let origin = await generoespecie.sequelize.query(
      "select genero from generoespecies"
    );
    //chequeo datos de tabla
    let generosTabla = [];
    origin[0].map((e) => {
      generosTabla.push(e.genero);
    });

    if (!generosTabla.includes(primario)) {
      let newGenero = await generoespecie.create({
        genero: primario,
        especie: [],
      });
      res.send(newGenero);
    } else {
      let origin = await generoespecie.sequelize.query(
        "select especie from generoespecies where genero = '" + primario + "'"
      );
      let especies = origin[0][0].especie;

      especies.push(secundario);

      let newEspecie = await generoespecie.update(
        {
          especie: especies,
        },
        {
          where: {
            genero: primario,
          },
        }
      );
      res.send(newEspecie);
    }
  }

  if (modelo === "cuenca") {
    try {
      let origin = await formacioncuenca.sequelize.query(
        "select cuenca from formacioncuencas"
      );
      //chequeo datos de tabla
      let cuencasTabla = [];
      origin[0].map((e) => {
        cuencasTabla.push(e.cuenca);
      });

      if (!cuencasTabla.includes(primario)) {
        let newCuenca = await formacioncuenca.create({
          cuenca: primario,
          formacion: [],
        });
        res.send(newCuenca);
      } else {
        let origin = await formacioncuenca.sequelize.query(
          "select formacion from formacioncuencas where cuenca ='" +
          primario +
          "'"
        );
        let forma = origin[0][0].formacion;
        forma.push(secundario);
        let newforma = await formacioncuenca.update(
          {
            formacion: forma,
          },
          {
            where: {
              cuenca: primario,
            },
          }
        );
        res.send(newforma);
      }
    } catch (e) {
      res.send(e);
    }
  }

  //post para nuevo filo
  if (modelo === "filo") {
    let origin = await filo.sequelize.query("select filo from filos");
    let filoTabla = [];

    //dontrol de duplicados
    origin[0].map((e) => {
      filoTabla.push(e.filo);
    });

    if (!filoTabla.includes(primario)) {
      let newFilo = await filo.create({
        filo: primario,
      });
      res.send(newFilo).status(202);
    }
  }
});
rutas.post("/subir-archivo", fileController.subirArchivo);

rutas.post("/subir-archivo-img", fileController1.subirArchivoImg);

rutas.get("/getImg/:filename", function (req, res) {
  let filename = req.params.filename;
  const rs = fs.createReadStream("../img/" + filename);

  rs.pipe(res);
});


rutas.get("/getPdf/:filename", function (req, res) {
  let filename = req.params.filename;
  const rs = fs.createReadStream("../pdf/" + filename);

  rs.pipe(res);
});
rutas.delete("/eliminar-archivo-img", async (req, res) => {
  let nombreArchivo = req.query;
  let archivoname = nombreArchivo.nombreArchivo;

  try {
    fs.unlinkSync("../img/" + archivoname);
    res.status(200).send({
      status: "success",
      msg: "archivo " + archivoname + " eliminado",
    });
  } catch (err) {
    res.status(404).send(err);
  }
});
rutas.delete("/eliminar-archivo", async (req, res) => {
  let nombreArchivo = req.query;
  let archivoname = nombreArchivo.nombreArchivo;

  try {
    fs.unlinkSync("../pdf/" + archivoname);
    res.status(200).send({
      status: "success",
      msg: "archivo " + archivoname + " eliminado",
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

rutas.post("/postpartes", async (req, res) => {
  let parte1 = req.query;
  let nueva = await parte.create({
    principal: parte1.parte,
    secundaria: [],
  });
  res.send(nueva);
});

//-----------------------------------------BOCHON----------------------------------//

rutas.post("/reserva/:cantidad", async (req, res) => {
  const { cantidad } = req.params;
  try {
    let inicio = 1;
    let numero = await especimen.sequelize.query(
      "select especimennumero from especimens"
    );
    let numeros = [];
    //buscamos el ultimo id ingresado
    numero[0].map((e) => {
      numeros.push(e.especimennumero);
    });

    let newId = Math.max(...numeros) + 1000;
    let string = newId.toString();
    let nuevoId = string.slice(0, string.length - 3) + "000";
    let desde = string.slice(0, string.length - 3);
    let hasta = Number(desde) + Number(cantidad) - 1;

    while (inicio <= cantidad) {
      await especimen.create({
        especimennumero: nuevoId.toString(),
        bochonnumero: "0",
        sigla: "PVSJ",
        posicionfilo: [],
        nrocampo: 0,
        fechadescubrimiento: "1111-11-11",
        preparacionfecha: "1111-11-11",
        imagen: [],
        pdf: [],
        publico: false,
        holotipo: false,
        modificado: false,
        prestado: false,
      });
      inicio++;
      nuevoId = Number(nuevoId) + 1000;
    }
    res
      .status(200)
      .send("se reservó desde " + desde + " hasta " + hasta + " con exito");
  } catch (err) {
    res.status(404).send(err);
  }
});

rutas.post("/bochon/reserva/:cantidad", async (req, res) => {
  const { cantidad } = req.params;
  try {
    let inicio = 1;
    let numero = await bochon.sequelize.query(
      "select bochonnumero from bochons"
    );
    let numeros = [];
    //buscamos el ultimo id ingresado
    numero[0].map((e) => {
      numeros.push(e.bochonnumero);
    });

    let newId = Math.max(...numeros) + 1;
    let desde = Number(newId);
    let hasta = newId + Number(cantidad) - 1;
    while (inicio <= cantidad) {
      await bochon.create({
        bochonnumero: newId.toString(),
        sigla: "PVBSJ",
        posicionfilo: [],
        nrocampo: 0,
        fechadescubrimiento: "1111-11-11",
        preparacionfecha: "1111-11-11",
        imagen: [],
        pdf: [],
        publico: false,
        holotipo: false,
        modificado: false,
        prestado: false,
      });
      inicio++;
      newId = newId + 1;
    }
    res
      .status(200)
      .send("se reservó desde " + desde + " hasta " + hasta + " con exito");
  } catch (err) {
    res.status(404).send(err);
  }
});

rutas.put("/modificarNumeros", async (req, res) => {
  let especimenes1 = await especimen.findAll();
  function SortArray(x, y) {
    if (Number(x.especimennumero) > Number(y.especimennumero)) {
      return -1;
    }
    if (Number(x.especimennumero) < Number(y.especimennumero)) {
      return 1;
    }
    return 0;
  }
  let especimenes = especimenes1.sort(SortArray);

  especimenes.map((el) => {
    let numerocorto = el.especimennumero.slice(
      0,
      el.especimennumero.length - 2
    );
    let sub = el.especimennumero.slice(el.especimennumero.length - 2);
    let nuevo = numerocorto + "0" + sub;
    especimen.update(
      {
        especimennumero: nuevo,
      },
      { where: { especimennumero: el.especimennumero } }
    );
  });

  //CAMBIO EN BOCHONES AGREGANDO UN CERO A LOS QUE TIENEN NUMERO DE ESPECIMEN Y PONIENDO UN 0 A LOS VACIOS
  let bochones = await bochon.findAll();

  bochones.map((el) => {
    if (el.especimennumero && Number(el.especimennumero) > 0) {
      nuevonumero = el.especimennumero + "0";

      bochon.update(
        {
          especimennumero: nuevonumero,
        },
        { where: { especimennumero: el.especimennumero } }
      );
    } else if (!el.especimennumero) {
      bochon.update(
        {
          especimennumero: "0",
        },
        { where: { bochonnumero: el.bochonnumero } }
      );
    }
  });

  res.send("se realizaron los cambios en bochones y especimenes");
});

rutas.get("/datalist", async (req, res) => {
  let especimenenes = await especimen.findAll();
  let bochones = await bochon.findAll();
  let result = {
    descubridor: [],
    campana: [],
    miembro: [],
    localidad: [],
    preparador: [],
  };

  especimenenes.map((e) => {
    if (!result.descubridor.includes(e.descubridor)) {
      result.descubridor.push(e.descubridor);
    }
    if (!result.campana.includes(e.campana)) {
      result.campana.push(e.campana);
    }
    if (!result.miembro.includes(e.miembro)) {
      result.miembro.push(e.miembro);
    }
    if (!result.localidad.includes(e.localidad)) {
      result.localidad.push(e.localidad);
    }
    if (!result.preparador.includes(e.preparador)) {
      result.preparador.push(e.preparador);
    }
  });

  bochones.map((e) => {
    if (!result.descubridor.includes(e.descubridor)) {
      result.descubridor.push(e.descubridor);
    }
    if (!result.campana.includes(e.campana)) {
      result.campana.push(e.campana);
    }
    if (!result.miembro.includes(e.miembro)) {
      result.miembro.push(e.miembro);
    }
    if (!result.localidad.includes(e.localidad)) {
      result.localidad.push(e.localidad);
    }
    if (!result.preparador.includes(e.preparador)) {
      result.preparador.push(e.preparador);
    }
  });

  res.send(result);
});

var PGPASSWORD = 1234;
rutas.get("/backup", async (req, res) => {
  function fechaActual() {
    const date = new Date();
    const [month, day, year] = [
      date.getMonth(),
      date.getDate(),
      date.getFullYear(),
    ];
    var fecha = day + "." + (month + 1) + "." + year;
    return fecha;
  }
  var fecha = fechaActual();
  var name = "../backup/" + fecha + "paleovertebrados.pgsql";
  exec(`pg_dump -U postgres -f ${name} -C back `, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      return;
    }

    res.download(name, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("listo");
      }
    });
  });
});

module.exports = rutas;
