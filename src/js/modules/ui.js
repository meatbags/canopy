/** UI */

import Element from '../util/element';

class UI {
  constructor() {
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

    this.state = {};

    // bind state
    this.el.querySelector('[name]').forEach(input => {
      this.state[input.name] =
    });
  }
}

export default UI;
