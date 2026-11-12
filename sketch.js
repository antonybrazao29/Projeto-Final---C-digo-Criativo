
let holes = [
  { id: 0, key: "q", x: 200, y: 390, r: 25, covered: false, visible: true },
  { id: 1, key: "w", x: 250, y: 350, r: 25, covered: false, visible: true },
  { id: 2, key: "e", x: 290, y: 299, r: 25, covered: false, visible: true },
  { id: 3, key: "r", x: 320, y: 245, r: 25, covered: false, visible: true },
  { id: 4, key: "2", x: 285, y: 390, r: 15, covered: false, visible: true },

  { id: 5, key: "y", x: 430, y: 345, r: 25, covered: false, visible: true },
  { id: 6, key: "u", x: 460, y: 290, r: 25, covered: false, visible: true },
  { id: 7, key: "i", x: 500, y: 237, r: 25, covered: false, visible: true },
  { id: 8, key: "o", x: 545, y: 190, r: 25, covered: false, visible: true },
  { id: 9, key: "7", x: 410, y: 260, r: 15, covered: false, visible: true },


  { id: 10, key: "c",x: 90, y: 345, r: 25, covered: false, visible: true },
  { id: 11, key: "n",x: 540, y: 440, r: 25, covered: false, visible: true }
];

let oscillator;
let audioStarted = false;
let currentNote = "—";


let fingering = {
  "111111111111": { frequency: 440.00, note: "LA4" },
  "111111111011": { frequency: 466.16, note: "LA#4" },
  "111101111111": { frequency: 493.88, note: "SI4" },
  "111101111011": { frequency: 523.25, note: "DO5" },
  "111101110111": { frequency: 554.37, note: "DO#5" },
  "111101110011": { frequency: 587.33, note: "RE5" },
  "111101100111": { frequency: 622.25, note: "RE#5" },
  "111101100011": { frequency: 659.25, note: "MI5" },
  "111101000011": { frequency: 698.46, note: "FA5" },
  "111100010011": { frequency: 739.99, note: "FA#5" },
  "111100000011": { frequency: 783.99, note: "SOL5" },
  "110100010011": { frequency: 830.61, note: "SOL#5" },
  "110100000011": { frequency: 880.00, note: "LA5" },
  "100100010011": { frequency: 932.33, note: "LA#5" },
  "100100000011": { frequency: 987.77, note: "SI5" },
  "000100000011": { frequency: 1046.50, note: "DO6" }
};



function setup() {

  let cnv = createCanvas(800, 650);


  cnv.parent("instrument-stage");

 
  cnv.style("background-image", 'url("ocarina vector.svg")');
  cnv.style("background-repeat", "no-repeat");
  cnv.style("background-position", "center");
  cnv.style("background-size", "95% 95%");


  oscillator = new p5.Oscillator("sine");


  oscillator.amp(0);


  window.addEventListener("blur", releaseAllKeys);
}



function draw() {

  clear();

  
  drawHoles();

 
  textAlign(CENTER, CENTER);
  noStroke();


  fill(255);
  textSize(38);
  textStyle(BOLD);

  text(currentNote, 400, 475);

 
  stroke(74, 157, 211);
  strokeWeight(3);
  line(365, 505, 435, 505);

  
  noStroke();
  fill(100, 115, 125);
  textSize(14);
  textStyle(NORMAL);

  text("USA AS TECLAS PARA TOCAR", 400, 540);

}





function drawHoles() {

  for (let h of holes) {

    if (!h.visible) {
      continue;
    }

   
    noStroke();
    fill(0, 0, 0, 35);
    ellipse(h.x, h.y + 2, h.r * 2.2);

    fill(8, 38, 64);
    ellipse(h.x, h.y, h.r * 2);


    if (h.covered) {

      fill(74, 157, 211);
      stroke(12, 65, 110);
      strokeWeight(2.5);

      ellipse(h.x, h.y, h.r * 2);

      noStroke();
      fill(255, 255, 255, 60);
      ellipse(h.x - 4, h.y - 4, h.r * 0.6);
    }

   
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);

    text(h.key.toUpperCase(), h.x, h.y);
  }

  textStyle(NORMAL);
}




async function startOcarina() {

  if (!audioStarted) {

    await userStartAudio();

    oscillator.start();
    oscillator.amp(0);

    audioStarted = true;

    updateOcarinaSound();
  }
}



function updateOcarinaSound() {

  if (!audioStarted) {
    return;
  }


  let combination = "";

  for (let h of holes) {
    combination += h.covered ? "1" : "0";
  }


  let result = fingering[combination];

  
  if (result === undefined) {

    currentNote = "-";
    oscillator.amp(0, 0.08);

    return;
  }


  currentNote = result.note;


  oscillator.freq(result.frequency, 0.08);
  oscillator.amp(0.18, 0.08);

  console.log("Nota:", result.note);
}


function keyPressed(event) {

  startOcarina();

  let pressedKey = event.key.toLowerCase();


  if (event.repeat) {
    return false;
  }


  for (let h of holes) {

    if (pressedKey === h.key) {

      h.covered = true;

      updateOcarinaSound();

      break;
    }
  }

  return false;
}



function keyReleased(event) {

  let releasedKey = event.key.toLowerCase();

  for (let h of holes) {

    if (releasedKey === h.key) {

      h.covered = false;

      updateOcarinaSound();

      break;
    }
  }

  return false;
}


function releaseAllKeys() {

  for (let h of holes) {
    h.covered = false;
  }

  updateOcarinaSound();
}
