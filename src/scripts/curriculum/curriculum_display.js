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
    const title = document.createElement('h2');
    title.classList.add('curriculum-title');
    this.title = title;

    return title;
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
    this.title.innerHTML = this.curriculum.name;

    // Update credits
    this.creditValue.innerHTML = this.curriculum.credits;

    // Update grade
    const { gradeText, eliminationGradeText } = this.curriculum;
    this.gradeValue.innerHTML = eliminationGradeText;

    const bestGrade = this.curriculum.bestCase().eliminationGradeText;
    const worstGrade = this.curriculum.worstCase().eliminationGradeText;

    if (gradeText !== bestGrade || gradeText !== worstGrade) {
      this.gradeLimits.innerHTML = ` (${bestGrade}-${worstGrade})`;
    } else {
      this.gradeLimits.innerHTML = '';
    }
    if (gradeText !== eliminationGradeText) {
      this.eliminatedGradeValue.innerText = gradeText;
    } else {
      this.eliminatedGradeValue.innerText = '';
    }
  }
}
