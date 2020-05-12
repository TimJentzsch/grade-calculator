export default class ModuleAreaEditorView {
  constructor(moduleArea, onSave, onDiscard) {
    this.moduleArea = moduleArea;
    this.onSave = onSave;
    this.onDiscard = onDiscard;
  }

  createHeader() {
    const header = document.createElement('div');
    header.classList.add('module-area-edit-header', 'edit-header');

    header.appendChild(this.createInput());
    header.appendChild(this.createControls());

    this.header = header;

    return header;
  }

  createInput() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    inputContainer.appendChild(this.createNameInput());

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
    nameInput.placeholder = 'Module area name...';
    if (this.moduleArea.name) {
      nameInput.value = this.moduleArea.name;
    }
    this.nameInput = nameInput;
    nameInputLabel.appendChild(nameInput);

    return nameInputLabel;
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
    const { moduleArea } = this;
    moduleArea.name = this.nameInput.value;
    this.moduleArea = moduleArea;
    return moduleArea;
  }
}
