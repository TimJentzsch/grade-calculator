export default class ModuleDisplayView {
  constructor(module, onChange, onRemove, onEdit) {
    this.module = module;
    this.onChange = onChange;
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

    if (this.module.isGraded) {
      gradeContainer.appendChild(this.createIsEliminatedInput());
      gradeContainer.appendChild(this.createGradeSelection());
    } else {
      gradeContainer.appendChild(this.createHasPassedInput());
    }

    return gradeContainer;
  }

  createIsEliminatedInput() {
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

    isEliminatedInput.addEventListener('change', () => {
      this.module.eliminated = this.isEliminatedInput.checked;
      this.onChange();
    });

    this.isEliminatedInput = isEliminatedInput;
    isEliminatedLabel.appendChild(isEliminatedInput);

    return isEliminatedLabel;
  }

  createHasPassedInput() {
    // <label>Passed: <input type="checkbox" checked="true" /></label>
    const hasPassedLabel = document.createElement('label');
    hasPassedLabel.classList.add('label', 'has-passed-label', 'module-has-passed-label');
    hasPassedLabel.appendChild(document.createTextNode('Passed: '));
    this.hasPassed = hasPassedLabel;

    const hasPassedInput = document.createElement('input');
    hasPassedInput.classList.add('checkbox', 'has-passed-input');
    hasPassedInput.name = 'has-passed-input';
    hasPassedInput.type = 'checkbox';
    hasPassedInput.checked = this.module.passed;

    hasPassedInput.addEventListener('change', () => {
      this.module.passed = this.hasPassedInput.checked;
      this.onChange();
    });

    this.hasPassedInput = hasPassedInput;
    hasPassedLabel.appendChild(hasPassedInput);

    return hasPassedLabel;
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

  createGradeSelection() {
    const gradeSelection = document.createElement('select');
    gradeSelection.classList.add('selection', 'grade-selection', 'module-grade-selection');
    gradeSelection.name = 'grade-selection';
    gradeSelection.addEventListener('change', () => {
      this.module.grade =
        this.gradeSelection.value === 'TBD' ? undefined : this.gradeSelection.value;
      this.onChange();
    });

    this.gradeSelection = gradeSelection;

    const optionTBD = document.createElement('option');
    optionTBD.classList.add('select-option');
    optionTBD.value = 'TBD';
    optionTBD.innerHTML = 'TBD';
    gradeSelection.appendChild(optionTBD);

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

    gradeSelection.value = this.module.grade || 'TBD';

    return gradeSelection;
  }
}
