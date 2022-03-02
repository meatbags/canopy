/** UI */

import * as THREE from 'three';
import Element from '../util/element';
import Config from '../config/config';

class UI {
  constructor() {
    this.render();
  }

  bind(root) {
    this.ref = {};
    this.ref.Tree = root.modules.Tree;
    this.ref.Viewer = root.modules.Viewer;

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
      let v;
      switch (input.type) {
        case 'number': v = parseFloat(input.value); break;
        case 'checkbox': v = input.checked; break;
        default: v = input.value; break;
      }
      this.state[input.name] = v;
    });
    this.ref.Tree.generate(this.state);

    // viewer
    this.ref.Viewer.lookAt(new THREE.Vector3(0, this.state.height/2, 0));

    // stats
    const n = this.ref.Tree.count();
    this.el.querySelector('[name="nodes"]').value = n;
    this.el.querySelector('[name="polygons"]').value = n * this.ref.Tree.polycount();
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
              click: () => {
                const target = this.el.querySelector(`[data-id="${section}"]`);
                target.classList.toggle('ui__section--collapsed');
              },
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
                ...Config.UI.sections[section][key],
                name: key,
                type: 'input',
                attribute: {
                  type: Config.UI.sections[section][key].type || 'number',
                },
              }]
            }))
          }]
        }))
      }]
    });

    // custom
    this.el.querySelector('[name="seed"]').parentNode.appendChild(
      Element({
        innerHTML: '&#x1F3B2',
        style: { cursor: 'pointer', marginLeft: '2px' },
        addEventListener: {
          click: () => {
            this.el.querySelector('[name="seed"]').value = Math.floor(Math.random() * 1000000);
            this.onChange();
          }
        }
      })
    );

    document.querySelector('body').appendChild(this.el);
  }
}

export default UI;
