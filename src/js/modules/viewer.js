/** Renderer */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Element from '../util/element';

class Viewer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({antialias: false});
    this.renderer.setClearColor(0x888888);

    // scene
    this.scene = new THREE.Scene();
    const geo = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
    const mat = new THREE.MeshBasicMaterial({color: 0x0, wireframe: true});
    const grid = new THREE.Mesh(geo, mat);
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    const dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(1, -1, -0.25);
    grid.rotation.x = Math.PI/2;
    this.scene.add(grid, ambient, dir);

    // camera
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(20, 10, 20);
    this.controls.dampingFactor = 0.1;

    // DOM
    this.el = Element({ class: 'viewer' });
    this.el.appendChild(this.renderer.domElement);
    document.querySelector('body').appendChild(this.el);
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  init() {
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => this.loop());

    // update stuff
    this.controls.update();

    // render
    this.renderer.render(this.scene, this.camera);
  }
}

export default Viewer;
