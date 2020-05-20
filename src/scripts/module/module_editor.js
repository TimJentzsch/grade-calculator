export default class ModuleEditView {
  constructor(module, onSave, onDiscard) {
    this.module = module;
    this.onSave = onSave;
    this.onDiscard = onDiscard;
  }

  createElement() {
    const element = document.createElement('div');
    element.classList.add('module-edit-container', 'module-container');

    element.appendChild(this.createInput());
    element.appendChild(this.createControls());

    this.element = element;

    return element;
  }

  createInput() {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container', 'module-input-container');

    inputContainer.appendChild(this.createNameInput());
    inputContainer.appendChild(this.createCreditsInput());
    inputContainer.appendChild(this.createIsGradedInput());
    inputContainer.appendChild(this.createHasCompletedInput());
    inputContainer.appendChild(this.createGradeSelection());
    inputContainer.appendChild(this.createIsEliminatedInput());
    inputContainer.appendChild(this.createWeightInput());

    this.updateGradeStatus();

    this.inputContainer = inputContainer;

    return inputContainer;
  }

  createNameInput() {
    // <label>Name: <input name="name-input" type="text" placeholder="Module name..." /></label>
    const nameInputLabel = document.createElement('label');
    nameInputLabel.classList.add('label', 'name-label', 'module-name-label');
    nameInputLabel.appendChild(document.createTextNode('Name: '));
    this.nameInputLabel = nameInputLabel;

    const nameInput = document.createElement('input');
    nameInput.classList.add('input', 'name-input');
    nameInput.name = 'name-input';
    nameInput.type = 'text';
    nameInput.size = 40;
    nameInput.placeholder = 'Module name...';
    if (this.module.name) {
      nameInput.value = this.module.name;
    }
    this.nameInput = nameInput;
    nameInputLabel.appendChild(nameInput);

    return nameInputLabel;
  }

  createCreditsInput() {
    // <label>Credits: <input name="credits-input" type="number" step="1" min="0" placeholder="CP" size="2"/></label>
    const creditsInputLabel = document.createElement('label');
    creditsInputLabel.classList.add('label', 'credits-label', 'module-credits-label');
    creditsInputLabel.appendChild(document.createTextNode('Credits: '));
    this.creditsInputLabel = creditsInputLabel;

    const creditsInput = document.createElement('input');
    creditsInput.classList.add('input', 'credits-input');
    creditsInput.name = 'credits-input';
    creditsInput.type = 'number';
    creditsInput.step = 1;
    creditsInput.min = 0;
    creditsInput.placeholder = 'CP';
    creditsInput.size = 2;
    if (this.module.credits) {
      creditsInput.value = this.module.credits;
    }
    this.creditsInput = creditsInput;
    creditsInputLabel.appendChild(creditsInput);

    return creditsInputLabel;
  }

  createWeightInput() {
    // <label>Weight: <input name="weight-input" type="number" inputmode="numeric" step="0.1" min="0" placeholder="Weight" value="1.0" size="3"/></label>
    const weightInputLabel = document.createElement('label');
    weightInputLabel.classList.add('label', 'weight-label', 'module-weight-label');
    weightInputLabel.appendChild(document.createTextNode('Weight: '));
    this.weightInputLabel = weightInputLabel;

    const weightInput = document.createElement('input');
    weightInput.classList.add('input', 'credits-input');
    weightInput.name = 'credits-input';
    weightInput.type = 'number';
    weightInput.step = 0.1;
    weightInput.min = 0;
    weightInput.placeholder = 'CP';
    weightInput.size = 3;
    weightInput.value = this.module.weight === undefined ? 1 : this.module.weight;

    this.weightInput = weightInput;
    weightInputLabel.appendChild(weightInput);

    return weightInputLabel;
  }

  createIsGradedInput() {
    // <label>Graded: <input type="checkbox" checked="true" /></label>
    const isGradedLabel = document.createElement('label');
    isGradedLabel.classList.add('label', 'is-graded-label', 'module-is-graded-label');
    isGradedLabel.appendChild(document.createTextNode('Graded: '));
    this.isGradedLabel = isGradedLabel;

    const isGradedInput = document.createElement('input');
    isGradedInput.classList.add('checkbox', 'is-graded-input');
    isGradedInput.name = 'is-graded-input';
    isGradedInput.type = 'checkbox';
    isGradedInput.checked = this.module.isGraded;
    isGradedInput.addEventListener('click', () => this.updateGradeStatus());

    this.isGradedInput = isGradedInput;
    isGradedLabel.appendChild(isGradedInput);

    return isGradedLabel;
  }

  createHasCompletedInput() {
    // <label>Completed: <input type="checkbox" checked="true" /></label>
    const hasCompletedLabel = document.createElement('label');
    hasCompletedLabel.classList.add('label', 'has-completed-label', 'module-has-completed-label');
    hasCompletedLabel.appendChild(document.createTextNode('Completed: '));
    this.hasCompleted = hasCompletedLabel;

    const hasCompletedInput = document.createElement('input');
    hasCompletedInput.classList.add('checkbox', 'has-completed-input');
    hasCompletedInput.name = 'has-completed-input';
    hasCompletedInput.type = 'checkbox';
    hasCompletedInput.checked = this.module.completed;
    hasCompletedInput.addEventListener('click', () => this.updateGradeStatus());

    this.hasCompletedInput = hasCompletedInput;
    hasCompletedLabel.appendChild(hasCompletedInput);

    return hasCompletedLabel;
  }

  createIsEliminatedInput() {
    console.debug('Creating Eliminated Input');
    // <label>Eliminated: <input type="checkbox" checked="true" /></label>
    const isEliminatedLabel = document.createElement('label');
    isEliminatedLabel.classList.add('label', 'is-eliminated-label', 'module-is-eliminated-label');
    isEliminatedLabel.appendChild(document.createTextNode('Eliminated: '));
    this.isEliminated = isEliminatedLabel;

    const isEliminatedInput = document.createElement('input');
    isEliminatedInput.classList.add('checkbox', 'is-eliminated-input');
    isEliminatedInput.name = 'is-eliminated-input';
    isEliminatedInput.type = 'checkbox';
    isEliminatedInput.checked = this.module.eliminated;

    this.isEliminatedInput = isEliminatedInput;
    isEliminatedLabel.appendChild(isEliminatedInput);

    return isEliminatedLabel;
  }

  updateGradeStatus() {
    const { gradeSelectionLabel, gradeSelection, isEliminated, isEliminatedInput } = this;

    if (this.isGradedInput.checked && this.hasCompletedInput.checked) {
      gradeSelection.disabled = false;
      isEliminatedInput.disabled = false;
      gradeSelectionLabel.classList.remove('disabled');
      isEliminated.classList.remove('disabled');
    } else {
      gradeSelection.disabled = true;
      isEliminatedInput.disabled = true;
      gradeSelectionLabel.classList.add('disabled');
      isEliminated.classList.add('disabled');
    }
  }

  createGradeSelection() {
    const gradeSelectionLabel = document.createElement('label');
    gradeSelectionLabel.classList.add(
      'label',
      'grade-selection-label',
      'module-grade-selection-label',
    );
    gradeSelectionLabel.appendChild(document.createTextNode('Grade: '));
    this.gradeSelectionLabel = gradeSelectionLabel;

    const gradeSelection = document.createElement('select');
    gradeSelection.classList.add('selection', 'grade-selection');
    gradeSelection.name = 'grade-selection';

    this.gradeSelection = gradeSelection;
    gradeSelectionLabel.appendChild(gradeSelection);

    const option10 = document.createElement('option');
    option10.classList.add('select-option');
    option10.value = 1.0;
    option10.innerHTML = '1.0';
    gradeSelection.appendChild(option10);

    const option13 = document.createElement('option');
    option13.classList.add('select-option');
    option13.value = 1.3;
    option13.innerHTML = '1.3';
    gradeSelection.appendChild(option13);

    const option17 = document.createElement('option');
    option17.classList.add('select-option');
    option17.value = 1.7;
    option17.innerHTML = '1.7';
    gradeSelection.appendChild(option17);

    const option20 = document.createElement('option');
    option20.classList.add('select-option');
    option20.value = 2.0;
    option20.innerHTML = '2.0';
    gradeSelection.appendChild(option20);

    const option23 = document.createElement('option');
    option23.classList.add('select-option');
    option23.value = 2.3;
    option23.innerHTML = '2.3';
    gradeSelection.appendChild(option23);

    const option27 = document.createElement('option');
    option27.classList.add('select-option');
    option27.value = 2.7;
    option27.innerHTML = '2.7';
    gradeSelection.appendChild(option27);

    const option30 = document.createElement('option');
    option30.classList.add('select-option');
    option30.value = 3.0;
    option30.innerHTML = '3.0';
    gradeSelection.appendChild(option30);

    const option33 = document.createElement('option');
    option33.classList.add('select-option');
    option33.value = 3.3;
    option33.innerHTML = '3.3';
    gradeSelection.appendChild(option33);

    const option37 = document.createElement('option');
    option37.classList.add('select-option');
    option37.value = 3.7;
    option37.innerHTML = '3.7';
    gradeSelection.appendChild(option37);

    const option40 = document.createElement('option');
    option40.classList.add('select-option');
    option40.value = 4.0;
    option40.innerHTML = '4.0';
    gradeSelection.appendChild(option40);

    if (this.module.grade) {
      gradeSelection.value = this.module.grade;
    }

    return gradeSelectionLabel;
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
    const { module } = this;

    module.name = this.nameInput.value;
    module.credits = this.creditsInput.valueAsNumber;
    module.weight = this.weightInput.valueAsNumber;
    module.isGraded = this.isGradedInput.checked;

    const completed = this.hasCompletedInput.checked;

    if (completed) {
      if (module.isGraded) {
        module.grade = Number(this.gradeSelection.value);
        module.eliminated = this.isEliminatedInput.checked;
        module.passed = undefined;
      } else {
        module.grade = undefined;
        module.eliminated = undefined;
        module.passed = true;
      }
    } else {
      module.passed = undefined;
      module.eliminated = undefined;
      module.grade = undefined;
    }

    this.module = module;
    return module;
  }
}
