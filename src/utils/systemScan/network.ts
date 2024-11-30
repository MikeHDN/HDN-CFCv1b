import { networkInterfaces } from 'os';
import type { SystemInfo, NetworkDevice } from '../../types/neon';

export async function getSystemInfo(): Promise<SystemInfo> {
  const info: SystemInfo = {
    hostname: window.location.hostname,
    os: detectOS(),
    ip: await getLocalIP(),
    lastUpdate: new Date().toISOString(),
    openPorts: await scanPorts(),
    version: navigator.userAgent
  };
  
  return info;
}

export async function scanLocalNetwork(): Promise<NetworkDevice[]> {
  try {
    // In a browser environment, we can't directly scan the network
    // This would require a backend service or agent
    // For demo purposes, we'll return simulated devices
    return [
      {
        hostname: 'windows-client',
        os: 'Windows 11',
        ip: '192.168.1.100',
        lastUpdate: new Date().toISOString(),
        openPorts: [80, 443, 3389],
        version: 'Windows 11 Pro 21H2'
      },
      {
        hostname: 'ubuntu-server',
        os: 'Linux',
        ip: '192.168.1.200',
        lastUpdate: new Date().toISOString(),
        openPorts: [22, 80, 443, 3306],
        version: 'Ubuntu 22.04 LTS'
      },
      {
        hostname: 'macos-workstation',
        os: 'macOS',
        ip: '192.168.1.150',
        lastUpdate: new Date().toISOString(),
        openPorts: [22, 80],
        version: 'macOS 13.0'
      }
    ];
  } catch (error) {
    console.error('Error scanning network:', error);
    return [];
  }
}

async function getLocalIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting local IP:', error);
    return 'unknown';
  }
}

async function scanPorts(): Promise<number[]> {
  // In a browser environment, we can't directly scan ports
  // This would require a backend service
  return [];
}

function detectOS(): string {
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) return 'Windows';
  if (userAgent.includes('mac')) return 'macOS';
  if (userAgent.includes('linux')) return 'Linux';
  
  return 'Unknown OS';
}