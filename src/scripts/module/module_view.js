import ModuleDisplayView from "./module_display.js";
import ModuleEditView from "./module_editor.js";

export default class ModuleView {
  constructor(module, onRemove, onEdit, onSave, onDiscard) {
    this.module = module;
    this.onRemove = onRemove;
    this.onEdit = onEdit;
    this.onSave = onSave;
    this.onDiscard = onDiscard;
  }

  createDisplay() {
    this.view = new ModuleDisplayView(this.module, () => this.onRemove(this), () => this.onEdit(this));
    this.element = this.view.createElement();
    return this.element;
  }

  createEditor() {
    this.view = new ModuleEditView(this.module, () => this.onSave(this), () => this.onDiscard(this));
    this.element = this.view.createElement();
    return this.element;
  }

  getElementIndex() {
    let node = this.element;

    let index = 0;
    while ((node = node.previousElementSibling)) {
      index++;
    }
    return index;
  }
}
