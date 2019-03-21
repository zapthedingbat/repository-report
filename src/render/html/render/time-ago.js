module.exports = exports = function timeAgo(date, refDate) {
  const msDay = 1000 * 60 * 60 * 24;
  const days = Math.floor((refDate.getTime() - date.getTime()) / msDay);

  if (days === 0) {
    return 'today';
  }

  if (days === 1) {
    return 'yesterday';
  }

  return `${days} days ago`;
}
