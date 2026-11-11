
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

  // Crear canvas
  let cnv = createCanvas(800, 800);

  // Imagen SVG como fondo
  cnv.style("background-image", 'url("ocarina vector.svg")');
  cnv.style("background-repeat", "no-repeat");
  cnv.style("background-position", "center");
  cnv.style("background-size", "750px 592px");

  // Crear oscilador
  oscillator = new p5.Oscillator("sine");

  // Empezar en silencio
  oscillator.amp(0);

  // Liberar teclas al perder el foco
  window.addEventListener("blur", releaseAllKeys);
}


function draw() {

  clear();

  drawHoles();

  // Indicador de funcionamiento
  noStroke();
  fill(100);
  textAlign(CENTER, CENTER);
  textSize(16);

  text("USA AS TECLAS PARA TOCAR", 400, 530);

  // Mostrar nota musical
  fill(30, 65, 100);
  textSize(32);
  textStyle(BOLD);

  text(currentNote, 400, 475);

  textStyle(NORMAL);
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


// Actualizar sonido según la digitación
function updateOcarinaSound() {

  if (!audioStarted) {
    return;
  }

  // Construir combinación de agujeros
  let combination = "";

  for (let h of holes) {
    combination += h.covered ? "1" : "0";
  }

  // Buscar frecuencia correspondiente
  let result = fingering[combination];

  // Si no existe combinación, silenciar
  if (result === undefined) {

    currentNote = "-";
    oscillator.amp(0, 0.08);

    return;
  }

  // Actualizar nota
  currentNote = result.note;

  // Reproducir frecuencia
  oscillator.freq(result.frequency, 0.08);
  oscillator.amp(0.18, 0.08);

  console.log("Nota:", result.note);
}


// Detectar teclas pulsadas
function keyPressed(event) {

  // Activar audio
  startOcarina();

  let pressedKey = event.key.toLowerCase();

  // Evitar repeticiones
  if (event.repeat) {
    return false;
  }

  // Cubrir agujero correspondiente
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

  // Abrir agujero correspondiente
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
