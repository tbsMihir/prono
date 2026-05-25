// Physics Engine for 3D Ping Pong

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

class Ball extends Vector3D {
    constructor(x, y, z) {
        super(x, y, z);
        this.velocity = new Vector3D(0.3, 0, 0);
        this.acceleration = new Vector3D(0, 0, 0);
        this.gravity = 0.02;
        this.radius = 0.4;
        this.friction = 0.99;
        this.mesh = null;
    }

    update() {
        // Apply velocity to position
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.z += this.velocity.z;

        // Apply acceleration
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
        this.velocity.z += this.acceleration.z;

        // Reset acceleration
        this.acceleration = new Vector3D(0, 0, 0);
    }

    applyForce(force) {
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
        this.acceleration.z += force.z;
    }

    applyGravity() {
        this.velocity.y -= this.gravity;
    }

    applyFriction() {
        this.velocity.x *= this.friction;
        this.velocity.z *= this.friction;
    }

    reset() {
        this.x = 0;
        this.y = 2;
        this.z = 0;
        this.velocity = new Vector3D((Math.random() > 0.5 ? 1 : -1) * 0.3, 0, (Math.random() - 0.5) * 0.2);
    }
}

class Paddle extends Vector3D {
    constructor(x, y, z) {
        super(x, y, z);
        this.velocity = new Vector3D(0, 0, 0);
        this.width = 1;
        this.height = 6;
        this.depth = 0.5;
        this.maxSpeed = 0.5;
        this.mesh = null;
    }

    update() {
        this.y += this.velocity.y;
        this.velocity.y *= 0.95; // Damping
    }

    moveTo(targetZ, maxSpeed) {
        const direction = Math.sign(targetZ - this.z);
        const distance = Math.abs(targetZ - this.z);
        const speed = Math.min(maxSpeed, distance * 0.1);
        this.z += direction * speed;
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
