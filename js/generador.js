// --- Lógica de generación de página y wallet ---

let walletData = {
    tipo: null,
    direccion: null,
    clavePrivada: null
};

let fondoSeleccionado = null;

function iniciarGenerador() {
    localStorage.removeItem("walletData");
    const landing = document.getElementById("landing");
    const paso1 = document.getElementById("paso1");

    if (landing && paso1) {
        landing.style.display = "none";
        paso1.style.display = "block";
        paso1.scrollIntoView({ behavior: 'smooth' });
        paso1.setAttribute("aria-hidden", "false");
    } else {
        console.error("No se encontró una de las secciones (#landing o #paso1)");
    }
}

function mostrarPaso2() {
    const paso1 = document.getElementById("paso1");
    const paso2 = document.getElementById("paso2");

    if (paso1 && paso2) {
        paso1.style.display = "none";
        paso1.setAttribute("aria-hidden", "true");

        paso2.style.display = "block";
        paso2.removeAttribute("aria-hidden");

        paso2.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn("No se encontró uno de los pasos.");
    }
}

// Valida el primer paso antes de avanzar
// Valida el primer paso antes de avanzar (solo para el campo obligatorio)
function validarPaso1() {
    const nombreInput = document.getElementById("nombreNegocio");
    const error = document.getElementById("errorNombre");
    const nombre = nombreInput.value.trim();

    // Resetea los estilos de error antes de chequear
    nombreInput.classList.remove("border-yellow-400", "bg-yellow-50");
    error.classList.add("hidden");

    // Si el campo está vacío, muestra el error y la marca amarilla
    if (nombre === "") {
        nombreInput.classList.add("border-yellow-400", "bg-yellow-50");
        error.classList.remove("hidden");
        nombreInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nombreInput.focus();
        return;
    }

    // Si está todo ok, avanza al siguiente paso
    mostrarPaso2();
}



function elegirWallet(opcion) {
    // Visual: resetea los estilos de los botones
    document.getElementById("btnManual").classList.remove("border-black", "bg-gray-100", "font-semibold");
    document.getElementById("btnGenerar").classList.remove("border-black", "bg-gray-100", "font-semibold");

    // Oculta el campo manual de wallet de forma suave
    const walletManual = document.getElementById("walletManual");
    walletManual.classList.remove("fade-in");
    walletManual.style.display = "none";

    // Reinicia los valores del formulario
    document.getElementById("direccionManual").value = "";
    walletData = { tipo: null, direccion: null, clavePrivada: null };

    if (opcion === 'manual') {
        document.getElementById("btnManual").classList.add("border-black", "bg-gray-100", "font-semibold");
        // Muestra el campo manual de wallet con animación
        walletManual.style.display = "block";
        setTimeout(() => walletManual.classList.add("fade-in"), 10);
        walletData.tipo = 'manual';
    } else if (opcion === 'generar') {
        document.getElementById("btnGenerar").classList.add("border-black", "bg-gray-100", "font-semibold");
        abrirAvisoModal(); // ✅ Mostramos la modal de condiciones
        walletData.tipo = 'generada';
    }

}

function mostrarCampoGenerarWallet() {
    document.getElementById("walletManual").style.display = "block";
    document.getElementById("direccionManual").value = "";
    document.getElementById("direccionManual").readOnly = true; // Siempre solo lectura, porque se va a generar
    // No generamos la wallet todavía
}


function validarDireccionManual() {
    const input = document.getElementById("direccionManual");
    const mensaje = document.getElementById("errorWallet");
    // Oculta el mensaje de error y resetea el estilo amarillo
    mensaje.classList.add("hidden");
    input.classList.remove("border-yellow-400", "bg-yellow-50");
}


function continuarConWallet() {
    const walletManualBlock = document.getElementById("walletManual");
    const direccionInput = document.getElementById("direccionManual");
    const error = document.getElementById("errorWallet");
    const direccion = direccionInput.value.trim();

    const estaVisible = walletManualBlock && walletManualBlock.style.display !== "none";
    const direccionPareceValida = direccion.startsWith("0x") && direccion.length === 42;

    // Siempre resetea antes de validar (como en Paso 1)
    direccionInput.classList.remove("border-yellow-400", "bg-yellow-50");
    error.classList.add("hidden");

    if (estaVisible) {
        if (direccion === "") {
            direccionInput.classList.add("border-yellow-400", "bg-yellow-50");
            error.classList.remove("hidden");
            direccionInput.focus();
            walletData.direccion = null;
            return;
        }
        if (!direccionPareceValida) {
            direccionInput.classList.add("border-yellow-400", "bg-yellow-50");
            error.classList.remove("hidden");
            direccionInput.focus();
            walletData.direccion = null;
            return;
        }
        walletData.direccion = direccion;
    }

    // ⛔️ Не переходим если нет валидного адреса
    if (!walletData.direccion || !walletData.direccion.startsWith("0x") || walletData.direccion.length !== 42) {
        return;
    }

    // Guardar datos en localStorage
    localStorage.setItem("walletData", JSON.stringify(walletData));

    // Ir al paso 3
    const paso2 = document.getElementById("paso2");
    const paso3 = document.getElementById("paso3");

    if (paso2 && paso3) {
        paso2.style.display = "none";
        paso2.setAttribute("aria-hidden", "true");

        paso3.style.display = "block";
        paso3.removeAttribute("aria-hidden");

        paso3.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn("No se encontró uno de los pasos.");
    }
}

function seleccionarFondo(tipo) {
    fondoSeleccionado = tipo;

    // Limpiar selección anterior
    document.querySelectorAll('.fondo-option').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500');
        btn.classList.remove('glow-moderna', 'glow-elegante', 'glow-tecno', 'glow-blanca');
    });

    // Aplicar efecto visual según tipo
    const btnElegido = document.getElementById(`fondo-${tipo}`);
    if (btnElegido) {
        switch (tipo) {
            case 'moderno':
                btnElegido.classList.add('glow-moderna');
                break;
            case 'elegante':
                btnElegido.classList.add('glow-elegante');
                break;
            case 'tecnologico':
                btnElegido.classList.add('glow-tecno');
                break;
            case 'blanco':
                btnElegido.classList.add('glow-blanca');
                break;
        }
    }
}

function generarPaginaCobro() {
    const nombreNegocio = document.getElementById("nombreNegocio").value.trim();
    const wallet = walletData.direccion;
    const fondoElegido = fondoSeleccionado || "blanco";

    if (!wallet) {
        alert("No se detectó una billetera válida.");
        return;
    }

    // ✅ Insertamos los datos en la modal SOLO si existen los elementos
    const resumenNombre = document.getElementById("resumenNombre");
    if (resumenNombre) resumenNombre.innerText = nombreNegocio || "Sin nombre";

    const resumenNombreTitulo = document.getElementById("resumenNombreTitulo");
    if (resumenNombreTitulo) resumenNombreTitulo.innerText = nombreNegocio || "Tu negocio";

    const resumenWallet = document.getElementById("resumenWallet");
    if (resumenWallet) resumenWallet.innerText = wallet.slice(0, 6) + "..." + wallet.slice(-4);

    const resumenFondo = document.getElementById("resumenFondo");
    if (resumenFondo) resumenFondo.innerText = capitalizarFondo(fondoElegido);

    // ✅ Mostrar modal
    abrirModalConfirmacion();
}

function volverAPaso1() {
    const paso1 = document.getElementById("paso1");
    const paso2 = document.getElementById("paso2");

    if (paso1 && paso2) {
        paso2.style.display = "none";
        paso2.setAttribute("aria-hidden", "true");

        paso1.style.display = "block";
        paso1.removeAttribute("aria-hidden");

        paso1.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn("No se encontró uno de los pasos.");
    }

    // 👉 Siempre dejá el campo editable al volver (importante para UX en Argentina)
    const direccionManual = document.getElementById("direccionManual");
    if (direccionManual) {
      direccionManual.readOnly = false;
    }
}

function volverAPaso2() {
    const paso2 = document.getElementById("paso2");
    const paso3 = document.getElementById("paso3");

    if (paso2 && paso3) {
        paso3.style.display = "none";
        paso3.setAttribute("aria-hidden", "true");

        paso2.style.display = "block";
        paso2.removeAttribute("aria-hidden");

        paso2.scrollIntoView({ behavior: 'smooth' });
    }
}

// 🧾 Genera y descarga PDF real usando jsPDF
async function generarPDF(billetera, clavePrivada, soloGenerar = false) {
    const doc = new window.jspdf.jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("TU BILLETERA CRIPTO FUE CREADA", 20, 20);

    let y = 34;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Dirección pública:", 20, y);
    y += 7;

    doc.setFont("courier", "normal");
    doc.text(billetera, 20, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.text("Clave privada:", 20, y);
    y += 7;

    doc.setFont("courier", "normal");
    doc.text(clavePrivada, 20, y);
    y += 18;

    const bloques = [
        {
            titulo: "¿PARA QUÉ SIRVE ESTA BILLETERA?",
            texto: [
                "Recibir y enviar criptomonedas en Polygon, Ethereum, Binance Smart Chain y más.",
                "Para ver tu saldo o mover fondos, usá MetaMask o Trust Wallet."
            ]
        },
        {
            titulo: "CONSEJOS ESENCIALES:",
            texto: [
                "- Guardá este PDF en un lugar seguro (pendrive, bóveda offline, gestor de contraseñas).",
                "- Nunca compartas tu clave privada.",
                "- Si la perdés, nadie podrá recuperar tus fondos (ni PlataformA, ni otra persona).",
                "- PlataformA nunca tiene acceso ni controla tus fondos o claves privadas."
            ]
        },
        {
            titulo: "RECOMENDACIÓN PLATAFORMA: USA POLYGON",
            texto: [
                "Comisiones super bajas (aprox. USD 0.03–0.05 por transferencia).",
                "Operaciones rápidas e ideales para pagos diarios."
            ]
        },
        {
            titulo: "NOTA SOBRE COMISIONES:",
            texto: [
                "Para enviar fondos en la red Polygon, necesitás tener un poco de MATIC (la moneda de la red)",
                "para la comisión. Si solo recibís pagos, no necesitás MATIC."
            ]
        },
        {
            titulo: "MÁS INFORMACIÓN Y AYUDA:",
            texto: [
                "Guías y soporte en plataforma.ar",
                "WhatsApp: +54 9 11 2736-9492 / wa.me/5491127369492"
            ]
        },
        {
            titulo: "",
            texto: [
                "¡Listo! Ahora tu cripto está en tus manos.",
                "Disfrutá tu libertad financiera.",
                "Equipo PlataformA | plataforma.ar"
            ]
        }
    ];

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    for (const bloque of bloques) {
        if (bloque.titulo) {
            doc.setFont("helvetica", "bold");
            doc.text(bloque.titulo, 20, y);
            y += 7;
        }

        doc.setFont("helvetica", "normal");
        for (const linea of bloque.texto) {
            doc.text(linea, 20, y, { maxWidth: 170 });
            y += 6;
        }

        y += 6;
    }

    if (soloGenerar === true) {
        return doc.output('blob');
    } else {
        doc.save("Tu-Billetera-Cripto.pdf");
    }
}

// 👉 Descarga el PDF, lo abre en una nueva pestaña y habilita el botón de continuar
async function descargarPDFManual() {
    // 👉 Si no existe la wallet, la generamos ahora
    if (!walletData.direccion || !walletData.clavePrivada) {
        // ⚡️ Generamos la wallet automáticamente (usando ethers.js)
        const wallet = ethers.Wallet.createRandom();
        walletData.direccion = wallet.address;
        walletData.clavePrivada = wallet.privateKey;

        // 👉 Insertamos la dirección en el campo manual y lo dejamos readonly
        const inputManual = document.getElementById("direccionManual");
        if (inputManual) {
            inputManual.value = wallet.address;
            inputManual.readOnly = true;
        }
    }

    // ✅ Generamos y descargamos el PDF
    const pdfBlob = await generarPDF(walletData.direccion, walletData.clavePrivada, true);
    const url = URL.createObjectURL(pdfBlob);

    // 👉 Abrimos el PDF en una nueva pestaña
    window.open(url, "_blank");

    // 👉 Descargamos automáticamente
    const a = document.createElement("a");
    a.href = url;
    a.download = "Tu-Billetera-Cripto.pdf";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 800);

    // 👉 Mostramos mensaje de éxito debajo del botón
    const estado = document.getElementById("estadoDescargaPDF");
    if (estado) {
        estado.innerHTML = "✅ Archivo descargado. Podés continuar.";
        estado.classList.add("text-green-600");
    }

    // 👉 Activamos el botón de continuar
    const btn = document.getElementById("btnEntendido");
    if (btn) {
        btn.disabled = false;
        btn.classList.remove("opacity-50", "cursor-not-allowed");
    }
}
// Validación y avance
function validarFormulario() {
    const nombreInput = document.getElementById("nombreNegocio");
    const error = document.getElementById("errorNombre");
    // Resetea los estilos de error antes de chequear
    nombreInput.classList.remove("border-yellow-400", "bg-yellow-50");
    error.classList.add("hidden");
    if (nombreInput.value.trim() === "") {
        nombreInput.classList.add("border-yellow-400", "bg-yellow-50");
        error.classList.remove("hidden");
        nombreInput.focus();
        return false;
    }
    return true;
}

function validarYContinuar() {
    if (validarFormulario()) {
        mostrarPaso2();
    }
}

// UX mejorado: limpia el error solo cuando realmente hay texto
document.addEventListener('DOMContentLoaded', () => {
    const nombreInput = document.getElementById("nombreNegocio");
    const error = document.getElementById("errorNombre");
    if (nombreInput && error) {
        nombreInput.addEventListener('input', () => {
            // Saca el error solo si el campo deja de estar vacío
            if (nombreInput.value.trim() !== "") {
                nombreInput.classList.remove('border-yellow-400', 'bg-yellow-50');
                error.classList.add('hidden');
            }
        });
        // Eliminado el listener de focus, no es necesario
    }
});
