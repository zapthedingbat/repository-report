function classifications() {
  return [
    {
      details: {
        name: 'operate',
        title: 'Operate',
        description: 'This looks like working software. Ensure there is clear stewardship and a *strong roadmap*.',
      },
      auditCriteria: [
        'has-description',
        'created-after-30-days',
        'pushed-within-30-days',
        'has-many-contributors',
        'has-good-readme',
        'has-link-from-confluence',
        'has-ci-config',
      ]
    },
    {
      details: {
        name: 'develop',
        title: 'Develop',
        description: 'This looks like an established project. Work on getting the software production ready.',
      },
      auditCriteria: [
        'has-description',
        'created-within-a-year',
        'created-after-30-days',
        'pushed-within-30-days',
        'has-many-contributors',
        'has-good-readme',
      ]
    },
    {
      details: {
        name: 'create',
        title: 'Create',
        description: 'This looks like a shiny new project. Work on establishing the project, engaging other contributors and getting ready to prove some business value.',
      },
      auditCriteria: [
        'has-description',
        'created-within-a-year',
        'pushed-within-30-days',
        'has-good-readme',
      ]
    },
    {
      details: {
        name: 'sustain',
        title: 'Sustain',
        description: 'This project has been around for some time but is no longer or not well maintained. Consider either decommissioning steps or engaging new contributors to take on it\'s stewardship.',
      },
      auditCriteria: [
        'has-description',
        'created-after-30-days',
        'pushed-within-a-year',
        'has-many-contributors',
        'has-link-from-confluence',
        'has-good-readme',
      ]
    },
    {
      details: {
        name: 'discard',
        title: 'Discard',
        description: 'This project doesn\'t appear to be actively or well maintained. It\'s likely to be difficult to work with. Consider seeking new contributors or archiving or deleting the project.',
      },
      auditCriteria: []
    }
  ];
}

module.exports = exports = classifications();
