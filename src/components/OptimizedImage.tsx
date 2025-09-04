import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  placeholder?: string;
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image Component with lazy loading, WebP support, and performance optimizations
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  placeholder,
  sizes,
  quality = 85,
  format = 'auto',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');

  // Generate optimized image URLs
  const generateOptimizedSrc = (originalSrc: string, width?: number, quality?: number, format?: string) => {
    // In a real implementation, this would integrate with an image optimization service
    // like Cloudinary, ImageKit, or a custom image optimization API
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (quality) params.append('q', quality.toString());
    if (format && format !== 'auto') params.append('f', format);
    
    // For now, return the original src (in production, you'd use an image optimization service)
    return originalSrc;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = (originalSrc: string) => {
    if (!width) return undefined;
    
    const breakpoints = [0.5, 1, 1.5, 2]; // Different pixel densities
    return breakpoints
      .map(multiplier => {
        const scaledWidth = Math.round(width * multiplier);
        const optimizedSrc = generateOptimizedSrc(originalSrc, scaledWidth, quality, format);
        return `${optimizedSrc} ${multiplier}x`;
      })
      .join(', ');
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before the image comes into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Set current src when in view
  useEffect(() => {
    if (isInView) {
      setCurrentSrc(generateOptimizedSrc(src, width, quality, format));
    }
  }, [isInView, src, width, quality, format]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  // WebP support detection
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Generate picture element sources for modern formats
  const generatePictureSources = () => {
    if (format === 'auto') {
      const sources = [];
      
      // AVIF support (most modern browsers)
      if ('createImageBitmap' in window) {
        sources.push(
          <source
            key="avif"
            srcSet={generateOptimizedSrc(src, width, quality, 'avif')}
            type="image/avif"
            sizes={sizes}
          />
        );
      }
      
      // WebP support
      if (supportsWebP()) {
        sources.push(
          <source
            key="webp"
            srcSet={generateOptimizedSrc(src, width, quality, 'webp')}
            type="image/webp"
            sizes={sizes}
          />
        );
      }
      
      return sources;
    }
    
    return [];
  };

  // Placeholder styles
  const placeholderStyles: React.CSSProperties = {
    backgroundColor: '#f0f0f0',
    backgroundImage: placeholder ? `url(${placeholder})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: isLoaded ? 'none' : 'blur(5px)',
    transition: 'filter 0.3s ease',
  };

  // Image styles
  const imageStyles: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease',
    ...placeholderStyles,
  };

  // Error fallback
  if (isError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '200px',
        }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  // Use picture element for modern format support
  if (format === 'auto') {
    return (
      <picture className={className}>
        {generatePictureSources()}
        <img
          ref={imgRef}
          src={currentSrc || placeholder}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          style={imageStyles}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-auto"
        />
      </picture>
    );
  }

  // Standard img element
  return (
    <img
      ref={imgRef}
      src={currentSrc || placeholder}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      srcSet={generateSrcSet(src)}
      sizes={sizes}
      style={imageStyles}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
    />
  );
};

// Higher-order component for image optimization
export const withImageOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.forwardRef<any, P>((props, ref) => {
    return <Component {...props} ref={ref} />;
  });
};

// Hook for image preloading
export const useImagePreload = (src: string, priority: boolean = false) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!priority) return;

    const img = new Image();
    
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsError(true);
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority]);

  return { isLoaded, isError };
};

// Utility function to generate responsive image sizes
export const generateImageSizes = (breakpoints: { [key: string]: number }) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => {
      if (breakpoint === 'default') {
        return `${width}px`;
      }
      return `(max-width: ${breakpoint}) ${width}px`;
    })
    .join(', ');
};

// Example usage:
// const imageSizes = generateImageSizes({
//   '640px': 320,
//   '768px': 400,
//   '1024px': 500,
//   'default': 600
// });

export default OptimizedImage;
