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
    this.ref.Materials = root.modules.Materials;
  }

  set(state) {
    if (!(state.changed.tree || state.changed.global || state.changed.mesh)) return;

    this.state = state;
    this.random = new Random(this.state['global.seed']);
    this.depth = state.depth || 0;
    this.position = state.position || new Vector();
    this.direction = state.direction || new Vector(0, 1, 0);
    this.extent = this.direction.clone().scale(this.height).add(this.position);

    // material
    this.wireframe = state.wireframe === undefined ? false : state.wireframe;
    this.backface = state.backface === undefined ? false : state.backface;

    // children
    this.children = this.children || [];
    const branches = this.state['tree.branches'];
    const maxDepth = this.state['tree.depth'];

    if (this.depth <= maxDepth) {
      // create geometry
      this.setGeometry();

      // generate branches
      for (let i=0; i<branches; i++) {
        const seed = this.random.random();
        const depth = this.depth + 1;
        const position = this.getPosition();
        const direction = this.getDirection();
        const nextState = { ...state, seed, depth, position, direction };

        // create
        if (i < this.children.length) {
          this.children[i].set(nextState);
        } else {
          const child = new Tree();
          child.bind(this.ref.root);
          child.set(nextState);
          this.children.push(child);
        }
      }

      // prune
      while (this.children.length > branches) {
        this.children.pop().remove();
      }
    } else {
      this.remove();
    }
  }

  setGeometry() {
    // create or update geometry
    const geo = this.geometry || new THREE.BufferGeometry();

    // settings
    const radius = this.state['tree.thickness'] / 2;
    const height = this.state['tree.height'];
    const vmax = this.state['mesh.vertical'];
    const rmax = this.state['mesh.radial'];
    const tris = vmax * rmax * 2;
    const index = new Uint16Array(tris * 3);
    const position = new Float32Array((tris + 2) * 3);
    const normal = new Float32Array((tris + 2) * 3);
    const uv = new Float32Array((tris + 2) * 2);

    // util
    const write = (buffer, data, index) => {
      for (let i=0; i<data.length; i++)
        buffer[index + i] = data[i];
    };

    // create buffer data
    for (let y=0; y<vmax+1; y++) {
      const y0 = y / vmax * height;
      const base = y * rmax;
      for (let r=0; r<rmax; r++) {
        const angle = r / rmax * Math.PI * 2;
        const sa = Math.sin(angle);
        const ca = Math.cos(angle);
        const x0 = sa * radius;
        const z0 = ca * radius;
        const i = base + r;
        write(position, [x0, y0, z0], i * 3);
        write(normal, [sa, 0, ca], i * 3);
        write(uv, [0, 0], i * 2);
        if (y !== vmax) {
          if (r < rmax - 1) {
            write(index, [i, i+1, i+rmax, i+rmax+1, i+rmax, i+1], i*6);
          } else {
            write(index, [i, base, i+rmax, base+rmax, i+rmax, base], i*6);
          }
        }
      }
    }

    // set buffer attributes
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.index = new THREE.BufferAttribute(index, 1);

    // add mesh
    if (!this.mesh) {
      this.mesh = new THREE.Mesh(geo, this.ref.Materials.get('bark'));
      this.geometry = this.mesh.geometry;
    }

    // settings
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    // add
    this.ref.Viewer.scene.add(this.mesh);
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
    this.ref.Viewer.scene.remove(this.mesh);
    while (this.children.length) {
      this.children.pop().remove();
    }
  }

  count() {
    let n = 1;
    this.children.forEach(child => { n += child.count(); });
    return n;
  }

  polycount() {
    return this.mesh ? this.mesh.geometry.index.array.length / 3 : 0;
  }
}

export default Tree;
