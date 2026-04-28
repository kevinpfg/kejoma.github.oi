let index = 0;
let slides = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

/* ================== INICIO ================== */
window.addEventListener("load", () => {
  slides = document.querySelectorAll("#slider img");

  if (slides.length > 0) {
    showSlide(0);
  }

  renderCarrito();

  let usuarioGuardado = localStorage.getItem("usuario");
  if (usuarioGuardado) {
    mostrarUsuario(usuarioGuardado);
  }

  cargarFavoritos();
});

/* ================== MENU ================== */
function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

function toggleLogin() {
  document.getElementById("login-form-container").classList.toggle("activo");
}

function toggleCarrito() {
  document.getElementById("carrito-desplegable").classList.toggle("activo");
}

/* ================== SLIDER ================== */
function showSlide(i) {
  slides.forEach(img => (img.style.display = "none"));
  index = (i + slides.length) % slides.length;
  slides[index].style.display = "block";
}

function moveSlide(step) {
  showSlide(index + step);
}

setInterval(() => {
  if (slides.length > 0) {
    moveSlide(1);
  }
}, 4000);

/* ================== CARRITO ================== */
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  guardarCarrito();
  renderCarrito();
  alert("Producto agregado 🛒");
}

function eliminarProducto(indexItem) {
  carrito.splice(indexItem, 1);
  guardarCarrito();
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
}

function renderCarrito() {
  let lista = document.getElementById("lista-carrito");
  let totalElemento = document.getElementById("total");
  let contadorElemento = document.getElementById("contador");

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, i) => {
    let li = document.createElement("li");

    li.innerHTML = `
      ${item.nombre} - $${item.precio.toLocaleString()}
      <button onclick="eliminarProducto(${i})">❌</button>
    `;

    lista.appendChild(li);
    total += item.precio;
  });

  totalElemento.textContent = total.toLocaleString();
  contadorElemento.textContent = carrito.length;
}

/* ================== PAGOS ================== */
function comprarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "Hola, quiero comprar:\n";

  carrito.forEach(item => {
    mensaje += `${item.nombre} - $${item.precio}\n`;
  });

  let numero = "573102519142";
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`);
}

function pagarNequi() {
  alert("Pago por Nequi: envía al número 300XXXXXXX");
}

function pagarPayPal() {
  window.open("https://www.paypal.com");
}

function pagarWeb() {
  if (carrito.length === 0) {
    alert("Carrito vacío");
    return;
  }

  alert("Pago realizado correctamente ✅");
  descargarPDF();
  vaciarCarrito();
}

/* ================== PDF ================== */
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("RECIBO KEJOMA", 20, 20);

  doc.setFontSize(12);
  let y = 40;
  let total = 0;

  carrito.forEach(item => {
    doc.text(`${item.nombre} - $${item.precio}`, 20, y);
    y += 10;
    total += item.precio;
  });

  doc.text("------------------------", 20, y);
  y += 10;
  doc.text(`TOTAL: $${total}`, 20, y);

  doc.save("recibo-kejoma.pdf");
}

/* ================== BUSCADOR ================== */
function buscarProducto() {
  let input = document.getElementById("buscador").value.toLowerCase();
  let productos = document.querySelectorAll(".producto");

  productos.forEach(p => {
    let texto = p.textContent.toLowerCase();
    p.style.display = texto.includes(input) ? "inline-block" : "none";
  });
}

/* ================== FILTRO ================== */
function filtrar(marca) {
  let secciones = document.querySelectorAll(".marca");

  secciones.forEach(sec => {
    if (marca === "all") {
      sec.style.display = "block";
    } else {
      sec.style.display = sec.classList.contains(marca) ? "block" : "none";
    }
  });
}

/* ================== LOGIN ================== */
function login() {
  let correo = document.getElementById("correo").value;
  let pass = document.getElementById("password").value;
  let mensaje = document.getElementById("mensaje-login");

  if (correo === "" || pass === "") {
    mensaje.style.color = "red";
    mensaje.textContent = "⚠️ Completa todos los campos";
    return;
  }

  localStorage.setItem("usuario", correo); // 🔒 NO guardar contraseña

  mostrarUsuario(correo);

  mensaje.style.color = "green";
  mensaje.textContent = "✅ Sesión iniciada";

  setTimeout(() => {
    toggleLogin();
  }, 1000);
}

function mostrarUsuario(nombre) {
  let btn = document.querySelector(".btn-login");
  btn.innerHTML = `<i class="fas fa-user"></i> ${nombre}`;
  btn.onclick = cerrarSesion;
}

function cerrarSesion() {
  localStorage.removeItem("usuario");

  let btn = document.querySelector(".btn-login");
  btn.innerHTML = `<i class="fas fa-user"></i>`;
  btn.onclick = toggleLogin;

  alert("Sesión cerrada");
}

/* ================== FAVORITOS ================== */
function cargarFavoritos() {
  document.querySelectorAll(".btn-fav").forEach(boton => {
    let nombre = boton.getAttribute("onclick").split("'")[1];

    if (favoritos.includes(nombre)) {
      boton.textContent = "❤️ Guardado";
      boton.style.background = "red";
    }
  });
}

function agregarFavoritoBtn(boton, nombre) {
  if (favoritos.includes(nombre)) {
    favoritos = favoritos.filter(f => f !== nombre);
    boton.textContent = "❤️ Favorito";
    boton.style.background = "#ff4081";
  } else {
    favoritos.push(nombre);
    boton.textContent = "❤️ Guardado";
    boton.style.background = "red";
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}