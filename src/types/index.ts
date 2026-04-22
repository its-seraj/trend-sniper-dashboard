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
