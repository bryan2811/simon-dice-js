const celeste = document.getElementById('celeste')
const violeta = document.getElementById('violeta')
const naranja = document.getElementById('naranja')
const verde = document.getElementById('verde')
const btnEmpezar = document.getElementById('btnEmpezar')
const ULTIMO_NIVEL = 10

class Juego {
  constructor() {
    this.inicializar = this.inicializar.bind(this)
    this.inicializar()
    this.generarSecuencia()
    setTimeout(this.siguienteNivel(), 500)
  }

  inicializar() {
    this.siguienteNivel = this.siguienteNivel.bind(this)
    // Se utiliza el método .bind() para que el this tenga referencia al juego y no al div del color
    this.elegirColor = this.elegirColor.bind(this) 
    this.toggleBtnEmpezar()
    this.nivel = 1
    this.colores = {
      celeste,
      violeta,
      naranja,
      verde
    }
  }

  toggleBtnEmpezar() {
    if(btnEmpezar.classList.contains('hide')) {
      btnEmpezar.classList.remove('hide')
    } else {
      btnEmpezar.classList.add('hide')
    }
  }
  
  // Generando la secuencia de números
  // Para generar la secuencia del juego uso un array con números aleatorios, que representarán el color del botón que se iluminará cada vez. Usamos new Array() para crear el arreglo de manera dinámica, y llamo al método fill para rellenar ese array con ceros y poder luego iterar sobre éste con map()
  // Math.floor redondea para abajo el número
  generarSecuencia() {
    this.secuencia = new Array(ULTIMO_NIVEL).fill(0).map(n => Math.floor(Math.random() * 4))
  }

  siguienteNivel() {
    this.subnivel = 0
    this.iluminarSecuencia()
    this.agregarEventosClick()
  }

  transformarNumeroAColor(numero) {
    switch (numero) {
      case 0:
        return 'celeste'
      case 1:
        return 'violeta'  
      case 2:
        return 'naranja'
      case 3:
        return 'verde'
    }
  }

  transformarColorANumero(color) {
    switch (color) {
      case 'celeste':
        return 0
      case 'violeta':
        return 1
      case 'naranja':
        return 2
      case 'verde':
        return 3
    }
  }


// Iluminando la secuencia de colores
// Aquí se observa la diferencia entre el uso de let y var para la declaración de variables y cómo esta diferencia afecta el alcance de la variable dentro de un ciclo for. Se recomienda siempre el uso de let cuando se trata de estructuras for, ya que al usar var, el valor de dicha variable se va a remplazar cada vez con la última asignación que se haga, mientras que con let, conservará su valor dentro de cada iteración. Siempre que sea posible debemos usar const sobre let, y let sobre var.

  iluminarSecuencia() {
    for (let i = 0; i < this.nivel; i++) {
      const color = this.transformarNumeroAColor(this.secuencia[i])
      setTimeout(() => this.iluminarColor(color), 1000 * i)
    }
  }

  iluminarColor(color) {
    this.colores[color].classList.add('light')
    setTimeout(() => this.apagarColor(color), 350)
  }

  apagarColor(color) {
    this.colores[color].classList.remove('light')
  }

// Obteniendo el input del usuario
// Para obtener el input del usuario agrego un manejador para el evento click del mouse usando addEventListener para cada uno de los colores del juego. Utilizando la propiedad target devuelta por el evento click podemos identificar cuál es el botón que ha sido presionado.
  agregarEventosClick() {
    this.colores.celeste.addEventListener('click', this.elegirColor)
    this.colores.verde.addEventListener('click', this.elegirColor)
    this.colores.violeta.addEventListener('click', this.elegirColor)
    this.colores.naranja.addEventListener('click', this.elegirColor)
  }

  eliminarEventosClick() {
    this.colores.celeste.removeEventListener('click', this.elegirColor)
    this.colores.verde.removeEventListener('click', this.elegirColor)
    this.colores.violeta.removeEventListener('click', this.elegirColor)
    this.colores.naranja.removeEventListener('click', this.elegirColor)
  }

  elegirColor(ev) {
    const nombreColor = ev.target.dataset.color
    const numeroColor = this.transformarColorANumero(nombreColor)
    this.iluminarColor(nombreColor)
    if(numeroColor === this.secuencia[this.subnivel]) {
      this.subnivel++
      if(this.subnivel === this.nivel) {
        this.nivel++
        this.eliminarEventosClick()
        if(this.nivel === (ULTIMO_NIVEL + 1) ) {
          // Ganó!
          this.ganoElJuego()
        } else {
          setTimeout(this.siguienteNivel(), 1500)
        }
      }
    } else {
      //Perdió
      this.perdioElJuego()
    }
  }

  ganoElJuego() {
    swal('Simón Dice', 'Felicitaciones, ganaste el juego! :)', 'success')
    .then(this.inicializar)
  }

  perdioElJuego() {
    swal('Simón Dice', 'Lo lamentamos, perdiste :(', 'error')
    .then(() => {
      this.eliminarEventosClick()
      this.inicializar()
    })
  }
}

function empezarJuego() {
  window.juego = new Juego()
}

