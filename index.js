const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 960;
canvas.height = 540;

const startX = -600;
const startY = -450;

// creating map
const map = new Drawings({
    image: mapImage,
    position: {
        x: startX,
        y: startY,
    },
    width: mapImage.width,
    height: mapImage.height,
});
// creating foreground 
const foreground = new Drawings({
    image: foregroundImage,
    position: {
        x: startX,
        y: startY,
    },
    width: foregroundImage.width,
    height: foregroundImage.height,
})
// creating player
const player = new Drawings({
    image: playerDown,
    position: {
        x: canvas.width/2,
        y: canvas.height/2 - playerDown.height/2,
    },
    animation: 0,
    cut: 8,
})

const collisions = [];
for(let i = 0; i < CollisionsData.length; i += 70) {
    collisions.push(CollisionsData.slice(i, i + 70));
}
const boundries = [];
collisions.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1387) {
            boundries.push(new Boundary(
                {position: {
                    x: startX + Boundary.width*j,
                    y: startY + Boundary.height*i,
                }}
            ))
        }
    })
})

let chestCollisions = [];
for(let i = 0; i < chestData.length; i += 70) {
    chestCollisions.push(chestData.slice(i, i + 70));
}

const chestBoundries = [];
chestCollisions.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 1387) {
            chestBoundries.push(new Boundary(
                {position: {
                    x: startX + Boundary.width*j,
                    y: startY + Boundary.height*i,
                }}
            ))
        }
    })
})


// variables for moving
let keyPressedW = false;
let keyPressedS = false;
let keyPressedA = false;
let keyPressedD = false;
let keyValue = '';
let keyValueS = '';
let keyValueA = '';
let keyValueD = '';
// function with conditions for collision, if conditions are true it means there is a collision
function detectingCollision({obj1, obj2, num = 0}) {
    return obj1.position.x <= obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width >= obj2.position.x + num && 
    obj1.position.y - num <= obj2.position.y + obj2.height &&
    obj1.position.y + obj1.height >= obj2.position.y
}
// function checking every boundry if there is a collision, if is player cant move
let canMove = true;
function loopForDetecting(arr, numX, numY) {
    for(let i = 0; i < arr.length; i++) {
        let boundry = arr[i];
        if(detectingCollision(
            {
            obj1 :player,
            obj2: {...boundry, 
                position: {
                    x: boundry.position.x + numX, // numX and numY prevent player from getting stuck
                    y: boundry.position.y + numY
                }}}
            )) {
            canMove = false;
            break;
        }    
    }
    return canMove;
}

let generalCanMove = false;
let checkerForChestInteraction = true;
function chestInteraction() {
    for(let i = 0; i < chestBoundries.length; i++) {
    if(!detectingCollision(
        {
            obj1: player,
            obj2: chestBoundries[i],
            num: 40,
        }
    )) {
        checkerForChestInteraction= true;
    } 
}
    for(let i = 0; i < chestBoundries.length; i++) {
        if(detectingCollision(
            {
                obj1: player,
                obj2: chestBoundries[i],
                num: 40,
            }
        ) && checkerForChestInteraction) {
            generalCanMove = false;
            const chest = document.querySelector('.chest');
            const close = document.querySelector('.close')
            
            chest.classList.add('active');
            close.addEventListener('click', (e) => {
                chest.classList.remove('active');
                checkerForChestInteraction = false;
                generalCanMove = true;
            })
        }
    }
    return
}
// variables needed for counting to applay animations
let nA = 0;
let anim = 0;
// function for player animation
function playerAnimation (direction) {
    nA++;
    if (nA % 5 === 0) {
        anim++;
    }
    if(anim < 8) {
        player.animation = anim * 40;
    } else {
        anim = 0;
    }
    player.image = direction;
}
// movables keeps all elements which are supposed to move 
const movables = [map, ...boundries, foreground, ...chestBoundries]

//main functionality of the game
function game() {
    window.requestAnimationFrame(game);
    map.draw();
    boundries.forEach((boundry) => {
        boundry.draw();
    })
    chestBoundries.forEach((boundary) => {
        boundary.draw();
    })
    player.draw();
    foreground.draw();
    
    if(generalCanMove) {
    // this canMove is for refreshing after returning false by loopForDetecting function
        canMove = true;
        if(keyValue === 'w' && keyPressedW) {
            playerAnimation (playerUp);
            loopForDetecting(boundries, 0, 3);
            chestInteraction();
            if (canMove) {
                movables.forEach((movable) => {
                    movable.position.y += 3;
            })
        }
        } else if (keyValue === 's' && keyPressedS) {
            playerAnimation (playerDown);
            loopForDetecting(boundries, 0, -3);
            chestInteraction();
            if (canMove) {
                movables.forEach((movable) => {
                    movable.position.y -= 3;
            })
        }
        } else if (keyValue === 'a' && keyPressedA) {
            playerAnimation (playerLeft);
            loopForDetecting(boundries, 3, 0);
            chestInteraction();
            if (canMove) {
                movables.forEach((movable) => {
                    movable.position.x += 3;
            })
        }
        } else if (keyValue === 'd' && keyPressedD) {
            playerAnimation (playerRight);
            loopForDetecting(boundries, -3, 0);
            chestInteraction();
            if (canMove) {
                movables.forEach((movable) => {
                    movable.position.x -= 3;
            })
        }
        }
    }
}

function startGame () {
    const startButton = document.querySelector('#start-button');
    const greetings = document.querySelector('.greetings');

    startButton.addEventListener('click', (e) => {
        greetings.classList.remove('active');
        generalCanMove = true;
    })
    window.requestAnimationFrame(game);
}

 startGame();





window.addEventListener('keydown', (e) => {
    if(e.key === 'w') {
        keyPressedW = true;
        keyValue = 'w';
    } else if (e.key === 's') {
        keyPressedS = true;
        keyValue = 's';
    } else if (e.key === 'a') {
        keyPressedA = true;
        keyValue = 'a';
    } else if (e.key === 'd') {
        keyPressedD = true;
        keyValue = 'd';
    }
})

window.addEventListener('keyup', (e) =>{
    if(e.key === 'w') {
        keyPressedW = false;
        keyValueW = '';
    } else if (e.key === 's') {
        keyPressedS = false;
        keyValueS = '';
    } else if (e.key === 'a') {
        keyPressedA = false;
        keyValueA = '';
    } else if (e.key === 'd') {
        keyPressedD = false;
        keyValueS = '';
    } 
})
