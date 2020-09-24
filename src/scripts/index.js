import Curriculum from './curriculum/curriculum.js';
import CurriculumView from './curriculum/curriculum_view.js';
import TemplateView from '../templates/template_view.js';
import getBestElimination from './elimination.js';

/** @type {CurriculumView} */
let curriculumView;

function displayNewCurriculum() {
  const newCurriculum = new Curriculum(undefined, []);
  curriculumView = new CurriculumView('curriculum', newCurriculum);
  curriculumView.createEditor();

  return curriculumView;
}

function displayCurriculum(curriculum) {
  curriculumView = new CurriculumView('curriculum', curriculum);
  curriculumView.createDisplay();

  return curriculumView;
}

function autoElimination() {
  const bestElim = getBestElimination(curriculumView.curriculum);

  displayCurriculum(bestElim);
}

function loadConfig(config) {
  const curriculum = Curriculum.fromObject(config);

  displayCurriculum(curriculum);
}

function loadConfiguration(event) {
  const input = event.target;

  const reader = new FileReader();
  reader.onload = () => {
    loadConfig(JSON.parse(reader.result));
  };
  if (input.files && input.files.length > 0) {
    console.info('Loading configuration...');
    reader.readAsText(input.files[0]);
  } else {
    console.warn('No input specified!');
  }
}

function saveConfiguration() {
  const { curriculum } = curriculumView;

  const jsonFile = JSON.stringify(curriculum.toObject(), null, 2);
  const href = `data:application/json;charset=utf-8,${encodeURIComponent(jsonFile)}`;
  const curriculumName = curriculum.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[.?!;]/g, '');
  const fileName = `${curriculumName}.json`;

  const saveButton = document.getElementById('save-config');
  saveButton.href = href;
  saveButton.download = fileName;
}

function loadTemplates() {
  const templateView = new TemplateView('template-container', (template) => loadConfig(template));
  templateView.createElement();
}

document.addEventListener('DOMContentLoaded', () => {
  loadTemplates();
  displayNewCurriculum();

  const loadConfigButton = document.getElementById('load-config');
  loadConfigButton.addEventListener('change', (event) => loadConfiguration(event));

  const saveConfigButton = document.getElementById('save-config');
  saveConfigButton.addEventListener('click', (event) => saveConfiguration(event));

  const newCurriculumButton = document.getElementById('new-curriculum-button');
  newCurriculumButton.addEventListener('click', () => displayNewCurriculum());

  const autoElimButton = document.getElementById('auto-elimination-button');
  autoElimButton.addEventListener('click', () => autoElimination());
});
