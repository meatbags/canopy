/** UI */

import Element from '../util/element';

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
      this.state[input.name] = input.value;
    });
    console.log(this.state);
  }

  render() {
    if (this.el) return;
    this.el = Element({
      class: 'ui',
      children: [{
        class: 'ui__header',
        innerText: 'Header'
      }, {
        class: 'ui__body',
        childNodes: [{
          class: 'ui__section',
          children: [{
            class: 'ui__row',
            children: [{
              type: 'label',
              innerText: 'Value:',
            }, {
              type: 'input',
              attribute: {
                name: 'test',
                type: 'number',
                value: 2,
              },
            }]
          }]
        }]
      }]
    });
    document.querySelector('body').appendChild(this.el);
  }
}

export default UI;
