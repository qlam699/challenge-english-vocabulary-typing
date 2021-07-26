// Constant
const LOCAL_DATA = 'LOCAL_DATA';
const GAME_NAME = 'Challenge English Vocabulary Typing';
// init
const btnStart = document.getElementById('btnStart');
const panel = document.getElementById('panel');
const nameElement = document.getElementById('name');
const wordsElement = document.getElementById('words');

let c = document.getElementById('canvas');
let ctx = c.getContext('2d');
c.height = window.innerHeight * 0.98;
c.width = window.innerWidth * 0.996;

let array = [];
let y = -10;
let h = 0;
let ct = 8;
let len = 0, scr = 0;

let indexWordList = 0;
let level = 0;

let selectColor = ['#DB291D', '#F85F68', '#77B1AD', '#F0B99A', '#E1CF79', '#F5998E', '#B16774', '#FAB301',
  '#F85F68', '#4FAA6D', 'orange', 'green', '#58A8C9', '#CDD6D5', '#ECD2A2', 'white'];

let theme = ['eyes', 'smile', 'rain', 'yeah', "connect", "with", "us", "on", "social", "media", "and", "on", "our", "blog", "to", "start", "seeing", 'zoo', 'orange', 'dog', 'pen'];
if (!getLocalData())
  saveLocalData([{ name: 'default', words: theme }]);
renderWordList();

// functions
function getLocalData() {
  return JSON.parse(localStorage.getItem(LOCAL_DATA));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function saveLocalData(data) {
  localStorage.setItem(LOCAL_DATA, JSON.stringify(data));
}

function changeIndexWordList(index) {
  indexWordList = index;

  const data = getLocalData();
  nameElement.value = data[index].name;
  wordsElement.value = data[index].words;
  renderWordList();
}

function renderWordList() {
  let wordList = document.getElementById('wordList');
  if (wordList) {
    wordList.textContent = '';
    const list = getLocalData();
    list.forEach((el, index) => {
      const element = document.createElement('li');
      element.innerText = el.name;
      element.onclick = function () {
        theme = el.words;
        changeIndexWordList(index);
      }
      if (index === indexWordList) {
        element.classList = 'selected'
      }
      wordList.appendChild(element)
    })
  }
}

function saveWords() {
  const words = getLocalData();
  if (!nameElement.value || !wordsElement.value) {
    alert('Please fill the name and words before saving');
  } else {
    const newData = [...words, { name: nameElement.value, words: wordsElement.value.toLowerCase().split(/[(\n),(\s)]/).filter(e => e) }];
    saveLocalData(newData);
    renderWordList();
  }
}

function Balloon(x, y, r, color, dy, text, word) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
  this.dy = dy;
  this.text = text;
  this.word = word;

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.font = '15px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(this.text, this.x - 32, this.y + 3);
  }
  this.update = function () {
    this.type();
    this.y += this.dy
  }
  this.type = function () {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(this.word, 670, 580);
  }
}


function drawStartScreen(isGameOver = false) {

  panel.style.display = 'block';

  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  if (isGameOver) {
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', c.width / 2 - 250, c.height / 2 - 160);
  } else {
    ctx.fillText(scr, 1280, 20);
    ctx.font = '40px Arial';
    ctx.strokeStyle = 'lightgrey';
    ctx.strokeText(GAME_NAME, 10, 40);
  }

}
const makeRepeated = (arr, repeats) =>
  Array.from({ length: repeats }, () => arr).flat();

function start() {
  array = [];
  y = -10;
  level++;
  
  shuffleArray(theme);
  const tempTheme = makeRepeated(theme, level);
  console.log(tempTheme)
  for (let i = 0; i < tempTheme.length; i++) {
    let x = Math.random() * (800 - 60) + 30;
    y -= Math.random() * (120 - 60) + 60;
    // y -= 66;
    let r = 40;
    let dy = 1;
    let color = selectColor[Math.floor(Math.random() * (selectColor.length - 1))];
    let text = tempTheme[i];
    array.push(new Balloon(x, y, r, color, dy, text, ''));
  }


  animate();
  panel.style.display = 'none';
}

drawStartScreen();
let keyAnimation = null;
function animate() {
  keyAnimation = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.font = '18px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('SCORE: ' + scr, 10, 70);
  ctx.fillText('Level: ' + level, 10, 90);

  ctx.font = '40px Arial';
  ctx.strokeStyle = 'lightgrey';
  ctx.strokeText(GAME_NAME, 10, 40);
  ctx.beginPath();
  ctx.fillStyle = 'lightgrey';
  ctx.fillRect(c.width / 2 - 20, c.height - 50, 50, 50);
  ctx.fill();
  if(scr === theme.length){
    ctx.fillStyle = 'black'
    ctx.fillText('Yeah! Win Level ' + level, c.width / 2 - 100, c.height / 2 - 100)
    cancelAnimationFrame(keyAnimation);
  }
  loopBubble();
}

function loopBubble() {
  const len = array.length;
  for (let m = 0; m < len; m++) {
    array[m].draw();
  }
  for (let p = 0; p < len; p++) {
    array[p].update();
    if (array[p].y >= c.height) {
      if (array[p].r > 0) {
        cancelAnimationFrame(keyAnimation);
        drawStartScreen(true);
        return;
      }

      // If the last bubble fall so we win
      if (p === len - 1) {
        ctx.fillStyle = 'black'
        ctx.fillText('Yeah! Win Level ' + level, c.width / 2 - 100, c.height / 2 - 100)
        cancelAnimationFrame(keyAnimation);
        setTimeout(() => {
          start()
        }, 2000)
      }
    }

  }
}

window.addEventListener('keyup', function (event) {
  let char = String.fromCharCode(event.keyCode).toLowerCase();
  if (ct == 8) {
    for (let g = 0; g < array.length; g++) {
      if (array[g].y >= 0 && array[g].text.substring(0, 1) === char) {
        h = g;
        len = array[h].text.length;
        break;
      }
    }
  }

  if (array[h]?.text.substring(0, 1) === char) {
    let word = array[h].text.substring(0, 1);
    array[h].word = word;
    array[h].text = (array[h].text).replace(word, '');
    ct--;
    if (array[h].text.length == 0) {
      ct += len;
      array[h].r = 0;
      array[h].y = 0;
      scr++;
      array[h].word = '';
    }
  }
});


