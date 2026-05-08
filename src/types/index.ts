export interface LabelCandidate {
  label: string
  score: number
  matches: string[]
}

export interface MlLabel {
  label: string
  score: number
}

export interface MlRefinementRecord {
  id: string
  processed_item_id: string
  source_id: string
  source_name: string
  title: string
  body: string
  ml_sector: string
  ml_sector_probs: Record<string, number>
  ml_labels: MlLabel[]
  ml_topic: string
  ml_sentiment_label: 'positive' | 'negative' | 'neutral'
  ml_sentiment_score: string
  ml_confidence: string
  ml_entities: string[]
  resolution_source: string
  error_message: string | null
  created_at: string
}

export interface RefinementsApiResponse {
  data: MlRefinementRecord[]
  pagination: Pagination
}

export interface MlRecord {
  id: string
  source_id: string
  source_name: string
  title: string
  body: string
  url: string
  published_at: string
  entities: string[]
  sector_candidates: string[]
  label_candidates: LabelCandidate[]
  topic_candidates: string[]
  sentiment_label: 'positive' | 'negative' | 'neutral'
  sentiment_score: string
  sentiment_comp: string
  credibility: number
  processed_at: string
  ml_status: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse {
  data: MlRecord[]
  pagination: Pagination
}

export interface DividendRecord {
  _id?: string
  symbol: string
  companyName: string
  series: string | null
  subject: string
  dividendAmount: number | null
  dividendIsPercent: boolean
  dividendPercent: number | null
  dividendType: 'Interim' | 'Final' | 'Special' | 'Unknown'
  exDate: string
  recordDate: string | null
  paymentDate: string | null
  bcStartDate: string | null
  bcEndDate: string | null
  lastPrice: number | null
  dividendOnExPct: number | null
  sector: string | null
  industry: string | null
  marketCap: number | null
  faceValue: number | null
  scrapedAt: string
  enrichedAt: string | null
}

export interface DividendsLastRun {
  at: string
  success: boolean
  inserted: number
  updated: number
  errors: string[]
  source: string
}

export interface DividendsApiResponse {
  count: number
  rows: DividendRecord[]
  lastRun: DividendsLastRun | null
}

export interface UpcomingCursor {
  after: string
  lastId: string
}

export interface PastCursor {
  before: string
  lastId: string
}

export interface DividendsUpcomingResponse {
  direction: 'upcoming'
  rows: DividendRecord[]
  hasMore: boolean
  nextCursor: UpcomingCursor | null
  lastRun?: DividendsLastRun | null
}

export interface DividendsPastResponse {
  direction: 'past'
  rows: DividendRecord[]
  hasMore: boolean
  nextCursor: PastCursor | null
}

export interface DividendsCounts {
  upcoming: number
  past: number
}

export interface DividendsRefreshResult {
  success: boolean
  inserted: number
  updated: number
  skipped: number
  errors: string[]
  total?: number
}
