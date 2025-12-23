import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Textarea } from "./ui/textarea.jsx";
import { Checkbox } from "./ui/checkbox.jsx";
import { ScrollArea } from "./ui/scroll-area.jsx";
import styles from "./CreateCollectionModal.module.css";

export function CreateCollectionModal({
  open,
  onOpenChange,
  availableSpecimens,
  onCreateCollection
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSpecimens, setSelectedSpecimens] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onCreateCollection(name.trim(), description.trim(), selectedSpecimens);
      setName("");
      setDescription("");
      setSelectedSpecimens([]);
      onOpenChange(false);
    }
  };

  const handleSpecimenToggle = (specimenNumber) => {
    setSelectedSpecimens(prev => 
      prev.includes(specimenNumber) 
        ? prev.filter(id => id !== specimenNumber)
        : [...prev, specimenNumber]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>
            Create New Collection
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formContent}>
            <div className={styles.nameSection}>
              <Label htmlFor="collection-name" className={styles.nameLabel}>
                Collection Name
              </Label>
              <Input
                id="collection-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                className={styles.nameInput}
                required
              />
            </div>
            
            <div className={styles.descriptionSection}>
              <Label htmlFor="collection-description" className={styles.descriptionLabel}>
                Description
              </Label>
              <Textarea
                id="collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter collection description"
                rows={3}
                className={styles.descriptionInput}
                required
              />
            </div>

            <div className={styles.specimensSection}>
              <Label className={styles.specimensLabel}>Select Specimens (Optional)</Label>
              <ScrollArea className={styles.specimensScrollArea}>
                <div className={styles.specimensList}>
                  {availableSpecimens.map((specimen) => (
                    <div 
                      key={specimen.specimenNumber} 
                      className={styles.specimenItem}
                    >
                      <Checkbox
                        id={specimen.specimenNumber}
                        checked={selectedSpecimens.includes(specimen.specimenNumber)}
                        onCheckedChange={() => handleSpecimenToggle(specimen.specimenNumber)}
                        className={styles.specimenCheckbox}
                      />
                      <div className={styles.specimenInfo}>
                        <Label 
                          htmlFor={specimen.specimenNumber}
                          className={styles.specimenLabel}
                        >
                          <div className={styles.specimenNumber}>
                            {specimen.specimenNumber}
                          </div>
                          <div className={styles.specimenName}>
                            <span className={styles.genus}>{specimen.genus}</span>{" "}
                            <span className={styles.species}>{specimen.species}</span>
                          </div>
                          <div className={styles.specimenLocation}>
                            {specimen.locality} • {specimen.period}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <p className={styles.selectedCount}>
                <span className={styles.selectedNumber}>{selectedSpecimens.length}</span> specimen(s) selected
              </p>
            </div>
          </div>

          <DialogFooter className={styles.modalFooter}>
            <Button 
              type="button" 
              variant="outline" 
              className={styles.cancelButton}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className={styles.createButton}
            >
              Create Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}