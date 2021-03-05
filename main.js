let tableSize = 20;
let paintDelay = 500; //ms
let delayForBoxLengthIncrement = paintDelay * 2;
let boxFillcolor = 'rgb(0, 0, 0)';
let globalNonceObj;
let haltProcess = false;
let inc = true, directionX = true;
let currentApplePosition = [];
let score = 0;

let cellBorderVal = 'thin solid rgb(243, 237, 237)';
let cellNoBorderVal = '0 solid rgb(243, 237, 237)';

document.onkeydown = (e) => {
    switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
            setMoveProp(true, false)
            break;
        case 'KeyS':
        case 'ArrowDown':
            setMoveProp(false, true)
            break;
        case 'KeyD':
        case 'ArrowRight':
            setMoveProp(true, true)
            break;
        case 'KeyW':
        case 'ArrowUp':
            setMoveProp(false, false)
            break;
    }

};

function plotApple() {
    let randomPosition = getRandomPosition();
    let randPosBackground = document.getElementById(`${randomPosition[0]}-${randomPosition[1]}`).style.background;
    if (randPosBackground != 'white') {
        plotApple();
        return;
    }
    document.getElementById(`${randomPosition[0]}-${randomPosition[1]}`).style.background = 'Red';
    currentApplePosition = [randomPosition[0], randomPosition[1]];
}

function getRandomPosition() {
    let iRandom = Math.floor(Math.random() * (tableSize - 1));
    let jRandom = Math.floor(Math.random() * (tableSize - 1));
    return [iRandom, jRandom];
}

function setMoveProp(dirX, incr, isStart = false) {
    if (directionX == dirX && incr != inc && !isStart) return;
    inc = incr;
    directionX = dirX;
}

function createTable() {
    document.querySelector('div.table-container').innerHTML = '';
    let table = document.createElement('table');
    for (let i = 0; i < tableSize; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < tableSize; j++) {
            let td = document.createElement('td');
            td.id = `${i}-${j}`;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.querySelector('div.table-container').appendChild(table);
}

function resetFill() {
    document.querySelectorAll('td').forEach(elem => {
        elem.style.background = 'white';
    });
}

function initValues() {
    score = 0;
    document.getElementById('score-count').innerText = score;
    let delayTime = document.getElementById('select-snake-speed').value.trim();

    if (!!delayTime) paintDelay = parseInt(delayTime);
    delayForBoxLengthIncrement = paintDelay * 2;
}

async function start() {
    haltProcess = false;
    setMoveProp(true, true, true);
    let localNonceObj = globalNonceObj = new Object();
    handleStartGameScreen();
    initValues();
    createTable();
    resetFill();
    plotApple();
    await processLogic(localNonceObj); //process initiate
}

function handleStartGameScreen() {
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('gameOver-Message').style.display = 'none';
}

function getAxisPosition(i, j) {
    if (directionX) {
        let jVal = inc ? j + 1 : j - 1;
        jVal = (jVal < 0) ? tableSize - 1 :
            (jVal > tableSize - 1) ? 0 : jVal;
        return [i, jVal];
    }
    else {
        let iVal = inc ? i + 1 : i - 1;
        iVal = (iVal < 0) ? tableSize - 1 :
            (iVal > tableSize - 1) ? 0 : iVal;
        return [iVal, j];
    }
}

async function processLogic(localNonceObj) {
    // actual logic 
    let i = 0, j = 0;
    while (true) {
        /************ halt check *************/
        if (localNonceObj != globalNonceObj) return;
        if (haltProcess) return;
        /************ halt check *************/

        let ij = getAxisPosition(i, j);
        i = ij[0];
        j = ij[1];

        checkForGameOver(i, j);
        document.getElementById(`${i}-${j}`).style.background = boxFillcolor;
        document.getElementById(`${i}-${j}`).style.border = cellNoBorderVal;
        checkForAppleCatch(i, j);
        unfillPaintWithDelay(i, j);
        await delay(paintDelay);
    }
}

function checkForAppleCatch(x, y) {
    if (currentApplePosition[0] == x && currentApplePosition[1] == y) {
        score++;
        document.getElementById('score-count').innerText = score;
        delayForBoxLengthIncrement += paintDelay;
        plotApple();
    }
}

function unfillPaintWithDelay(x, y) {
    setTimeout(() => {
        paintBoxWhite(x, y)
    }, delayForBoxLengthIncrement);
}

function paintBoxWhite(i, j) {
    if (haltProcess) return;
    document.getElementById(`${i}-${j}`).style.background = 'white';
    document.getElementById(`${i}-${j}`).style.border = cellBorderVal;
}

function checkForGameOver(i, j) {
    let currBackgroundColor = document.getElementById(`${i}-${j}`).style.background;
    if (currBackgroundColor == boxFillcolor)
        gameOver();
}

async function gameOver() {
    haltProcess = true;
    document.getElementById('gameOver-Message').style.display = 'block';
    for (let i = 0; i < tableSize; i++) {
        for (let j = 0; j < tableSize; j++) {
            document.getElementById(`${i}-${j}`).style.background = "#d8caca";
            document.getElementById(`${i}-${j}`).style.border = cellNoBorderVal;
        }
        await delay(50);
    }
}

function setHaltProcess() {
    haltProcess = true;
}

function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delayInms);
    });
}