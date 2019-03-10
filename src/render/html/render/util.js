function renderAll(fn, ary) {
  return ary.map(fn).join("\r\n");
}

function renderHtml(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function renderJson(obj) {
  return `<pre>${renderHtml(JSON.stringify(obj, null, 2))}</pre>`;
}

module.exports = exports = {
  renderAll,
  renderHtml,
  renderJson
}
