import { useMemo } from 'react'
import type { IDatasource, IGetRowsParams } from 'ag-grid-community'
import { fetchMlData } from '../api/mlApi'

const PAGE_LIMIT = 30

export function useGridDataSource(onTotalLoaded?: (total: number) => void): IDatasource {
  return useMemo<IDatasource>(
    () => ({
      getRows: async (params: IGetRowsParams) => {
        const page = Math.floor(params.startRow / PAGE_LIMIT) + 1
        try {
          const result = await fetchMlData(page, PAGE_LIMIT)
          if (onTotalLoaded && page === 1) {
            onTotalLoaded(result.pagination.total)
          }
          params.successCallback(result.data, result.pagination.total)
        } catch {
          params.failCallback()
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
