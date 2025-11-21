import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';

// Collect all tip images that need preloading
const getTipImages = () => {
  const images: any[] = [];

  // Add your tip images here as you add them
  // For local images using require()
  try {
    images.push(require('../assets/tips/organization/create_brag_file.png'));
  } catch (e) {
    console.log('Image not found:', e);
  }

  // Add more images as you create them:
  // images.push(require('../assets/tips/fitness/morning-walk.jpg'));
  // images.push(require('../assets/tips/nutrition/water-bottle.jpg'));

  return images;
};

// Preload all images during app initialization
export const preloadImages = async () => {
  const startTime = Date.now();
  console.log('Starting image preload...');

  try {
    const imageAssets = getTipImages();

    // For local images (using require)
    const imagePromises = imageAssets.map(image => {
      if (typeof image === 'number') {
        // It's a require() statement - use expo-asset
        return Asset.loadAsync(image);
      } else if (typeof image === 'string') {
        // It's a URL string - use Image.prefetch
        return Image.prefetch(image);
      }
      return Promise.resolve();
    });

    await Promise.all(imagePromises);

    const duration = Date.now() - startTime;
    console.log(`✅ Preloaded ${imageAssets.length} images in ${duration}ms`);

    return true;
  } catch (error) {
    console.error('Error preloading images:', error);
    // Don't crash the app if images fail to preload
    return false;
  }
};

// Alternative: Lazy load with caching for dynamic images
export const cacheImage = async (uri: string) => {
  try {
    await Image.prefetch(uri);
    return true;
  } catch (error) {
    console.error('Error caching image:', uri, error);
    return false;
  }
};

// Get cached image or return null
const imageCache = new Map<string, boolean>();

export const getCachedImage = (source: any) => {
  const key = typeof source === 'string' ? source : JSON.stringify(source);
  return imageCache.get(key);
};

export const setCachedImage = (source: any) => {
  const key = typeof source === 'string' ? source : JSON.stringify(source);
  imageCache.set(key, true);
};