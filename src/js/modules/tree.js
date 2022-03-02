/** Tree */

import * as THREE from 'three';
import Vector from '../util/vector';
import Random from '../util/random';
import Lerp from '../util/lerp';

class Tree {
  constructor() {}

  bind(root) {
    this.ref = {};
    this.ref.root = root;
    this.ref.Viewer = root.modules.Viewer;
  }

  generate(state) {
    this.random = new Random(state.seed);
    this.depth = state.depth || 0;
    this.position = state.position || new Vector();
    this.direction = state.direction || new Vector(0, 1, 0);
    this.height = state.height;
    this.extent = this.direction.clone().scale(this.height).add(this.position);
    this.thickness = state.thickness;

    // children
    this.children = this.children || [];

    if (this.depth <= state.subdivide) {
      // create mesh
      if (!this.mesh) {
        const geo = new THREE.BoxBufferGeometry(1, 1, 1);
        const mat = new THREE.MeshPhysicalMaterial({color:0x888888});
        this.mesh = new THREE.Mesh(geo, mat);
      }

      // set position
      this.mesh.position.set(0, 0, 0);
      this.mesh.lookAt(new THREE.Vector3(this.direction.x, this.direction.y, this.direction.z));
      this.mesh.position.set(this.position.x, this.position.y + this.height/2, this.position.z);
      this.mesh.scale.set(this.thickness, this.height, this.thickness);
      this.ref.Viewer.scene.add(this.mesh);

      // generate branches
      for (let i=0; i<state.branches; i++) {
        const seed = this.random.random();
        const depth = this.depth + 1;
        const position = this.getPosition();
        const direction = this.getDirection();
        const nextState = { ...state, seed, depth, position, direction };

        // create
        if (i < this.children.length) {
          this.children[i].generate(nextState);
        } else {
          const child = new Tree();
          child.bind(this.ref.root);
          child.generate(nextState);
          this.children.push(child);
        }
      }

      // prune
      while (this.children.length > state.branches) {
        this.children.pop().remove();
      }
    } else {
      this.remove();
    }
  }

  getPosition() {
    const t = this.random.random();
    return new Vector(
      Lerp(this.position.x, this.extent.x, t),
      Lerp(this.position.y, this.extent.y, t),
      Lerp(this.position.z, this.extent.z, t),
    );
  }

  getDirection() {
    const x = this.random.range(-1, 1);
    const y = this.random.range(-1, 1);
    const z = this.random.range(-1, 1);
    return new Vector(x, y, z).normalise();
  }

  remove() {
    while (this.children.length) {
      this.children.pop().remove();
    }
    this.ref.Viewer.scene.remove(this.mesh);
  }

  count() {
    let n = 1;
    this.children.forEach(child => {
      n += child.count();
    });
    return n;
  }
}

export default Tree;
