// eslint-disable-next-line no-unused-vars
import ModuleArea from './module_area.js';

export default class ModuleAreaDisplayView {
  /**
   * Creates a new module area display view.
   * @param {ModuleArea} moduleArea - The module area to display.
   * @param {*} onChange - The event to execute on change.
   * @param {*} onAdd - The event to execute on module addition.
   * @param {*} onRemove - The event to execute on module removal.
   * @param {*} onEdit - The event to execute on edits.
   */
  constructor(moduleArea, onChange, onAdd, onRemove, onEdit) {
    this.moduleArea = moduleArea;
    this.onChange = onChange;
    this.onAdd = onAdd;
    this.onRemove = onRemove;
    this.onEdit = onEdit;
  }

  createHeader() {
    this.header = document.createElement('div');
    this.header.classList.add('module-area-display-header', 'header');

    this.header.appendChild(this.createTitle());
    this.header.appendChild(this.createData());

    return this.header;
  }

  createTitle() {
    const title = document.createElement('div');
    title.classList.add('module-area-title', 'title-container');
    this.title = title;

    title.appendChild(this.createName());
    title.appendChild(this.createElimination());

    return title;
  }

  createName() {
    this.name = document.createElement('h3');
    this.name.classList.add('module-area-name');

    return this.name;
  }

  createElimination() {
    const elimination = document.createElement('div');
    elimination.classList.add('module-area-elimination', 'elimination-container');
    this.elimination = elimination;

    const eliminationDescription = document.createElement('span');
    eliminationDescription.classList.add('elimination-description');
    elimination.appendChild(eliminationDescription);
    this.eliminationDescription = eliminationDescription;

    const eliminationCount = document.createElement('span');
    eliminationCount.classList.add('elimination-count');
    elimination.appendChild(eliminationCount);
    this.eliminationCount = eliminationCount;

    const eliminationSeperator = document.createElement('span');
    eliminationSeperator.classList.add('elimination-seperator');
    elimination.appendChild(eliminationSeperator);
    this.eliminationSeperator = eliminationSeperator;

    const eliminationCPs = document.createElement('span');
    eliminationCPs.classList.add('elimination-cps');
    elimination.appendChild(eliminationCPs);
    this.eliminationCPs = eliminationCPs;

    return elimination;
  }

  createData() {
    this.data = document.createElement('div');
    this.data.classList.add('info-container');

    this.data.appendChild(this.createInfo());
    this.data.appendChild(this.createControls());

    return this.data;
  }

  createInfo() {
    this.info = document.createElement('div');
    this.info.classList.add('info-container');

    this.createCredits();
    this.createGrade();

    return this.info;
  }

  createGrade() {
    const gradeContainer = document.createElement('div');
    gradeContainer.classList.add('module-area-grade-container', 'grade-container');
    this.gradeContainer = gradeContainer;

    const eliminatedGradeValue = document.createElement('span');
    eliminatedGradeValue.classList.add('module-area-eliminated-grade-value', 'grade', 'eliminated');
    eliminatedGradeValue.title = 'The grade before elimination';
    gradeContainer.appendChild(eliminatedGradeValue);
    this.eliminatedGradeValue = eliminatedGradeValue;

    const gradeValue = document.createElement('span');
    gradeValue.classList.add('module-area-grade-value', 'grade-value', 'grade');
    gradeValue.title = 'The current grade of this module area';
    gradeContainer.appendChild(gradeValue);
    this.gradeValue = gradeValue;

    const gradeLimits = document.createElement('span');
    gradeLimits.classList.add('module-area-grade-limits', 'grade-limits', 'grade');
    gradeLimits.title = 'The best/worst possible grade in this module area';
    gradeContainer.appendChild(gradeLimits);
    this.gradeLimits = gradeLimits;

    this.info.appendChild(this.gradeContainer);
  }

  createCredits() {
    this.creditsContainer = document.createElement('div');
    this.creditsContainer.classList.add('module-area-credits-container', 'credits-container');
    this.creditsContainer.title = 'The total credit points of this module area';

    this.creditValue = document.createElement('span');
    this.creditValue.classList.add('module-area-credits-value');
    this.creditsContainer.appendChild(this.creditValue);

    this.creditDescription = document.createElement('span');
    this.creditDescription.classList.add('module-area-credits-description');
    this.creditDescription.innerHTML = ' CP';
    this.creditsContainer.appendChild(this.creditDescription);

    this.info.appendChild(this.creditsContainer);
  }

  createControls() {
    const controls = document.createElement('div');
    controls.classList.add('controls-container');

    controls.appendChild(this.createAddButton());
    controls.appendChild(this.createEditButton());
    controls.appendChild(this.createRemoveButton());

    this.controls = controls;

    return controls;
  }

  createAddButton() {
    const addButton = document.createElement('button');
    addButton.classList.add('add-button', 'control-button');
    addButton.innerHTML = '&#x2795;&#xFE0E;';
    addButton.title = 'Add a new module';

    addButton.addEventListener('click', () => this.onAdd());
    this.addButton = addButton;

    return addButton;
  }

  createEditButton() {
    const editButton = document.createElement('button');
    editButton.classList.add('edit-button', 'control-button');
    editButton.innerHTML = '&#9998;&#xFE0E;';
    editButton.title = 'Edit this module area';

    editButton.addEventListener('click', () => this.onEdit());
    this.editButton = editButton;

    return editButton;
  }

  createRemoveButton() {
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-button', 'control-button');
    removeButton.innerHTML = '&#x1F5D9;&#xFE0E;';
    removeButton.title = 'Remove this module area';

    removeButton.addEventListener('click', () => this.onRemove());
    this.removeButton = removeButton;

    return removeButton;
  }

  updateView() {
    // Update name
    this.name.innerText = this.moduleArea.name;

    // Update credits
    this.creditValue.innerText = this.moduleArea.credits;

    // Update grade
    const { gradeText, eliminationGradeText } = this.moduleArea;
    this.gradeValue.innerText = eliminationGradeText;

    const bestGrade = this.moduleArea.bestCase().eliminationGradeText;
    const worstGrade = this.moduleArea.worstCase().eliminationGradeText;

    if (bestGrade !== gradeText || worstGrade !== gradeText) {
      this.gradeLimits.innerText = `(${bestGrade}-${worstGrade})`;
    } else {
      this.gradeLimits.innerText = '';
    }
    if (gradeText !== eliminationGradeText) {
      this.eliminatedGradeValue.innerText = gradeText;
    } else {
      this.eliminatedGradeValue.innerText = '';
    }

    // Update elimination
    const { eliminationLimit, eliminationCPLimit } = this.moduleArea;

    if (eliminationLimit === 0 || eliminationCPLimit === 0) {
      // No elimination allowed
      this.eliminationDescription.innerText = 'No elimination allowed';
    } else {
      // Elimination allowed
      this.eliminationDescription.innerText =
        eliminationLimit || eliminationCPLimit ? 'Max. eliminations: ' : '';
      // Elimination count limit
      this.eliminationCount.innerText = eliminationLimit || '';
      // Seperator
      this.eliminationSeperator.innerText = eliminationLimit && eliminationCPLimit ? ' / ' : '';
      // Elimination CP limit
      this.eliminationCPs.innerText = eliminationCPLimit ? `${eliminationCPLimit} CPs` : '';
    }
  }
}
