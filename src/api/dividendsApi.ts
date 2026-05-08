import axios from 'axios'
import type {
  DividendsCounts,
  DividendsPastResponse,
  DividendsRefreshResult,
  DividendsUpcomingResponse,
  PastCursor,
  UpcomingCursor,
} from '../types'
import { env } from '../config'

const baseURL = env.DIVIDENDS_API_BASE_URL || 'http://localhost:5000'

const client = axios.create({
  baseURL,
  timeout: 90000,
})

export async function fetchUpcomingDividends(
  cursor?: UpcomingCursor | null
): Promise<DividendsUpcomingResponse> {
  const response = await client.get<DividendsUpcomingResponse>('/', {
    params: {
      direction: 'upcoming',
      ...(cursor ? { after: cursor.after, lastId: cursor.lastId } : {}),
    },
  })
  return response.data
}

export async function fetchPastDividends(
  cursor?: PastCursor | null
): Promise<DividendsPastResponse> {
  const response = await client.get<DividendsPastResponse>('/', {
    params: {
      direction: 'past',
      ...(cursor ? { before: cursor.before, lastId: cursor.lastId } : {}),
    },
  })
  return response.data
}

export async function fetchDividendCounts(): Promise<DividendsCounts> {
  const response = await client.get<DividendsCounts>('/counts')
  return response.data
}

export async function refreshDividends(): Promise<DividendsRefreshResult> {
  const response = await client.post<DividendsRefreshResult>('/refresh')
  return response.data
}
