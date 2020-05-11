import templates from './templates.js';

export default class TemplateView {
  constructor(elementID, onLoad) {
    this.onLoad = onLoad;
    this.elementID = elementID;
  }

  createElement() {
    const element = document.getElementById(this.elementID);

    for (const template of templates) {
      element.appendChild(this.createButton(template));
    }
  }

  createButton(template) {
    const button = document.createElement('button');
    button.classList.add('template-button');
    button.innerText = template.name;
    button.title = `Load the ${template.name} curriculum`;

    button.addEventListener('click', () => this.onLoad(template));

    return button;
  }
}
