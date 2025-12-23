import { useState } from "react";
import { Button } from "./ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { SpecimenCard } from "./SpecimenCard.jsx";
import { CreateCollectionModal } from "./CreateCollectionModal.jsx";
import { AddSpecimenModal } from "./AddSpecimenModal.jsx";
import { Plus, Archive, Beaker } from "lucide-react";
import styles from "./CollectionsView.module.css";

// Mock data for collections and specimens with multiple images
const mockCollections = [
  {
    id: "1",
    name: "Jurassic Dinosaurs",
    description: "A comprehensive collection of dinosaur fossils from the Jurassic period, featuring various species discovered across multiple excavation sites.",
    specimenCount: 3,
    specimens: [
      {
        specimenNumber: "JD-2024-001",
        bochonNumber: "BCH-8842",
        genus: "Allosaurus",
        species: "fragilis",
        phyloPosition: "Theropoda",
        period: "Jurassic",
        epoch: "Late Jurassic",
        stratum: "Morrison Formation",
        basin: "Denver Basin",
        formation: "Morrison Formation",
        member: "Brushy Basin Member",
        locality: "Dinosaur National Monument, Utah",
        coordLat: 40.4425,
        coordLong: -109.3006,
        campaign: "Summer 2024 Expedition",
        fieldNumber: "FN-2024-067",
        discoverer: "Dr. Sarah Mitchell",
        preparationDate: "2024-08-15",
        skeletalParts: "Skull fragments, vertebrae, femur",
        fragmentQuantity: 12,
        comment: "Well-preserved specimen with excellent cranial features. Shows evidence of healed fractures.",
        images: [
          "https://images.unsplash.com/photo-1729372463377-ac1adee5090c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMGZvc3NpbCUyMHNrZWxldG9ufGVufDF8fHx8MTc1NjIwNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1723988433028-e92142cc2c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBleGNhdmF0aW9uJTIwc2l0ZXxlbnwxfHx8fDE3NTYyMDQ0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1723549645175-baa293903c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxlb250b2xvZ3klMjBtdXNldW0lMjBzcGVjaW1lbnxlbnwxfHx8fDE3NTYyMDQ0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ]
      },
      {
        specimenNumber: "JD-2024-002",
        bochonNumber: "BCH-8843",
        genus: "Stegosaurus",
        species: "stenops",
        phyloPosition: "Stegosauria",
        period: "Jurassic",
        epoch: "Late Jurassic",
        stratum: "Morrison Formation",
        basin: "Denver Basin",
        formation: "Morrison Formation",
        member: "Brushy Basin Member",
        locality: "Garden Park, Colorado",
        coordLat: 38.4311,
        coordLong: -105.1778,
        campaign: "Summer 2024 Expedition",
        fieldNumber: "FN-2024-089",
        discoverer: "Dr. James Rodriguez",
        preparationDate: "2024-09-02",
        skeletalParts: "Complete dorsal plates, tail spikes",
        fragmentQuantity: 8,
        comment: "Exceptional preservation of the iconic back plates and tail spikes.",
        images: [
          "https://images.unsplash.com/photo-1593267051809-4d850d1553d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlsb2JpdGUlMjBmb3NzaWwlMjBkZXRhaWx8ZW58MXx8fHwxNzU2MjA0NDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1729372463377-ac1adee5090c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMGZvc3NpbCUyMHNrZWxldG9ufGVufDF8fHx8MTc1NjIwNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ]
      },
      {
        specimenNumber: "JD-2024-003",
        bochonNumber: "BCH-8844",
        genus: "Brachiosaurus",
        species: "altithorax",
        phyloPosition: "Sauropoda",
        period: "Jurassic",
        epoch: "Late Jurassic",
        stratum: "Morrison Formation",
        basin: "Denver Basin",
        formation: "Morrison Formation",
        member: "Salt Wash Member",
        locality: "Fruita, Colorado",
        coordLat: 39.1586,
        coordLong: -108.7289,
        campaign: "Autumn 2024 Expedition",
        fieldNumber: "FN-2024-112",
        discoverer: "Dr. Emily Chen",
        preparationDate: "2024-10-20",
        skeletalParts: "Cervical vertebrae, ribs, limb bones",
        fragmentQuantity: 15,
        comment: "Large sauropod specimen with exceptional preservation of the long neck vertebrae.",
        images: [
          "https://images.unsplash.com/photo-1723549645175-baa293903c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWxlb250b2xvZ3klMjBtdXNldW0lMjBzcGVjaW1lbnxlbnwxfHx8fDE3NTYyMDQ0MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Triassic Marine Reptiles",
    description: "Marine reptile fossils from the Triassic period, including ichthyosaurs and plesiosaurs from ancient sea deposits.",
    specimenCount: 2,
    specimens: [
      {
        specimenNumber: "TMR-2024-001",
        bochonNumber: "BCH-8901",
        genus: "Ichthyosaurus",
        species: "communis",
        phyloPosition: "Ichthyosauria",
        period: "Triassic",
        epoch: "Early Triassic",
        stratum: "Posidonia Shale",
        basin: "Germanic Basin",
        formation: "Posidonia Shale Formation",
        member: "Lower Posidonia",
        locality: "Holzmaden, Germany",
        coordLat: 48.6234,
        coordLong: 9.5689,
        campaign: "International Exchange 2024",
        fieldNumber: "FN-2024-201",
        discoverer: "Dr. Klaus Weber",
        preparationDate: "2024-07-08",
        skeletalParts: "Complete skeleton, preserved soft tissue",
        fragmentQuantity: 1,
        comment: "Remarkable preservation including skin impressions and stomach contents.",
        images: [
          "https://images.unsplash.com/photo-1593267051809-4d850d1553d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmlsb2JpdGUlMjBmb3NzaWwlMjBkZXRhaWx8ZW58MXx8fHwxNzU2MjA0NDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1723988433028-e92142cc2c21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3NzaWwlMjBleGNhdmF0aW9uJTIwc2l0ZXxlbnwxfHx8fDE3NTYyMDQ0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ]
      },
      {
        specimenNumber: "TMR-2024-002",
        bochonNumber: "BCH-8902",
        genus: "Nothosaurus",
        species: "mirabilis",
        phyloPosition: "Sauropterygia",
        period: "Triassic",
        epoch: "Middle Triassic",
        stratum: "Muschelkalk",
        basin: "Germanic Basin",
        formation: "Upper Muschelkalk",
        member: "Ceratites Member",
        locality: "Crailsheim, Germany",
        coordLat: 49.1333,
        coordLong: 10.0667,
        campaign: "International Exchange 2024",
        fieldNumber: "FN-2024-202",
        discoverer: "Dr. Anna Schultz",
        preparationDate: "2024-07-22",
        skeletalParts: "Skull, neck vertebrae, forelimbs",
        fragmentQuantity: 6,
        comment: "Well-preserved semi-aquatic reptile showing transitional marine adaptations.",
        images: [
          "https://images.unsplash.com/photo-1729372463377-ac1adee5090c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMGZvc3NpbCUyMHNrZWxldG9ufGVufDF8fHx8MTc1NjIwNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ]
      }
    ]
  }
];

export function CollectionsView() {
  const [selectedCollection, setSelectedCollection] = useState(mockCollections[0]);
  const [collections, setCollections] = useState(mockCollections);
  const [allSpecimens, setAllSpecimens] = useState(() => {
    // Flatten all specimens from all collections
    return mockCollections.flatMap(collection => collection.specimens);
  });
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false);
  const [addSpecimenOpen, setAddSpecimenOpen] = useState(false);

  const handleCreateCollection = (name, description, selectedSpecimens) => {
    const specimenObjects = allSpecimens.filter(specimen => 
      selectedSpecimens.includes(specimen.specimenNumber)
    );
    
    const newCollection = {
      id: Date.now().toString(),
      name,
      description,
      specimenCount: specimenObjects.length,
      specimens: specimenObjects
    };

    setCollections(prev => [...prev, newCollection]);
    setSelectedCollection(newCollection);
  };

  const handleAddSpecimen = (specimen) => {
    // Add default images if none provided
    const specimenWithImages = {
      ...specimen,
      images: specimen.images && specimen.images.length > 0 
        ? specimen.images 
        : ["https://images.unsplash.com/photo-1729372463377-ac1adee5090c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMGZvc3NpbCUyMHNrZWxldG9ufGVufDF8fHx8MTc1NjIwNDQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"]
    };

    setAllSpecimens(prev => [...prev, specimenWithImages]);
    
    // Add to current collection
    setSelectedCollection(prev => ({
      ...prev,
      specimens: [...prev.specimens, specimenWithImages],
      specimenCount: prev.specimenCount + 1
    }));

    // Update in collections array
    setCollections(prev => prev.map(collection => 
      collection.id === selectedCollection.id 
        ? {
            ...collection,
            specimens: [...collection.specimens, specimenWithImages],
            specimenCount: collection.specimenCount + 1
          }
        : collection
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Museum Collections
            </h1>
            <p className="text-muted-foreground">Manage and explore your fossil collections</p>
          </div>
          <Button 
            className={styles.createButton}
            onClick={() => setCreateCollectionOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Collection
          </Button>
        </div>

        {/* Collection Selector */}
        <Card className={styles.collectionSelector}>
          <CardHeader className="pb-4">
            <CardTitle className={styles.collectionTitle}>
              <Archive className="w-5 h-5 text-primary" />
              Your Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.collectionsGrid}>
              {collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant={selectedCollection.id === collection.id ? "default" : "outline"}
                  onClick={() => setSelectedCollection(collection)}
                  className={`${styles.collectionButton} ${
                    selectedCollection.id === collection.id 
                      ? styles.collectionButtonActive
                      : styles.collectionButtonInactive
                  }`}
                >
                  <span className={styles.collectionName}>{collection.name}</span>
                  <span className={styles.collectionCount}>
                    {collection.specimenCount} specimens
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Collection Details */}
        <Card className={styles.collectionDetails}>
          <CardHeader className="pb-4">
            <div className={styles.collectionDetailsHeader}>
              <div className={styles.collectionInfo}>
                <CardTitle className={styles.collectionDetailsTitle}>
                  {selectedCollection.name}
                </CardTitle>
                <p className={styles.collectionDescription}>
                  {selectedCollection.description}
                </p>
              </div>
              <Badge variant="secondary" className={styles.specimenBadge}>
                <Beaker className="w-3 h-3" />
                {selectedCollection.specimenCount} specimens
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Specimens Section */}
        <div className="space-y-4">
          <div className={styles.specimensHeader}>
            <h2 className={styles.specimensTitle}>
              Specimens
            </h2>
            <Button 
              className={styles.addSpecimenButton}
              onClick={() => setAddSpecimenOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Specimen
            </Button>
          </div>
          
          <div className={styles.specimensGrid}>
            {selectedCollection.specimens.map((specimen) => (
              <SpecimenCard
                key={specimen.specimenNumber}
                specimen={specimen}
              />
            ))}
          </div>
        </div>

        {selectedCollection.specimens.length === 0 && (
          <Card className={styles.emptyState}>
            <CardContent className="text-center">
              <Beaker className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>No specimens yet</h3>
              <p className={styles.emptyStateDescription}>
                Start building your collection by adding specimens
              </p>
              <Button 
                className={styles.addFirstSpecimenButton}
                onClick={() => setAddSpecimenOpen(true)}
              >
                Add First Specimen
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <CreateCollectionModal
          open={createCollectionOpen}
          onOpenChange={setCreateCollectionOpen}
          availableSpecimens={allSpecimens}
          onCreateCollection={handleCreateCollection}
        />

        <AddSpecimenModal
          open={addSpecimenOpen}
          onOpenChange={setAddSpecimenOpen}
          onAddSpecimen={handleAddSpecimen}
        />
      </div>
    </div>
  );
}