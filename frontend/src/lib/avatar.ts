const PALETTE = ['3157D5', '2A6F6A', 'C45C26', '5B4B8A', '1F6F8B', 'B4532A', '3D5A80']

export function avatarDataUri(name: string) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
  const bg = PALETTE[name.length % PALETTE.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="80" fill="#${bg}"/><text x="80" y="96" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="54" font-weight="600" fill="#ffffff">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
