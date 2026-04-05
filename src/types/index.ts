export interface LabelCandidate {
  label: string
  score: number
  matches: string[]
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
