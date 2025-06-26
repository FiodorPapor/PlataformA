// --- Funciones de manejo de modales y popups (todo Argentina) ---

// ✅ Modal de confirmación previa a generar link
function abrirModalConfirmacion() {
    const nombre = document.getElementById("nombreNegocio")?.value || "Tu negocio";
    const wallet = walletData.direccion || "–";
    const fondoElegidoCapitalizado = capitalizarFondo(fondoSeleccionado);

    // ✅ Insertamos los datos en los elementos correspondientes de la modal
    document.getElementById("resumenNombre").textContent = nombre;
    document.getElementById("resumenNombreTitulo").textContent = nombre;
    document.getElementById("resumenWallet").textContent = wallet.slice(0, 6) + "..." + wallet.slice(-4);
    document.getElementById("resumenFondo").textContent = fondoElegidoCapitalizado;

    // ✅ Mostramos la modal
    document.getElementById("confirmModal").classList.remove("hidden");
}

function cerrarModalConfirmacion() {
    document.getElementById("confirmModal").classList.add("hidden");
}

// ✅ Modal post-confirmación (sugerencia mejorada)
function mostrarModalPostConfirmacion() {
    document.getElementById("modalPostConfirmacion").classList.remove("hidden");
}
function cerrarModalPostConfirmacion() {
    document.getElementById("modalPostConfirmacion").classList.add("hidden");
}

// ✅ Modal de éxito (PDF descargado)
function mostrarModalExitoManual() {
    const modal = document.getElementById("modalExito");
    if (modal) {
        modal.style.display = "flex";
        const inner = modal.querySelector("div");
        if (inner) {
            inner.classList.remove("fade-in-modal");
            void inner.offsetWidth;
            inner.classList.add("fade-in-modal");
        }
    }

    // Deshabilitar el botón "Entendido" hasta que se descargue el PDF
    const btn = document.getElementById("btnEntendido");
    if (btn) {
        btn.disabled = true;
        btn.classList.add("opacity-50", "cursor-not-allowed");
    }
}

// Cierra la modal de éxito
window.cerrarModalExito = function () {
    document.getElementById("modalExito").style.display = "none";

    // 👉 Al cerrar la modal, mostramos el campo manual con el valor generado (si existe)
    if (walletData.direccion) {
        const walletManual = document.getElementById("walletManual");
        if (walletManual) walletManual.style.display = "block";
        const inputManual = document.getElementById("direccionManual");
        if (inputManual) {
            inputManual.value = walletData.direccion;
            inputManual.readOnly = true;
        }
        // 👉 (Opcional) Activa el botón de continuar al siguiente paso
        const btn = document.getElementById("continuarPaso2");
        if (btn) btn.disabled = false;
    }
}
// 👉 Abre la modal de aviso y condiciones
window.abrirAvisoModal = function () {
    const modal = document.getElementById("avisoModal");
    if (modal) {
        modal.style.display = "flex";
        // Animación visual
        const inner = modal.querySelector("div");
        if (inner) {
            inner.classList.remove("fade-in-modal");
            void inner.offsetWidth;
            inner.classList.add("fade-in-modal");
        }
    }
    // Resetear checkbox y botón
    document.getElementById("acceptPrivacy").checked = false;
    document.getElementById("btnAceptar").disabled = true;
    document.getElementById("mensajeError").style.display = "none";
}
window.abrirModalWalletInfo = function () {
    document.getElementById('modalWalletInfo').style.display = 'flex';
}
// 👉 Cierra la modal de aviso de privacidad
window.cerrarAvisoModal = function () {
    document.getElementById("avisoModal").style.display = "none";
    // Resetea el estado del checkbox y botón aceptar
    document.getElementById("acceptPrivacy").checked = false;
    document.getElementById("btnAceptar").disabled = true;
    document.getElementById("mensajeError").style.display = "none";
}

