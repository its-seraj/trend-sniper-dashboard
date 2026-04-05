import axios from 'axios'
import type { ApiResponse } from '../types'
import { env } from '../config'

const client = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 15000,
})

export async function fetchMlData(page: number, limit: number): Promise<ApiResponse> {
  const response = await client.get<ApiResponse>(env.API_RAW_PATH, {
    params: { page, limit },
  })
  return response.data
}
