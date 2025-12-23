// Componente Modal Unificado (Bootstrap + Animaciones + Scroll Columnas Apiladas)
// NOTA: ajustado a un ancho más angosto y layout vertical

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Check } from "lucide-react";
import { url } from "../../URL.js";
import { subespecimen } from "../../store/action";
import styles from "./UnifiedModal.module.css";
import styles2 from "./CreateCollectionModal.module.css";

export function CreateCollectionModal({
  open,
  onOpenChange,
  mode = "create", // create | add
  usuarioid,
  estado,
  collectionSelect,
  onCreateCollection,
  setCollection,
  availableSpecimens = [],
  availableBochones = []
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [specimenSearch, setSpecimenSearch] = useState("");
  const [bochonSearch, setBochonSearch] = useState("");
  const [selectedSpecimens, setSelectedSpecimens] = useState([]);
  const [selectedBochones, setSelectedBochones] = useState([]);

  const norm = (v) => String(v);

  const closeAndReset = () => {
    setName("");
    setDescription("");
    setSpecimenSearch("");
    setBochonSearch("");
    setSelectedSpecimens([]);
    setSelectedBochones([]);
    onOpenChange(false);
  };

  const toggleSpecimen = (num) => {
    const id = norm(num);
    setSelectedSpecimens((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleBochon = (num) => {
    const id = norm(num);
    setSelectedBochones((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredSpecimens = availableSpecimens.filter((s) => {
    // Si estamos editando/agregando, no mostrar los que ya están
    if (collectionSelect?.especimenes) {
      const alreadyIn = collectionSelect.especimenes.map(norm).includes(norm(s.especimennumero));
      if (alreadyIn) return false;
    }

    const txt = specimenSearch.toLowerCase();
    return (
      subespecimen(s.especimennumero).toLowerCase().includes(txt) ||
      s.genero?.toLowerCase().includes(txt) ||
      s.especie?.toLowerCase().includes(txt)
    );
  }).sort((a, b) => Number(a.especimennumero) - Number(b.especimennumero));

  const filteredBochones = availableBochones.filter((b) => {
    // Si estamos editando/agregando, no mostrar los que ya están
    if (collectionSelect?.bochones) {
      const alreadyIn = collectionSelect.bochones.map(norm).includes(norm(b.bochonnumero));
      if (alreadyIn) return false;
    }

    const txt = bochonSearch.toLowerCase();
    return (
      String(b.bochonnumero).includes(txt) ||
      b.genero?.toLowerCase().includes(txt) ||
      b.especie?.toLowerCase().includes(txt)
    );
  }).sort((a, b) => Number(a.bochonnumero) - Number(b.bochonnumero));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "create") {
      if (!name.trim() || !description.trim()) return;

      const newCol = {
        usuario_id: usuarioid,
        nombre: name,
        descripcion: description,
        especimenes: selectedSpecimens,
        bochones: selectedBochones,
      };

      axios.post(`${url}user_collection/create`, newCol).then((res) => {
        if (onCreateCollection) {
          onCreateCollection(name.trim(), description.trim(), selectedSpecimens, selectedBochones);
        }
        if (setCollection) setCollection(res.data);
        closeAndReset();
      });
    }

    if (mode === "add" && collectionSelect) {

      // 1. Unir y normalizar los IDs (asegurar que sean strings y únicos)
      let mergedSpecimens = [
        ...new Set([...collectionSelect.especimenes.map(norm), ...selectedSpecimens]),
      ].map(norm);

      let mergedBochones = [
        ...new Set([...collectionSelect.bochones.map(norm), ...selectedBochones]),
      ].map(norm);

      // 2. Ordenar las listas de IDs por número de forma descendente 
      // (ya que el sort se realiza en el padre por 'numeroOrden' y tipo después)
      mergedSpecimens.sort((a, b) => Number(b) - Number(a));
      mergedBochones.sort((a, b) => Number(b) - Number(a));

      // 3. Obtener los detalles completos y ordenados

      // Obtener detalles de especímenes y ordenarlos por número
      const mergedSpecimensDetails = availableSpecimens
        .filter(s => mergedSpecimens.includes(norm(s.especimennumero)))
        .sort((a, b) => Number(b.especimennumero) - Number(a.especimennumero));

      // Obtener detalles de bochones y ordenarlos por número
      const mergedBochonesDetails = availableBochones
        .filter(b => mergedBochones.includes(norm(b.bochonnumero)))
        .sort((a, b) => Number(b.bochonnumero) - Number(a.bochonnumero));

      // 4. Crear el objeto actualizado para el PUT
      const updatedPayload = {
        ...collectionSelect,
        especimenes: mergedSpecimens,
        bochones: mergedBochones,
      };

      // 5. Llamar a la API
      axios.put(`${url}user_collection/update/${collectionSelect.id}`, updatedPayload).then((res) => {
        console.log(res.data);


        // 6. Enviar al padre el objeto *completo* y *detallado* // para que pueda recalcular combinedItems inmediatamente.
        if (setCollection) {
          console.log("setCollection");

          setCollection({
            ...res.data, // IDs actualizados de la API
            // Detalles completos (esenciales para el rendering)

          });
        }
        closeAndReset();
      });
    }
  }

  if (!open) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className={`modal-content p-2 ${styles.fadeIn}`}>

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {mode === "create" ? "Create New Collection" : "Add Items"}
            </h5>
            <button className="btn-close" onClick={closeAndReset}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {/* INFO SOLO EN CREATE */}
              {mode === "create" && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label className="form-label fw-semibold mt-3">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              )}

              {/* LISTAS HORIZONTALES */}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignContent: 'center',
                justifyContent: 'space-around',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>

                {/* SPECIMENS */}
                <div className="mb-4" style={{ flex: 1 }}>
                  <h5 className="fw-bold mb-2">Specimens ({selectedSpecimens.length})</h5>

                  <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                      className="form-control"
                      placeholder="Search specimens…"
                      value={specimenSearch}
                      onChange={(e) => setSpecimenSearch(e.target.value)}
                    />
                  </div>

                  <div className={styles.listScroll}>
                    {filteredSpecimens.map((sp) => {
                      const isSel = selectedSpecimens.includes(String(sp.especimennumero));
                      return (
                        <div
                          key={sp.especimennumero}
                          className={`${styles.cardItem} ${isSel ? styles.cardSelected : ""}`}
                          onClick={() => toggleSpecimen(sp.especimennumero)}
                        >
                          {isSel && (
                            <div className={styles.checkBadge}>
                              <Check size={14} />
                            </div>
                          )}

                          <span className={styles.codeBadge}>
                            {subespecimen(sp.especimennumero)}
                          </span>

                          <div className="mt-1">
                            <i>{sp.genero}</i> <span className="text-secondary"><i>{sp.especie}</i></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BOCHONES */}
                <div className="mb-2" style={{ flex: 1 }}>
                  <h5 className="fw-bold mb-2">Bochones ({selectedBochones.length})</h5>

                  <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                      className="form-control"
                      placeholder="Search bochones…"
                      value={bochonSearch}
                      onChange={(e) => setBochonSearch(e.target.value)}
                    />
                  </div>

                  <div className={styles.listScroll}>
                    {filteredBochones.map((b) => {
                      const isSel = selectedBochones.includes(String(b.bochonnumero));
                      return (
                        <div
                          key={b.bochonnumero}
                          className={`${styles.cardItem} ${isSel ? styles.cardSelected : ""}`}
                          onClick={() => toggleBochon(b.bochonnumero)}
                        >
                          {isSel && (
                            <div className={styles.checkBadge}>
                              <Check size={14} />
                            </div>
                          )}

                          <span className={styles.codeBadge}>{b.bochonnumero}</span>

                          <div className="mt-1">
                            <i>{b.genero}</i> <span className="text-secondary"><i>{b.especie}</i></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeAndReset}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={mode === "create" && (!name || !description)}
              >
                {mode === "create" ? "Create Collection" : "Add Selected"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

/* CSS UNIFICADO (poner en UnifiedModal.module.css)

.fadeIn {
  animation: fadeIn 0.25s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.searchBox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.listScroll {
  max-height: 240px;
  overflow-y: auto;
  border-radius: 6px;
  padding-right: 4px;
}

.cardItem {
  position: relative;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  background: #fafafa;
  transition: 0.15s;
}

.cardItem:hover {
  background: #f1f1f1;
}

.cardSelected {
  background: #dff3ff !important;
  border-color: #65b6ff;
}

.codeBadge {
  font-weight: 700;
  font-size: 14px;
}

.checkBadge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #0d6efd;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
}
*/
