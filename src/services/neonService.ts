import { simulateSystemScan } from '../utils/systemScan';
import { RandomForestClassifier } from '../utils/ml/randomForest';
import { getSystemInfo, scanLocalNetwork } from '../utils/systemScan/network';
import type { SystemInfo, NetworkDevice, VulnerabilityScan } from '../types/neon';

const classifier = new RandomForestClassifier();

export async function scanSystem(): Promise<VulnerabilityScan[]> {
  try {
    // Get local system information
    const localSystem = await getSystemInfo();
    
    // Scan network for other devices
    const networkDevices = await scanLocalNetwork();
    
    // Combine local and network devices
    const allDevices = [localSystem, ...networkDevices];
    
    // Scan each device
    const scanResults = await Promise.all(
      allDevices.map(async (device) => {
        const vulnerabilities = await simulateSystemScan(device);
        const riskScore = calculateRiskScore(vulnerabilities);
        const breachProbability = await predictBreachProbability(device, vulnerabilities);
        
        return {
          ...device,
          vulnerabilities,
          riskScore,
          breachProbability
        };
      })
    );

    return scanResults;
  } catch (error) {
    console.error('Error scanning system:', error);
    return [];
  }
}

export async function analyzeVulnerabilities(scanResults: VulnerabilityScan[]) {
  try {
    return scanResults.map(result => ({
      type: determineSystemType(result),
      hostname: result.hostname,
      os: result.os,
      ip: result.ip,
      vulnerabilities: result.vulnerabilities.length,
      riskScore: result.riskScore,
      breachProbability: result.breachProbability,
      details: result.vulnerabilities.map(vuln => ({
        ...vuln,
        probability: calculateVulnerabilityProbability(vuln, result)
      }))
    }));
  } catch (error) {
    console.error('Error analyzing vulnerabilities:', error);
    return [];
  }
}

async function predictBreachProbability(device: SystemInfo, vulnerabilities: any[]) {
  try {
    const features = extractFeatures(device, vulnerabilities);
    return await classifier.predict(features);
  } catch (error) {
    console.error('Error predicting breach probability:', error);
    return calculateFallbackProbability(vulnerabilities);
  }
}

function extractFeatures(device: SystemInfo, vulnerabilities: any[]) {
  return {
    totalVulnerabilities: vulnerabilities.length,
    criticalVulnerabilities: vulnerabilities.filter(v => v.severity === 'critical').length,
    highVulnerabilities: vulnerabilities.filter(v => v.severity === 'high').length,
    osType: device.os,
    lastUpdate: device.lastUpdate,
    openPorts: device.openPorts?.length || 0
  };
}

function calculateRiskScore(vulnerabilities: any[]) {
  const severityWeights = {
    critical: 10,
    high: 7,
    medium: 4,
    low: 1
  };
  
  const totalWeight = vulnerabilities.reduce((sum, vuln) => 
    sum + (severityWeights[vuln.severity.toLowerCase()] || 1), 0
  );
  
  return Math.min(10, totalWeight / Math.max(vulnerabilities.length, 1));
}

function calculateVulnerabilityProbability(vulnerability: any, systemInfo: any) {
  const baseProbability = vulnerability.breachProbability || 0.5;
  const systemFactor = getSystemFactor(systemInfo);
  const timeFactor = getTimeFactor(vulnerability.discovered);
  
  return Math.min(1, baseProbability * systemFactor * timeFactor);
}

function getSystemFactor(systemInfo: any) {
  const factors = {
    windows: 1.2,
    linux: 1.0,
    macos: 0.9
  };
  
  const os = systemInfo.os.toLowerCase();
  return factors[os] || 1.0;
}

function getTimeFactor(discoveryDate: string) {
  const daysSinceDiscovery = (Date.now() - new Date(discoveryDate).getTime()) / (1000 * 60 * 60 * 24);
  return Math.min(1.5, 1 + (daysSinceDiscovery / 365));
}

function determineSystemType(result: VulnerabilityScan) {
  const serverPorts = [80, 443, 22, 21, 25, 3306];
  const hasServerPorts = result.openPorts?.some(port => 
    serverPorts.includes(port)
  );
  
  return hasServerPorts ? 'server' : 'client';
}

function calculateFallbackProbability(vulnerabilities: any[]) {
  const severityWeights = {
    critical: 0.9,
    high: 0.7,
    medium: 0.4,
    low: 0.2
  };
  
  if (vulnerabilities.length === 0) return 0;
  
  const weightedSum = vulnerabilities.reduce((sum, vuln) => 
    sum + (severityWeights[vuln.severity.toLowerCase()] || 0.1), 0
  );
  
  return Math.min(1, weightedSum / vulnerabilities.length);
}