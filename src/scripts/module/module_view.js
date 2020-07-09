import ModuleDisplayView from './module_display.js';
import ModuleEditView from './module_editor.js';
// eslint-disable-next-line no-unused-vars
import Module from './module.js';

export default class ModuleView {
  /**
   * Creates a new module view.
   * @param {Module} module
   * @param {*} onChange
   * @param {*} onRemove
   * @param {*} onEdit
   * @param {*} onSave
   * @param {*} onDiscard
   */
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
