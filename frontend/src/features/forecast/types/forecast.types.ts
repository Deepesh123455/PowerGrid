export interface ForecastData {
  billForecast: number;
  aiConfidenceScore: number;
  vsLastMonth: number;
  forecastedDate: string;
}

export interface ForecastResponse {
  status: 'success' | 'error';
  data: ForecastData;
}
