import React, { memo } from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<NextImageProps, 'placeholder'> {
  fallback?: string;
  lazyBoundary?: string;
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  width, 
  height, 
  fallback = '/placeholder.svg',
  lazyBoundary = '200px',
  ...props
}) => {
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(Number(width) || 700, Number(height) || 475))}`;
  
  return (
    <NextImage
      src={src || fallback}
      alt={alt || ''}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={blurDataURL}
      loading="lazy"
      lazyBoundary={lazyBoundary}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallback) {
          target.src = fallback;
        }
      }}
      {...props}
    />
  );
};

export default memo(OptimizedImage); 