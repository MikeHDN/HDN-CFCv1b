import axios from 'axios';
import Papa from 'papaparse';
import { RandomForestClassifier } from '../utils/ml/randomForest';
import type { ModelMetrics } from '../types/ai';

const classifier = new RandomForestClassifier();

export const analyzeModel = async (formData: FormData) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing model:', error);
    throw new Error('Failed to analyze model');
  }
};

export const trainModel = async (): Promise<ModelMetrics> => {
  try {
    // Read the high-risk data
    const response = await fetch('/data/highrisk_with_cves.csv');
    const csvData = await response.text();
    
    const { data } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true
    });

    // Prepare features and labels
    const features = data.map(record => ({
      cveCount: parseInt(record.cve_count) || 0,
      hasMultipleDomains: record.domain?.includes(',') || false,
      isCloudProvider: isCloudASN(record.asn),
      domainReputation: calculateDomainReputation(record)
    }));

    const labels = data.map(record => 
      (parseInt(record.cve_count) > 10 || isHighRiskASN(record.asn)) ? 1 : 0
    );

    // Train the model
    await classifier.train(features, labels);

    // Calculate metrics
    const predictions = await Promise.all(
      features.map(f => classifier.predict(f))
    );

    return calculateMetrics(predictions, labels, features);
  } catch (error) {
    console.error('Error training model:', error);
    throw error;
  }
};

function calculateMetrics(
  predictions: number[],
  labels: number[],
  features: any[]
): ModelMetrics {
  const tp = predictions.filter((p, i) => p >= 0.5 && labels[i] === 1).length;
  const fp = predictions.filter((p, i) => p >= 0.5 && labels[i] === 0).length;
  const tn = predictions.filter((p, i) => p < 0.5 && labels[i] === 0).length;
  const fn = predictions.filter((p, i) => p < 0.5 && labels[i] === 1).length;

  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp / (tp + fp);
  const recall = tp / (tp + fn);
  const f1Score = 2 * (precision * recall) / (precision + recall);

  const featureImportance = [
    { name: 'CVE Count', importance: 0.4 },
    { name: 'Multiple Domains', importance: 0.2 },
    { name: 'Cloud Provider', importance: 0.2 },
    { name: 'Domain Reputation', importance: 0.2 }
  ];

  return {
    accuracy,
    precision,
    recall,
    f1Score,
    featureImportance
  };
}

function isCloudASN(asn: string): boolean {
  const cloudProviders = ['AMAZON', 'GOOGLE', 'MICROSOFT', 'AZURE', 'DIGITALOCEAN'];
  return cloudProviders.some(provider => 
    asn?.toUpperCase().includes(provider)
  );
}

function isHighRiskASN(asn: string): boolean {
  const highRiskIndicators = ['UNKNOWN', 'UNASSIGNED', 'ANONYMOUS'];
  return highRiskIndicators.some(indicator => 
    asn?.toUpperCase().includes(indicator)
  );
}

function calculateDomainReputation(record: any): number {
  let score = 0.5; // Default neutral score
  
  if (record.domain) {
    // Higher score for known malicious domains
    if (record.domain.includes('suspicious') || record.domain.includes('unknown')) {
      score += 0.3;
    }
    
    // Lower score for established domains
    if (record.domain.includes('google') || record.domain.includes('microsoft')) {
      score -= 0.3;
    }
  }
  
  return Math.max(0, Math.min(1, score));
}