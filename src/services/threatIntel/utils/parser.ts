export function parseCSVLine(line: string): string[] {
  const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
  return matches.map(value => value.replace(/^"|"$/g, '').trim());
}