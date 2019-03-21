function createGetResults(days, artefactsDateFn, messageFn, refDate) {
  return function getResults(artefacts) {
    const atDate = artefactsDateFn(artefacts);
    const msDay = 1000 * 60 * 60 * 24;
    const daysAgo = Math.floor((refDate.getTime() - atDate.getTime()) / msDay);
    const pass = daysAgo < days;

    return {
      pass,
      score: pass ? 1 : 0,
      message: messageFn ? messageFn(pass, daysAgo) : pass ? null : ''
    }
  }
}

module.exports = exports = function createWithinDaysAudit(title, description, days, artefactsDateFn, messageFn, refDate) {
  const details = {
    title,
    description
  }
  return {
    details,
    getResults: createGetResults(days, artefactsDateFn, messageFn, refDate)
  }
}
