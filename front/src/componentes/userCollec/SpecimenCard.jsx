import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.jsx";
import { Badge } from "./ui/badge.jsx";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel.jsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.jsx";
import { MapPin, User, Hash, Calendar, Beaker, MessageSquare } from "lucide-react";
import { url } from '../../URL.js';
import { subespecimen } from '../../store/action';
import styles from './SpecimenCard.module.css';

export function SpecimenCard({ specimen, layout = 'grid' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [t] = useTranslation("global");

  // Helper to format specimen number
  const getSpecimenNumber = () => {
    if (specimen.sigla === "PVSJ") {
      return `${specimen.sigla} ${subespecimen(specimen.especimennumero)}`;
    }
    return `${specimen.sigla} ${specimen.bochonnumero}`;
  };

  // Helper to render value or "No data"
  const renderValue = (value) => {
    if (!value || value === "") return <span className="text-muted-foreground italic" style={{ opacity: 0.7 }}>{t("NO_DATA")}</span>;
    return value;
  };

  // Render image section
  const isBase64 = (str) => typeof str === "string" && str.startsWith("data:");

  const getImageSrc = (img) => {
    if (!img) return "";
    return isBase64(img) ? img : `${url}getImg/${img}`;
  };

  const renderImageSection = () => (
    <div className={styles.imageContainer}>
      {specimen.imagen && specimen.imagen.length > 0 ? (
        specimen.imagen.length === 1 ? (
          <ImageWithFallback
            src={getImageSrc(specimen.imagen[0])}
            alt={`${specimen.genero} ${specimen.especie}`}
            className={styles.singleImage}
          />
        ) : (
          <Carousel className={styles.carousel}>
            <CarouselContent>
              {specimen.imagen.map((image, index) => (
                <CarouselItem key={index}>
                  <ImageWithFallback
                    src={getImageSrc(image)}
                    alt={`${specimen.genero} ${specimen.especie} - Image ${index + 1}`}
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
  );

  // Render header section
  const renderHeaderSection = () => (
    <>
      <CardTitle className={styles.specimenTitle}>
        <Hash className="w-4 h-4 text-primary" />
        <span className={styles.specimenNumber} onClick={() => navigate(`/home/${specimen.especimennumero}`, { state: { from: location.pathname } })}>{getSpecimenNumber()}</span>
      </CardTitle>
      <div className="space-y-1">
        <p className={styles.scientificName}>
          <span className={styles.genus}>{specimen.genero}</span>{" "}
          <span className={styles.species}>{specimen.especie}</span>
        </p>
      </div>
    </>
  );

  // Render content sections
  const renderContentSections = () => (
    <>
      {/* Specimen Details (Phylogeny, Skeleton, etc.) - Moved UP */}
      <div className={styles.specimenSection}>
        <h4 className={styles.sectionTitle}>
          <span className="text-lg">🦴</span> {t("DETALLES")}
        </h4>
        <div className="text-sm space-y-1">
          {/* Phylogenetic Position - Moved here */}
          <div className="flex flex-wrap gap-1 mb-2 justify-center">
            {Array.isArray(specimen.posicionfilo) ? (
              specimen.posicionfilo.map((filo, idx) => (
                <Badge key={idx} variant="secondary" className={styles.phyloBadge}>
                  {filo}
                </Badge>
              ))
            ) : (
              specimen.posicionfilo && (
                <Badge variant="secondary" className={styles.phyloBadge}>
                  {specimen.posicionfilo}
                </Badge>
              )
            )}
          </div>

          {/* Skeletal Parts */}
          <div>
            <span className={styles.fieldLabel}>{t("PARTES_ESQUELETALES")}:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {Array.isArray(specimen.partesesqueletales) && specimen.partesesqueletales.length > 0 ? (
                specimen.partesesqueletales.map((parte, idx) => (
                  <span key={idx} className="text-foreground ml-1 bg-white/50 px-1 rounded border border-black/10">
                    {parte}
                  </span>
                ))
              ) : (
                <span className="text-foreground ml-1">{renderValue(Array.isArray(specimen.partesesqueletales) ? "" : specimen.partesesqueletales)}</span>
              )}
            </div>
          </div>

          <p>
            <span className={styles.fieldLabel}>{t("FRAGMENTOS")}:</span>
            <span className="text-foreground ml-1 font-mono">{renderValue(specimen.fragmentos)}</span>
          </p>
          <p>
            <span className={styles.fieldLabel}>{t("PREPARACION")}:</span>
            <span className="text-foreground ml-1">{renderValue(specimen.preparacionfecha)}</span>
          </p>
        </div>
      </div>

      {/* Geological Information */}
      <div className={styles.geologicalSection}>
        <h4 className={styles.sectionTitle}>
          <span className="text-lg">🗿</span> {t("GEOLOGY")}
        </h4>
        <div className={styles.gridCols2}>
          <div className={styles.fieldContainer}>
            <span className={styles.fieldLabel}>{t("PERIODO")}:</span>
            <p className={styles.fieldValue}>{renderValue(specimen.periodo)}</p>
          </div>
          <div className={styles.fieldContainer}>
            <span className={styles.fieldLabel}>{t("EPOCA")}:</span>
            <p className={styles.fieldValue}>{renderValue(specimen.epoca)}</p>
          </div>
          <div className={styles.fieldContainer}>
            <span className={styles.fieldLabel}>{t("FORMACION")}:</span>
            <p className={styles.fieldValue}>{renderValue(specimen.formacion)}</p>
          </div>
          <div className={styles.fieldContainer}>
            <span className={styles.fieldLabel}>{t("MIEMBRO")}:</span>
            <p className={styles.fieldValue}>{renderValue(specimen.miembro)}</p>
          </div>
        </div>
      </div>

      {/* Discovery Information */}
      <div className={styles.discoverySection}>
        <h4 className={styles.sectionTitle}>
          <User className="w-4 h-4" />
          {t("HALLAZGO")}
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className={styles.fieldLabel}>{t("DESCUBRIDOR")}:</span>
            <span className="text-foreground ml-1">{renderValue(specimen.discoverer)}</span>
          </p>
          <p>
            <span className={styles.fieldLabel}>{t("CAMPAÑA")}:</span>
            <span className="text-foreground ml-1">{renderValue(specimen.campana)}</span>
          </p>
          <p>
            <span className={styles.fieldLabel}>{t("CAMPO_NUM")}:</span>
            <span className={styles.fieldNumber}>{renderValue(specimen.nrocampo)}</span>
          </p>
        </div>
      </div>

      {/* Location Information */}
      <div className={styles.locationSection}>
        <h4 className={styles.sectionTitle}>
          <MapPin className="w-4 h-4" />
          {t("UBICACION")}
        </h4>
        <div className="text-sm space-y-1">
          <p>
            <span className={styles.fieldLabel}>{t("LOCALIDAD")}:</span>
            <span className="text-foreground ml-1">{renderValue(specimen.localidad)}</span>
          </p>
          <p>
            <span className={styles.fieldLabel}>{t("CUENCA")}:</span>
            <span className="text-foreground ml-1">{renderValue(specimen.cuenca)}</span>
          </p>
          {specimen.coordlat && specimen.coordlong ? (
            <div className="mt-2">
              <a
                href={`https://www.google.com/maps?q=${specimen.coordlat},${specimen.coordlong}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-white/50 hover:bg-white/80 border border-black/10 rounded text-xs font-medium transition-colors text-blue-600"
                style={{ textDecoration: 'none' }}
              >
                <MapPin className="w-3 h-3" />
                {t("MAPS")}
              </a>
            </div>
          ) : null}
          {specimen.coordlat && (
            <p className={styles.coordinates}>
              {Number(specimen.coordlat).toFixed(6)}, {Number(specimen.coordlong).toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {specimen.comentario && (
        <div className={styles.commentSection}>
          <h4 className={styles.sectionTitle}>{t("COMENT")}</h4>
          <p className={styles.commentText}>{specimen.comentario}</p>
        </div>
      )}
    </>
  );

  // Grid layout (default)
  if (layout === 'grid') {
    const SectionWrapper = ({ children }) => (
      <div className={styles.sectionWrapper}>
        {children}
      </div>
    );
    return (
      <Card className={styles.specimenCard}>
        <CardHeader className="pb-3">
          {renderImageSection()}
          {renderHeaderSection()}
        </CardHeader>
        <CardContent className={styles.gridContent}>

          <SectionWrapper>
            {renderContentSections()}
          </SectionWrapper>

        </CardContent>
      </Card>
    );
  }

  // List layout
  return (
    <Card className={`${styles.specimenCard} ${styles.specimenCardList}`}>
      <div className={styles.listLeftSection}>
        {renderImageSection()}

        <div className={styles.listSpecimenHeader}>
          <CardTitle className={styles.specimenTitle}>
            <Hash className="w-3 h-3 text-primary" />
            <span className={styles.specimenNumber} onClick={() => navigate(`/home/${specimen.especimennumero}`, { state: { from: location.pathname } })}>{getSpecimenNumber()}</span>
          </CardTitle>

          <p className={styles.scientificName}>
            <span className={styles.genus}>{specimen.genero}</span>{" "}
            <span className={styles.species}>{specimen.especie}</span>
          </p>
        </div>
      </div>

      <div className={styles.listContent}>
        <div className={styles.listSections}>

          {/* --- COL 1: DETALLES --- */}
          <div className={`${styles.listSection} ${styles.specimenSection}`}>
            <h4 className={styles.sectionTitle}>
              <span className="text-lg">🦴</span> {t("DETALLES")}
            </h4>
            <div className="text-sm space-y-1">
              {/* Phylo */}
              <div className="flex flex-wrap gap-1 mb-1">
                {Array.isArray(specimen.posicionfilo) ? (
                  specimen.posicionfilo.map((filo, idx) => (
                    <Badge key={idx} variant="secondary" className={styles.phyloBadge} style={{ fontSize: '0.6rem', padding: '0 0.25rem' }}>
                      {filo}
                    </Badge>
                  ))
                ) : (
                  specimen.posicionfilo && (
                    <Badge variant="secondary" className={styles.phyloBadge} style={{ fontSize: '0.6rem', padding: '0 0.25rem' }}>
                      {specimen.posicionfilo}
                    </Badge>
                  )
                )}
              </div>
              {/* Skeletal Parts */}
              <div className="flex flex-wrap gap-1 mb-1">
                <span className={styles.fieldLabel} style={{ marginRight: '0.25rem' }}>{t("PARTES_ESQUELETALES")}:</span>
                {Array.isArray(specimen.partesesqueletales) && specimen.partesesqueletales.length > 0 ? (
                  specimen.partesesqueletales.map((parte, idx) => (
                    <span key={idx} className="bg-white/50 px-1 rounded border border-black/10 text-[0.65rem]">
                      {parte}
                    </span>
                  ))
                ) : (
                  <span className="text-foreground text-[0.65rem]">{renderValue(Array.isArray(specimen.partesesqueletales) ? "" : specimen.partesesqueletales)}</span>
                )}
              </div>

              <div className={styles.line}><span>{t("FRAGMENTOS")}:</span> {renderValue(specimen.fragmentos)}</div>
              <div className={styles.line}><span>{t("PREPARACION")}:</span> {renderValue(specimen.preparacionfecha)}</div>
            </div>
          </div>

          {/* --- COL 2: GEOLOGÍA --- */}
          <div className={`${styles.listSection} ${styles.geologicalSection}`}>
            <h4 className={styles.sectionTitle}>
              <span className="text-lg">🗿</span> {t("GEOLOGY")}
            </h4>
            <div className={styles.line}><span>{t("PERIODO")}:</span> {renderValue(specimen.periodo)}</div>
            <div className={styles.line}><span>{t("EPOCA")}:</span> {renderValue(specimen.epoca)}</div>
            <div className={styles.line}><span>{t("FORMACION")}:</span> {renderValue(specimen.formacion)}</div>
            <div className={styles.line}><span>{t("MIEMBRO")}:</span> {renderValue(specimen.miembro)}</div>
          </div>

          {/* --- COL 3: HALLAZGO --- */}
          <div className={`${styles.listSection} ${styles.discoverySection}`}>
            <h4 className={styles.sectionTitle}>
              <User className="w-3 h-3" /> {t("HALLAZGO")}
            </h4>
            <div className={styles.line}><span>{t("DESCUBRIDOR")}:</span> {renderValue(specimen.discoverer)}</div>
            <div className={styles.line}><span>{t("CAMPAÑA")}:</span> {renderValue(specimen.campana)}</div>
            <div className={styles.line}><span>{t("CAMPO_NUM")}:</span> {renderValue(specimen.nrocampo)}</div>
          </div>

          {/* --- COL 4: UBICACIÓN --- */}
          <div className={`${styles.listSection} ${styles.locationSection}`}>
            <h4 className={styles.sectionTitle}>
              <MapPin className="w-3 h-3" /> {t("UBICACION")}
            </h4>
            <div className={styles.line}><span>{t("LOCALIDAD")}:</span> {renderValue(specimen.localidad)}</div>
            <div className={styles.line}><span>{t("CUENCA")}:</span> {renderValue(specimen.cuenca)}</div>
            {specimen.coordlat && specimen.coordlong ? (
              <div className="mt-1">
                <a
                  href={`https://www.google.com/maps?q=${specimen.coordlat},${specimen.coordlong}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/50 hover:bg-white/80 border border-black/10 rounded text-[0.65rem] font-medium transition-colors text-blue-600"
                  style={{ textDecoration: 'none' }}
                >
                  <MapPin className="w-3 h-3" />
                  {t("MAPS")}
                </a>
              </div>
            ) : null}
            {specimen.coordlat && (
              <p className={styles.coordinates} style={{ fontSize: '0.65rem', padding: '0.125rem 0.25rem' }}>
                {Number(specimen.coordlat).toFixed(6)}, {Number(specimen.coordlong).toFixed(6)}
              </p>
            )}
          </div>

        </div>

        {specimen.comentario && (
          <div className={`${styles.listCommentSection} ${styles.commentSection}`} style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'transparent', borderTop: '1px solid rgba(0,0,0,0.1)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <h4 className={styles.sectionTitle} style={{ display: 'inline-block', margin: 0, borderBottom: 'none', whiteSpace: 'nowrap' }}>
              {t("COMENT")}:
            </h4>
            <span className={styles.commentText} style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{specimen.comentario}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
