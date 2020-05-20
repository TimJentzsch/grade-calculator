export default class ModuleDisplayView {
  constructor(module, onRemove, onEdit) {
    this.module = module;
    this.onRemove = onRemove;
    this.onEdit = onEdit;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('module-display-container', 'module-container');

    this.element.appendChild(this.createTitle());
    this.element.appendChild(this.createData());

    return this.element;
  }

  createTitle() {
    this.title = document.createElement('span');
    this.title.classList.add('module-title');
    this.title.innerHTML = this.module.name;

    return this.title;
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

    this.info.appendChild(this.createWeight());
    this.info.appendChild(this.createGrade());
    this.info.appendChild(this.createCredits());

    return this.info;
  }

  createWeight() {
    const weightValue = document.createElement('span');
    weightValue.classList.add('module-weight-value', 'weight-value');
    if (this.module.weight !== 1) {
      weightValue.innerHTML = `&#xd7;&#xFE0E;${this.module.weight.toFixed(1)}`;
    }
    weightValue.title = 'The weighting of this module';
    this.weightValue = weightValue;

    return weightValue;
  }

  createCredits() {
    this.creditsContainer = document.createElement('div');
    this.creditsContainer.classList.add('module-credits-container', 'credits-container');
    this.creditsContainer.title = 'The credit points of this module';

    this.creditValue = document.createElement('span');
    this.creditValue.classList.add('module-credits-value');
    this.creditValue.innerHTML = this.module.credits;
    this.creditsContainer.appendChild(this.creditValue);

    this.creditDescription = document.createElement('span');
    this.creditDescription.classList.add('module-credits-description');
    this.creditDescription.innerHTML = ' CP';
    this.creditsContainer.appendChild(this.creditDescription);

    return this.creditsContainer;
  }

  createGrade() {
    const gradeContainer = document.createElement('div');
    gradeContainer.classList.add('module-grade-container', 'grade-container');
    this.gradeContainer = gradeContainer;

    const { gradeText } = this.module;
    const { eliminationGradeText } = this.module;

    const eliminatedGradeValue = document.createElement('span');
    eliminatedGradeValue.classList.add('module-eliminated-grade-value', 'grade', 'eliminated');
    eliminatedGradeValue.title = 'The grade before elimination';
    if (gradeText !== eliminationGradeText) {
      eliminatedGradeValue.innerText = gradeText;
    }
    gradeContainer.appendChild(eliminatedGradeValue);
    this.eliminatedGradeValue = eliminatedGradeValue;

    const gradeValue = document.createElement('span');
    gradeValue.classList.add('module-grade-value', 'grade-value', 'grade');
    gradeValue.title = 'The current grade of this module';
    gradeValue.innerText = eliminationGradeText;
    gradeContainer.appendChild(gradeValue);
    this.gradeValue = gradeValue;

    return gradeContainer;
  }

  createControls() {
    const controls = document.createElement('div');
    controls.classList.add('controls-container');
    this.controls = controls;

    controls.appendChild(this.createEditButton());
    controls.appendChild(this.createRemoveButton());

    return this.controls;
  }

  createEditButton() {
    const editButton = document.createElement('button');
    editButton.classList.add('edit-button', 'control-button');
    editButton.innerHTML = '&#9998;&#xFE0E;';
    editButton.title = 'Edit this module';

    editButton.addEventListener('click', () => this.onEdit());
    this.editButton = editButton;

    return editButton;
  }

  createRemoveButton() {
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-button', 'control-button');
    removeButton.innerHTML = '&#x1F5D9;&#xFE0E;';
    removeButton.title = 'Remove this module';

    removeButton.addEventListener('click', () => this.onRemove());
    this.removeButton = removeButton;

    return removeButton;
  }
}
