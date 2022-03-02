/** Config */

export default {
  UI: {
    sections: {
      global: {
        seed: { value: 0, }
      },
      tree: {
        thickness: { value: 1, min: 0 },
        height: { value: 5, min: 0 },
        branches: { value: 1, min: 0 },
        subdivide: { value: 0, min: 0 },
      },
      mesh: {
        radial: { value: 6, min: 2 },
        vertical: { value: 1, min: 1 },
      },
      render: {
        backface: { type: 'checkbox', checked: true },
        wireframe: { type: 'checkbox', checked: false },
      },
      stats: {
        nodes: { value: -1, disabled: true },
        polygons: { value: -1, disabled: true },
      },
    }
  }
};
