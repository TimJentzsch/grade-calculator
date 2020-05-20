import ModuleDisplayView from './module_display.js';
import ModuleEditView from './module_editor.js';

export default class ModuleView {
  constructor(module, onChange, onRemove, onEdit, onSave, onDiscard) {
    this.module = module;
    this.onChange = onChange;
    this.onRemove = onRemove;
    this.onEdit = onEdit;
    this.onSave = onSave;
    this.onDiscard = onDiscard;
  }

  createDisplay() {
    this.view = new ModuleDisplayView(
      this.module,
      () => this.onChange(this),
      () => this.onRemove(this),
      () => this.onEdit(this),
    );
    this.element = this.view.createElement();
    return this.element;
  }

  createEditor() {
    this.view = new ModuleEditView(
      this.module,
      () => this.onSave(this),
      () => this.onDiscard(this),
    );
    this.element = this.view.createElement();
    return this.element;
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
