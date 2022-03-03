/** App */

import UI from './ui';
import Tree from './tree';
import Viewer from './viewer';
import Materials from './materials';

class App {
  constructor() {
    this.modules = {};
    [UI, Tree, Viewer, Materials].forEach(_ => this.modules[_.name] = new _());

    // global events
    window.addEventListener('resize', () => this.call('resize'));

    // run
    this.call('bind');
    this.call('resize');
    this.call('init');
  }

  call(f) {
    for (const key in this.modules) {
      if (typeof this.modules[key][f] === 'function') {
        this.modules[key][f](this);
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
});
