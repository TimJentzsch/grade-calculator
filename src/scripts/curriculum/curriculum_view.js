import ModuleAreaView from '../module_area/module_area_view.js';
import ModuleArea from '../module_area/module_area.js';
import CurriculumDisplayHeader from './curriculum_display.js';
import CurriculumEditorHeader from './curriculum_editor.js';

export default class CurriculumView {
  constructor(elementID, curriculum) {
    this.elementID = elementID;
    this.curriculum = curriculum;
  }

  createDisplay() {
    const element = document.getElementById(this.elementID);
    element.innerHTML = '';
    element.classList.add('curriculum-container');
    this.element = element;

    element.appendChild(this.createDisplayHeader());
    element.appendChild(this.createModuleAreas());

    return this.element;
  }

  createDisplayHeader() {
    this.editing = false;
    const headerView = new CurriculumDisplayHeader(
      this.curriculum,
      () => this.onModuleAreaAdd(),
      () => this.edit()
    );
    this.headerView = headerView;

    const header = headerView.createHeader();
    this.header = header;

    this.updateView();

    return header;
  }

  createEditor() {
    const element = document.getElementById(this.elementID);
    element.innerHTML = '';
    element.classList.add('curriculum-container');
    this.element = element;

    element.appendChild(this.createEditorHeader());
    element.appendChild(this.createModuleAreas());

    return this.element;
  }

  createEditorHeader() {
    this.editing = true;
    const headerView = new CurriculumEditorHeader(
      this.curriculum,
      () => this.save(),
      () => this.discard()
    );
    this.headerView = headerView;

    const header = headerView.createHeader();
    this.header = header;

    this.updateView();

    return header;
  }

  createModuleAreas() {
    const moduleAreaContainer = document.createElement('div');
    moduleAreaContainer.classList.add('curriculum-module-area-container');
    this.moduleAreaContainer = moduleAreaContainer;

    const moduleAreaViews = this.curriculum.moduleAreas.map(
      (moduleArea) =>
        new ModuleAreaView(
          moduleArea,
          () => this.onModuleAreaChange(),
          (moduleAreaView) => this.onModuleAreaRemove(moduleAreaView),
          (moduleAreaView) => this.onModuleAreaEdit(moduleAreaView),
          (moduleAreaView) => this.onModuleAreaSave(moduleAreaView),
          (moduleAreaView) => this.onModuleAreaDiscard(moduleAreaView)
        )
    );
    moduleAreaViews.map((moduleAreaView) => {
      moduleAreaContainer.appendChild(moduleAreaView.createDisplay());
    });
    this.moduleAreaViews = moduleAreaViews;

    return moduleAreaContainer;
  }

  updateView() {
    if (this.editing) {
      return;
    }

    this.headerView.updateView();
  }

  edit() {
    const displayHeaderElement = this.header;
    const editorHeaderElement = this.createEditorHeader();

    this.element.replaceChild(editorHeaderElement, displayHeaderElement);
  }

  save() {
    const editorHeaderView = this.headerView;
    editorHeaderView.save();

    const editorHeaderElement = this.header;
    const displayHeaderElement = this.createDisplayHeader();

    this.element.replaceChild(displayHeaderElement, editorHeaderElement);
    this.updateView();
  }

  discard() {
    const editorHeaderElement = this.header;
    const displayHeaderElement = this.createDisplayHeader();

    this.element.replaceChild(displayHeaderElement, editorHeaderElement);
  }

  onModuleAreaAdd() {
    const newModuleArea = new ModuleArea('', []);
    this.curriculum.addModuleArea(newModuleArea);

    const newModuleAreaView = new ModuleAreaView(
      newModuleArea,
      () => this.onModuleAreaChange(),
      (moduleAreaView) => this.onModuleAreaRemove(moduleAreaView),
      (moduleAreaView) => this.onModuleAreaEdit(moduleAreaView),
      (moduleAreaView) => this.onModuleAreaSave(moduleAreaView),
      (moduleAreaView) => this.onModuleAreaDiscard(moduleAreaView)
    );
    this.moduleAreaViews.push(newModuleAreaView);
    this.moduleAreaContainer.appendChild(newModuleAreaView.createEditor());

    this.updateView();
  }

  onModuleAreaChange() {
    this.updateView();
  }

  onModuleAreaRemove(moduleAreaView) {
    const moduleAreaElement = moduleAreaView.element;
    if (moduleAreaElement) {
      // Remove from curriculum
      const elementIndex = moduleAreaView.getElementIndex();
      console.debug(
        `Removing module area '${this.curriculum.moduleAreas[elementIndex].name}'.`
      );
      this.curriculum.moduleAreas.splice(elementIndex, 1);
      // Remove from module area views
      console.debug(
        `Removing module area view '${this.moduleAreaViews[elementIndex].moduleArea.name}'.`
      );
      this.moduleAreaViews.splice(elementIndex, 1);
      // Remove from View
      this.moduleAreaContainer.removeChild(moduleAreaElement);
      // Update data
      this.onModuleAreaChange();
    }
  }

  onModuleAreaEdit(moduleAreaView) {
    const displayHeaderElement = moduleAreaView.header;
    const editorHeaderElement = moduleAreaView.createEditorHeader();

    moduleAreaView.element.replaceChild(
      editorHeaderElement,
      displayHeaderElement
    );
  }

  onModuleAreaSave(moduleAreaView) {
    const editorHeaderView = moduleAreaView.headerView;
    editorHeaderView.save();

    const editorHeaderElement = moduleAreaView.header;
    const displayHeaderElement = moduleAreaView.createDisplayHeader();

    moduleAreaView.element.replaceChild(
      displayHeaderElement,
      editorHeaderElement
    );
    this.updateView();
  }

  onModuleAreaDiscard(moduleAreaView) {
    if (moduleAreaView.moduleArea.isEmpty) {
      this.onModuleAreaRemove(moduleAreaView);
      return;
    }

    const editorHeaderElement = moduleAreaView.header;
    const displayHeaderElement = moduleAreaView.createDisplayHeader();

    moduleAreaView.element.replaceChild(
      displayHeaderElement,
      editorHeaderElement
    );
  }
}
