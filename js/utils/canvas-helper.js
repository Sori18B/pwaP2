export const CanvasHelper = {
    limpiar(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
    },

    dibujarAngulo(ctx, x, y, radio, grados, rotacion = 0, color = 'black', grosor = 2, mostrarArco = true) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = grosor;
        ctx.lineCap = 'round';

        const startRad = (rotacion * Math.PI) / 180;
        const endRad = ((rotacion + grados) * Math.PI) / 180;

        // Lado inicial
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + radio * Math.cos(startRad), y + radio * Math.sin(startRad));
        ctx.stroke();

        // Lado final
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + radio * Math.cos(endRad), y + radio * Math.sin(endRad));
        ctx.stroke();

        // Arco
        if (mostrarArco) {
            ctx.beginPath();
            // Para ángulos cóncavos (>180), dibujamos el arco externo
            ctx.arc(x, y, radio * 0.4, startRad, endRad, false);
            ctx.stroke();

            // Relleno suave
            ctx.fillStyle = color + '33'; // Transparencia
            ctx.lineTo(x, y);
            ctx.fill();
        }

        ctx.restore();
    },

    dibujarTransportador(ctx, x, y, radio) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radio, Math.PI, 0);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.strokeStyle = '#aaa';
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fill();

        // Marcas
        for (let i = 0; i <= 180; i += 10) {
            const rad = (Math.PI * (180 - i)) / 180;
            const len = i % 90 === 0 ? 15 : 10;
            const x1 = x + (radio - len) * Math.cos(rad);
            const y1 = y - (radio - len) * Math.sin(rad);
            const x2 = x + radio * Math.cos(rad);
            const y2 = y - radio * Math.sin(rad);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Números
            if (i % 30 === 0) {
                ctx.fillStyle = '#666';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                const tx = x + (radio - 25) * Math.cos(rad);
                const ty = y - (radio - 25) * Math.sin(rad);
                ctx.fillText(i.toString(), tx, ty);
            }
        }
        ctx.restore();
    },

    dibujarLineaPunteada(ctx, x1, y1, x2, y2, color = '#666') {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = color;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }
};
