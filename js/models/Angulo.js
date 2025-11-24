export class Angulo {
    constructor(grados) {
        this.grados = grados;
        this.tipo = this.determinarTipo();
    }

    set grados(valor) {
        this._grados = valor;
        this.tipo = this.determinarTipo();
    }

    get grados() {
        return this._grados;
    }

    determinarTipo() {
        if (this.grados > 180 && this.grados < 360) {
            return 'Cóncavo (Reflejo)';
        } else if (this.grados === 360) {
            return 'Completo';
        } else if (this.grados === 180) {
            return 'Llano';
        } else {
            return 'Otro';
        }
    }

    // Método para dibujar el ángulo en un canvas
    dibujar(ctx, x, y, radio, rotacion = 0, resaltar = false) {
        const startAngle = (rotacion * Math.PI) / 180;
        const endAngle = ((rotacion + this.grados) * Math.PI) / 180;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + radio * Math.cos(startAngle), y + radio * Math.sin(startAngle));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + radio * Math.cos(endAngle), y + radio * Math.sin(endAngle));
        ctx.stroke();

        // Dibujar el arco
        ctx.beginPath();
        ctx.arc(x, y, radio * 0.3, startAngle, endAngle, false);
        ctx.stroke();

        if (resaltar) {
            ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
            ctx.fill();
        }
    }
}
