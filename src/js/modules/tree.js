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
    this.divisions = {radial: state.radial, vertical: state.vertical};
    this.height = state.height;
    this.extent = this.direction.clone().scale(this.height).add(this.position);
    this.thickness = state.thickness;
    this.radius = this.thickness / 2;

    // material
    this.wireframe = state.wireframe === undefined ? false : state.wireframe;
    this.backface = state.backface === undefined ? false : state.backface;

    // children
    this.children = this.children || [];

    if (this.depth <= state.subdivide) {
      // create geometry
      this.setGeometry();

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

  setGeometry() {
    // create or update geometry
    const geo = this.geometry || new THREE.BufferGeometry();

    // settings
    const tris = this.divisions.radial * this.divisions.vertical * 2;
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
    for (let y=0; y<this.divisions.vertical+1; y++) {
      const y0 = y / this.divisions.vertical * this.height;
      const base = y * this.divisions.radial;
      for (let r=0, rmax=this.divisions.radial; r<rmax; r++) {
        const angle = r / rmax * Math.PI * 2;
        const sa = Math.sin(angle);
        const ca = Math.cos(angle);
        const x0 = sa * this.radius;
        const z0 = ca * this.radius;
        const i = base + r;
        write(position, [x0, y0, z0], i * 3);
        write(normal, [sa, 0, ca], i * 3);
        write(uv, [0, 0], i * 2);
        if (y !== this.divisions.vertical) {
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
      const mat = new THREE.MeshStandardMaterial({color: 0x888888});
      this.mesh = new THREE.Mesh(geo, mat);
      this.geometry = this.mesh.geometry;
    }

    // settings
    this.mesh.material.wireframe = this.wireframe;
    this.mesh.material.side = this.backface ? THREE.DoubleSide : THREE.FrontSide;
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
