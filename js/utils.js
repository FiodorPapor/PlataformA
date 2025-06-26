// --- Funciones utilitarias generales ---

// 👉 Capitaliza el nombre del fondo visual
function capitalizarFondo(fondo) {
    if (!fondo) return "";
    return fondo.charAt(0).toUpperCase() + fondo.slice(1);
}
