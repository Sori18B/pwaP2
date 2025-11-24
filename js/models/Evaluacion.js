import { Ejercicio } from './Ejercicio.js';

export class Evaluacion {
    constructor() {
        this.preguntas = [];
        this.respuestasUsuario = [];
        this.indiceActual = 0;
        this.calificacion = 0;
        this.generarEvaluacion();
    }

    generarEvaluacion() {
        // 10 preguntas aleatorias distribuidas
        // 2 Identificación, 2 Método 1, 2 Método 2, 3 Medición, 1 Dibujo (simulado como medición o identificación para simplificar en móvil)

        const tipos = [
            'identificacion', 'identificacion',
            'metodo1', 'metodo1',
            'metodo2', 'metodo2',
            'medicion', 'medicion', 'medicion',
            'metodo1' // Reemplazamos dibujo por metodo1 para simplificar la evaluación automática por ahora
        ];

        // Mezclar tipos
        tipos.sort(() => Math.random() - 0.5);

        this.preguntas = tipos.map(tipo => new Ejercicio(tipo));
    }

    obtenerPreguntaActual() {
        return this.preguntas[this.indiceActual];
    }

    registrarRespuesta(respuesta) {
        const pregunta = this.obtenerPreguntaActual();
        const esCorrecta = pregunta.verificar(respuesta);

        this.respuestasUsuario.push({
            pregunta: pregunta,
            respuestaUsuario: respuesta,
            esCorrecta: esCorrecta
        });

        return esCorrecta;
    }

    siguientePregunta() {
        this.indiceActual++;
        return this.indiceActual < this.preguntas.length;
    }

    calcularCalificacion() {
        const correctas = this.respuestasUsuario.filter(r => r.esCorrecta).length;
        this.calificacion = (correctas / this.preguntas.length) * 100;
        return this.calificacion;
    }

    obtenerResultados() {
        return {
            calificacion: this.calificacion,
            correctas: this.respuestasUsuario.filter(r => r.esCorrecta).length,
            total: this.preguntas.length,
            detalles: this.respuestasUsuario
        };
    }
}
