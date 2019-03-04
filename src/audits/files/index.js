const createHasFileAudit = require("./create-has-file-audit");

module.exports = {
  hasCodeOfConduct: createHasFileAudit(
    "Has code of conduct",
    "Adopt a code of conduct to define community standards, signal a welcoming and inclusive project, and outline procedures for handling abuse.",
    /^(\.github\/|docs\/|)CODE_OF_CONDUCT.md$/i
  ),
  hasContributingFile: createHasFileAudit(
    "Has contributors guidelines",
    "You can create guidelines to communicate how people should contribute to your project.",
    /^(\.github\/|docs\/|)CONTRIBUTING.md$/i
  ),
  hasLicenseFile: createHasFileAudit(
    "Has license",
    "You can include an open source license in your repository to make it easier for other people to contribute.",
    /^LICENSE.md$/i
  ),
  hasSupportFile: createHasFileAudit(
    "Has support file",
    "You can create a SUPPORT file to let people know about ways to get help with your project.",
    /^(\.github\/|docs\/|)SUPPORT.md$/i
  ),
  hasEditorConfigFile: createHasFileAudit(
    "Has editorconfig file",
    "Editor config files can help developers keep their development environments consistent.",
    /(^|\/)\.editorconfig$/i
  )
};
