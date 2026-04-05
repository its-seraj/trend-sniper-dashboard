import { useEffect, useRef } from 'react'
import type { GridApi } from 'ag-grid-community'
import type { MlRecord } from '../types'
import { env } from '../config'

export function useStreamUpdates(
  getGridApi: () => GridApi | null,
  onNewItem?: (item: MlRecord) => void
) {
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource(env.STREAM_URL)
    esRef.current = es

    es.onmessage = (event) => {
      try {
        const item: MlRecord = JSON.parse(event.data)
        const api = getGridApi()
        if (api) {
          // Prepend to top of infinite grid
          api.applyServerSideTransaction?.({ add: [item], addIndex: 0 })
          // For infinite row model, refresh the first block so new row appears
          api.refreshInfiniteCache()
        }
        onNewItem?.(item)
      } catch {
        // ignore malformed messages / heartbeat comments
      }
    }

    es.onerror = () => {
      // Browser auto-reconnects on error — no manual retry needed
    }

    return () => {
      es.close()
      esRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
