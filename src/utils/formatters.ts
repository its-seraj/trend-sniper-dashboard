export function formatDate(iso: string): string {
  if (!iso) return '-'
  const d = new Date(iso)
  // Display in IST (UTC+5:30) regardless of browser timezone
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(d)
}

export function truncateText(text: string, maxLen = 120): string {
  if (!text) return '-'
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text
}
