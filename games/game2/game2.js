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

// get USER and HOSTNAME and TIME INFO from url
const currURL = document.URL

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


const USERID = getParameterByName('id',currURL)
const HOSTNAME = getParameterByName('hostname',currURL)
const TIME = parseInt(getParameterByName('time', currURL))
//=================================================


//====================timer========================
const startTime = Date.now()
let currTime = Date.now()
function timeout(){
    currTime = Date.now()
    let diff = currTime - startTime
    if(TIME - diff <= 0){
        return true
    }
    return false
}
// ================================================

const canvas = document.getElementById('Mycanvas')
const c = canvas.getContext('2d')

const _width = innerWidth-1
const _height = innerHeight-1
canvas.width = _width
canvas.height = _height

const gravity = 1.25
const vel = 5
const totalLength = 10000;
const meterEl = document.getElementById('meterEl')
const startGameBtn = document.getElementById('startGameBtn')
const modalEl = document.getElementById('modalEl')
const finalmeter = document.getElementById('finalmeter')
const dmBtn = document.getElementById('dmBtn')
const expmsg = document.getElementById('explain')

class Player {
    constructor(){
        this.position = {
            x: parseInt(_width*(1/4)),
            y: parseInt(_height*(1/2))
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.width = 10
        this.height = 10
        this.radius = 10
        this.color ="white"
    }
    draw() {
        c.fillStyle = this.color
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

class Enemy {
    constructor(x,y,radius,color,velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.index = Math.floor(Math.random()*54) + 1
        this.image = new Image()
        this.image.src = `./img/enemies/${this.index}.png`
    }

    draw(){
        c.drawImage(this.image, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
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


function createImage(imgSrc){
    const image = new Image()
    image.src = imgSrc
    return image
}


let player = new Player()
let genericObjects
let background =  createImage("./img/background.png")
let platforms
let platformImage = createImage("./img/platform.png")
let scrollOffset
let enemies
let gmin = 50
let gmax = 200
let ymin = _height*(2.0/7.0)
let ymax = _height*(6.0/7.0)
let emin = _height*(1.0/8.0)
let emax = _height*(7.0/8.0)

let currLength

var audio = document.getElementById("audio_playo24");

if (audio) {
  window.addEventListener('keydown', function (event) {
    var key = event.which || event.keyCode;
    if (key === 32) { // spacebar
      // eat the spacebar, so it does not scroll the page
      event.preventDefault();
      audio.paused ? audio.play() : audio.pause();
    }
  });
}

function init(){
    //================= draw platform ============================
    player = new Player()

    // 초기발판
    platforms = [new Platform({ x:0, y:_height*(2.0/3.0), image:platformImage }),
        new Platform({ x:249, y:_height*(2.0/3.0), image:platformImage }),
        new Platform({ x:499, y:_height*(2.0/3.0), image:platformImage })]
    
    // 발판
    for(let i=800; i<=totalLength+_width; i+=_width){
        let tot = 0
        let cnt = 0
        while(tot < _width-250){
            let gap = Math.floor(Math.random() * (gmax-gmin))+gmin
            let ypos = Math.floor(Math.random() * (ymax-ymin))+ymin
            platforms.push(new Platform({ x:i+tot+gap, y:ypos, image:platformImage }))
            tot += 250+gap
            cnt += 1
        }
    }
    platforms.push(new Platform({ x:10000+375, y:_height*(2.0/3.0), image:platformImage }))
    // Enemy
    enemies = []
    for(let i=_width+600; i<=totalLength*2; i+=_width){
        for(let j = 0; j <=2; j++){
            const radius = Math.random() * (40-15) + 15
            let color = `hsl(${Math.random()*360}, 70%, 70%)`
            let eVelocity = Math.floor(Math.random() * (15-6))+6
            let expos = Math.floor(Math.random() * (500-100))+100
            let eypos = Math.floor(Math.random() * (emax-emin))+emin
            enemies.push(new Enemy(i+expos,eypos,radius,color,eVelocity))
        }
    }

    //================draw background=====================
    genericObjects =[]
    genericObjects.push(new GenericObject({x:0,y:0,image: background}))
    for(let i=0; i<=totalLength+_width; i+=_width){
        genericObjects.push(new GenericObject({x:i,y:0,image: background}))
    }

    scrollOffset = 0
    currLength = _width
    meterEl.innerHTML = scrollOffset
    
    audio.play()
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

    enemies.forEach(enemy => {
        enemy.draw()
    })

    // scroll background & platform
    player.velocity.x = 0
    scrollOffset += vel
    if(scrollOffset <= totalLength){
        platforms.forEach(platform => {
            platform.position.x -= vel
        })
        genericObjects.forEach(genericObject => {
            genericObject.position.x -= vel-2
        })
        enemies.forEach(enemy =>{
            enemy.x -= enemy.velocity
        })
    }else{
        scrollOffset = totalLength
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

    // end condition
    // timeout
    if(timeout()){
        alert("제한시간 5분이 초과되었습니다. 게임이 종료됩니다. 내일 다시 시도하세요!")
        document.location.href=`http://${HOSTNAME}`
    }
    // enemy collision detection
    let dead = false;
    enemies.forEach(enemy =>{
        const dist = Math.hypot(player.position.x - enemy.x, player.position.y - enemy.y)
        //game over
        if(dist - enemy.radius < 0){
            expmsg.innerHTML = "외계바이러스에 감염되어 죽었습니다! 공부하러 돌아가세요!"
            dead = true
        }
    })
    if (player.position.y > canvas.height){
        expmsg.innerHTML = "뱀에 물려 죽었습니다! 공부하러 돌아가세요!"
        dead = true
    }else if( player.position.y -player.height<= 0){
        expmsg.innerHTML = "새에게 잡혀 죽었습니다! 공부하러 돌아가세요!"
        dead = true
    } else if(scrollOffset >= totalLength){ 
        audio.pause()
        expmsg.innerHTML = "2단계 통과!"
        setTimeout(() => {console.log("세 번째 메시지")}, 1000);
        // win condition

        // 헬기 날아와서 대기
        // 헬기에 공이 부딪히면 go stage 3 창 띄우기
        cancelAnimationFrame(animationID)
        finalmeter.innerHTML = scrollOffset
        startGameBtn.innerHTML = 'Go to Stage 3'
        modalEl.style.display = 'flex'
    }
    if(dead){  
        cancelAnimationFrame(animationID)
        finalmeter.innerHTML = scrollOffset
        modalEl.style.display = 'flex'
    }   
}


startGameBtn.addEventListener('click', () => {
    if(startGameBtn.innerHTML=='Go to Stage 3'){
        document.location.href=`http://192.249.18.156:443/homecoming?id=${USERID}&hostname=${HOSTNAME}&time=${TIME-(Date.now()-startTime)}`
    }
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
    player.velocity.y -= 17
})

dmBtn.addEventListener('dblclick', ()=> {
    document.location.href=`http://192.249.18.156:443/homecoming?id=${USERID}&hostname=${HOSTNAME}&time=${TIME-(Date.now()-startTime)}`
})
