const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
//one letter variable, that means context, 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//the canvas is html is a context, a big object allowing us to draw on the screen
//ici je veux faire un rectangle (position x, position y, width,height)
c.fillRect(0, 0, canvas.width, canvas.height);
c.fillStyle ='black'

class Player 
{
    constructor( {position, velocity } ) // tout le truc entre {} est mon objet, comme ça je passe un seul argument
    {
        this.position = position // {x,y}
        this.velocity = velocity
        this.rotation = 0
    }
    
    draw () //c'est le dessin de mon player, on en fait une methode
    {
        c.save() 
        //c.rotate() juste comme ça, "rotate" tout mon canvas il faut le save et resore pour que ça limite à mon objet actuel
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        
       /* c.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false);
        c.fillStyle = 'green';
        c.fill();*/

        //c.fillStyle = 'green';
        //c.fillRect(this.position.x,this.position.y,100,100);
        
        //moveto dit à partir d'ou je vais commencer à dessiner, ou j pose ma base
        
        c.beginPath()
        c.moveTo(this.position.x + 30, this.position.y )
        c.lineTo(this.position.x - 30, this.position.y -10)
        c.lineTo(this.position.x - 30, this.position.y +10)
        c.closePath()

        c.strokeStyle = 'white'
        c.stroke()        
        c.restore()
    }

    update () {

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
       
    }
    getVerticies () {
        const cos = Math.cos(this.rotation)
        const sin = Math.sin(this.rotation)

        return [
            {
                x: this.position.x + cos * 30 - sin * 0,
                y: this.position.y + sin * 30 + cos * 0,
            },
            {
                x: this.position.x + cos * -10 - sin * -10,
                y: this.position.y + sin * -10 + cos * -10,
            },
            {
            x: this.position.x + cos * -10 - sin * -10,
            y: this.position.y + sin * -10 + cos * -10,
            }
        ]
    }
}


class Projectile {
    constructor ({position, velocity}){
        this.position = position 
        this.velocity = velocity 
        this.radius = 5

    }
    draw () {
        //you have to use begin and close path otherwise yourprokectiles end up linked up with eachother

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update () {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Asteroid {
    constructor ({position, velocity, radius}){
        this.position = position 
        this.velocity = velocity 
        this.radius = radius

    }
    draw () {
        //you have to use begin and close path otherwise yourprokectiles end up linked up with eachother

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false)
        c.strokeStyle = 'blue'
        c.stroke()
        c.closePath()
    }

    update () {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
const player = new Player ({
    position: { x: canvas.width / 2, y: canvas.height / 2 },
    velocity: { x: 0, y: 0 },

})

const keys = {
    //pour des raisons de clavier, mon e c'est son w
    e: { 
        pressed: false,
    },
    r: { //this is the guy's a
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const  SPEED = 3
const  ROTATION_SPEED = 0.05
const FRICTION = 0.8
const PROJECTILE_SPEED = 3


const projectiles = []
const asteroids = []

const intervalID = window.setInterval( () => {
   const index = Math.floor(Math.random() * 4)  //pour avoir des asteroids des 4 cotes
   let x, y
   let vx, vy
   let radius = 50 * Math.random() + 10
    switch (index) {
        case 0: //cote gauche de mon ecran
          x = 0 - radius
          y = Math.random() * canvas.height
          vx = 1
          vy = 0
          break
        case 1: //cote gauche de mon ecran
          x = Math.random() * canvas.width
          y = canvas.height + radius
          vx = 0
          vy = -1
          break
        case 2: //cote gauche de mon ecran
          x = canvas.width + radius
          y = Math.random() * canvas.height
          vx = -1
          vy = 0
          break
        case 3: //cote gauche de mon ecran
          x = Math.random() * canvas.width
          y = 0 - radius
          vx = 0
          vy = 1
          break 
    }
    asteroids.push(new Asteroid ({
        position : {
            x: x,
            y: y,
        },
        velocity : {
            x: vx,
            y: vy,
        },
        radius,
    })
    )

}, 3000)

function CircleCollision (circle1, circle2){
 const xdifference = circle2.position.x - circle1.position.x
 const ydifference = circle2.position.y - circle1.position.y

 const distance = Math.sqrt(xdifference * xdifference + ydifference * ydifference)
 
 if ( distance <= circle1.radius + circle2.radius) {
    console.log("there is a collision")
    return true
 } 
  return false 
}
//ceci est du code copié de son git
function circleTriangleCollision(circle, triangle) {
    // Check if the circle is colliding with any of the triangle's edges
    for (let i = 0; i < 3; i++) {
      let start = triangle[i]
      let end = triangle[(i + 1) % 3]
  
      let dx = end.x - start.x
      let dy = end.y - start.y
      let length = Math.sqrt(dx * dx + dy * dy)
  
      let dot =
        ((circle.position.x - start.x) * dx +
          (circle.position.y - start.y) * dy) /
        Math.pow(length, 2)
  
      let closestX = start.x + dot * dx
      let closestY = start.y + dot * dy
  
      if (!isPointOnLineSegment(closestX, closestY, start, end)) {
        closestX = closestX < start.x ? start.x : end.x
        closestY = closestY < start.y ? start.y : end.y
      }
  
      dx = closestX - circle.position.x
      dy = closestY - circle.position.y
  
      let distance = Math.sqrt(dx * dx + dy * dy)
  
      if (distance <= circle.radius) {
        return true
      }
    }
  
    // No collision
    return false
  }
  
  function isPointOnLineSegment(x, y, start, end) {
    return (
      x >= Math.min(start.x, end.x) &&
      x <= Math.max(start.x, end.x) &&
      y >= Math.min(start.y, end.y) &&
      y <= Math.max(start.y, end.y)
    )
  }

//on veut creer cet appel pour avoir l'animation, d'ou la recursion
function animate (){
 const animationID = window.requestAnimationFrame(animate)
 c.fillStyle ='black'
 c.fillRect(0 ,0 , canvas.width, canvas.height);
 
//ici c'est pour que notre player soit bougé à chaque animation
 player.update()

 for (let i = projectiles.length - 1 ; i >= 0; i--){
    const projectile = projectiles[i]
    projectile.update()

    //ici on supprime les projectiles qui ne sont plus sur l'ecran
    if (projectile.position.x + projectile.radius < 0 ||
        projectile.position.x - projectile.radius > canvas.width ||
        projectile.position.y - projectile.radius > canvas.width ||
        projectile.position.y + projectile.radius < 0) {
       projectiles.splice(i, 1)
    }
 }

 //ici pour les asteroids
 for (let i = asteroids.length - 1 ; i >= 0; i--){
    const asteroid = asteroids[i]
    asteroid.update()

    if (circleTriangleCollision(asteroid, player.getVerticies())) {
        console.log("Game over")
        window.cancelAnimationFrame(animationID)
        clearInterval(intervalID)
    }

    if (asteroid.position.x + asteroid.radius < 0 ||
        asteroid.position.x - asteroid.radius > canvas.width ||
        asteroid.position.y - asteroid.radius > canvas.width ||
        asteroid.position.y + asteroid.radius < 0) {
       asteroids.splice(i, 1)
    }

    //projectile
    for (let j = projectiles.length - 1 ; j >= 0; j--){
        const projectile = projectiles[j]

        if (CircleCollision (asteroid, projectile)){
            asteroids.splice(i, 1)
            projectiles.splice(j, 1)
        }
    }
 }

 //comme ça pas besoin de faire un else pour le cas ou on s'arrete de marcher

 if ( keys.e.pressed) {
    player.velocity.x = Math.cos(player.rotation) * SPEED
    player.velocity.y = Math.sin(player.rotation) * SPEED
 }else if (!keys.e.pressed){
    player.velocity.x *= FRICTION
    player.velocity.y *= FRICTION
 }
  
if (keys.d.pressed) player.rotation += ROTATION_SPEED //c'est mon degree de rotation
else if (keys.r.pressed) player.rotation -= ROTATION_SPEED
}

animate ()

//ici, quand on appuie sur keydown, la fonction callback va etre exectutee
//le keydown c'est quand j'appuie sur une touche, event.code me donne le code dela touche 

//revelation, my things are not working, parce que les codes de mon clavier sont des querty, donc mon w, c'est un z
 
window.addEventListener('keydown', (event) => {
    switch(event.code){
        case 'KeyE' :
                keys.e.pressed = true
                break
        case 'KeyR' :
                keys.r.pressed = true
                break
        case 'KeyD' :
                keys.d.pressed = true
                break     
        case 'KeyT' :
                projectiles.push (new Projectile ({
                    position : {
                         x: player.position.x + Math.cos(player.rotation) * 30,
                         y: player.position.y + Math.sin(player.rotation) * 30, 
                        },
                     velocity : {
                        x : Math.cos(player.rotation) * PROJECTILE_SPEED, //3 is for speed
                        y : Math.sin(player.rotation) * PROJECTILE_SPEED,
                     },
                }))          
    }
})

window.addEventListener('keyup', (event) => {
    console.log(event.code)
    switch(event.code){
        case 'KeyE' :
            keys.e.pressed = false
            break
        case 'KeyR' :
            keys.r.pressed = false
            break
        case 'KeyD' :
            keys.d.pressed = false
            break 
    }
})
