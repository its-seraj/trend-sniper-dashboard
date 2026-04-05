export const SOURCES = [
  { id: 'moneycontrol', name: 'Moneycontrol', favicon: 'https://www.moneycontrol.com/favicon.ico' },
  { id: 'economic_times', name: 'Economic Times', favicon: 'https://economictimes.indiatimes.com/favicon.ico' },
  { id: 'rbi', name: 'RBI', favicon: 'https://rbi.org.in/favicon.ico' },
  { id: 'sebi', name: 'SEBI', favicon: 'https://www.sebi.gov.in/favicon.ico' },
  { id: 'nse', name: 'NSE', favicon: 'https://www.nseindia.com/favicon.ico' },
] as const

export type SourceId = typeof SOURCES[number]['id']

const sourceMap = new Map<string, typeof SOURCES[number]>(SOURCES.map((s) => [s.id, s]))

export function getSource(sourceId: string) {
  return sourceMap.get(sourceId)
}
