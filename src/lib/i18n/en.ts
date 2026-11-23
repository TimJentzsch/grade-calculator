import type { Messages } from './index.ts';

const en: Messages = {
  meta: {
    title: 'Grade calculator for RWTH Aachen University',
    description:
      'Calculate your final grade at RWTH Aachen University: with weights, elimination of ' +
      'modules, the best and worst possible grade, and the import of your Notenspiegel from ' +
      'RWTH Online.',
    ogLocale: 'en_US',
  },
  header: {
    appName: 'Grade calculator',
    university: 'for RWTH Aachen University',
    githubTitle: 'Check out the project on GitHub',
    githubLabel: 'GitHub repository',
    languageLabel: 'Language',
  },
  noscript:
    'Your browser does not support JavaScript or you have blocked script execution. ' +
    'This website will not work without JavaScript. ' +
    'Please enable it in your settings or switch to another browser.',
  toolbar: {
    startFrom: 'Start from',
    emptyCurriculum: 'Empty curriculum',
    emptyCurriculumTitle: 'Create a new empty curriculum',
    loadTemplateTitle: (name) => `Load the ${name} curriculum`,
    file: 'File',
    load: 'Load…',
    loadTitle: 'Load a saved curriculum from a file',
    save: 'Save…',
    saveTitle: 'Save the curriculum to a file',
    defaultFileName: 'curriculum',
    importNotenspiegel: 'Import Notenspiegel…',
    importing: 'Importing…',
    importTitle:
      'Import your grades from a Notenspiegel PDF exported from RWTH Online. ' +
      'The file stays in your browser.',
    elimination: 'Elimination',
    autoEliminate: 'Auto-eliminate',
    calculating: 'Calculating…',
    autoEliminateTitle: 'Automatically eliminate modules for the best grade',
  },
  import: {
    success: 'The Notenspiegel was imported.',
    warning: 'The Notenspiegel was imported, but please check the following:',
    error: 'The Notenspiegel could not be imported.',
    dismiss: 'Dismiss',
    unassigned: (name, credits) => `"${name}" (${credits} CP) could not be assigned to a module.`,
    eliminationLimits: 'The eliminated modules exceed the elimination limits of this curriculum.',
    gradeMismatch: (calculated, official) =>
      `The calculated grade ${calculated} differs from the grade ${official} in the Notenspiegel.`,
    unsupported: (program, supported) =>
      `${program ?? 'This course of study'} is not supported yet. Supported: ${supported}.`,
    readErrors: {
      'not-pdf': 'The file is not a readable PDF.',
      'no-table': 'No table of modules was found in the PDF.',
      'empty-table': 'The table of modules is empty.',
      failed: 'The Notenspiegel could not be read.',
    },
  },
  area: {
    edit: (kind) => `Edit this ${kind === 'curriculum' ? 'curriculum' : 'module area'}`,
    remove: (kind) => `Remove this ${kind === 'curriculum' ? 'curriculum' : 'module area'}`,
    add: (kind) => (kind === 'curriculum' ? 'Add a new module area' : 'Add a new module'),
    finalGradeTitle:
      'The final grade. Only the first decimal place counts, hover to see the cut off second one.',
    areaGradeTitle: 'The average grade of this module area',
    gradeBeforeEliminationTitle: 'The grade before elimination',
    gradeLimitsTitle: (kind) =>
      `The best/worst possible grade in this ${kind === 'curriculum' ? 'curriculum' : 'module area'}`,
    creditsTitle: (kind) =>
      `The credit points of the modules in this ${kind === 'curriculum' ? 'curriculum' : 'module area'}`,
    belowMinCredits: (min, missing) =>
      `, of at least ${min} required. ${missing} CP are still missing.`,
    aboveMaxCredits: (max, excess) =>
      `, of at most ${max} allowed. Mark modules with ${excess} CP as additional modules.`,
  },
  editor: {
    name: 'Name:',
    curriculumPlaceholder: 'Curriculum name…',
    moduleAreaPlaceholder: 'Module area name…',
    elimination: 'Elimination:',
    limitedCount: 'Limited count:',
    limitedCredits: 'Limited credits:',
    credits: 'Credits:',
    minimum: 'Minimum:',
    minimumTitle:
      'The credits that have to be reached at least. ' +
      'Missing credits count towards the possible grade range.',
    maximum: 'Maximum:',
    maximumTitle:
      'The credits that may be reached at most. Mark further modules as additional modules.',
    save: 'Save the changes',
    discard: 'Discard the changes',
  },
  elimination: {
    noneAllowed: 'No elimination allowed',
    label: 'Elimination: ',
    modules: (count) => (count === 1 ? 'module' : 'modules'),
  },
  module: {
    unnamed: 'Unnamed module',
    nameLabel: 'module name',
    additionalTitle:
      'An additional module (Zusatzleistung), which counts towards neither the credits nor the grade',
    weightLabel: (name) => `Weight of ${name ?? 'this module'}`,
    weightHint:
      'Enter the weighting of this module, e.g. 2.0 to count it twice or 0.0 to not count it',
    eliminate: (name) => `Eliminate ${name ?? 'this module'}`,
    staysEliminated: (name) =>
      `${name ?? 'This module'} stays eliminated, because its grade is unknown. ` +
      'Enter the grade to change this.',
    gradeLabel: (name) => `Grade of ${name ?? 'this module'}`,
    markPassed: (name) => `Mark ${name ?? 'this module'} as passed`,
    creditsLabel: (name) => `Credit points of ${name ?? 'this module'}`,
    creditsHint: 'Enter the credit points',
    markAdditional: (name) =>
      `Mark ${name ?? 'this module'} as an additional module (Zusatzleistung), ` +
      "which doesn't count towards the credits or the grade",
    passFail: (name) => `Only pass or fail ${name ?? 'this module'}, without a grade`,
    remove: (name) => `Remove ${name ?? 'this module'}`,
  },
  editableText: {
    edit: (label) => `, edit ${label}`,
  },
  grade: {
    tbd: 'TBD',
    hint: (min, max) => `Enter a grade between ${min} and ${max}`,
  },
};

export default en;
