/**
 * Formats a number with K (thousands) and M (millions) suffixes
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string (e.g., "1.2K", "3.5M", "245")
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  } else if (num >= 1000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return num.toString();
};

