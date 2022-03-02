/** UI */

import Element from '../util/element';
import Config from '../config/config';

class UI {
  constructor() {
    this.render();

    // bind state
    this.state = {};
    this.onChange();
    this.el.querySelectorAll('[name]').forEach(input => {
      input.addEventListener('change', () => this.onChange());
    });
  }

  onChange() {
    this.el.querySelectorAll('[name]').forEach(input => {
      this.state[input.name] = input.type === 'number' ? parseFloat(input.value) : input.value;
    });
    console.log(this.state);
  }

  render() {
    this.el = Element({
      class: 'ui',
      children: [{
        class: 'ui__header',
        innerText: 'Options'
      }, {
        class: 'ui__body',
        children: Object.keys(Config.UI.sections).map(section => ({
          class: 'ui__section',
          dataset: {
            id: section,
          },
          children: [{
            class: 'title',
            children: [{
              innerText: section,
            }, {
              class: 'ui__section-collapse',
              innerText: '+',
              addEventListener: {
                click: () => this.el.querySelector(`[data-id="${section}"]`).classList.toggle('ui__section--collapsed'),
              }
            }]
          }, {
            class: 'rows',
            children: Object.keys(Config.UI.sections[section]).map(key => ({
              children: [{
                type: 'label',
                innerText: key,
              }, {
                type: 'input',
                attribute: {
                  name: `${section}.${key}`,
                  type: 'number',
                  ...Config.UI.sections[section][key],
                },
              }]
            }))
          }]
        }))
      }]
    });
    document.querySelector('body').appendChild(this.el);
  }
}

export default UI;
