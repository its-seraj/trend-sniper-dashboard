import axios from 'axios'
import type { RefinementsApiResponse } from '../types'
import { env } from '../config'

const client = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
})

export async function fetchRefinements(page: number, limit: number): Promise<RefinementsApiResponse> {
  const response = await client.get<RefinementsApiResponse>('/refinements', {
    params: { page, limit },
  })
  return response.data
}
