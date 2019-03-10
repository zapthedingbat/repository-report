const icons = require("./icons-svg")();

module.exports = exports = function renderRepositorySettingsButton(repository) {
  if (!repository.settingsUrl) {
    return '';
  }
  return `
<a class="btn btn-light btn-sm" role="button" href="${repository.settingsUrl}">
  ${icons.use("gear")} Settings
</a>
`;
}
