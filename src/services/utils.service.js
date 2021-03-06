class UtilsService  {
    calcularPrecioConDescuento = (precio, descuento) => {
        return descuento > 0
            ? (precio - (precio * descuento) / 100).toFixed(2)
            : (+precio).toFixed(2);
    }
    formatearPrecio = (precio) =>
        precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
};

module.exports = UtilsService;
