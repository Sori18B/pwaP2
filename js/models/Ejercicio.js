import { RandomGenerator } from '../utils/random-generator.js';

export class Ejercicio {
    constructor(tipo) {
        this.tipo = tipo;
        this.generar();
    }

    generar() {
        this.angulo = RandomGenerator.anguloConcavo();
        this.opciones = [];
        this.respuestaCorrecta = null;
        this.pregunta = '';

        switch (this.tipo) {
            case 'identificacion':
                this.generarIdentificacion();
                break;
            case 'metodo1':
                this.generarMetodo1();
                break;
            case 'metodo2':
                this.generarMetodo2();
                break;
            case 'medicion':
                this.generarMedicion();
                break;
            case 'dibujo':
                this.generarDibujo();
                break;
        }
    }

    generarIdentificacion() {
        // Generar un ángulo difícil (cercano a 180 o 360)
        // 50% probabilidad de ser > 180
        const esMayor = Math.random() > 0.5;
        let grados;

        if (esMayor) {
            // Entre 181 y 220 (difícil visualmente si no está rotado)
            grados = RandomGenerator.entero(181, 220);
        } else {
            // Entre 140 y 180 (obtuso cercano a llano)
            grados = RandomGenerator.entero(140, 180);
        }

        this.angulo = grados;
        this.pregunta = `¿El ángulo mostrado es mayor a 180°?`;
        this.respuestaCorrecta = grados > 180;
        this.tipoRespuesta = 'booleana'; // Si/No
    }

    generarMetodo1() {
        // Método 1: 180 + x
        // Generamos un ángulo cóncavo
        this.angulo = RandomGenerator.anguloConcavo();
        const excedente = this.angulo - 180;
        this.pregunta = `Si prolongamos un lado, el ángulo pequeño mide ${excedente}°. ¿Cuánto mide el ángulo total? (180° + ${excedente}°)`;
        this.respuestaCorrecta = this.angulo;
        this.tipoRespuesta = 'numerica';
    }

    generarMetodo2() {
        // Método 2: 360 - x
        this.angulo = RandomGenerator.anguloConcavo();
        const restante = 360 - this.angulo;
        this.pregunta = `El ángulo interno mide ${restante}°. ¿Cuánto mide el ángulo cóncavo? (360° - ${restante}°)`;
        this.respuestaCorrecta = this.angulo;
        this.tipoRespuesta = 'numerica';
    }

    generarMedicion() {
        this.angulo = RandomGenerator.anguloConcavo();
        this.pregunta = 'Estima la medida del ángulo mostrado (tolerancia ±5°)';
        this.respuestaCorrecta = this.angulo;
        this.tipoRespuesta = 'rango';
    }

    generarDibujo() {
        this.angulo = RandomGenerator.anguloConcavo();
        this.pregunta = `Dibuja un ángulo de ${this.angulo}°`;
        this.respuestaCorrecta = this.angulo;
        this.tipoRespuesta = 'interactiva';
    }

    verificar(respuesta) {
        if (this.tipoRespuesta === 'rango') {
            return Math.abs(respuesta - this.respuestaCorrecta) <= 5;
        }
        if (this.tipoRespuesta === 'interactiva') {
            return Math.abs(respuesta - this.respuestaCorrecta) <= 5;
        }
        return respuesta == this.respuestaCorrecta; // == para permitir string/number
    }
}
