export const RandomGenerator = {
    entero(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    anguloConcavo() {
        return this.entero(181, 359);
    },

    anguloCualquiera() {
        // Mezcla de agudos, obtusos, llanos y cóncavos para ejercicios de identificación
        const tipos = ['agudo', 'obtuso', 'concavo', 'completo'];
        const tipo = tipos[this.entero(0, tipos.length - 1)];

        switch (tipo) {
            case 'agudo': return this.entero(10, 89);
            case 'obtuso': return this.entero(91, 179);
            case 'concavo': return this.entero(181, 359);
            case 'completo': return 360;
            default: return 180;
        }
    }
};
