export class GestorProgreso {
    constructor() {
        this.STORAGE_KEY = 'angulos_pwa_progreso';
        this.datos = this.cargarDatos();
    }

    cargarDatos() {
        const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
        if (datosGuardados) {
            return JSON.parse(datosGuardados);
        }
        return {
            evaluaciones: [],
            promedio: 0,
            mejorNota: 0,
            totalEvaluaciones: 0
        };
    }

    guardarDatos() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.datos));
    }

    registrarEvaluacion(calificacion) {
        const nuevaEvaluacion = {
            fecha: new Date().toISOString(),
            calificacion: calificacion
        };

        this.datos.evaluaciones.push(nuevaEvaluacion);
        this.actualizarEstadisticas();
        this.guardarDatos();
    }

    actualizarEstadisticas() {
        const evals = this.datos.evaluaciones;
        this.datos.totalEvaluaciones = evals.length;

        if (evals.length > 0) {
            const suma = evals.reduce((acc, curr) => acc + curr.calificacion, 0);
            this.datos.promedio = Math.round(suma / evals.length);
            this.datos.mejorNota = Math.max(...evals.map(e => e.calificacion));
        } else {
            this.datos.promedio = 0;
            this.datos.mejorNota = 0;
        }
    }

    obtenerEstadisticas() {
        return this.datos;
    }

    limpiarProgreso() {
        this.datos = {
            evaluaciones: [],
            promedio: 0,
            mejorNota: 0,
            totalEvaluaciones: 0
        };
        this.guardarDatos();
        return true;
    }
}
