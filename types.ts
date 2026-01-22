
export enum Page {
  Home = 'home',
  Diagnose = 'diagnose',
  Market = 'market',
  Weather = 'weather',
  Team = 'team',
  Login = 'login',
  Sustainability = 'sustainability',
  Simulation = 'simulation',
  Finance = 'finance'
}

export interface DiagnosisResult {
  disease: string;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  recommendations: string[];
  description: string;
}

export interface MarketPrice {
  crop: string;
  price: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}
