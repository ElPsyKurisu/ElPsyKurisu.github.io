document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('backgroundAnimationCanvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial resize

    // 2. Body Definition
    const bodies = [
        {
            mass: 15,
            x: canvas.width / 4,
            y: canvas.height / 2,
            vx: 0,
            vy: 0.5,
            radius: 7,
            color: 'red',
            forceX: 0,
            forceY: 0
        },
        {
            mass: 10,
            x: canvas.width * 3 / 4,
            y: canvas.height / 2,
            vx: 0,
            vy: -0.5,
            radius: 5,
            color: 'green',
            forceX: 0,
            forceY: 0
        },
        {
            mass: 20,
            x: canvas.width / 2,
            y: canvas.height / 4,
            vx: 0.5,
            vy: 0,
            radius: 9,
            color: 'blue',
            forceX: 0,
            forceY: 0
        }
    ];

    // 3. Simulation Parameters
    const G = 0.5; // Gravitational constant - tune for "cuteness"
    const dt = 0.1; // Time step
    const epsilon = 150; // Softening factor to prevent extreme forces at close distances

    // 4. Drawing Functions
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawBody(body) {
        ctx.beginPath();
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
        ctx.fillStyle = body.color;
        ctx.fill();
        ctx.closePath();
    }

    // 5. Physics Update Function
    function updatePositions() {
        // Reset forces for all bodies
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].forceX = 0;
            bodies[i].forceY = 0;
        }

        // Calculate forces between each pair of bodies
        for (let i = 0; i < bodies.length; i++) {
            for (let j = 0; j < bodies.length; j++) {
                if (i === j) continue; // Don't calculate force with self

                const bodyA = bodies[i];
                const bodyB = bodies[j];

                const dx = bodyB.x - bodyA.x;
                const dy = bodyB.y - bodyA.y;
                let distanceSquared = dx * dx + dy * dy;

                // Add softening factor or enforce minimum distance
                distanceSquared = Math.max(epsilon, distanceSquared);
                
                const distance = Math.sqrt(distanceSquared);
                const forceMagnitude = (G * bodyA.mass * bodyB.mass) / distanceSquared;

                const fx = forceMagnitude * dx / distance;
                const fy = forceMagnitude * dy / distance;

                // Add this force to bodyA
                bodyA.forceX += fx;
                bodyA.forceY += fy;
            }
        }

        // Update velocities and positions for each body
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];

            // Update velocity
            body.vx += body.forceX / body.mass * dt;
            body.vy += body.forceY / body.mass * dt;

            // Update position
            body.x += body.vx * dt;
            body.y += body.vy * dt;

            // 6. Boundary Conditions (Simple Loop-Around)
            if (body.x < 0) body.x = canvas.width;
            if (body.x > canvas.width) body.x = 0;
            if (body.y < 0) body.y = canvas.height;
            if (body.y > canvas.height) body.y = 0;
        }
    }

    // 7. Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        clearCanvas();
        updatePositions();
        bodies.forEach(drawBody);
    }

    // 8. Initialization and Start
    // Initial positions are set relative to canvas dimensions, so safe to start.
    animate();
});
