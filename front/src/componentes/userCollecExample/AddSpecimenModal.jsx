import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "./ui/label.jsx";
import { Textarea } from "./ui/textarea.jsx";
import { ScrollArea } from "./ui/scroll-area.jsx";
import styles from "./AddSpecimenModal.module.css";

export function AddSpecimenModal({
  open,
  onOpenChange,
  onAddSpecimen
}) {
  const [formData, setFormData] = useState({
    specimenNumber: "",
    bochonNumber: "",
    genus: "",
    species: "",
    phyloPosition: "",
    period: "",
    epoch: "",
    stratum: "",
    basin: "",
    formation: "",
    member: "",
    locality: "",
    coordLat: 0,
    coordLong: 0,
    campaign: "",
    fieldNumber: "",
    discoverer: "",
    preparationDate: "",
    skeletalParts: "",
    fragmentQuantity: 0,
    comment: "",
    images: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.specimenNumber && formData.genus && formData.species) {
      onAddSpecimen(formData);
      setFormData({
        specimenNumber: "",
        bochonNumber: "",
        genus: "",
        species: "",
        phyloPosition: "",
        period: "",
        epoch: "",
        stratum: "",
        basin: "",
        formation: "",
        member: "",
        locality: "",
        coordLat: 0,
        coordLong: 0,
        campaign: "",
        fieldNumber: "",
        discoverer: "",
        preparationDate: "",
        skeletalParts: "",
        fragmentQuantity: 0,
        comment: "",
        images: []
      });
      onOpenChange(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.modalContent}>
        <DialogHeader className={styles.modalHeader}>
          <DialogTitle className={styles.modalTitle}>
            Add New Specimen
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <ScrollArea className={styles.scrollArea}>
            <div className={styles.formContent}>
              {/* Basic Information */}
              <div className={styles.basicSection}>
                <h3 className={styles.sectionTitle}>
                  <span className="text-lg">📋</span> Basic Information
                </h3>
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="specimen-number" className={styles.requiredLabel}>
                      Specimen Number <span className={styles.required}>*</span>
                    </Label>
                    <Input
                      id="specimen-number"
                      value={formData.specimenNumber || ""}
                      onChange={(e) => updateField('specimenNumber', e.target.value)}
                      placeholder="e.g., JD-2024-001"
                      className={styles.monoInput}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="bochon-number" className={styles.fieldLabel}>
                      Bochon Number
                    </Label>
                    <Input
                      id="bochon-number"
                      value={formData.bochonNumber || ""}
                      onChange={(e) => updateField('bochonNumber', e.target.value)}
                      placeholder="e.g., BCH-8842"
                      className={styles.monoInput}
                    />
                  </div>
                </div>
                
                <div className={styles.gridCols3}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="genus" className={styles.requiredLabel}>
                      Genus <span className={styles.required}>*</span>
                    </Label>
                    <Input
                      id="genus"
                      value={formData.genus || ""}
                      onChange={(e) => updateField('genus', e.target.value)}
                      placeholder="e.g., Allosaurus"
                      className={styles.italicInput}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="species" className={styles.requiredLabel}>
                      Species <span className={styles.required}>*</span>
                    </Label>
                    <Input
                      id="species"
                      value={formData.species || ""}
                      onChange={(e) => updateField('species', e.target.value)}
                      placeholder="e.g., fragilis"
                      className={styles.italicInput}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="phylo-position" className={styles.fieldLabel}>
                      Phylogenetic Position
                    </Label>
                    <Input
                      id="phylo-position"
                      value={formData.phyloPosition || ""}
                      onChange={(e) => updateField('phyloPosition', e.target.value)}
                      placeholder="e.g., Theropoda"
                      className={styles.standardInput}
                    />
                  </div>
                </div>
              </div>

              {/* Geological Context */}
              <div className={styles.geologicalSection}>
                <h3 className={styles.sectionTitle}>
                  <span className="text-lg">🗿</span> Geological Context
                </h3>
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="period" className={styles.fieldLabel}>
                      Period
                    </Label>
                    <Input
                      id="period"
                      value={formData.period || ""}
                      onChange={(e) => updateField('period', e.target.value)}
                      placeholder="e.g., Jurassic"
                      className={styles.standardInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="epoch" className={styles.fieldLabel}>
                      Epoch
                    </Label>
                    <Input
                      id="epoch"
                      value={formData.epoch || ""}
                      onChange={(e) => updateField('epoch', e.target.value)}
                      placeholder="e.g., Late Jurassic"
                      className={styles.standardInput}
                    />
                  </div>
                </div>
                
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="formation" className={styles.fieldLabel}>
                      Formation
                    </Label>
                    <Input
                      id="formation"
                      value={formData.formation || ""}
                      onChange={(e) => updateField('formation', e.target.value)}
                      placeholder="e.g., Morrison Formation"
                      className={styles.standardInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="member" className={styles.fieldLabel}>
                      Member
                    </Label>
                    <Input
                      id="member"
                      value={formData.member || ""}
                      onChange={(e) => updateField('member', e.target.value)}
                      placeholder="e.g., Brushy Basin Member"
                      className={styles.standardInput}
                    />
                  </div>
                </div>
                
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="basin" className={styles.fieldLabel}>
                      Basin
                    </Label>
                    <Input
                      id="basin"
                      value={formData.basin || ""}
                      onChange={(e) => updateField('basin', e.target.value)}
                      placeholder="e.g., Denver Basin"
                      className={styles.standardInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="stratum" className={styles.fieldLabel}>
                      Stratum
                    </Label>
                    <Input
                      id="stratum"
                      value={formData.stratum || ""}
                      onChange={(e) => updateField('stratum', e.target.value)}
                      placeholder="e.g., Morrison Formation"
                      className={styles.standardInput}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className={styles.locationSection}>
                <h3 className={styles.sectionTitle}>
                  <span className="text-lg">📍</span> Location
                </h3>
                <div className={styles.fieldGroup}>
                  <Label htmlFor="locality" className={styles.fieldLabel}>
                    Locality
                  </Label>
                  <Input
                    id="locality"
                    value={formData.locality || ""}
                    onChange={(e) => updateField('locality', e.target.value)}
                    placeholder="e.g., Dinosaur National Monument, Utah"
                    className={styles.standardInput}
                  />
                </div>
                
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="coord-lat" className={styles.fieldLabel}>
                      Latitude
                    </Label>
                    <Input
                      id="coord-lat"
                      type="number"
                      step="any"
                      value={formData.coordLat || ""}
                      onChange={(e) => updateField('coordLat', parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 40.4425"
                      className={styles.monoInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="coord-long" className={styles.fieldLabel}>
                      Longitude
                    </Label>
                    <Input
                      id="coord-long"
                      type="number"
                      step="any"
                      value={formData.coordLong || ""}
                      onChange={(e) => updateField('coordLong', parseFloat(e.target.value) || 0)}
                      placeholder="e.g., -109.3006"
                      className={styles.monoInput}
                    />
                  </div>
                </div>
              </div>

              {/* Discovery Information */}
              <div className={styles.discoverySection}>
                <h3 className={styles.sectionTitle}>
                  <span className="text-lg">👤</span> Discovery Information
                </h3>
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="discoverer" className={styles.fieldLabel}>
                      Discoverer
                    </Label>
                    <Input
                      id="discoverer"
                      value={formData.discoverer || ""}
                      onChange={(e) => updateField('discoverer', e.target.value)}
                      placeholder="e.g., Dr. Sarah Mitchell"
                      className={styles.standardInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="campaign" className={styles.fieldLabel}>
                      Campaign
                    </Label>
                    <Input
                      id="campaign"
                      value={formData.campaign || ""}
                      onChange={(e) => updateField('campaign', e.target.value)}
                      placeholder="e.g., Summer 2024 Expedition"
                      className={styles.standardInput}
                    />
                  </div>
                </div>
                
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="field-number" className={styles.fieldLabel}>
                      Field Number
                    </Label>
                    <Input
                      id="field-number"
                      value={formData.fieldNumber || ""}
                      onChange={(e) => updateField('fieldNumber', e.target.value)}
                      placeholder="e.g., FN-2024-067"
                      className={styles.monoInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="preparation-date" className={styles.fieldLabel}>
                      Preparation Date
                    </Label>
                    <Input
                      id="preparation-date"
                      type="date"
                      value={formData.preparationDate || ""}
                      onChange={(e) => updateField('preparationDate', e.target.value)}
                      className={styles.monoInput}
                    />
                  </div>
                </div>
              </div>

              {/* Specimen Details */}
              <div className={styles.specimenSection}>
                <h3 className={styles.sectionTitle}>
                  <span className="text-lg">🦴</span> Specimen Details
                </h3>
                <div className={styles.gridCols2}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="skeletal-parts" className={styles.fieldLabel}>
                      Skeletal Parts
                    </Label>
                    <Input
                      id="skeletal-parts"
                      value={formData.skeletalParts || ""}
                      onChange={(e) => updateField('skeletalParts', e.target.value)}
                      placeholder="e.g., Skull fragments, vertebrae, femur"
                      className={styles.standardInput}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="fragment-quantity" className={styles.fieldLabel}>
                      Fragment Quantity
                    </Label>
                    <Input
                      id="fragment-quantity"
                      type="number"
                      min="0"
                      value={formData.fragmentQuantity || ""}
                      onChange={(e) => updateField('fragmentQuantity', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 12"
                      className={styles.monoInput}
                    />
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <Label htmlFor="comment" className={styles.fieldLabel}>
                    Comments
                  </Label>
                  <Textarea
                    id="comment"
                    value={formData.comment || ""}
                    onChange={(e) => updateField('comment', e.target.value)}
                    placeholder="Additional notes and observations..."
                    rows={3}
                    className={styles.textareaInput}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

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
              className={styles.addButton}
            >
              Add Specimen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}