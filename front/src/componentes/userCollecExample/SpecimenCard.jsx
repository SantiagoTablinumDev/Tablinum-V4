import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel.jsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.jsx";
import { MapPin, Calendar, User, Hash } from "lucide-react";
import styles from "./SpecimenCard.module.css";

export function SpecimenCard({ specimen }) {
  return (
    <Card className={styles.specimenCard}>
      <CardHeader className="pb-3">
        <div className={styles.imageContainer}>
          {specimen.images && specimen.images.length > 0 ? (
            specimen.images.length === 1 ? (
              <ImageWithFallback
                src={specimen.images[0]}
                alt={`${specimen.genus} ${specimen.species}`}
                className={styles.singleImage}
              />
            ) : (
              <Carousel className={styles.carousel}>
                <CarouselContent>
                  {specimen.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <ImageWithFallback
                        src={image}
                        alt={`${specimen.genus} ${specimen.species} - Image ${index + 1}`}
                        className={styles.carouselImage}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className={styles.carouselPrev} />
                <CarouselNext className={styles.carouselNext} />
              </Carousel>
            )
          ) : (
            <div className={styles.noImagePlaceholder}>
              <span className="text-muted-foreground text-sm">No images</span>
            </div>
          )}
        </div>
        <CardTitle className={styles.specimenTitle}>
          <Hash className="w-4 h-4 text-primary" />
          <span className={styles.specimenNumber}>{specimen.specimenNumber}</span>
        </CardTitle>
        <div className="space-y-1">
          <p className={styles.scientificName}>
            <span className={styles.genus}>{specimen.genus}</span>{" "}
            <span className={styles.species}>{specimen.species}</span>
          </p>
          <Badge variant="secondary" className={styles.phyloBadge}>
            {specimen.phyloPosition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Geological Information */}
        <div className={styles.geologicalSection}>
          <h4 className={styles.sectionTitle}>
            <span className="text-lg">🗿</span> Geological Context
          </h4>
          <div className={styles.gridCols2}>
            <div className={styles.fieldContainer}>
              <span className={styles.fieldLabel}>Period:</span>
              <p className={styles.fieldValue}>{specimen.period}</p>
            </div>
            <div className={styles.fieldContainer}>
              <span className={styles.fieldLabel}>Epoch:</span>
              <p className={styles.fieldValue}>{specimen.epoch}</p>
            </div>
            <div className={styles.fieldContainer}>
              <span className={styles.fieldLabel}>Formation:</span>
              <p className={styles.fieldValue}>{specimen.formation}</p>
            </div>
            <div className={styles.fieldContainer}>
              <span className={styles.fieldLabel}>Member:</span>
              <p className={styles.fieldValue}>{specimen.member}</p>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className={styles.locationSection}>
          <h4 className={styles.sectionTitle}>
            <MapPin className="w-4 h-4" />
            Location
          </h4>
          <div className="text-sm space-y-1">
            <p>
              <span className={styles.fieldLabel}>Locality:</span> 
              <span className="text-foreground ml-1">{specimen.locality}</span>
            </p>
            <p>
              <span className={styles.fieldLabel}>Basin:</span> 
              <span className="text-foreground ml-1">{specimen.basin}</span>
            </p>
            <p className={styles.coordinates}>
              {specimen.coordLat.toFixed(6)}, {specimen.coordLong.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Discovery Information */}
        <div className={styles.discoverySection}>
          <h4 className={styles.sectionTitle}>
            <User className="w-4 h-4" />
            Discovery
          </h4>
          <div className="text-sm space-y-1">
            <p>
              <span className={styles.fieldLabel}>Discoverer:</span> 
              <span className="text-foreground ml-1">{specimen.discoverer}</span>
            </p>
            <p>
              <span className={styles.fieldLabel}>Campaign:</span> 
              <span className="text-foreground ml-1">{specimen.campaign}</span>
            </p>
            <p>
              <span className={styles.fieldLabel}>Field #:</span> 
              <span className={styles.fieldNumber}>{specimen.fieldNumber}</span>
            </p>
          </div>
        </div>

        {/* Specimen Details */}
        <div className={styles.specimenSection}>
          <h4 className={styles.sectionTitle}>Specimen Details</h4>
          <div className="text-sm space-y-1">
            <p>
              <span className={styles.fieldLabel}>Bochon #:</span> 
              <span className={styles.fieldNumber}>{specimen.bochonNumber}</span>
            </p>
            <p>
              <span className={styles.fieldLabel}>Skeletal Parts:</span> 
              <span className="text-foreground ml-1">{specimen.skeletalParts}</span>
            </p>
            <p>
              <span className={styles.fieldLabel}>Fragments:</span> 
              <span className="text-foreground ml-1 font-mono">{specimen.fragmentQuantity}</span>
            </p>
            <p>
              <span className={styles.fieldLabel}>Prepared:</span> 
              <span className={styles.dateField}>{specimen.preparationDate}</span>
            </p>
          </div>
        </div>

        {specimen.comment && (
          <div className={styles.commentSection}>
            <h4 className={styles.sectionTitle}>Comments</h4>
            <p className={styles.commentText}>{specimen.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}