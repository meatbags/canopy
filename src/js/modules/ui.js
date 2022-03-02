/** UI */

import Element from '../util/element';
import Config from '../config/config';

class UI {
  constructor() {
    this.render();
  }

  bind(root) {
    this.ref = {};
    this.ref.Tree = root.modules.Tree;

    // bind state
    this.state = {};
    this.el.querySelectorAll('[name]').forEach(input => {
      input.addEventListener('change', () => this.onChange());
    });
  }

  init() {
    this.onChange();
  }

  onChange() {
    this.el.querySelectorAll('[name]').forEach(input => {
      this.state[input.name] = input.type === 'number' ? parseFloat(input.value) : input.value;
    });
    this.ref.Tree.generate(this.state);
    //console.log(this.state);
    console.log('Nodes:', this.ref.Tree.count());
  }

  render() {
    this.el = Element({
      class: 'ui',
      children: [{
        class: 'ui__header',
      }, {
        class: 'ui__body',
        children: Object.keys(Config.UI.sections).map(section => ({
          class: 'ui__section',
          dataset: {
            id: section,
          },
          children: [{
            class: 'title',
            addEventListener: {
              click: () => this.el.querySelector(`[data-id="${section}"]`).classList.toggle('ui__section--collapsed'),
            },
            children: [{
              innerText: section
            }, {
              class: 'ui__section-collapse'
            }]
          }, {
            class: 'rows',
            children: Object.keys(Config.UI.sections[section]).map(key => ({
              class: 'row',
              children: [{
                type: 'label',
                innerText: key,
              }, {
                type: 'input',
                attribute: {
                  name: key,
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
