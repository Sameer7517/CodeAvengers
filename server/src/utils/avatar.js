/**
 * Generates an SVG data URI avatar containing the user's name initials.
 * Self-contained, zero external network dependency, renders crisp and clear everywhere.
 */
export const generateInitialsAvatar = (name) => {
  const cleanName = (name || 'Student').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  let initials = 'ST';
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].substring(0, 2).toUpperCase();
  } else if (parts.length === 1 && parts[0].length === 1) {
    initials = parts[0].toUpperCase();
  }

  // Consistent brand color palette based on name hash
  const colors = [
    { bg: '#176B4D', text: '#ffffff' }, // CampusLoop Emerald
    { bg: '#0D4F36', text: '#ffffff' }, // Deep Forest Green
    { bg: '#1E3A8A', text: '#ffffff' }, // Collegiate Blue
    { bg: '#0F766E', text: '#ffffff' }, // Teal
    { bg: '#312E81', text: '#ffffff' }, // Indigo
    { bg: '#92400E', text: '#ffffff' }, // Amber Bronze
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const { bg, text } = colors[colorIndex];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="50" fill="${bg}"/><text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="38" font-weight="700" fill="${text}" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
