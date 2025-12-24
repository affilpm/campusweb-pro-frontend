/**
 * Utility to merge class names conditionally.
 * Replaces clsx for basic usage.
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function truncate(str: string, length: number) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
// Helper to parse hours (JSON or newline-separated string)
export const renderHours = (hoursString: string | undefined | null) => {
  if (!hoursString) return null;
  try {
    const parsed = JSON.parse(hoursString);
    if (Array.isArray(parsed)) {
      return parsed.map((item: any, idx: number) => (
        `${item.day}: ${item.time}`
      )).join('\n');
    }
  } catch (e) {
    // Fallback: it's a plain string
  }
  return hoursString;
};
