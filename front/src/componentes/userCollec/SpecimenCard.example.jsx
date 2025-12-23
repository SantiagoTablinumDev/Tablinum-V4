// Ejemplo de cómo usar SpecimenCard.module.css en el componente SpecimenCard
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MapPin, Calendar, User, Hash } from "lucide-react";
// Importar los estilos modulares
import styles from "./SpecimenCard.module.css";

export function SpecimenCard({ specimen }) {
  return (
    <Card className={`w-full max-w-sm hover:shadow-lg transition-shadow duration-200 ${styles['specimen-card']}`}>
      <CardHeader className="pb-3">
        <div className={`aspect-video w-full overflow-hidden rounded-md mb-3 ${styles['specimen-card-image-container']}`}>
          {specimen.images && specimen.images.length > 0 ? (
            specimen.images.length === 1 ? (
              <ImageWithFallback
                src={specimen.images[0]}
                alt={`${specimen.genus} ${specimen.species}`}
                className={`w-full h-full object-cover ${styles['specimen-card-image']}`}
              />
            ) : (
              <Carousel className={`w-full h-full ${styles['specimen-card-carousel']}`}>
                <CarouselContent>
                  {specimen.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <ImageWithFallback
                        src={image}
                        alt={`${specimen.genus} ${specimen.species} - Image ${index + 1}`}
                        className={`w-full h-full object-cover ${styles['specimen-card-image']}`}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className={`left-2 ${styles['specimen-card-carousel-nav']}`} />
                <CarouselNext className={`right-2 ${styles['specimen-card-carousel-nav']}`} />
              </Carousel>
            )
          ) : (
            <div className={styles['specimen-card-no-images']}>
              <span>No images</span>
            </div>
          )}
        </div>
        <CardTitle className="flex items-center gap-2">
          <Hash className="w-4 h-4" />
          <span className={styles['specimen-card-number']}>{specimen.specimenNumber}</span>
        </CardTitle>
        <div className="space-y-1">
          <p className={`text-lg ${styles['specimen-card-scientific-name']}`}>
            {specimen.genus} {specimen.species}
          </p>
          <Badge variant="secondary" className={styles['specimen-card-badge']}>
            {specimen.phyloPosition}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Geological Information */}
        <div className={`space-y-2 ${styles['specimen-card-section']}`}>
          <h4 className={styles['specimen-card-section-title']}>
            🗿 Geological Context
          </h4>
          <div className={`grid grid-cols-2 gap-2 text-sm ${styles['specimen-card-grid']}`}>
            <div className={styles['specimen-card-grid-item']}>
              <span className={styles['specimen-card-label']}>Period:</span>
              <p className={styles['specimen-card-value']}>{specimen.period}</p>
            </div>
            <div className={styles['specimen-card-grid-item']}>
              <span className={styles['specimen-card-label']}>Epoch:</span>
              <p className={styles['specimen-card-value']}>{specimen.epoch}</p>
            </div>
            <div className={styles['specimen-card-grid-item']}>
              <span className={styles['specimen-card-label']}>Formation:</span>
              <p className={styles['specimen-card-value']}>{specimen.formation}</p>
            </div>
            <div className={styles['specimen-card-grid-item']}>
              <span className={styles['specimen-card-label']}>Member:</span>
              <p className={styles['specimen-card-value']}>{specimen.member}</p>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className={`space-y-2 ${styles['specimen-card-section']}`}>
          <h4 className={styles['specimen-card-section-title']}>
            <MapPin className="w-4 h-4" />
            Location
          </h4>
          <div className="text-sm space-y-1">
            <p>
              <span className={styles['specimen-card-label']}>Locality:</span> 
              <span className={styles['specimen-card-value']}> {specimen.locality}</span>
            </p>
            <p>
              <span className={styles['specimen-card-label']}>Basin:</span> 
              <span className={styles['specimen-card-value']}> {specimen.basin}</span>
            </p>
            <p className={styles['specimen-card-coordinates']}>
              {specimen.coordLat.toFixed(6)}, {specimen.coordLong.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Discovery Information */}
        <div className={`space-y-2 ${styles['specimen-card-section']}`}>
          <h4 className={styles['specimen-card-section-title']}>
            <User className="w-4 h-4" />
            Discovery
          </h4>
          <div className="text-sm space-y-1">
            <p>
              <span className={styles['specimen-card-label']}>Discoverer:</span> 
              <span className={styles['specimen-card-value']}> {specimen.discoverer}</span>
            </p>
            <p>
              <span className={styles['specimen-card-label']}>Campaign:</span> 
              <span className={styles['specimen-card-value']}> {specimen.campaign}</span>
            </p>
            <p>
              <span className={styles['specimen-card-label']}>Field #:</span> 
              <span className={styles['specimen-card-value']}> {specimen.fieldNumber}</span>
            </p>
          </div>
        </div>

        {/* Specimen Details */}
        <div className={`space-y-2 ${styles['specimen-card-section']}`}>
          <h4 className={styles['specimen-card-section-title']}>Specimen Details</h4>
          <div className="text-sm space-y-1">
            <p>
              <span className={styles['specimen-card-label']}>Bochon #:</span> 
              <span className={styles['specimen-card-value']}> {specimen.bochonNumber}</span>
            </p>
            <p>
              <span className={styles['specimen-card-label']}>Skeletal Parts:</span> 
              <span className={styles['specimen-card-value']}> {specimen.skeletalParts}</span>
            </p>
            <p>
              <span className={styles['specimen-card-label']}>Fragments:</span> 
              <span className={styles['specimen-card-value']}> {specimen.fragmentQuantity}</span>
            </p>
            <p>
              <span className={styles['specimen-card-label']}>Prepared:</span> 
              <span className={styles['specimen-card-value']}> {specimen.preparationDate}</span>
            </p>
          </div>
        </div>

        {specimen.comment && (
          <div className={styles['specimen-card-comment']}>
            <h4 className={`${styles['specimen-card-section-title']} mb-2`}>Comments</h4>
            <p>{specimen.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}