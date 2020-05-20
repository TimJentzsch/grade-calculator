export default class CurriculumDisplayHeader {
  constructor(curriculum, onAdd, onEdit) {
    this.curriculum = curriculum;
    this.onAdd = onAdd;
    this.onEdit = onEdit;
  }

  createHeader() {
    const header = document.createElement('div');
    header.classList.add('curriculum-header', 'header');
    this.header = header;

    header.appendChild(this.createTitle());
    header.appendChild(this.createData());

    return header;
  }

  createData() {
    this.data = document.createElement('div');
    this.data.classList.add('info-container');

    this.data.appendChild(this.createInfo());
    this.data.appendChild(this.createControls());

    return this.data;
  }

  createTitle() {
    const title = document.createElement('div');
    title.classList.add('curriculum-title', 'title-container');
    this.title = title;

    title.appendChild(this.createName());
    title.appendChild(this.createElimination());

    return title;
  }

  createName() {
    this.name = document.createElement('h3');
    this.name.classList.add('curriculum-name');

    return this.name;
  }

  createElimination() {
    const elimination = document.createElement('div');
    elimination.classList.add('curriculum-elimination', 'elimination-container');
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

  createInfo() {
    const info = document.createElement('div');
    info.classList.add('info-container');
    this.info = info;

    info.appendChild(this.createCredits());
    info.appendChild(this.createGrade());

    return info;
  }

  createGrade() {
    const gradeContainer = document.createElement('div');
    gradeContainer.classList.add('curriculum-grade-container', 'grade-container');
    this.gradeContainer = gradeContainer;

    const eliminatedGradeValue = document.createElement('span');
    eliminatedGradeValue.classList.add('module-area-eliminated-grade-value', 'grade', 'eliminated');
    eliminatedGradeValue.title = 'The grade before elimination';
    gradeContainer.appendChild(eliminatedGradeValue);
    this.eliminatedGradeValue = eliminatedGradeValue;

    const gradeValue = document.createElement('span');
    gradeValue.classList.add('curriculum-grade-value', 'grade-value', 'grade');
    gradeValue.title = 'The current grade of this curriculum';
    gradeContainer.appendChild(gradeValue);
    this.gradeValue = gradeValue;

    const gradeLimits = document.createElement('span');
    gradeLimits.classList.add('curriculum-grade-limits', 'grade-limits', 'grade');
    gradeLimits.title = 'The best/worst possible grade in this curriculum';
    gradeContainer.appendChild(gradeLimits);
    this.gradeLimits = gradeLimits;

    return gradeContainer;
  }

  createCredits() {
    const creditsContainer = document.createElement('div');
    creditsContainer.classList.add('curriculum-credits-container', 'credits-container');
    creditsContainer.title = 'The total credit points of this curriculum';
    this.creditsContainer = creditsContainer;

    const creditValue = document.createElement('span');
    creditValue.classList.add('curriculum-credits-value');
    creditsContainer.appendChild(creditValue);
    this.creditValue = creditValue;

    const creditDescription = document.createElement('span');
    creditDescription.classList.add('curriculum-credits-description');
    creditDescription.innerHTML = ' CP';
    creditsContainer.appendChild(creditDescription);
    this.creditDescription = creditDescription;

    return creditsContainer;
  }

  createControls() {
    const controls = document.createElement('div');
    controls.classList.add('controls-container');

    controls.appendChild(this.createAddButton());
    controls.appendChild(this.createEditButton());

    this.controls = controls;

    return controls;
  }

  createAddButton() {
    const addButton = document.createElement('button');
    addButton.classList.add('add-button', 'control-button');
    addButton.innerHTML = '&#x2795;&#xFE0E;';
    addButton.title = 'Add a new module area';

    addButton.addEventListener('click', () => this.onAdd());
    this.addButton = addButton;

    return addButton;
  }

  createEditButton() {
    const editButton = document.createElement('button');
    editButton.classList.add('edit-button', 'control-button');
    editButton.innerHTML = '&#9998;&#xFE0E;';
    editButton.title = 'Edit this curriculum';

    editButton.addEventListener('click', () => this.onEdit());
    this.editButton = editButton;

    return editButton;
  }

  updateView() {
    // Update title
    this.name.innerText = this.curriculum.name;

    // Update credits
    this.creditValue.innerText = this.curriculum.credits;

    // Update grade
    const { gradeText, eliminationGradeText } = this.curriculum;
    this.gradeValue.innerText = eliminationGradeText;

    const bestGrade = this.curriculum.bestCase().eliminationGradeText;
    const worstGrade = this.curriculum.worstCase().eliminationGradeText;

    if (gradeText !== bestGrade || gradeText !== worstGrade) {
      this.gradeLimits.innerText = ` (${bestGrade}-${worstGrade})`;
    } else {
      this.gradeLimits.innerText = '';
    }
    if (gradeText !== eliminationGradeText) {
      this.eliminatedGradeValue.innerText = gradeText;
    } else {
      this.eliminatedGradeValue.innerText = '';
    }

    // Update elimination
    const { eliminationLimit, eliminationCPLimit } = this.curriculum;

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
