
let holes = [
  // Mano izquierda: agujeros frontales
  { id: 0, key: "q", x: 300, y: 270, r: 21, covered: false, visible: true },
  { id: 1, key: "w", x: 355, y: 250, r: 19, covered: false, visible: true },
  { id: 2, key: "e", x: 410, y: 250, r: 19, covered: false, visible: true },
  { id: 3, key: "r", x: 465, y: 270, r: 21, covered: false, visible: true },

  // Mano derecha: agujeros frontales
  { id: 4, key: "y", x: 335, y: 345, r: 21, covered: false, visible: true },
  { id: 5, key: "u", x: 390, y: 355, r: 19, covered: false, visible: true },
  { id: 6, key: "i", x: 445, y: 355, r: 19, covered: false, visible: true },
  { id: 7, key: "o", x: 500, y: 345, r: 21, covered: false, visible: true },

  // Agujeros posteriores: pulgares
  { id: 8, key: "c", covered: false, visible: false },
  { id: 9, key: "n", covered: false, visible: false }
];

let oscillator;
let audioStarted = false;
let currentNote = "—";

// Orden de los agujeros:
// Q W E R Y U I O C N
// 1 = cubierto
// 0 = abierto

// Digitaciones de la escala de Do mayor
let fingering = {
  "1111111111": { frequency: 523.25, note: "DO5" },
  "1111111011": { frequency: 587.33, note: "RE5" },
  "1111110011": { frequency: 659.25, note: "MI5" },
  "1111100011": { frequency: 698.46, note: "FA5" },
  "1111000011": { frequency: 783.99, note: "SOL5" },
  "1011000011": { frequency: 880.00, note: "LA5" },
  "1001000011": { frequency: 987.77, note: "SI5" },
  "1000000011": { frequency: 1046.50, note: "DO6" }
};


function setup() {
  createCanvas(800, 600);

  // Crear el oscilador
  oscillator = new p5.Oscillator("sine");

  // Empezar en silencio
  oscillator.amp(0);

  // Liberar todas las teclas al perder el foco
  window.addEventListener("blur", releaseAllKeys);
}


function draw() {
  background(239, 235, 220);

  drawOcarina();
  drawHoles();

  // Indicador de funcionamiento
  noStroke();
  fill(100);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("PULSA LAS TECLAS PARA TOCAR", 400, 530);

  fill(30, 65, 100);
  textAlign(CENTER, CENTER);
  textSize(32);
  textStyle(BOLD);
  text(currentNote, 400, 475);

  textStyle(NORMAL);
}


// Dibujar la ocarina
function drawOcarina() {

  // Sombra
  noStroke();
  fill(0, 0, 0, 35);
  ellipse(420, 345, 500, 225);

  // Boquilla
  fill(18, 76, 125);
  ellipse(185, 275, 125, 65);

  // Cuerpo principal
  fill(30, 112, 177);
  stroke(12, 65, 110);
  strokeWeight(4);

  beginShape();
  vertex(175, 290);
  bezierVertex(190, 210, 300, 175, 420, 195);
  bezierVertex(560, 170, 680, 240, 675, 320);
  bezierVertex(670, 410, 560, 445, 425, 430);
  bezierVertex(290, 445, 180, 390, 175, 290);
  endShape(CLOSE);

  // Decoración dorada
  noFill();
  stroke(220, 183, 91);
  strokeWeight(3);
  ellipse(420, 310, 420, 175);

  // Símbolo triangular
  noStroke();
  fill(235, 198, 105);
  triangle(420, 215, 395, 258, 445, 258);
}


// Dibujar los agujeros
function drawHoles() {

  for (let h of holes) {

    if (!h.visible) {
      continue;
    }

    // Agujero oscuro
    noStroke();
    fill(8, 38, 64);
    ellipse(h.x, h.y, h.r * 2);

    // Superficie azul cuando está cubierto
    if (h.covered) {
      fill(74, 157, 211);
      stroke(12, 65, 110);
      strokeWeight(3);
      ellipse(h.x, h.y, h.r * 2);
    }

    // Letra correspondiente
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(h.key.toUpperCase(), h.x, h.y);
  }
}


// Activar el audio del navegador
async function startOcarina() {

  if (!audioStarted) {

    await userStartAudio();

    oscillator.start();
    oscillator.amp(0);

    audioStarted = true;

    updateOcarinaSound();
  }
}


// Actualizar el sonido según la digitación
function updateOcarinaSound() {

  // Evitar reproducir antes de activar el audio
  if (!audioStarted) {
    return;
  }

  // Construir la combinación de agujeros
  let combination = "";

  for (let h of holes) {
    combination += h.covered ? "1" : "0";
  }
  
  // Buscar la frecuencia correspondiente
  let result = fingering[combination];

  // Si la combinación no existe, silenciar
  if (result === undefined) {
    currentNote = "-";
    oscillator.amp(0, 0.08);
    return;
  }
  currentNote = result.note;

  // Reproducir la nota automáticamente
  oscillator.freq(result.frequency, 0.08);
  oscillator.amp(0.18, 0.08);

  console.log("Nota:", result.note);
}


// Detectar teclas pulsadas
function keyPressed(event) {

  // Activar el audio con la primera interacción
  startOcarina();

  let pressedKey = event.key.toLowerCase();

  // Evitar repeticiones del teclado
  if (event.repeat) {
    return false;
  }

  // Cubrir el agujero correspondiente
  for (let h of holes) {

    if (pressedKey === h.key) {

      h.covered = true;

      updateOcarinaSound();

      break;
    }
  }

  return false;
}


// Detectar teclas liberadas
function keyReleased(event) {

  let releasedKey = event.key.toLowerCase();

  // Abrir el agujero correspondiente
  for (let h of holes) {

    if (releasedKey === h.key) {

      h.covered = false;

      updateOcarinaSound();

      break;
    }
  }

  return false;
}


// Liberar todas las teclas al perder el foco
function releaseAllKeys() {

  for (let h of holes) {
    h.covered = false;
  }

  updateOcarinaSound();
}
