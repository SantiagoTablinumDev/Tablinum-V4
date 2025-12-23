import { useState } from "react";

export function ImageWithFallback({ src, alt, className, ...props }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`} {...props}>
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}