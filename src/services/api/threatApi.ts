import axios from 'axios';

const FIREHOL_API = 'https://iplists.firehol.org/files/firehol_level1.netset';
const EXPLOITDB_API = 'https://raw.githubusercontent.com/offensive-security/exploitdb/master/files_exploits.csv';

export const fetchFireholData = async () => {
  try {
    const response = await axios.get(FIREHOL_API);
    return response.data
      .split('\n')
      .filter((line: string) => !line.startsWith('#') && line.trim())
      .map((ip: string) => ({ ip: ip.trim(), type: 'malicious' }));
  } catch (error) {
    console.error('Error fetching Firehol data:', error);
    return [];
  }
};

export const fetchExploitDBData = async () => {
  try {
    const response = await axios.get(EXPLOITDB_API);
    return response.data
      .split('\n')
      .slice(1)
      .filter(Boolean)
      .map((line: string) => {
        const [id, file, description, date, author, platform, type] = line.split(',');
        return { id, file, description, date, author, platform, type };
      });
  } catch (error) {
    console.error('Error fetching ExploitDB data:', error);
    return [];
  }
};