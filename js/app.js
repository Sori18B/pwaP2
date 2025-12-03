import { ServiceWorkerManager } from './managers/ServiceWorkerManager.js';
import { GestorProgreso } from './models/GestorProgreso.js';
import { Angulo } from './models/Angulo.js';
import { CanvasHelper } from './utils/canvas-helper.js';
import { Evaluacion } from './models/Evaluacion.js';
import { Ejercicio } from './models/Ejercicio.js';
import { RandomGenerator } from './utils/random-generator.js';

class App {
    constructor() {
        this.swManager = new ServiceWorkerManager();
        this.gestorProgreso = new GestorProgreso();
        this.evaluacionActual = null;
        this.cronometroInterval = null;

        this.init();
    }

    init() {
        this.swManager.register();
        this.setupNavigation();
        this.initInicio();
        this.initAprender();
        this.initPracticar();
        this.initEvaluar();
        this.initProgreso();
        console.log('App iniciada correctamente');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const cards = document.querySelectorAll('.card[data-navegar]');
        const backButtons = document.querySelectorAll('.btn-volver');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const seccionId = link.getAttribute('data-seccion');
                this.cambiarSeccion(seccionId);
            });
        });

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const seccionId = card.getAttribute('data-navegar');
                this.cambiarSeccion(seccionId);
            });
        });

        backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.cambiarSeccion('inicio');
            });
        });
    }

    cambiarSeccion(seccionId) {
        document.querySelectorAll('.seccion').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        const seccion = document.getElementById(`seccion-${seccionId}`);
        if (seccion) {
            seccion.classList.add('active');
            const navLink = document.querySelector(`.nav-link[data-seccion="${seccionId}"]`);
            if (navLink) navLink.classList.add('active');

            if (seccionId === 'progreso') this.actualizarVistaProgreso();
            if (seccionId === 'inicio') this.actualizarResumenInicio();

            // Detener cronómetro si salimos de evaluar
            if (seccionId !== 'evaluar' && this.cronometroInterval) {
                clearInterval(this.cronometroInterval);
            }
        }
    }

    // --- SECCIÓN INICIO ---
    initInicio() {
        const canvas = document.getElementById('hero-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let rotacion = 0;
            const animar = () => {
                CanvasHelper.limpiar(ctx, 300, 300);
                rotacion += 0.5;
                CanvasHelper.dibujarAngulo(ctx, 150, 150, 100, 225, rotacion, '#4A90E2', 3);
                requestAnimationFrame(animar);
            };
            animar();
        }
        this.actualizarResumenInicio();
    }

    actualizarResumenInicio() {
        const stats = this.gestorProgreso.obtenerEstadisticas();
        const resumenDiv = document.getElementById('resumen-progreso');

        if (stats.totalEvaluaciones > 0) {
            resumenDiv.classList.remove('hidden');
            const ultima = stats.evaluaciones[stats.evaluaciones.length - 1].calificacion;
            document.getElementById('ultima-calificacion').textContent = ultima.toFixed(1);
            document.getElementById('promedio-general').textContent = stats.promedio;
            document.getElementById('total-evaluaciones').textContent = stats.totalEvaluaciones;
        } else {
            resumenDiv.classList.add('hidden');
        }
    }

    // --- SECCIÓN APRENDER ---
    initAprender() {
        // Generar valores dinámicos para los ejemplos
        const anguloConcavoEjemplo = RandomGenerator.entero(190, 350);

        // Método 1: 180 + extra
        const extraMetodo1 = RandomGenerator.entero(20, 80);
        const totalMetodo1 = 180 + extraMetodo1;

        // Método 2: 360 - interno
        const internoMetodo2 = RandomGenerator.entero(40, 140);
        const totalMetodo2 = 360 - internoMetodo2;

        const container = document.querySelector('.contenido-aprender');
        container.innerHTML = `
            <div class="leccion-intro">
                <div class="leccion-card">
                    <h3>¿Qué son los ángulos mayores a 180°?</h3>
                    <p>En geometría, es fundamental comprender que los ángulos pueden tener una amplitud mayor a la de un ángulo llano (180°). Estos ángulos representan un giro que supera la media vuelta.</p>
                    <p>Cuando un ángulo tiene una medida superior a 180° pero no completa el giro total, se le denomina <strong>Ángulo Cóncavo</strong> (o entrante).</p>
                    
                    <div class="conceptos-grid">
                        <div class="concepto">
                            <h4>1. Ángulo Cóncavo</h4>
                            <p>Es aquel ángulo cuya medida es <strong>mayor a 180° y menor a 360°</strong>.</p>
                            <p><strong>Características:</strong> Su apertura es amplia y supera la línea recta. Visualmente, ocupa más espacio que un ángulo llano.</p>
                            <p class="nota-visual">Ejemplo mostrado: <strong>${anguloConcavoEjemplo}°</strong></p>
                            <div class="canvas-container"><canvas id="canvas-concavo" width="200" height="200"></canvas></div>
                        </div>
                        <div class="concepto">
                            <h4>2. Ángulo Completo</h4>
                            <p>Es el ángulo que mide exactamente <strong>360°</strong>.</p>
                            <p><strong>Características:</strong> Representa un giro total. El lado final coincide con el lado inicial después de dar una vuelta completa.</p>
                            <p class="nota-visual">Giro completo de 360°</p>
                            <div class="canvas-container"><canvas id="canvas-completo" width="200" height="200"></canvas></div>
                        </div>
                    </div>
                </div>
            </div>

            <h3 class="titulo-metodos">Métodos de Medición</h3>

            <div class="metodos-container">
                <div class="leccion-card metodo-card">
                    <div class="metodo-header">
                        <span class="numero-metodo">1</span>
                        <h4>Método de la Prolongación (Suma)</h4>
                    </div>
                    <div class="metodo-pasos">
                        <p>Este método consiste en dividir el ángulo en dos partes conocidas.</p>
                        <ol>
                            <li>Prolonga uno de los lados para formar un ángulo llano (180°).</li>
                            <li>Mide la parte restante del ángulo (el excedente).</li>
                            <li>Suma ambas cantidades: <strong>180° + medida excedente</strong>.</li>
                        </ol>
                        <div class="ejemplo-calculo">
                            Cálculo: 180° + ${extraMetodo1}° = <strong>${totalMetodo1}°</strong>
                        </div>
                    </div>
                    <div class="canvas-container">
                        <canvas id="canvas-metodo1" width="280" height="200"></canvas>
                        <p class="caption">Suma: 180° (línea) + ${extraMetodo1}° (rojo) = ${totalMetodo1}°</p>
                    </div>
                </div>

                <div class="leccion-card metodo-card">
                    <div class="metodo-header">
                        <span class="numero-metodo">2</span>
                        <h4>Método del Ángulo Interno (Resta)</h4>
                    </div>
                    <div class="metodo-pasos">
                        <p>Este método utiliza el ángulo completo como referencia.</p>
                        <ol>
                            <li>Identifica y mide el ángulo convexo (la parte interna o faltante).</li>
                            <li>Resta esa medida al giro completo (360°).</li>
                            <li>Operación: <strong>360° - ángulo interno</strong>.</li>
                        </ol>
                        <div class="ejemplo-calculo">
                            Cálculo: 360° - ${internoMetodo2}° = <strong>${totalMetodo2}°</strong>
                        </div>
                    </div>
                    <div class="canvas-container">
                        <canvas id="canvas-metodo2" width="280" height="200"></canvas>
                        <p class="caption">Resta: 360° (total) - ${internoMetodo2}° (verde) = ${totalMetodo2}°</p>
                    </div>
                </div>
            </div>

            <div class="fuente-cita">
                <p><strong>Fuente:</strong> Baldor, A. (2004). <em>Geometría plana y del espacio</em>. Publicaciones Cultural.</p>
            </div>
        `;

        setTimeout(() => {
            // 1. Ángulo Cóncavo Aleatorio
            const ctx1 = document.getElementById('canvas-concavo').getContext('2d');
            CanvasHelper.dibujarAngulo(ctx1, 100, 100, 60, anguloConcavoEjemplo, 0, '#F5A623');

            // 2. Ángulo Completo (Fijo)
            const ctx2 = document.getElementById('canvas-completo').getContext('2d');
            CanvasHelper.dibujarAngulo(ctx2, 100, 100, 60, 360, 0, '#7ED321');

            // 3. Método 1: Suma (Dinámico)
            const ctx3 = document.getElementById('canvas-metodo1').getContext('2d');
            // Línea base
            ctx3.beginPath(); ctx3.moveTo(140, 100); ctx3.lineTo(220, 100); ctx3.stroke();
            // Línea punteada (prolongación)
            CanvasHelper.dibujarLineaPunteada(ctx3, 140, 100, 60, 100, '#999');

            const radTotal1 = (totalMetodo1 * Math.PI) / 180;
            // Línea del ángulo final
            ctx3.beginPath();
            ctx3.moveTo(140, 100);
            ctx3.lineTo(140 + 80 * Math.cos(radTotal1), 100 + 80 * Math.sin(radTotal1));
            ctx3.strokeStyle = 'black';
            ctx3.stroke();

            // Arco del "pedacito extra"
            ctx3.beginPath();
            ctx3.arc(140, 100, 40, 0, radTotal1);
            ctx3.strokeStyle = '#D0021B';
            ctx3.lineWidth = 3;
            ctx3.stroke();

            // Arco de 180 (referencia visual suave)
            ctx3.beginPath();
            ctx3.arc(140, 100, 50, Math.PI, radTotal1); // Esto dibuja el arco grande, ajustamos para que se vea bien
            // Mejor dibujamos el arco completo del ángulo resultante para que se entienda

            // Texto
            ctx3.fillStyle = '#4A90E2';
            ctx3.fillText(`${extraMetodo1}°`, 90, 140);
            ctx3.fillStyle = '#D0021B';
            ctx3.fillText(`${totalMetodo1}°`, 150, 60);

            // 4. Método 2: Resta (Dinámico)
            const ctx4 = document.getElementById('canvas-metodo2').getContext('2d');
            // Dibujar el ángulo grande (resultado)
            CanvasHelper.dibujarAngulo(ctx4, 140, 100, 60, totalMetodo2, 0, '#F5A623', 3);

            // Dibujar la "rebanada" que falta (el interno)
            ctx4.beginPath();
            ctx4.arc(140, 100, 30, (totalMetodo2 * Math.PI) / 180, 0);
            ctx4.strokeStyle = '#7ED321';
            ctx4.lineWidth = 3;
            ctx4.stroke();

            ctx4.fillStyle = '#7ED321';
            ctx4.fillText(`${internoMetodo2}°`, 160, 130);
        }, 100);
    }

    // --- SECCIÓN PRACTICAR ---
    initPracticar() {
        const botonesTipo = document.querySelectorAll('.ejercicio-tipo');
        const areaEjercicio = document.getElementById('area-ejercicio');

        botonesTipo.forEach(btn => {
            btn.addEventListener('click', () => {
                botonesTipo.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tipo = btn.getAttribute('data-tipo');
                this.cargarEjercicioPractica(tipo, areaEjercicio);
            });
        });
    }

    cargarEjercicioPractica(tipo, contenedor) {
        const ejercicio = new Ejercicio(tipo);

        let html = `
            <div class="ejercicio-practica">
                <h3 class="pregunta-practica">${ejercicio.pregunta}</h3>
                <div class="canvas-wrapper">
                    <canvas id="canvas-practica" width="300" height="300"></canvas>
                </div>
                <div class="controles-respuesta">
        `;

        if (ejercicio.tipoRespuesta === 'booleana') {
            html += `
                <div class="botones-si-no">
                    <button class="btn btn-lg btn-outline-primary btn-respuesta" data-val="true">SÍ, es mayor</button>
                    <button class="btn btn-lg btn-outline-danger btn-respuesta" data-val="false">NO, es menor</button>
                </div>
            `;
        } else if (ejercicio.tipoRespuesta === 'numerica' || ejercicio.tipoRespuesta === 'rango') {
            html += `
                <div class="input-group">
                    <input type="number" id="input-respuesta" placeholder="0" class="input-grados-lg">
                    <span class="unit">°</span>
                </div>
                <button class="btn btn-primary btn-verificar" id="btn-verificar">Comprobar Respuesta</button>
            `;
        } else if (ejercicio.tipoRespuesta === 'interactiva') {
            html += `
                <p class="instruccion-dibujo">Usa papel y lápiz. Cuando termines, verifica.</p>
                <button class="btn btn-primary" id="btn-ver-solucion">Ver Solución</button>
            `;
        }

        html += `
                <div id="feedback-mensaje" class="feedback-box hidden"></div>
                <button class="btn btn-secondary hidden" id="btn-otro-ejercicio">Siguiente Ejercicio →</button>
                </div>
            </div>
        `;

        contenedor.innerHTML = html;

        const ctx = document.getElementById('canvas-practica').getContext('2d');
        CanvasHelper.dibujarAngulo(ctx, 150, 150, 80, ejercicio.angulo, 0, '#333');

        // Event listeners
        if (ejercicio.tipoRespuesta === 'booleana') {
            contenedor.querySelectorAll('.btn-respuesta').forEach(b => {
                b.addEventListener('click', () => {
                    const val = b.getAttribute('data-val') === 'true';
                    this.verificarRespuestaPractica(ejercicio, val);
                });
            });
        } else if (ejercicio.tipoRespuesta === 'interactiva') {
            document.getElementById('btn-ver-solucion').addEventListener('click', () => {
                const feedback = document.getElementById('feedback-mensaje');
                feedback.innerHTML = `<strong>¡Así se ve un ángulo de ${ejercicio.angulo}°!</strong><br>Compáralo con tu dibujo.`;
                feedback.className = 'feedback-box info';
                feedback.classList.remove('hidden');
                document.getElementById('btn-otro-ejercicio').classList.remove('hidden');
                // Dibujar solución superpuesta o resaltar
                CanvasHelper.dibujarAngulo(ctx, 150, 150, 80, ejercicio.angulo, 0, '#4A90E2', 4);
            });
        } else {
            const btnVerificar = document.getElementById('btn-verificar');
            if (btnVerificar) {
                btnVerificar.addEventListener('click', () => {
                    const input = document.getElementById('input-respuesta');
                    const val = parseFloat(input.value);
                    if (isNaN(val)) {
                        input.focus();
                        return;
                    }
                    this.verificarRespuestaPractica(ejercicio, val);
                });
            }
        }

        const btnSiguiente = document.getElementById('btn-otro-ejercicio');
        if (btnSiguiente) {
            btnSiguiente.addEventListener('click', () => {
                this.cargarEjercicioPractica(tipo, contenedor);
            });
        }
    }

    verificarRespuestaPractica(ejercicio, respuesta) {
        const esCorrecta = ejercicio.verificar(respuesta);
        const feedback = document.getElementById('feedback-mensaje');
        const btnSiguiente = document.getElementById('btn-otro-ejercicio');

        feedback.classList.remove('hidden');
        if (esCorrecta) {
            feedback.innerHTML = '<strong>¡Excelente!</strong><br>Tu respuesta es correcta.';
            feedback.className = 'feedback-box success';
        } else {
            let mensaje = `<strong>Ups, intenta de nuevo.</strong><br>`;
            if (ejercicio.tipoRespuesta === 'booleana') {
                mensaje += `La respuesta correcta era <strong>${ejercicio.respuestaCorrecta ? 'SÍ, es mayor' : 'NO, es menor'}</strong>.`;
            } else {
                mensaje += `La respuesta correcta era <strong>${ejercicio.respuestaCorrecta}°</strong>.`;
            }
            feedback.innerHTML = mensaje;
            feedback.className = 'feedback-box error';
        }

        if (btnSiguiente) btnSiguiente.classList.remove('hidden');
    }

    // --- SECCIÓN EVALUAR ---
    initEvaluar() {
        const btnIniciar = document.getElementById('btn-iniciar-evaluacion');
        btnIniciar.addEventListener('click', () => {
            this.comenzarEvaluacion();
        });

        document.getElementById('btn-siguiente').addEventListener('click', () => this.siguientePreguntaEvaluacion());
        document.getElementById('btn-saltar').addEventListener('click', () => this.siguientePreguntaEvaluacion(true));
    }

    comenzarEvaluacion() {
        this.evaluacionActual = new Evaluacion();
        document.getElementById('evaluacion-inicio').classList.add('hidden');
        document.getElementById('evaluacion-contenedor').classList.remove('hidden');
        document.getElementById('evaluacion-resultados').classList.add('hidden');

        this.iniciarCronometro();
        this.mostrarPreguntaEvaluacion();
    }

    iniciarCronometro() {
        let segundos = 0;
        const display = document.getElementById('cronometro');
        if (this.cronometroInterval) clearInterval(this.cronometroInterval);

        this.cronometroInterval = setInterval(() => {
            segundos++;
            const min = Math.floor(segundos / 60).toString().padStart(2, '0');
            const sec = (segundos % 60).toString().padStart(2, '0');
            display.textContent = `${min}:${sec}`;
        }, 1000);
    }

    mostrarPreguntaEvaluacion() {
        const pregunta = this.evaluacionActual.obtenerPreguntaActual();
        const contenedor = document.getElementById('pregunta-contenedor');
        const indice = this.evaluacionActual.indiceActual + 1;
        const total = this.evaluacionActual.preguntas.length;

        document.getElementById('progreso-texto').textContent = `Pregunta ${indice} de ${total}`;
        document.getElementById('barra-progreso').style.width = `${((indice - 1) / total) * 100}%`;

        let html = `
            <h3 class="pregunta-eval">${pregunta.pregunta}</h3>
            <div class="canvas-wrapper">
                <canvas id="canvas-evaluacion" width="300" height="300"></canvas>
            </div>
            <div class="input-area-eval">
                `;

        if (pregunta.tipoRespuesta === 'booleana') {
            html += `
                <button class="btn btn-outline-primary btn-eval-resp" data-val="true">SÍ</button>
                <button class="btn btn-outline-danger btn-eval-resp" data-val="false">NO</button>
            `;
        } else {
            html += `
                <input type="number" id="input-eval-respuesta" class="input-grados-lg" placeholder="?">
                <span class="unit">°</span>
            `;
        }

        html += `</div>`;
        contenedor.innerHTML = html;

        const ctx = document.getElementById('canvas-evaluacion').getContext('2d');
        CanvasHelper.dibujarAngulo(ctx, 150, 150, 80, pregunta.angulo, 0, '#333');

        if (pregunta.tipoRespuesta === 'booleana') {
            contenedor.querySelectorAll('.btn-eval-resp').forEach(b => {
                b.addEventListener('click', () => {
                    contenedor.querySelectorAll('.btn-eval-resp').forEach(x => x.classList.remove('selected'));
                    b.classList.add('selected');
                });
            });
        }
    }

    siguientePreguntaEvaluacion(saltar = false) {
        if (!saltar) {
            const pregunta = this.evaluacionActual.obtenerPreguntaActual();
            let respuesta = null;

            if (pregunta.tipoRespuesta === 'booleana') {
                const selected = document.querySelector('.btn-eval-resp.selected');
                if (selected) respuesta = selected.getAttribute('data-val') === 'true';
            } else {
                const input = document.getElementById('input-eval-respuesta');
                if (input && input.value !== '') respuesta = parseFloat(input.value);
            }

            if (respuesta !== null && !isNaN(respuesta)) {
                this.evaluacionActual.registrarRespuesta(respuesta);
            } else {
                alert('Por favor selecciona una respuesta o pulsa Saltar.');
                return;
            }
        } else {
            this.evaluacionActual.registrarRespuesta(null);
        }

        if (this.evaluacionActual.siguientePregunta()) {
            this.mostrarPreguntaEvaluacion();
        } else {
            this.finalizarEvaluacion();
        }
    }

    finalizarEvaluacion() {
        clearInterval(this.cronometroInterval);
        this.evaluacionActual.calcularCalificacion(); // Asegurar cálculo
        const resultados = this.evaluacionActual.obtenerResultados();

        // Guardar en progreso
        this.gestorProgreso.registrarEvaluacion(resultados.calificacion);

        document.getElementById('evaluacion-contenedor').classList.add('hidden');
        const divResultados = document.getElementById('evaluacion-resultados');
        divResultados.classList.remove('hidden');

        divResultados.innerHTML = `
            <h3>¡Evaluación Terminada!</h3>
            <div class="resultado-score">
                <span class="score-grande">${Math.round(resultados.calificacion)}</span>
                <span class="score-total">/ 100</span>
            </div>
            <p class="resultado-texto">Has acertado <strong>${resultados.correctas}</strong> de ${resultados.total} preguntas.</p>
            <button class="btn btn-primary" onclick="location.reload()">Volver al Inicio</button>
            `;
    }

    // --- SECCIÓN PROGRESO ---
    initProgreso() {
        document.getElementById('btn-limpiar-datos').addEventListener('click', () => {
            if (confirm('¿Estás seguro de borrar todo tu progreso?')) {
                this.gestorProgreso.limpiarProgreso();
                this.actualizarVistaProgreso();
            }
        });
    }

    actualizarVistaProgreso() {
        const stats = this.gestorProgreso.obtenerEstadisticas();

        document.getElementById('stat-promedio').textContent = stats.promedio;
        document.getElementById('stat-mejor').textContent = stats.mejorNota;
        document.getElementById('stat-total').textContent = stats.totalEvaluaciones;

        const lista = document.getElementById('historial-lista');
        if (stats.evaluaciones.length === 0) {
            lista.innerHTML = '<p class="text-muted">Aún no hay evaluaciones.</p>';
        } else {
            lista.innerHTML = stats.evaluaciones.map((ev, i) => `
                <div class="historial-item">
                    <span>Evaluación ${i + 1}</span>
                    <strong>${ev.calificacion} pts</strong>
                </div>
            `).reverse().join('');
        }

        this.dibujarGraficaProgreso(stats.evaluaciones);
    }

    dibujarGraficaProgreso(evaluaciones) {
        const canvas = document.getElementById('grafica-progreso');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        CanvasHelper.limpiar(ctx, canvas.width, canvas.height);

        if (evaluaciones.length < 2) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Completa más evaluaciones para ver tu gráfica', canvas.width / 2, canvas.height / 2);
            return;
        }

        const padding = 40;
        const width = canvas.width - padding * 2;
        const height = canvas.height - padding * 2;

        // Ejes
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();

        const stepX = width / (evaluaciones.length - 1);

        ctx.beginPath();
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 3;

        evaluaciones.forEach((ev, i) => {
            const x = padding + i * stepX;
            const y = (canvas.height - padding) - (ev.calificacion / 100) * height;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Puntos
        evaluaciones.forEach((ev, i) => {
            const x = padding + i * stepX;
            const y = (canvas.height - padding) - (ev.calificacion / 100) * height;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#F5A623';
            ctx.fill();
        });
    }
}

window.app = new App();
