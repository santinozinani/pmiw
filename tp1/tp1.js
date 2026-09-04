let fondoRojo, fondoAzul, fondoVerde;
let imgPokebola;

// fondos
let framesRojo = [];
let framesHoja = [];
let framesAzul = []; // Aquí se cargarán los sprites de Squirtle (ej: "sprite-3-")


let estado = 0;

//tiempo y animacion
let frameActual = 0;
let tiempoAnterior = 0;
let tiempoEstado = 0;

// Fondo continuo
let posXFondo = 0;
let velFondo = 3.5;

// boton de pokebola
const btnX = 730;      // Centro en X
const btnY = 45;       // Centro en Y
const btnRadio = 35;   // Radio de click (diametro de 70px)

function preload() {
  //fondos cargados
  fondoRojo = loadImage("data/fondo_red.png");
  fondoAzul = loadImage("data/fondo_blue.png");
  fondoVerde = loadImage("data/fondo_green.png");

  //pokebola cargada
  imgPokebola = loadImage("data/pokebola-1-1.png");
  
  //secuencias (asegúrate de que el prefijo coincida con los archivos de Squirtle en tu carpeta data)
  framesRojo = cargarSecuencia("sprite-1-", 6);
  framesHoja = cargarSecuencia("sprite-2-", 6);
  framesAzul = cargarSecuencia("sprite-3-", 6); // Secuencia de Squirtle para el fondo azul
}

function setup() {
  createCanvas(800, 600);
  noSmooth();  

  tiempoAnterior = millis();
  tiempoEstado = millis();
}

function draw() {
  background(0);
  moverFondo();
  switch (estado) {
    case 0:
      // Rojo 
      avanzarAnimacion(framesRojo.length, 100);
      dibujarPersonaje(framesRojo[frameActual], 400, 360, 3.5);

      // Azul
      if (millis() - tiempoEstado > 5000) {
        cambiarEstado(1);
      }
      break;
      case 1: 
      // Aquí se dibuja Squirtle con la secuencia azul
      avanzarAnimacion(framesAzul.length, 150);
      dibujarPersonaje(framesAzul[frameActual], 400, 360, 3.5);

      //Hoja
      if (millis() - tiempoEstado > 5000) {
        cambiarEstado(2);
      }
      break;
      case 2:
      avanzarAnimacion(framesHoja.length, 100);
      dibujarPersonaje(framesHoja[frameActual], 400, 360, 3.5);

      // rojo infinito
      if (millis() - tiempoEstado > 5000) {
        cambiarEstado(3);
      }
      break;
      case 3:
      avanzarAnimacion(framesRojo.length, 100);
      dibujarPersonaje(framesRojo[frameActual], 400, 360, 3.5);

      dibujarBotonPokebola();
      break;
  }
}

// Funcion con retorno
function cargarSecuencia(prefijo, cantidad) {
  let lista = [];
  for (let i = 1; i <= cantidad; i++) {
    lista.push(loadImage("data/" + prefijo + i + ".png"));
  }
  return lista;
}

// velocidad
function avanzarAnimacion(totalFrames, velocidadMs) {
  if (millis() - tiempoAnterior >= velocidadMs) {
    tiempoAnterior = millis();
    frameActual++;
    if (frameActual >= totalFrames) {
      frameActual = 0;
    }
  }
}

function dibujarPersonaje(img, x, y, escala) {
  if (img) {
    push();
    imageMode(CENTER);
    translate(x, y);
    scale(escala);
    image(img, 0, 0);
    pop();
  }
}

function moverFondo() {
  let imgFondo = fondoRojo;
  if (estado === 1) imgFondo = fondoAzul;
  if (estado === 2) imgFondo = fondoVerde;
  if (estado === 3) imgFondo = fondoRojo;

  let anchoPantalla = (imgFondo.width / imgFondo.height) * height;

  //se detiene Azul (1)
  if (estado !== 1) {
    posXFondo += velFondo;
    if (posXFondo >= 0) {
      posXFondo = -anchoPantalla;
    }
  }

  //dos imagenes pegadas para el desplazamiento continuo
  image(imgFondo, posXFondo, 0, anchoPantalla, height);
  image(imgFondo, posXFondo + anchoPantalla, 0, anchoPantalla, height);
}

// Dibuja la pokebola 
function dibujarBotonPokebola() {
  push();
  imageMode(CENTER);

  let distancia = dist(mouseX, mouseY, btnX, btnY);
  if (distancia <= btnRadio) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  // Dibuja la pokebola en tamaño fijo
  translate(btnX, btnY);
  image(imgPokebola, 0, 0, 70, 70);

  // Letra R 
  fill(255);
  stroke(0);
  strokeWeight(2.5);
  textStyle(BOLD);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("R", 0, -18);

  pop();
}

function cambiarEstado(nuevoEstado) {
  estado = nuevoEstado;
  frameActual = 0;
  tiempoAnterior = millis();
  tiempoEstado = millis();
}

// boton de la Pokebola
function mousePressed() {
  if (estado === 3) {
    let distancia = dist(mouseX, mouseY, btnX, btnY);
    if (distancia <= btnRadio) {
      cursor(ARROW);
      cambiarEstado(0);
      posXFondo = 0;
    }
  }
}

// Evita la ralentización al usar la ruedita del mouse
function mouseWheel(event) {
  return false;
}
