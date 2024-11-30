import tinyGlob from 'tiny-glob';

export async function findFiles(pattern: string): Promise<string[]> {
  try {
    return await tinyGlob(pattern, { dot: true });
  } catch (error) {
    console.error('Error finding files:', error);
    return [];
  }
}