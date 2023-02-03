const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoredisplay = document.querySelector('#score');
const startbtn = document.querySelector("#start-btn");
const Sline = document.querySelector('#sline');
const width = 10;
let nextrandom =0;
let timerid;
let score =0;
let sline =0;

const colors = [
    'orange',
    'aquamarine',
    'purple',
    'red',
    'green'
]

const lTetromino = [
    [1,width+1,width*2+1,2],
    [width,width+1,width+2,width*2+2],
    [1,width+1,width*2+1,width*2],
    [width,width*2,width*2+1,width*2+2]
];

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1]
];

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
];

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
];

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
];

const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];
let currentposition = 3;
let random = Math.floor(Math.random()*theTetrominoes.length);
let currentrotation = 0;
let current = theTetrominoes[random][currentrotation];

function draw(){
    current.forEach(
        (index)=> {
            squares[currentposition + index].classList.add("tetromino")
            squares[currentposition + index].style.backgroundColor = colors[random];
        }
    )
}


const undraw = () =>{
    current.forEach(
        (index)=> {
            squares[currentposition + index].classList.remove('tetromino')
            squares[currentposition + index].style.backgroundColor = '';
        }
    )
}



function movedown () {
    undraw();
    currentposition += width;
    draw();
    freeze();
    
}

document.addEventListener("keyup",control);


function control(e) {
    if(e.keyCode === 37){
        moveleft();
    }
    if(e.keyCode === 39){
        moveright();
    }
    if(e.keyCode === 40){
        movedown();
    }
    if(e.keyCode === 38) {
        rotate();
    }
}

const freeze = () =>{
    if(current.some(index=> squares[currentposition+index+width].classList.contains('taken'))){
        current.forEach(
            (index)=> {
                squares[currentposition + index].classList.add('taken');
            }
        )
        random =nextrandom;
        nextrandom = Math.floor(Math.random()*theTetrominoes.length);
        current = theTetrominoes[random][currentrotation];
        currentposition = 4;
        draw();
        displayshape();
        addscore();
        gameover();
    }
}

function moveleft (){
    undraw();
    let isleftedge = current.some(index=> (currentposition+index)%width == 0);
    if(!isleftedge) currentposition -=1;

    if(current.some(index=> squares[currentposition + index].classList.contains('taken'))){
        currentposition += 1;
    }
    draw();
    
}

function moveright (){
    undraw();
    let isrightedge = current.some(index=> ((currentposition+index)-9)%width == 0);
    if(!isrightedge) currentposition +=1;

    if(current.some(index=> squares[currentposition + index].classList.contains('taken'))){
        currentposition -= 1;
    }
    draw();
    
}

function rotate (){
    undraw();
    
    let isleftedge = current.some(index=> (currentposition+index)%width == 0);
    

    let isrightedge = current.some(index=> ((currentposition+index)-9)%width == 0);
    

    if(!isleftedge && !isrightedge){
        currentrotation++;
    }

    if(currentrotation === current.length){
        currentrotation =0;
    }
    current = theTetrominoes[random][currentrotation];
    draw();
}

const displaysquares = document.querySelectorAll(".mini-grid div");
const displaywidth = 4;
let displayindex = 0;

const upnexttetrominoes = [
    [1,displaywidth+1,displaywidth*2+1,2],
    [0,displaywidth,displaywidth+1,displaywidth*2+1],
    [1,displaywidth,displaywidth+1,displaywidth+2],
    [0,1,displaywidth,displaywidth+1],
    [1,displaywidth+1,displaywidth*2+1,displaywidth*3+1]
];

function displayshape() {
    displaysquares.forEach(
        square=>{
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        }
    )
    upnexttetrominoes[nextrandom].forEach(index =>{
        displaysquares[displayindex + index].classList.add('tetromino');
        displaysquares[displayindex + index].style.backgroundColor = colors[nextrandom];
    })
}

startbtn.addEventListener(
    "click",

    function() {
        if(timerid){
            clearInterval(timerid)
            timerid = null;
        }
        else{
            draw();
            timerid = setInterval(movedown,1000);
            nextrandom= nextrandom = Math.floor(Math.random()*theTetrominoes.length);
            displayshape();
        }
    }
)

function addscore() {
    for(let i=0;i<200;i+=width){
        const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]

        if(row.every(index => squares[index].classList.contains('taken'))){
            score+= 10;
            sline+= 1;
            scoredisplay.innerHTML= score;
            Sline.innerHTML = sline;
            row.forEach(index=> {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresremoved = squares.splice(i,width);
            squares = squaresremoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
   
}

function gameover() {
    if(current.some(index => squares[currentposition + index].classList.contains('taken'))) {
        scoredisplay.innerHTML = 'end'
        clearInterval(timerid)
    }
}