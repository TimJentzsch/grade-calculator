export default class ModuleAreaDisplayView {
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
    this.title = document.createElement('h3');
    this.title.classList.add('module-area-title');

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

    this.createCredits();
    this.createGrade();

    return this.info;
  }

  createGrade() {
    this.gradeContainer = document.createElement('div');
    this.gradeContainer.classList.add('module-area-grade-container', 'grade-container');

    this.gradeValue = document.createElement('span');
    this.gradeValue.classList.add('module-area-grade-value', 'grade-value', 'grade');
    this.gradeValue.title = 'The current grade of this module area';
    this.gradeContainer.appendChild(this.gradeValue);

    this.gradeLimits = document.createElement('span');
    this.gradeLimits.classList.add('module-area-grade-limits', 'grade-limits', 'grade');
    this.gradeLimits.title = 'The best/worst possible grade in this module area';
    this.gradeContainer.appendChild(this.gradeLimits);

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
}
