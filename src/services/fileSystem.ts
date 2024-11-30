export async function readFile(path: string): Promise<string> {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to read file: ${path}`);
    return await response.text();
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}

export async function listFiles(path: string): Promise<string[]> {
  try {
    const dirHandle = await window.showDirectoryPicker({
      startIn: path,
      mode: 'read'
    });
    
    const files: string[] = [];
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file') {
        files.push(entry.name);
      }
    }
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}