import ModuleView from '../module/module_view.js';
import Module from '../module/module.js';
import ModuleAreaDisplayView from './module_area_display.js';
import ModuleAreaEditorView from './module_area_editor.js';

export default class ModuleAreaView {
  constructor(moduleArea, onChange, onRemove, onEdit, onSave, onDiscard) {
    this.moduleArea = moduleArea;
    this.onChange = onChange;
    this.onRemove = onRemove;
    this.onEdit = onEdit;
    this.onSave = onSave;
    this.onDiscard = onDiscard;
  }

  createDisplay() {
    this.element = document.createElement('div');
    this.element.classList.add('module-area-container');

    this.element.appendChild(this.createDisplayHeader());
    this.element.appendChild(this.createModules());

    return this.element;
  }

  createDisplayHeader() {
    this.headerView = new ModuleAreaDisplayView(
      this.moduleArea,
      () => this.onChange(),
      () => this.onModuleAdd(),
      () => this.onRemove(this),
      () => this.onEdit(this),
    );
    this.header = this.headerView.createHeader();
    this.editing = false;

    this.updateView();

    return this.header;
  }

  createEditor() {
    const element = document.createElement('div');
    element.classList.add('module-area-container');
    this.element = element;

    element.appendChild(this.createEditorHeader());
    element.appendChild(this.createModules());

    return this.element;
  }

  createEditorHeader() {
    this.headerView = new ModuleAreaEditorView(
      this.moduleArea,
      () => this.onSave(this),
      () => this.onDiscard(this),
    );
    this.header = this.headerView.createHeader();
    this.editing = true;

    return this.header;
  }

  createModules() {
    const moduleContainer = document.createElement('div');
    moduleContainer.classList.add('module-area-module-container');
    this.moduleContainer = moduleContainer;

    const moduleViews = this.moduleArea.modules.map(
      (module) =>
        new ModuleView(
          module,
          (moduleView) => this.onModuleRemove(moduleView),
          (moduleView) => this.onModuleEdit(moduleView),
          (moduleView) => this.onModuleSave(moduleView),
          (moduleView) => this.onModuleDiscard(moduleView),
        ),
    );
    moduleViews.forEach((moduleView) => {
      const moduleViewElement = moduleView.createDisplay();
      moduleContainer.appendChild(moduleViewElement);
    });
    this.moduleViews = moduleViews;

    return moduleContainer;
  }

  updateView() {
    this.onChange();

    if (this.editing) {
      return;
    }

    this.headerView.updateView();
  }

  onModuleAdd() {
    const newModule = new Module('', undefined, undefined, 1, false, false);
    this.moduleArea.addModule(newModule);

    const newModuleView = new ModuleView(
      newModule,
      (moduleView) => this.onModuleRemove(moduleView),
      (moduleView) => this.onModuleEdit(moduleView),
      (moduleView) => this.onModuleSave(moduleView),
      (moduleView) => this.onModuleDiscard(moduleView),
    );
    this.moduleViews.push(newModuleView);
    this.moduleContainer.appendChild(newModuleView.createEditor());

    this.updateView();
  }

  onModuleChange() {
    this.updateView();
  }

  onModuleRemove(moduleView) {
    const moduleElement = moduleView.element;
    if (moduleElement) {
      // Remove from module area
      const elementIndex = moduleView.getElementIndex();
      console.debug(`Removing module '${this.moduleArea.modules[elementIndex].name}'.`);
      this.moduleArea.modules.splice(elementIndex, 1);
      // Remove from module views
      console.debug(`Removing module view '${this.moduleViews[elementIndex].module.name}'.`);
      this.moduleViews.splice(elementIndex, 1);
      // Remove from View
      this.moduleContainer.removeChild(moduleElement);
      // Update data
      this.onModuleChange();
    }
  }

  onModuleEdit(moduleView) {
    const displayElement = moduleView.element;
    const editorElement = moduleView.createEditor();

    this.moduleContainer.replaceChild(editorElement, displayElement);
  }

  onModuleSave(moduleView) {
    const editorView = moduleView.view;
    editorView.save();

    const editorElement = moduleView.element;
    const displayElement = moduleView.createDisplay();

    this.moduleContainer.replaceChild(displayElement, editorElement);
    this.updateView();
  }

  onModuleDiscard(moduleView) {
    if (moduleView.module.isEmpty) {
      this.onModuleRemove(moduleView);
      return;
    }

    const editorElement = moduleView.element;
    const displayElement = moduleView.createDisplay();

    this.moduleContainer.replaceChild(displayElement, editorElement);
  }

  getElementIndex() {
    let node = this.element;

    let index = 0;
    while (node.previousElementSibling) {
      node = node.previousElementSibling;
      index += 1;
    }
    return index;
  }
}
