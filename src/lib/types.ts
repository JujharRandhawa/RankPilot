export type ContentStatus = "draft" | "optimized" | "published";

export interface Project {
  id: string;
  name: string;
  domain: string;
  niche: string;
  createdAt: string;
}

export interface KeywordRecord {
  id: string;
  projectId: string;
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: "informational" | "commercial" | "transactional" | "navigational";
  trend: number[];
  opportunity: number;
  researchedAt: string;
}

export interface ContentRecord {
  id: string;
  projectId: string;
  keyword: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  outline: string[];
  body: string;
  wordCount: number;
  seoScore: number;
  scoreBreakdown: ScoreBreakdown;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreBreakdown {
  keywordUsage: number;
  structure: number;
  readability: number;
  meta: number;
  length: number;
  suggestions: string[];
}

export interface AnalyticsPoint {
  date: string;
  organicTraffic: number;
  impressions: number;
  clicks: number;
  avgPosition: number;
}

export interface RankingRow {
  id: string;
  keyword: string;
  position: number;
  previousPosition: number;
  url: string;
  change: number;
}

export interface StoreData {
  project: Project;
  keywords: KeywordRecord[];
  contents: ContentRecord[];
  analytics: AnalyticsPoint[];
  rankings: RankingRow[];
}
