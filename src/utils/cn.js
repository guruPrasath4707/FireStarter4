export function cn(...parts) {
  return parts
    .flat(Infinity)
    .filter(Boolean)
    .filter((p) => typeof p === 'string')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default cn;
