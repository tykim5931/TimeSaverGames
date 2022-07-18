let intro = document.querySelector('.intro')
let splash1 = document.querySelector('#imgspaceship')
let splash2 = document.querySelector('#circle')

window.addEventListener('DOMContentLoaded', ()=>{
    splash1.addEventListener('animationend',()=>{
        setTimeout(() => {
            intro.style.top = '-100vh'
        }, 1600);
        setTimeout(() => {
            init()
            animate()
            modalEl.style.display = 'none'
        }, 1700);
    })

})

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEL = document.querySelector('#scoreEL')
const bigScoreEl = document.querySelector('#bigScoreEl')
const startBtn = document.querySelector('#startButton')
const modalEl = document.querySelector('#modalEl')
const expmsg = document.querySelector('#explain')

let background = new Image()
background.src = "./assets/spacebackGround.png"


class Player {
    constructor(x,y,radius,color){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x+this.velocity.x
        this.y = this.y+this.velocity.y
    }
}

class Enemy {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.index = Math.floor(Math.random()*54) + 1
        this.image = new Image()
        this.image.src = `./assets/enemies/${this.index}.png`
    }

    draw(){
        c.drawImage(this.image, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
    }

    update(){
        this.draw()
        this.x = this.x+this.velocity.x
        this.y = this.y+this.velocity.y
    }
}

const friction = 0.99
class Particle {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }

    draw(){
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x+this.velocity.x
        this.y = this.y+this.velocity.y
        this.alpha -= 0.01
    }
}

const x = canvas.width/2
const y = canvas.height/2

let player = new Player(x,y,10,'white')
let projectiles = []
let enemies = []
let particles = []


function init(){
    player = new Player(x,y,10,'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEL.innerHTML = score
    bigScoreEl.innerHTML = score
}

function spawnEnemies(){
    setInterval(()=>{
        const radius = Math.random() * (30-10) + 10

        let x
        let y

        if(Math.random()<0.5){
            x = Math.random() < 0.5 ? 0-radius : canvas.width+radius
            y = Math.random() * canvas.height
        }else{
            y = Math.random() < 0.5 ? 0-radius : canvas.height+radius
            x = Math.random() * canvas.width
        }

        const color = `hsl(${Math.random()*360}, 70%, 70%)`
        const angle = Math.atan2(canvas.height/2-y, canvas.width/2-x)

        const random = Math.random()+ 3
        const velocity = {
            x: Math.cos(angle)* random * (innerWidth+innerHeight) / 2000.0,
            y: Math.sin(angle)* random * (innerWidth+innerHeight) / 2000.0
        }

        enemies.push(new Enemy(x,y,radius,color,velocity))
    }, 1000)
}

let animationId
let score = 0
function animate(){
    animationId = requestAnimationFrame(animate)
    c.globalAlpha = 0.3
    c.drawImage(background,0,0,innerWidth, innerHeight)
    c.globalAlpha = 1.0
    // c.fillStyle = 'rgba(0,0,0,0.1)'
    // c.fillRect(0,0,canvas.width, canvas.height)
    player.draw()
    particles.forEach((particle, index)=>{
        if(particle.alpha <= 0){
            particles.splice(index, 1)
        } else{
            particle.update()
        }
    })
    projectiles.forEach((projectile, index)=>{
        projectile.update()
        if(
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(()=>{
                projectiles.splice(index,1)
            },0)
        }
    })
    enemies.forEach((enemy, index)=>{
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        //game over
        if(dist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId)
            expmsg.innerHTML = '외계생명체에게 당했습니다! 공부하러 돌아가세요!'
            modalEl.style.display = 'flex'
            bigScoreEl.innerHTML = score
            if(score>1000){
                expmsg.innerHTML = "1단계 통과!"
                startBtn.innerHTML = 'Go to Stage 2'
            }
        }

        projectiles.forEach((projectile, projectileIndex)=>{
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            //hit!
            if(dist - enemy.radius - projectile.radius < 1){
                for(let i=0; i<enemy.radius *2; i++){
                    particles.push(
                        new Particle(
                            projectile.x, projectile.y, 
                            Math.random()*2, `hsl(${Math.random()*360}, 50%, 50%)`, 
                            {x: (Math.random()-0.5)*(Math.random()*6), 
                                y: (Math.random()-0.5)*(Math.random()*6)}
                        )
                    )
                }
                if (enemy.radius - 10 > 10) {
                    score +=10
                    scoreEL.innerHTML = score
                    console.log(score)
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(()=>{
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    score +=15
                    scoreEL.innerHTML = score
                    console.log(score)
                    setTimeout(()=>{
                        enemies.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
                
            }
        })
    })
}

window.addEventListener('click',(event)=>{
    const angle = Math.atan2(
        event.clientY - canvas.height/2, 
        event.clientX - canvas.width/2
    )
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4,
    }
    projectiles.push(
        new Projectile(
            canvas.width/2, 
            canvas.height/2, 
            5, 'white', 
            velocity
        )
    )
})

spawnEnemies()

startBtn.addEventListener('click', ()=>{
    if(startBtn.innerHTML=='Go to Stage 2'){
        console.log(startBtn.innerHTML)
        document.location.href='http://192.249.18.156:443/junglegame'
    }
    init()
    animate()
    modalEl.style.display = 'none'
})

dmBtn.addEventListener('dblclick', ()=> {
    console.log('jump stages')
    document.location.href='http://192.249.18.156:443/junglegame'   // TODO need to change link to lev3 
})