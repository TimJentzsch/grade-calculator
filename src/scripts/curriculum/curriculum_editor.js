export default class CurriculumEditorHeader {
  constructor(curriculum, onSave, onDiscard) {
    this.curriculum = curriculum;
    this.onSave = onSave;
    this.onDiscard = onDiscard;
  }

  createHeader() {
    const header = document.createElement('div');
    header.classList.add('curriculum-edit-header', 'edit-header');

    header.appendChild(this.createInput());
    header.appendChild(this.createControls());

    this.header = header;

    return header;
  }

  createInput() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    inputContainer.appendChild(this.createNameInput());
    inputContainer.appendChild(this.createEliminationInput());

    this.inputContainer = inputContainer;

    return inputContainer;
  }

  createNameInput() {
    // <label>Name: <input name="name-input" type="text" placeholder="Module area name..." /></label>
    const nameInputLabel = document.createElement('label');
    nameInputLabel.classList.add('label', 'name-label');
    nameInputLabel.appendChild(document.createTextNode('Name: '));
    this.nameInputLabel = nameInputLabel;

    const nameInput = document.createElement('input');
    nameInput.classList.add('input', 'name-input');
    nameInput.name = 'name-input';
    nameInput.type = 'text';
    nameInput.size = 40;
    nameInput.placeholder = 'Curriculum name...';
    if (this.curriculum.name) {
      nameInput.value = this.curriculum.name;
    }
    this.nameInput = nameInput;
    nameInputLabel.appendChild(nameInput);

    return nameInputLabel;
  }

  createEliminationInput() {
    const eliminationContainer = document.createElement('div');
    eliminationContainer.classList.add('elimination-input-container');
    eliminationContainer.innerText = 'Elimination: ';
    this.eliminationContainer = eliminationContainer;

    eliminationContainer.appendChild(this.createEliminationCountInput());
    eliminationContainer.appendChild(this.createEliminationCPInput());

    return eliminationContainer;
  }

  createEliminationCountInput() {
    const eliminationCountLabel = document.createElement('label');
    eliminationCountLabel.classList.add('elimination-count-label');
    eliminationCountLabel.innerText = 'Limited count: ';
    this.eliminationCountLabel = eliminationCountLabel;

    // Checkbox
    const eliminationCountLimited = document.createElement('input');
    eliminationCountLimited.classList.add('checkbox', 'elimination-count-checkbox');
    eliminationCountLimited.name = 'elimination-count-checkbox';
    eliminationCountLimited.type = 'checkbox';
    eliminationCountLimited.checked = this.curriculum.eliminationLimit !== undefined;
    eliminationCountLimited.addEventListener('click', () => {
      this.eliminationCountInput.disabled = !this.eliminationCountLimited.checked;
    });
    eliminationCountLabel.appendChild(eliminationCountLimited);
    this.eliminationCountLimited = eliminationCountLimited;

    // Limit input
    const eliminationCountInput = document.createElement('input');
    eliminationCountInput.classList.add('input', 'elimination-count-input');
    eliminationCountInput.name = 'elimination-count-input';
    eliminationCountInput.type = 'number';
    eliminationCountInput.step = 1;
    eliminationCountInput.min = 0;
    eliminationCountInput.placeholder = '0';
    eliminationCountInput.size = 2;
    eliminationCountInput.value = this.curriculum.eliminationCountLimit || 0;
    eliminationCountInput.disabled = !eliminationCountLimited.checked;
    this.eliminationCountInput = eliminationCountInput;
    eliminationCountLabel.appendChild(eliminationCountInput);

    return eliminationCountLabel;
  }

  createEliminationCPInput() {
    const eliminationCPLabel = document.createElement('label');
    eliminationCPLabel.classList.add('elimination-´cp-label');
    eliminationCPLabel.innerText = ' Limited credits: ';
    this.eliminationCPLabel = eliminationCPLabel;

    // Checkbox
    const eliminationCPLimited = document.createElement('input');
    eliminationCPLimited.classList.add('checkbox', 'elimination-cp-checkbox');
    eliminationCPLimited.name = 'elimination-cp-checkbox';
    eliminationCPLimited.type = 'checkbox';
    eliminationCPLimited.checked = this.curriculum.eliminationCPLimit !== undefined;
    eliminationCPLimited.addEventListener('click', () => {
      this.eliminationCPInput.disabled = !this.eliminationCPLimited.checked;
    });
    eliminationCPLabel.appendChild(eliminationCPLimited);
    this.eliminationCPLimited = eliminationCPLimited;

    // Limit input
    const eliminationCPInput = document.createElement('input');
    eliminationCPInput.classList.add('input', 'elimination-cp-input');
    eliminationCPInput.name = 'elimination-cp-input';
    eliminationCPInput.type = 'number';
    eliminationCPInput.step = 1;
    eliminationCPInput.min = 0;
    eliminationCPInput.placeholder = '0';
    eliminationCPInput.size = 2;
    eliminationCPInput.value = this.curriculum.eliminationCPLimit || 0;
    eliminationCPInput.disabled = !eliminationCPLimited.checked;
    this.eliminationCPInput = eliminationCPInput;
    eliminationCPLabel.appendChild(eliminationCPInput);

    return eliminationCPLabel;
  }

  createControls() {
    this.controls = document.createElement('div');
    this.controls.classList.add('controls-container');

    this.controls.appendChild(this.createSaveButton());
    this.controls.appendChild(this.createDiscardButton());

    return this.controls;
  }

  createSaveButton() {
    this.saveButton = document.createElement('button');
    this.saveButton.classList.add('save-button', 'control-button');
    this.saveButton.innerHTML = '&#x2714;&#xFE0E;';
    this.saveButton.title = 'Save the changes';

    this.saveButton.addEventListener('click', () => this.onSave());

    return this.saveButton;
  }

  createDiscardButton() {
    this.discardButton = document.createElement('button');
    this.discardButton.classList.add('discard-button', 'control-button');
    this.discardButton.innerHTML = '&#x1F5D9;&#xFE0E;';
    this.discardButton.title = 'Discard the changes';

    this.discardButton.addEventListener('click', () => this.onDiscard());

    return this.discardButton;
  }

  save() {
    const { curriculum } = this;

    curriculum.name = this.nameInput.value;
    curriculum.eliminationLimit = this.eliminationCountLimited.checked
      ? this.eliminationCountInput.value
      : undefined;
    curriculum.eliminationCPLimit = this.eliminationCPLimited.checked
      ? this.eliminationCPInput.value
      : undefined;

    this.curriculum = curriculum;
    return curriculum;
  }
}
