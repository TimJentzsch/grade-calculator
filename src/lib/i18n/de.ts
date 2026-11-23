/** What a curriculum header or editor refers to. */
export type AreaKind = 'curriculum' | 'module-area';

import type { ReadErrorReason } from '#lib/notenspiegel/read-notenspiegel.ts';

/** The German texts, which are the default. The English texts follow the same structure. */
const de = {
  meta: {
    title: 'Notenrechner für die RWTH Aachen',
    description:
      'Berechne deine Gesamtnote an der RWTH Aachen: mit Gewichtung, Streichung von Modulen, ' +
      'bester und schlechtester möglicher Note und dem Import deines Notenspiegels aus RWTH Online.',
    ogLocale: 'de_DE',
  },
  header: {
    appName: 'Notenrechner',
    university: 'für die RWTH Aachen',
    githubTitle: 'Das Projekt auf GitHub ansehen',
    githubLabel: 'GitHub-Repository',
    languageLabel: 'Sprache',
  },
  noscript:
    'Dein Browser unterstützt kein JavaScript oder du hast es blockiert. ' +
    'Ohne JavaScript funktioniert diese Seite nicht. ' +
    'Bitte aktiviere es in den Einstellungen oder nutze einen anderen Browser.',
  toolbar: {
    file: 'Datei',
    load: 'Laden…',
    loadTitle: 'Gespeicherte Noten aus einer Datei laden',
    loadError: 'Die Datei enthält keine gespeicherten Noten dieses Notenrechners.',
    save: 'Speichern…',
    saveTitle: 'Deine Noten in einer Datei speichern',
    defaultFileName: 'noten',
    importNotenspiegel: 'Notenspiegel importieren…',
    importing: 'Importiere…',
    importTitle:
      'Importiere deine Noten aus einem Notenspiegel-PDF aus RWTH Online. ' +
      'Die Datei bleibt in deinem Browser.',
    curriculum: 'Studienplan',
    duplicate: 'Als eigenen Studienplan kopieren',
    duplicateTitle:
      'Den Studienplan kopieren, um Modulbereiche, Module und Grenzen zu ändern. ' +
      'Deine Noten bleiben erhalten.',
    editCurriculum: 'Studienplan bearbeiten',
    editCurriculumTitle: 'Modulbereiche, Module und Grenzen dieses Studienplans ändern',
    startOver: 'Neu beginnen',
    startOverTitle: 'Alle Eingaben entfernen und einen anderen Studienplan wählen',
    confirmStartOver:
      'Alle deine Noten und Module entfernen? Das kann nicht rückgängig gemacht werden.',
    confirmReplace:
      'Deine bisherigen Noten und Module durch die importierten ersetzen? ' +
      'Das kann nicht rückgängig gemacht werden.',
    elimination: 'Streichung',
    autoEliminate: 'Automatisch streichen',
    calculating: 'Berechne…',
    autoEliminateTitle: 'Module automatisch so streichen, dass die Note am besten ist',
  },
  start: {
    title: 'Lade deinen Notenspiegel hoch',
    description:
      'Exportiere deinen Notenspiegel in RWTH Online als PDF und lade ihn hier hoch. ' +
      'Dein Studiengang und deine Prüfungsordnung werden automatisch erkannt.',
    chooseFile: 'PDF auswählen…',
    dropHint: 'oder hierher ziehen',
    privacy: 'Die Datei wird nur in deinem Browser gelesen und nirgendwo hochgeladen.',
    manualTitle: 'Ohne Notenspiegel starten',
    chooseCurriculum: 'Studienplan wählen',
    chooseTitle: (name: string) => `Mit dem Studienplan ${name} starten`,
    otherOptions: 'Weitere Möglichkeiten',
    custom: 'Eigener Studienplan',
    customTitle: 'Einen eigenen Studienplan mit Modulbereichen, Modulen und Grenzen anlegen',
  },
  import: {
    success: 'Der Notenspiegel wurde importiert.',
    warning: 'Der Notenspiegel wurde importiert, bitte prüfe aber Folgendes:',
    error: 'Der Notenspiegel konnte nicht importiert werden.',
    dismiss: 'Schließen',
    unassigned: (name: string, credits: number) =>
      `„${name}“ (${credits} CP) konnte keinem Modul zugeordnet werden.`,
    eliminationLimits: 'Die gestrichenen Module überschreiten die Grenzen dieses Studienplans.',
    gradeMismatch: (calculated: string, official: string) =>
      `Die berechnete Note ${calculated} weicht von der Note ${official} im Notenspiegel ab.`,
    unsupported: (program: string | undefined, supported: string) =>
      `${program ?? 'Dieser Studiengang'} wird noch nicht unterstützt. Unterstützt: ${supported}. ` +
      'Du kannst aber einen eigenen Studienplan anlegen.',
    readErrors: {
      'not-pdf': 'Die Datei ist kein lesbares PDF.',
      'no-table': 'Im PDF wurde keine Tabelle mit Modulen gefunden.',
      'empty-table': 'Die Tabelle mit Modulen ist leer.',
      failed: 'Der Notenspiegel konnte nicht gelesen werden.',
    } satisfies Record<ReadErrorReason, string>,
  },
  area: {
    add: (kind: AreaKind): string =>
      kind === 'curriculum' ? 'Einen neuen Modulbereich hinzufügen' : 'Ein neues Modul hinzufügen',
    finalGradeTitle:
      'Die Gesamtnote. Nur die erste Nachkommastelle zählt, ' +
      'fahre mit der Maus darüber, um die abgeschnittene zweite zu sehen.',
    areaGradeTitle: 'Die Durchschnittsnote dieses Modulbereichs',
    gradeBeforeEliminationTitle: 'Die Note vor der Streichung',
    gradeLimitsTitle: (kind: AreaKind): string =>
      kind === 'curriculum'
        ? 'Die bestmögliche/schlechtestmögliche Note in diesem Studienplan'
        : 'Die bestmögliche/schlechtestmögliche Note in diesem Modulbereich',
    creditsTitle: (kind: AreaKind): string =>
      kind === 'curriculum'
        ? 'Die Leistungspunkte der Module in diesem Studienplan'
        : 'Die Leistungspunkte der Module in diesem Modulbereich',
    belowMinCredits: (min: number, missing: number) =>
      `, von mindestens ${min} benötigten. Es fehlen noch ${missing} CP.`,
    aboveMaxCredits: (max: number, excess: number) =>
      `, von höchstens ${max} erlaubten. Markiere Module mit ${excess} CP als Zusatzleistungen.`,
  },
  editor: {
    newTitle: 'Eigener Studienplan',
    editTitle: 'Studienplan bearbeiten',
    intro:
      'Lege die Modulbereiche, ihre festen Module und die Grenzen fest. ' +
      'Deine Noten trägst du danach im Studienplan ein.',
    name: 'Name',
    curriculumPlaceholder: 'Name des Studienplans…',
    moduleAreaPlaceholder: 'Name des Modulbereichs…',
    modulePlaceholder: 'Name des Moduls…',
    elimination: 'Streichung',
    limitedCount: 'Anzahl begrenzt',
    limitedCredits: 'Leistungspunkte begrenzt',
    credits: 'Leistungspunkte',
    minimum: 'Minimum',
    minimumTitle:
      'Die Leistungspunkte, die mindestens erreicht werden müssen. ' +
      'Fehlende Leistungspunkte fließen in den möglichen Notenbereich ein.',
    maximum: 'Maximum',
    maximumTitle:
      'Die Leistungspunkte, die höchstens erreicht werden dürfen. ' +
      'Markiere weitere Module als Zusatzleistungen.',
    moduleAreas: 'Modulbereiche',
    addArea: 'Modulbereich hinzufügen',
    removeArea: (name: string | undefined) =>
      name ? `Modulbereich ${name} entfernen` : 'Diesen Modulbereich entfernen',
    openChoice: 'Module werden frei gewählt, z. B. Wahlpflichtmodule',
    openChoiceTitle: 'Du fügst die Module dieses Bereichs später selbst hinzu',
    noModules: 'Keine festen Module',
    addModule: 'Festes Modul hinzufügen',
    removeModule: (name: string | undefined) =>
      name ? `Modul ${name} entfernen` : 'Dieses Modul entfernen',
    moduleName: 'Modulname',
    moduleCredits: 'Leistungspunkte',
    moduleWeight: 'Gewichtung',
    moduleGraded: 'Benotet',
    save: 'Speichern',
    cancel: 'Abbrechen',
  },
  elimination: {
    noneAllowed: 'Keine Streichung erlaubt',
    label: 'Streichung: ',
    modules: (count: number): string => (count === 1 ? 'Modul' : 'Module'),
  },
  module: {
    unnamed: 'Unbenanntes Modul',
    nameLabel: 'Modulname',
    additionalTitle:
      'Eine Zusatzleistung, die weder in die Leistungspunkte noch in die Note eingeht',
    weightLabel: (name?: string) => (name ? `Gewichtung von ${name}` : 'Gewichtung dieses Moduls'),
    fixedWeightTitle: 'Die Gewichtung in der Endnote laut Prüfungsordnung',
    weightHint:
      'Gib die Gewichtung dieses Moduls ein, z. B. 2.0, um es doppelt zu zählen, ' +
      'oder 0.0, um es nicht zu zählen',
    eliminate: (name?: string) => (name ? `${name} streichen` : 'Dieses Modul streichen'),
    staysEliminated: (name?: string) =>
      `${name ?? 'Dieses Modul'} bleibt gestrichen, weil seine Note unbekannt ist. ` +
      'Gib die Note ein, um das zu ändern.',
    gradeLabel: (name?: string) => (name ? `Note von ${name}` : 'Note dieses Moduls'),
    markPassed: (name?: string) =>
      name ? `${name} als bestanden markieren` : 'Dieses Modul als bestanden markieren',
    creditsLabel: (name?: string) =>
      name ? `Leistungspunkte von ${name}` : 'Leistungspunkte dieses Moduls',
    creditsHint: 'Gib die Leistungspunkte ein',
    markAdditional: (name?: string) =>
      `${name ?? 'Dieses Modul'} als Zusatzleistung markieren, ` +
      'die weder in die Leistungspunkte noch in die Note eingeht',
    passFail: (name?: string) => `${name ?? 'Dieses Modul'} nur bestehen, ohne Note (unbenotet)`,
    remove: (name?: string) => (name ? `${name} entfernen` : 'Dieses Modul entfernen'),
  },
  editableText: {
    /** Read by screen readers after the text, e.g. "Programming, edit module name". */
    edit: (label: string) => `, ${label} bearbeiten`,
  },
  grade: {
    /** Shown for a grade that isn't known yet. */
    tbd: 'offen',
    hint: (min: string, max: string) => `Gib eine Note zwischen ${min} und ${max} ein`,
  },
};

export default de;
