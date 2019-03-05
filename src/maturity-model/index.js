function pushedWithingDays(days) {
  return {
    details: {
      name: 'pushedWithingDays',
      title: `Pushed withing ${days} days`,
      description: 'Projects should be actively maintained.'
    },
    test: async function (artifacts, context) {
      const pushedAtDate = new Date(artifacts.repository.pushed_at);
      const msDay = 1000 * 60 * 60 * 24;
      const pushedDaysAgo = Math.floor((Date.now() - pushedAtDate.getTime()) / msDay);
      return pushedDaysAgo < days;
    }
  }
}

function hasManyContributors() {
  return {
    details: {
      name: 'hasManyContributors',
      title: 'Has many contributors',
      description: 'Projects should be a collaborative effort.'
    },
    test: async function (artifacts, context) {
      return artifacts.contributors.length >= 3;
    }
  }
}

function hasGoodReadme() {
  const pattern = /^readme\.md$/i;
  const headingPattern = /(^\s*#+\s*.+$|^[^\r\n]+={3,}\s*$)/gm;
  const wordPattern = /\s+/g;
  return {
    details: {
      name: 'hasGoodReadme',
      title: `Has a meaningful readme file`,
      description: 'Readme file should provide enough helpful information for someone to start using an contributing to the project.'
    },
    test: async function (artifacts, context) {
      const fileName = artifacts.filePaths.find(filePath => pattern.test(filePath));
      if (fileName) {
        const fileContent = await context.readFile(fileName);
        // List of headings
        headings = fileContent.match(headingPattern) || [];

        // Number of words excluding headings
        wordCount = fileContent.replace(headingPattern, "").split(wordPattern).length;
        
        return headings.length > 2 && wordCount > 50;
      }
      return false;
    }
  }
}

function hasReadme() {
  const pattern = /^readme\.md$/i;
  return {
    details: {
      name: 'hasReadme',
      title: `Has readme file`,
      description: 'Projects should have a readme file to help other to learn about it.'
    },
    test: async function (artifacts, context) {
      return artifacts.filePaths.some(filePath => pattern.test(filePath));
    }
  }
}

function hasCiConfig() {
  const pattern = /(circleci|travis|jenkins)/i;
  return {
    details: {
      name: 'hasCiConfig',
      title: `Has CI configuration`,
      description: 'Projects should have a continuous integration pipeline.'
    },
    test: async function (artifacts, context) {
      return artifacts.filePaths.some(filePath => pattern.test(filePath));
    }
  }
}

function createdWithinDays(days) {
  return {
    details: {
      name: 'createdWithinDays',
      title: `Created within ${days} days`,
      description: 'Projects take time to reach maturity'
    },
    test: async function (artifacts, context) {
      const atDate = new Date(artifacts.repository.created_at);
      const msDay = 1000 * 60 * 60 * 24;
      const daysAgo = Math.floor((Date.now() - atDate.getTime()) / msDay);
      return daysAgo < days;
    }
  }
}

function createdAfterDays(days) {
  return {
    details: {
      name: 'createdAfterDays',
      title: `Created after ${days} days`
    },
    test: async function (artifacts, context) {
      const atDate = new Date(artifacts.repository.created_at);
      const msDay = 1000 * 60 * 60 * 24;
      const daysAgo = Math.floor((Date.now() - atDate.getTime()) / msDay);
      return daysAgo > days;
    }
  }
}

const model = {
  classifications: [
    {
      details: {
        name: 'operate',
        title: 'Operate',
        description: 'This looks like working software. Ensure there is clear stewardship and a *strong roadmap*.',
      },
      criteria: [
        pushedWithingDays(30),
        hasManyContributors(),
        hasGoodReadme(),
        hasCiConfig()
      ]
    },
    {
      details: {
        name: 'develop',
        title: 'Develop',
        description: 'This looks like an established the project. Work on getting the software production ready.',
      },
      criteria: [
        pushedWithingDays(30),
        hasManyContributors(),
        hasGoodReadme()
      ]
    },
    {
      details: {
        name: 'create',
        title: 'Create',
        description: 'This looks like a shiny new project. Work on establishing the project, engaging other contributors and getting ready to prove some business value.',
      },
      criteria: [
        createdWithinDays(30),
        pushedWithingDays(30),
        hasGoodReadme()
      ]
    },
    {
      details: {
        name: 'sustain',
        title: 'Sustain',
        description: 'This project has been around for some time but is no longer not not well maintained. Consider either decommissioning steps or engaging new contributors to take on stewardship.',
      },
      criteria: [
        pushedWithingDays(365),
        createdAfterDays(90),
        hasManyContributors(),
        hasReadme()
      ]
    },
    {
      details: {
        name: 'discard',
        title: 'Discard',
        description: 'This project doesn\'t appear to be actively or well maintained. It\'s likely to be difficult to work with. Consider seeking new contributors or archiving or deleting the project.',
      },
      criteria: []
    },
  ]
}

async function classify(artifacts, context) {

  const classificationCriteriaResults = [];

  for (let classification of model.classifications) {
    const criteriaResults = [];
    for (let criterion of classification.criteria) {
      const result = await criterion.test(artifacts, context);
      criteriaResults.push({
        details: criterion.details,
        result
      });
    }
    classificationCriteriaResults.push({
      details: classification.details,
      criteriaResults
    });
  }

  // Get the first classificationCriteriaResults where all the criteria are met.
  const matchedClassificationCriteriaResults = classificationCriteriaResults.find(classificationCriteriaResult => {
    return classificationCriteriaResult.criteriaResults.every(criteriaResult => criteriaResult.result);
  });

  return {
    matched: matchedClassificationCriteriaResults.details,
    classificationCriteriaResults
  }
}

module.exports = exports = {
  model,
  classify
}
