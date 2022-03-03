/** UI */

import * as THREE from 'three';
import Element from '../util/element';
import Clamp from '../util/clamp';
import Config from '../config/config';

class UI {
  constructor() {
    this.render();
  }

  bind(root) {
    this.ref = {};
    this.ref.Tree = root.modules.Tree;
    this.ref.Materials = root.modules.Materials;
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
    this.state.changed = {};
    this.el.querySelectorAll('[name], [data-name]').forEach(input => {
      let name = input.name || input.dataset.name;
      let v;
      switch (input.type) {
        case 'number': v = parseFloat(input.value); break;
        case 'checkbox': v = input.checked; break;
        default: v = input.value; break;
      }
      if (this.state[name] !== v) {
        const section = name.split('.')[0];
        this.state.changed[section] = 1;
      }
      this.state[name] = v;
    });

    // distribute state
    this.ref.Tree.set(this.state);
    this.ref.Materials.set(this.state);

    // viewer
    this.ref.Viewer.lookAt(new THREE.Vector3(0, this.state["tree.height"]/2, 0));

    // stats
    const n = this.ref.Tree.count();
    this.el.querySelector('[name="stats.nodes"]').value = n;
    this.el.querySelector('[name="stats.polygons"]').value = n * this.ref.Tree.polycount();
  }

  bindSlider2(slider) {
    console.log(slider);
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
            children: Object.keys(Config.UI.sections[section]).map(key => {
              const settings = Config.UI.sections[section][key];
              const obj = {
                class: 'row',
                children: [{
                  type: 'label',
                  innerText: key,
                }]
              };
              let input = {};
              if (settings.type === 'slider2') {
                input = {
                  ...settings,
                  dataset: {
                    name: `${section}.${key}`,
                  },
                  type: 'div',
                  class: 'slider2',
                  children: {
                    class: 'slider2__track',
                    children: [{
                      class: 'slider2__lower',
                    }, {
                      class: 'slider2__upper',
                    }]
                  }
                };
              } else {
                input = {
                  ...settings,
                  name: `${section}.${key}`,
                  type: 'input',
                  attribute: {
                    type: Config.UI.sections[section][key].type || 'number',
                  },
                };
              }
              obj.children.push(input);
              return obj;
            })
          }]
        }))
      }]
    });

    // custom
    this.el.querySelector('[name="global.seed"]').parentNode.appendChild(
      Element({
        innerHTML: '&#x1F3B2',
        style: { cursor: 'pointer', marginLeft: '2px' },
        addEventListener: {
          click: () => {
            this.el.querySelector('[name="global.seed"]').value = Math.floor(Math.random() * 1000000);
            this.onChange();
          }
        }
      })
    );
    this.el.querySelectorAll('.slider2').forEach(slider => {
      slider.range = slider.max - slider.min;
      slider.value = {min: slider.min, max: slider.max};
      const lower = slider.querySelector('.slider2__lower');
      const upper = slider.querySelector('.slider2__upper');
      lower.addEventListener('mousedown', () => { this.el.activeEl = lower; });
      upper.addEventListener('mousedown', () => { this.el.activeEl = upper; });

      if (!this.el.sliderCallback) {
        this.el.sliderCallback = evt => {
          if (this.el.activeEl) {
            const parent = this.el.activeEl.parentNode;
            const slider = parent.parentNode;
            const isLower = this.el.activeEl.classList.contains('slider2__lower');
            const rect = parent.getBoundingClientRect();
            const sibling = isLower ? parent.querySelector('.slider2__upper') : parent.querySelector('.slider2__lower');
            const x = Clamp(evt.clientX - rect.x, 0, rect.width);

            if (isLower) {
              slider.value.min = x / rect.width * slider.range;
              slider.value.max = Math.max(slider.value.min, slider.value.max);
            } else {
              slider.value.max = x / rect.width * slider.range;
              slider.value.min = Math.min(slider.value.min, slider.value.max);
            }

            parent.querySelector('.slider2__lower').style.left = `${slider.value.min / slider.range * rect.width}px`;
            parent.querySelector('.slider2__upper').style.left = `${slider.value.max / slider.range * rect.width}px`;
          }
        };
        const onEnd = () => {
          if (this.el.activeEl) {
            console.log(this.el.activeEl.parentNode.parentNode.value);
            this.el.activeEl = false;
            this.onChange();
          }
        };

        this.el.addEventListener('mousemove', this.el.sliderCallback);
        this.el.addEventListener('mouseup', onEnd);
        this.el.addEventListener('mouseleave', onEnd);
      }
    });

    document.querySelector('body').appendChild(this.el);
  }
}

export default UI;
