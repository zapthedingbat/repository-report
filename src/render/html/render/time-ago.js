module.exports = exports = function timeAgo(date) {
  const msDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((Date.now() - date.getTime()) / msDay);

  if (days === 0) {
    return 'today';
  }

  if (days === 1) {
    return 'yesterday';
  }

  return `${days} days ago`;
}
