import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../URL.js";
import { Search, Check } from "lucide-react";
import styles from "./CreateCollectionModal.module.css"; // usamos los mismos estilos del otro modal

export function AddSpecimenModal({
  open,
  onOpenChange,
  availableSpecimens,
  availableBochones,
  mode = "add",
  collectionSelect,
  setCollection
}) {
  const [selectedSpecimens, setSelectedSpecimens] = useState([]);
  const [selectedBochones, setSelectedBochones] = useState([]);
  const [specimenSearch, setSpecimenSearch] = useState("");
  const [bochonSearch, setBochonSearch] = useState("");

  const norm = (v) => String(v);

  useEffect(() => {
    if (!open) {
      setSelectedSpecimens([]);
      setSelectedBochones([]);
      setSpecimenSearch("");
      setBochonSearch("");
    }
  }, [open]);

  const closeAndReset = () => {
    setSelectedSpecimens([]);
    setSelectedBochones([]);
    setSpecimenSearch("");
    setBochonSearch("");
    onOpenChange(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "add" && collectionSelect) {
      const mergedSpecimens = [
        ...new Set([...collectionSelect.especimenes, ...selectedSpecimens])
      ].sort((a, b) => Number(b) - Number(a));

      const mergedBochones = [
        ...new Set([...collectionSelect.bochones, ...selectedBochones])
      ].sort((a, b) => Number(b) - Number(a));

      const updatedCollection = {
        ...collectionSelect,
        especimenes: mergedSpecimens,
        bochones: mergedBochones,
      };

      axios.put(`${url}user_collection/update/${collectionSelect.id}`, updatedCollection)
        .then(res => {
          setCollection(res.data);
          closeAndReset();
        });
    }
  };

  // ---------- FILTERS ----------
  const filteredSpecimens = availableSpecimens?.filter((s) =>
    s.especimennumero.toString().includes(specimenSearch.toLowerCase()) ||
    s.genero?.toLowerCase().includes(specimenSearch.toLowerCase()) ||
    s.especie?.toLowerCase().includes(specimenSearch.toLowerCase())
  );

  const filteredBochones = availableBochones?.filter((b) =>
    b.bochonnumero.toString().includes(bochonSearch.toLowerCase()) ||
    b.genero?.toLowerCase().includes(bochonSearch.toLowerCase()) ||
    b.especie?.toLowerCase().includes(bochonSearch.toLowerCase())
  );

  // ---------- TOGGLES ----------
  const toggleSpecimen = (num) => {
    const id = norm(num);
    setSelectedSpecimens(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleBochon = (num) => {
    const id = norm(num);
    setSelectedBochones(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (!open) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content p-2">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Add Specimens / Bochones</h5>
            <button className="btn-close" onClick={closeAndReset}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="body-modal-add">

              {/* GRID */}
              <div className="row g-4">

                {/* SPECIMENS */}
                <div className="col-lg-6">
                  <h5 className="fw-bold">
                    Specimens ({selectedSpecimens.length})
                  </h5>

                  {/* SEARCH */}
                  <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                      className="form-control"
                      placeholder="Search specimens…"
                      value={specimenSearch}
                      onChange={(e) => setSpecimenSearch(e.target.value)}
                    />
                  </div>

                  {/* LIST */}
                  <div className={styles.grid}>
                    {filteredSpecimens?.map((sp) => {
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

                          <span className={styles.codeBadge}>{sp.especimennumero}</span>

                          <div className="mt-1">
                            <i>{sp.genero}</i>{" "}
                            <span className="text-secondary">
                              <i>{sp.especie}</i>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* BOCHONES */}
                <div className="col-lg-6">
                  <h5 className="fw-bold">
                    Bochones ({selectedBochones.length})
                  </h5>

                  <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                      className="form-control"
                      placeholder="Search bochones…"
                      value={bochonSearch}
                      onChange={(e) => setBochonSearch(e.target.value)}
                    />
                  </div>

                  <div className={styles.grid}>
                    {filteredBochones?.map((b) => {
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
                            <i>{b.genero}</i>{" "}
                            <span className="text-secondary">
                              <i>{b.especie}</i>
                            </span>
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

              <button type="submit" className="btn btn-primary">
                Add Selected Items
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
