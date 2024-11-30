export async function readLocalFile(path: string): Promise<string | null> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`File not found: ${path}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}