/** Materials */

import * as THREE from 'three';

class Materials {
  constructor() {
    this.textures = {};
    this.material = {};
    this.material.bark = new THREE.MeshStandardMaterial({color:0xffffff});
  }

  get(name) {
    return this.material[name];
  }

  set(state) {
    if (!state.changed.render) return;
    
    for (const key in this.material) {
      const mat = this.material[key];
      mat.wireframe = state['render.wireframe'];
      mat.side = state['render.backface'] ? THREE.DoubleSide : THREE.FrontSide;
    }
  }
}

export default Materials;
