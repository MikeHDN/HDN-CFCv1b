export interface ModelAnalysis {
  modelType: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  issues: string[];
}

export interface DatasetInspection {
  shape: [number, number];
  columns: string[];
  missingValues: number;
  inconsistentRows: number;
  head: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  featureImportance: Array<{
    name: string;
    importance: number;
  }>;
}

export interface TrainingResult {
  metrics: ModelMetrics;
  modelPath: string;
  timestamp: string;
}