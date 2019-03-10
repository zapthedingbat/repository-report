module.exports = exports = function createRenderGroup(fn, { name, url, imageUrl}) {
  return function renderGroup(...args) {
    return `
<div class="container text-center py-4">
  <img src="${imageUrl}" alt="${name}" width="72" height="72">
  <div class="display-4"><a href="${url}">${name}</a></div>
</div>

<div class="border-top border-bottom bg-white py-4">
  <div class="container">
    ${fn(...args)}
  </div>
</div>
`;
  }
}
