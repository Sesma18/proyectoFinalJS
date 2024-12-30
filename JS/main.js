import { mostrarDiscos } from "./methods.js";

const { 
    cardsContainer, 
    searchInput, 
    minPriceInput, 
    maxPriceInput, 
    yearFilterInput, 
    filterBtn, 
    carritoContainer, 
    totalContainer 
} = obtenerElementos();

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const discosGuardados = JSON.parse(localStorage.getItem("discos")) || [];

async function cargarDiscos() {
    try {
        if (discosGuardados.length > 0) {
            return discosGuardados;
        } else {
            return await obtenerDiscosDesdeAPI();
        }
    } catch (error) {
        mostrarMensaje(error.message, "error");
        return [];
    }
}

async function obtenerDiscosDesdeAPI() {
    const response = await fetch('./JSON/discos.json');
    if (!response.ok) {
        throw new Error("Error al cargar los discos. Intenta nuevamente más tarde.");
    }
    const discos = await response.json();
    localStorage.setItem("discos", JSON.stringify(discos));
    return discos;
}

function aplicarFiltros(discos) {
    const filtros = obtenerFiltros();

    const discosFiltrados = discos.filter(disco => {
        return cumpleFiltros(disco, filtros);
    });

    mostrarDiscos(discosFiltrados, cardsContainer, carrito, carritoContainer, totalContainer);
}

function obtenerFiltros() {
    const { value: searchText } = searchInput;
    const { value: minPrice } = minPriceInput;
    const { value: maxPrice } = maxPriceInput;
    const { value: year } = yearFilterInput;

    return {
        searchText,
        minPrice: parseInt(minPrice),
        maxPrice: parseInt(maxPrice),
        year: parseInt(year),
    };
}

function cumpleFiltros(disco, filtros) {
    const matchesSearchText = disco.titulo.toLowerCase().includes(filtros.searchText.toLowerCase());
    const matchesMinPrice = !filtros.minPrice || disco.precio >= filtros.minPrice;
    const matchesMaxPrice = !filtros.maxPrice || disco.precio <= filtros.maxPrice;
    const matchesYear = !filtros.year || disco.anio === filtros.year;

    return matchesSearchText && matchesMinPrice && matchesMaxPrice && matchesYear;
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarCarrito() {
    localStorage.removeItem("carrito");
    mostrarMensaje("El carrito ha sido eliminado.", "info");
}

function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.createElement("div");
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = tipo;
    document.body.appendChild(mensajeDiv);
}

function obtenerElementos() {
    return {
        cardsContainer: document.getElementById("cards-container"),
        searchInput: document.getElementById("search"),
        minPriceInput: document.getElementById("min-price"),
        maxPriceInput: document.getElementById("max-price"),
        yearFilterInput: document.getElementById("year-filter"),
        filterBtn: document.getElementById("filter-btn"),
        carritoContainer: document.getElementById("carrito-items"),
        totalContainer: document.getElementById("carrito-total")
    };
}

async function iniciar() {
    const discos = await cargarDiscos();
    mostrarDiscos(discos, cardsContainer, carrito, carritoContainer, totalContainer);

    asignarEventos(discos);
}

function asignarEventos(discos) {
    filterBtn.addEventListener("click", () => aplicarFiltros(discos));
    searchInput.addEventListener("input", () => aplicarFiltros(discos));
    minPriceInput.addEventListener("input", () => aplicarFiltros(discos));
    maxPriceInput.addEventListener("input", () => aplicarFiltros(discos));
    yearFilterInput.addEventListener("input", () => aplicarFiltros(discos));

    carritoContainer.addEventListener("change", () => guardarCarrito());   
    }

iniciar();
