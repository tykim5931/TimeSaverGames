let intro = document.querySelector('.intro')
let splash1 = document.querySelector('#imgufo')
let splash2 = document.querySelector('#circle')

window.addEventListener('DOMContentLoaded', ()=>{
    splash1.addEventListener('animationend',()=>{
        setTimeout(() => {
            intro.style.top = '-100vh'
        },1600);
        setTimeout(() => {
            init()
            animate()
            modalEl.style.display = 'none'
        }, 1700);
    })   
})

const canvas = document.getElementById('Mycanvas')
const c = canvas.getContext('2d')

const _width = innerWidth-1
const _height = innerHeight-1
canvas.width = _width
canvas.height = _height

const gravity = 1.5
const vel = 5
const totalLength = 10000;
const meterEl = document.getElementById('meterEl')
const startGameBtn = document.getElementById('startGameBtn')
const modalEl = document.getElementById('modalEl')
const finalmeter = document.getElementById('finalmeter')
const dmBtn = document.getElementById('dmBtn')

class Player {
    constructor(){
        this.position = {
            x: 100,
            y: 450
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.width = 10
        this.height = 10
        this.radius = 10
    }
    draw() {
        c.fillStyle = 'white'
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
        c.fill()
        // c.fillRect(this.position.x, this.position.y, 
        // this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height +this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }else{
            // this.velocity.y = 0
        }
    }
}

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.width = 250
        this.height = 30
        this.image = image
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y,this.width, this.height)
    }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.width = _width
        this.height = _height
        this.image = image
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y,this.width, this.height)
    }
}

function createImage(imgSrc){
    const image = new Image()
    image.src = imgSrc
    return image
}


// ######################## initial call ############################
let player = new Player()

let platformImage = createImage("./img/platform.png")

let platforms = [new Platform({ x:0, y:470, image:platformImage }),
    new Platform({ x:249, y:470, image:platformImage })]
for(i=400; i<=totalLength+_width; i+=_width){
    platforms.push(new Platform({ x:0+i, y:innerHeight*(4.0/5.0), image:platformImage })),
    platforms.push(new Platform({ x:350+i, y:innerHeight*(3.0/5.0), image:platformImage })),
    platforms.push(new Platform({ x:700+i, y:innerHeight*(4.5/5.0), image:platformImage })),
    platforms.push(new Platform({ x:1050+i, y:innerHeight*(3.0/5.0), image:platformImage }))
    platforms.push(new Platform({ x:1550+i, y:innerHeight*(4.0/5.0), image:platformImage }))
}
let background =  createImage("./img/background.png")
let genericObjects =[]
for(i=0; i<=totalLength+_width; i+=_width){
    genericObjects.push(new GenericObject({x:i,y:0,image: background}))
}
let keys = {
    right: {
        pressed:false
    },
    left: {
        pressed: false
    }
}
let scrollOffset = 0
meterEl.innerHTML = scrollOffset


// ########################## init function ############################
function init(){
    player = new Player()
    scrollOffset = 0
    platforms = [new Platform({ x:0, y:470, image:platformImage }),
                    new Platform({ x:240, y:470, image:platformImage })]
    
    for(i=400; i<=totalLength+_width; i+=_width){
        platforms.push(new Platform({ x:0+i, y:innerHeight*(4.0/5.0), image:platformImage })),
        platforms.push(new Platform({ x:350+i, y:innerHeight*(3.0/5.0), image:platformImage })),
        platforms.push(new Platform({ x:700+i, y:innerHeight*(4.5/5.0), image:platformImage })),
        platforms.push(new Platform({ x:1050+i, y:innerHeight*(3.0/5.0), image:platformImage }))
        platforms.push(new Platform({ x:1550+i, y:innerHeight*(4.0/5.0), image:platformImage }))
    }
    genericObjects =[]
    for(i=0; i<=totalLength+_width; i+=_width){
        genericObjects.push(new GenericObject({x:i,y:0,image: background}))
    }
    meterEl.innerHTML = scrollOffset
}


// ####################### animate function ############################
let animationID
function animate(){
    animationID = requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width, canvas.height)
    clearArc(c, player.position.x, player.position.y, player.radius)

    genericObjects.forEach(genericObject =>{
        genericObject.draw()
    })
    player.update()
    meterEl.innerHTML = scrollOffset

    platforms.forEach(platform => {
        platform.draw()
    })

    // scroll background & platform
    player.velocity.x = 0
    scrollOffset += vel
    if(scrollOffset <= totalLength){
        platforms.forEach(platform => {
            platform.position.x -= vel
        })
        genericObjects.forEach(genericObject => {
            genericObject.position.x -= 3
        })
    }

    // platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y+10 &&
            player.position.y + player.height + player.velocity.y >= platform.position.y+10 &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }else if(player.position.y >= _width-10){
            player.velocity.y = 0
        }
    })


    // win condition
    if(scrollOffset >= totalLength){
        console.log("you win")
    }

    // end condition
    if (player.position.y > canvas.height || player.position.y -player.height<= 0){
        cancelAnimationFrame(animationID)
        finalmeter.innerHTML = scrollOffset
        modalEl.style.display = 'flex'
    } else if(scrollOffset >= totalLength){ // win condition
        cancelAnimationFrame(animationID)
        finalmeter.innerHTML = scrollOffset
        startGameBtn.innerHTML = 'Go to Stage 3'
        modalEl.style.display = 'flex'
    }
}


startGameBtn.addEventListener('click', () => {
    if(startGameBtn.innerHTML=='Go to Stage 3'){
        console.log(startGameBtn.innerHTML)
        document.location.href='http://192.249.18.156:443/junglegame'   // TODO need to change link to lev3 
    }
    console.log("cicked")
    init()
    animate()
    modalEl.style.display = 'none'
})

function clearArc(context, x, y, radius){
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}

addEventListener('click', ()=> {
    console.log('mouseclick')
    player.velocity.y -= 20
})

dmBtn.addEventListener('dblclick', ()=> {
    console.log('jump stages')
    document.location.href='http://www.youtube.com'   // TODO need to change link to lev3 
})
