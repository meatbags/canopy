/** Vector */

class Vector {
  constructor(x=0, y=0, z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  mul(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  set(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  normalise() {
    const mag = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    if (mag == 0) return this;
    this.x /= mag;
    this.y /= mag;
    this.z /= mag;
    return this;
  }

  distanceToLine(a, b) {
    const ap = this.clone().sub(a);
    const ab = a.clone().sub(b).normalise();
    return ab.scale(ab.dot(ap)).distanceTo(this);
  }

  distanceTo(p) {
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    const dz = p.z - this.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
  }

  cross(v) {
    return new Vector(
      this.y*v.z - this.z*v.y,
      this.z*v.x - this.x*v.z,
      this.x*v.y - this.y*v.x
    );
  }

  dot(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
  }

  clone() {
    return new Vector(this.x, this.y, this.z);
  }
}

export default Vector;
