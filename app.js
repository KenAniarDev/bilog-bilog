const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// Constant Variables
const CENTER_X = canvas.width / 2 
const CENTER_Y = canvas.height / 2 
const COLORS = [
    "#4BCD7D",
    "#4BCD7D",
    "#5554A2",
    "#E31E70",
    "#3E889D",
    "#6231A4",
    "#87049E"


]

// Other Variables
const projectiles = []
const enemies = []

// Player Class
class Player {
    constructor(x, y, radius, color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
}

// Initialize Player
const player = new Player(CENTER_X, CENTER_Y, 30, '#79D65A')

// Projectile Class
class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

// Enemy Class
class Enemy {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 10) + 10
        let x
        let y
        if(Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        }else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        
        const color = COLORS[
            Math.floor(Math.random() * COLORS.length - 1)
        ]
        console.log(color)

        const angle = Math.atan2(
            CENTER_Y - y, 
            CENTER_X - x 
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(
            new Enemy(
                x,
                y,
                radius,
                color,
                velocity
            )
        )
    }, 1000);
}
let animationId = undefined
// Animate Canvas
function animate() {
    animationId = requestAnimationFrame(animate)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw Player
    player.draw()
    
    // Loop through projectiles then update and draw
    projectiles.forEach((projectile) => {
        projectile.update()
    })

    // Loop through enemies
    enemies.forEach((enemy, i_enemy) => {
        enemy.update()

        const enemy_player_distance = Math.hypot(
            player.x - enemy.x,
            player.y - enemy.y    
        )

        if(enemy_player_distance - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            alert('Game Over')
        }

        // Check collision between projectile and enemy
        projectiles.forEach((projectile, i_projectile) => {
            const enemy_projectile_distance = Math.hypot(
                projectile.x - enemy.x,
                projectile.y - enemy.y    
            )
            // Object Collides
            if(enemy_projectile_distance - enemy.radius - projectile.radius < 1) {
                setTimeout(() => {
                    enemies.splice(i_enemy, 1)
                    projectiles.splice(i_projectile, 1)                    
                }, 0);
            }
        })
    })

}

// Listen for click events
window.addEventListener('click', (e) => {
    const angle = Math.atan2(
        e.clientY - CENTER_Y, 
        e.clientX - CENTER_X
    )
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(
        new Projectile(
            CENTER_X, 
            CENTER_Y,
            5,
            '#F1226A',
            velocity
        )
    )
})

animate()
spawnEnemies()