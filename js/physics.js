// Physics Engine for 3D Ping Pong - Utility functions

// Vector3D helper class
class Vector3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vector3D(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    subtract(v) {
        return new Vector3D(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiply(scalar) {
        return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector3D(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return new Vector3D(0, 0, 0);
        return this.multiply(1 / len);
    }
}

// Collision detection utilities
function checkSphereAABBCollision(sphere, aabb) {
    const closestX = Math.max(aabb.min.x, Math.min(sphere.x, aabb.max.x));
    const closestY = Math.max(aabb.min.y, Math.min(sphere.y, aabb.max.y));
    const closestZ = Math.max(aabb.min.z, Math.min(sphere.z, aabb.max.z));

    const dx = sphere.x - closestX;
    const dy = sphere.y - closestY;
    const dz = sphere.z - closestZ;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance < sphere.radius;
}

function getCollisionNormal(sphere, aabb) {
    const closestX = Math.max(aabb.min.x, Math.min(sphere.x, aabb.max.x));
    const closestY = Math.max(aabb.min.y, Math.min(sphere.y, aabb.max.y));
    const closestZ = Math.max(aabb.min.z, Math.min(sphere.z, aabb.max.z));

    const normal = new Vector3D(
        sphere.x - closestX,
        sphere.y - closestY,
        sphere.z - closestZ
    );

    return normal.normalize();
}
