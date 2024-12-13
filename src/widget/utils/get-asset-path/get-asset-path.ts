import type { Config } from '@/types';
import { getAppVersion } from '../get-app-version';

type AssetType = 'script' | 'image';
interface Directory {
  local: string;
  cdn: string;
}

const directoryMap = (config: Config): Record<AssetType, Directory> => ({
  script: {
    local: 'scripts',
    cdn: config.settings.cdn_scripts_url
  },
  image: {
    local: 'images',
    cdn: config.settings.cdn_images_url
  }
});

export const getAssetPath = (type: AssetType, path: string, config: Config) => {
  // Get the directory
  const directory = directoryMap(config)[type];

  // If in development, return the local path
  if (process.env.NODE_ENV === 'development') {
    return `/${directory.local}/${path}`;
  }

  // Get the URL
  const version = getAppVersion();

  // Replace all object keys with the version
  let url = directory.cdn;
  for (const key of Object.keys(version)) {
    const value = version[key as keyof typeof version];
    url = url.replaceAll(`{${key}}`, (value || '').toString());
  }

  // Return the full URL
  return new URL(path, url).toString();
};
