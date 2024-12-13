import packageJSON from '../../../../package.json';

interface Version {
  major: number;
  minor: number;
  patch: number;
  version: string;
  preRelease?: string;
}

/**
 * Get the current app version from the package.json file.
 * @returns The current app version split into major, minor, patch, and pre-release.
 * Also includes the full version string.
 */
export const getAppVersion = (): Version => {
  const { version } = packageJSON;

  const [major, minor, patch] = version.split('.');
  const preRelease = version.split('-')[1];

  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
    preRelease,
    version
  };
};
