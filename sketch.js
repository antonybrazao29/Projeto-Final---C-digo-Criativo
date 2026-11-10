
let holes = [
  { x: 300, y: 285, r: 23, covered: false },
  { x: 370, y: 260, r: 23, covered: false },
  { x: 445, y: 255, r: 23, covered: false },
  { x: 520, y: 275, r: 23, covered: false },
  { x: 325, y: 355, r: 23, covered: false },
  { x: 400, y: 355, r: 23, covered: false },
  { x: 475, y: 350, r: 23, covered: false },
  { x: 545, y: 340, r: 23, covered: false }
];

function setup() {
  createCanvas(800, 600);

  // Crear oscilador
  oscillator = new p5.Oscillator('sine');

  // Iniciar el oscilador
  oscillator.start();

  // Mantener el volumen en cero inicialmente
  oscillator.amp(0);
}

function draw() {
  background(239, 235, 220);

  drawOcarina();
  drawHoles();
}

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

  // Símbolo triangular decorativo
  noStroke();
  fill(235, 198, 105);
  triangle(420, 215, 395, 258, 445, 258);
}

function drawHoles() {
  for (let h of holes) {

    // Agujero oscuro
    noStroke();
    fill(8, 38, 64);
    ellipse(h.x, h.y, h.r * 2);

    // Si está cubierto, dibujamos una superficie azul
    if (h.covered) {
      fill(74, 157, 211);
      stroke(12, 65, 110);
      strokeWeight(3);
      ellipse(h.x, h.y, h.r * 2);
    }
  }
}

function mousePressed() {
  for (let h of holes) {
    let d = dist(mouseX, mouseY, h.x, h.y);

    if (d < h.r + 10) {
      h.covered = !h.covered;
    }
  }
}

function updateOcarinaSound() {

  let coveredCount = 0;

  // Contar los agujeros cubiertos
  for (let h of holes) {
    if (h.covered) {
      coveredCount++;
    }
  }

  // Frecuencias de las notas musicales
  let notes = [
    523.25,  // C5 - Do
    587.33,  // D5 - Re
    659.25,  // E5 - Mi
    698.46,  // F5 - Fa
    783.99,  // G5 - Sol
    880.00,  // A5 - La
    987.77,  // B5 - Si
    1046.50  // C6 - Do
  ];

  // Elegir una nota dependiendo de los agujeros cubiertos
  let noteIndex = min(coveredCount, 7);

  // Cambiar la frecuencia del oscilador
  oscillator.freq(notes[noteIndex], 0.1);

  // Activar el volumen
  oscillator.amp(0.2, 0.1);
}

let coveredCount = 0;

for (let h of holes) {
  if (h.covered) {
    coveredCount++;
  }
}

