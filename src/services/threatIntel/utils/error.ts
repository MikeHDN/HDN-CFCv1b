export class ThreatIntelError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ThreatIntelError';
  }

  static networkError(details?: unknown): ThreatIntelError {
    return new ThreatIntelError(
      'Failed to fetch threat intelligence data',
      'NETWORK_ERROR',
      details
    );
  }

  static parseError(details?: unknown): ThreatIntelError {
    return new ThreatIntelError(
      'Failed to parse threat intelligence data',
      'PARSE_ERROR',
      details
    );
  }

  static cacheError(details?: unknown): ThreatIntelError {
    return new ThreatIntelError(
      'Failed to access cache',
      'CACHE_ERROR',
      details
    );
  }
}