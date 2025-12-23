import React, { useEffect, useState } from "react";
import { Button } from "./ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { SpecimenCard } from "./SpecimenCard.jsx";
import { CreateCollectionModal } from "./CreateCollectionModal.jsx";
import { AddSpecimenModal } from "./AddSpecimenModal.jsx";
import { Plus, Archive, Beaker, Grid3X3, List } from "lucide-react";
import { getDatos2, subespecimen, getBochones } from "../../store/action";
import { useSelector, useDispatch } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./CollectionsView.module.css";
import Menu from "../NAVBAR/menu.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { url } from '../../URL.js';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { resolvePath } from "react-router-dom";



export function CollectionsView() {
  const dispatch = useDispatch();
  const [selectedCollection, setSelectedCollection] = useState({
    especimenes_detalle: [],
    bochones_detalle: [],
    especimenes: [],
    bochones: []
  });
  const [t, i18n] = useTranslation("global");
  const [collections, setCollections] = useState(null);
  const { isAuthenticated, user } = useAuth0();
  const [users, setUsers] = useState(null);
  const [percollections, setPercollections] = useState(null);

  const especimenes = useSelector((state) => state.especimenes);
  const bochones = useSelector((state) => state.bochones?.data);
  const espec = especimenes;
  const bochon = bochones;

  const [createCollectionOpen, setCreateCollectionOpen] = useState(false);
  const [addSpecimenOpen, setAddSpecimenOpen] = useState(false);
  const [viewLayout, setViewLayout] = useState('grid');
  const [allSpecimens, setAllSpecimens] = useState([]);
  const [combinedItems, setCombinedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('bochones'); // 'bochones' o 'especimenes'
  let [totalItems, setTotalItems] = useState(0)

  // ----- Load initial data -----
  useEffect(() => {
    dispatch(getDatos2());
    dispatch(getBochones());

    // Guardamos si user aún no llegó
    if (!user?.sub) return;

    axios.get(`${url}usuariosRoute/usuario?id=` + user.sub)
      .then(resp => {
        setUsers(resp.data);
        if (resp.data?.id) {
          axios.get(`${url}user_collection/getByUser/` + resp.data.id)
            .then(colle => {
              const cols = colle.data || [];
              setCollections(cols);
              setPercollections(cols);
              setSelectedCollection(cols[0] || {
                especimenes_detalle: [],
                bochones_detalle: [],
                especimenes: [],
                bochones: []
              });
              setAllSpecimens(cols.flatMap(collection => collection.especimenes_detalle || []));

            })
            .catch(err => {
              console.error("Error fetching user collections:", err);
              setCollections([]);
              setPercollections([]);
            });
        }
      })
      .catch(err => {
        console.error("Error fetching user:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.sub]);

  // ----- Build combined list when selectedCollection or sortOrder change -----
  useEffect(() => {
    if (!selectedCollection) {
      setCombinedItems([]);
      return;
    }

    const especimenesArr = selectedCollection?.especimenes_detalle || [];
    const bochonesArr = selectedCollection?.bochones_detalle || [];

    let especMarked = especimenesArr.map(e => ({
      ...e,
      tipo: 'especimen',
      numeroOrden: Number(e.especimennumero || 0),
      sigla: (e.sigla || '').toUpperCase()
    }));
    let bochonMarked = bochonesArr.map(b => ({
      ...b,
      tipo: 'bochon',
      numeroOrden: Number(b.bochonnumero || 0),
      sigla: (b.sigla || '').toUpperCase()
    }));

    const preferredSiglaFirst = sortOrder === 'bochones' ? 'PVBSJ' : 'PVSJ';
    const preferredSiglaSecond = sortOrder === 'bochones' ? 'PVSJ' : 'PVBSJ';

    let all = [...especMarked, ...bochonMarked];

    all.sort((a, b) => {
      const sigA = (a.sigla || '').toUpperCase();
      const sigB = (b.sigla || '').toUpperCase();

      if (sigA === sigB) {
        return Number(a.numeroOrden) - Number(b.numeroOrden);
      }

      const priority = s => (s === preferredSiglaFirst ? 2 : (s === preferredSiglaSecond ? 1 : 0));
      const aPref = priority(sigA);
      const bPref = priority(sigB);
      if (aPref !== bPref) {
        return bPref - aPref;
      }

      if (a.tipo !== b.tipo) {
        if (sortOrder === 'bochones') return a.tipo === 'bochon' ? -1 : 1;
        else return a.tipo === 'especimen' ? -1 : 1;
      }

      return Number(a.numeroOrden) - Number(b.numeroOrden);
    });

    const combined = all.map(x => ({ ...x, tipo: x.tipo || (x.bochonnumero ? 'bochon' : 'especimen') }));
    setCombinedItems(combined);
  }, [selectedCollection, sortOrder]);

  // ----- Handlers -----
  const handleCreateCollection = (name, description, selectedSpecimens, selectedBochones) => {
    const specimenObjects = (allSpecimens || []).filter(specimen =>
      selectedSpecimens.includes(specimen.especimennumero)
    );

    const newCollection = {
      id: Date.now().toString(),
      nombre: name,
      descripcion: description,
      especimenes: selectedSpecimens,
      bochones: selectedBochones,
      especimenes_detalle: specimenObjects,
      bochones_detalle: []
    };

    setCollections(prev => prev ? [...prev, newCollection] : [newCollection]);
    setTimeout(() => { window.location.reload() }, "1000")
  };

  const handleAddSpecimen = (specimen) => {
    const specimenWithImages = {
      ...specimen,
      images: specimen.images && specimen.images.length > 0
        ? specimen.images
        : ["https://images.unsplash.com/photo-1729372463377-ac1adee5090c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMGZvc3NpbCUyMHNrZWxldG9ufGVufDF8fHx8MTc1NjIwNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"]
    };


    setSelectedCollection(prev => {
      const prevSpecimens = prev?.especimenes_detalle || [];
      return {
        ...prev,
        especimenes_detalle: [...prevSpecimens, specimenWithImages],
        especimenes: [...(prev?.especimenes || []), specimenWithImages.especimennumero],
      };
    });

    setCollections(prev => prev ? prev.map(collection =>
      collection.id === selectedCollection?.id
        ? {
          ...collection,
          especimenes_detalle: [...(collection.especimenes_detalle || []), specimenWithImages],
          especimenes: [...(collection.especimenes || []), specimenWithImages.especimennumero]
        }
        : collection
    ) : prev);
  };
  console.log(selectedCollection);
  // ----- Render -----
  return (
    <div>
      <Menu activo={5} />
      <div className={styles.container}>
        <div className={styles.maxWidth}>



          {/* Main Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Mis colecciones</h1>
            <button
              className={styles.createButton}
              onClick={() => setCreateCollectionOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Collection
            </button>
          </div>

          {/* no collections / collections list */}
          {percollections?.length === 0 || percollections === null ? (
            <h1 className={styles.title}></h1>
          ) : (
            <div>

              {/* Collection Selector */}


              <Card className={styles.collectionSelector}>
                <CardHeader className="pb-4" style={{ display: 'none' }}>
                  <CardTitle className={styles.collectionTitle}>
                    <Archive className="w-5 h-5 text-primary" />
                    Your Collections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={styles.collectionsGrid}>
                    {(collections?.length > 0) ? (
                      collections.map((collection) => (
                        <Button
                          key={collection.id}
                          variant={selectedCollection?.id === collection.id ? "default" : "outline"}
                          onClick={() => setSelectedCollection(collection)}
                          className={`${styles.collectionButton} ${selectedCollection?.id === collection.id
                            ? styles.collectionButtonActive
                            : styles.collectionButtonInactive
                            }`}
                        >
                          <span className={styles.collectionName}>{collection.nombre}</span>
                          <span className={styles.collectionCount}>
                            {Array.isArray(collection.especimenes) ? collection.especimenes.length + collection.bochones.length : (collection.especimenes?.length ?? 0)} specimens
                          </span>
                        </Button>
                      ))
                    ) : (
                      (
                        <Button
                          key={collections[0].id}
                          variant={selectedCollection?.id === collections[0].id ? "default" : "outline"}
                          onClick={() => setSelectedCollection(collections[0])}
                          className={`${styles.collectionButton} ${selectedCollection?.id === collections[0].id
                            ? styles.collectionButtonActive
                            : styles.collectionButtonInactive
                            }`}
                        >
                          <span className={styles.collectionName}>{collections[0].nombre}</span>
                          <span className={styles.collectionCount}>
                            {(
                              (collections[0].especimenes?.length ?? 0) +
                              (collections[0].bochones?.length ?? 0)
                            )} specimens
                          </span>
                        </Button>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Collection Details */}
              <Card className={styles.collectionDetails}>
                <CardHeader className="pb-4">
                  <div className={styles.collectionDetailsHeader}>
                    <div className={styles.collectionInfo}>
                      <CardTitle className={styles.collectionDetailsTitle}>
                        {selectedCollection?.nombre}
                      </CardTitle>
                      <p className={styles.collectionDescription}>
                        {selectedCollection?.descripcion}
                      </p>
                    </div>

                    <Badge variant="secondary" className={styles.specimenBadge}>
                      <Beaker className="w-3 h-3" />
                      {Array.isArray(selectedCollection?.especimenes) ? selectedCollection.especimenes.length + selectedCollection.bochones.length : (selectedCollection?.especimenes?.length ?? 0)} especimenes
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Specimens Section */}
              <div className="space-y-4">
                <div className={styles.specimensHeader}>
                  <h2 className={styles.specimensTitle}>Specimens</h2>

                  <div className={styles.specimensControls}>
                    <div className={styles.viewToggle}>
                      <button
                        onClick={() => setViewLayout('grid')}
                        className={`${styles.viewButton} ${viewLayout === 'grid' ? styles.viewButtonActive : ''}`}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setViewLayout('list')}
                        className={`${styles.viewButton} ${viewLayout === 'list' ? styles.viewButtonActive : ''}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                    {selectedCollection?.bochones?.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'bochones' ? 'especimenes' : 'bochones')}
                        className={styles.sortButton}
                        title={sortOrder === 'bochones' ? 'Bochones primero' : 'Especimenes primero'}
                      >
                        <span className={styles.sortLabel}>
                          {sortOrder === 'bochones' ? 'PVBSJ primero' : 'PVSJ primero'}
                        </span>
                      </Button>
                    )}

                    <Button
                      className={styles.addSpecimenButton}
                      onClick={() => setAddSpecimenOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Specimen
                    </Button>
                  </div>
                </div>
              </div>

              {/* Items grid / list */}
              <div className={viewLayout === 'list' ? styles.specimensGridList : styles.specimensGrid}>
                {combinedItems.map((item) => (
                  <div
                    key={item.especimennumero || item.bochonnumero || `${item.tipo}-${item.numeroOrden}`}
                  >
                    <SpecimenCard specimen={item} layout={viewLayout} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(combinedItems?.length ?? 0) === 0 && (
            <Card className={styles.emptyState}>
              <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                <Beaker className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>
                  {t("NO_SPECIMENS_TITLE")}
                </h3>
                <p className={styles.emptyStateDescription}>
                  {selectedCollection
                    ? t("NO_SPECIMENS_DESCRIPTION")
                    : t("NO_COLLECTION_DESCRIPTION")}
                </p>

                {!selectedCollection && (
                  <Button
                    className={styles.createButton}
                    onClick={() => setCreateCollectionOpen(true)}
                  >
                    {t("CREATE_COLLECTION_BUTTON")}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Modals */}
          {/* Modal Unificado */}
          <CreateCollectionModal
            open={createCollectionOpen || addSpecimenOpen}
            onOpenChange={(state) => {
              // Si se cierra, cerramos ambos
              if (!state) {
                setCreateCollectionOpen(false);
                setAddSpecimenOpen(false);
              }
            }}
            mode={createCollectionOpen ? "create" : "add"} // Detecta qué modal era
            availableSpecimens={espec}
            availableBochones={bochon}
            usuarioid={users?.id}
            collectionSelect={selectedCollection}
            setCollection={setSelectedCollection}
            onCreateCollection={handleCreateCollection}
            onAddSpecimen={handleAddSpecimen}
          />

          {/*  <AddSpecimenModal
            open={addSpecimenOpen}
            onOpenChange={setAddSpecimenOpen}
            availableSpecimens={espec}
            availableBochones={bochon}
            usuarioid={users?.id}
            onAddSpecimen={handleAddSpecimen}
            collectionSelect={selectedCollection}
            setCollection={setSelectedCollection}
            mode="add"
          />
 */}
        </div>
      </div>
    </div>
  );
}
