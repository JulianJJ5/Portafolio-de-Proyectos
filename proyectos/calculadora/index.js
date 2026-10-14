"use strict";

(() => {
  const pantallaExpresion = document.getElementById("expresion");
  const pantallaResultado = document.getElementById("resultado");
  const teclado = document.getElementById("teclado");

  const OPERADORES = "+-*/";
  const SIMBOLOS = { "*": "×", "/": "÷", "-": "−" };
  const MAX_LONGITUD = 64;

  let expresion = "";
  let mostrandoResultado = false;

  class ErrorCalculo extends Error {}

  /* ---------- Evaluador seguro (descenso recursivo, sin eval) ---------- */

  const tokenizar = (texto) => {
    const tokens = [];
    let i = 0;
    while (i < texto.length) {
      const c = texto[i];
      if (/[0-9.]/.test(c)) {
        let numero = "";
        while (i < texto.length && /[0-9.]/.test(texto[i])) numero += texto[i++];
        if (!/^(\d+\.?\d*|\.\d+)$/.test(numero)) throw new ErrorCalculo("Número no válido");
        tokens.push({ tipo: "num", valor: parseFloat(numero) });
        continue;
      }
      if ("+-*/()".includes(c)) {
        tokens.push({ tipo: c });
        i++;
        continue;
      }
      throw new ErrorCalculo("Carácter no permitido");
    }
    return tokens;
  };

  const evaluar = (texto) => {
    const tokens = tokenizar(texto);
    let pos = 0;
    const ver = () => tokens[pos];
    const consumir = () => tokens[pos++];

    // expr := term (('+' | '-') term)*
    const expr = () => {
      let valor = term();
      while (ver() && (ver().tipo === "+" || ver().tipo === "-")) {
        const op = consumir().tipo;
        const derecha = term();
        valor = op === "+" ? valor + derecha : valor - derecha;
      }
      return valor;
    };

    // term := factor (('*' | '/') factor)*
    const term = () => {
      let valor = factor();
      while (ver() && (ver().tipo === "*" || ver().tipo === "/")) {
        const op = consumir().tipo;
        const derecha = factor();
        if (op === "/" && derecha === 0) throw new ErrorCalculo("No se puede dividir entre cero");
        valor = op === "*" ? valor * derecha : valor / derecha;
      }
      return valor;
    };

    // factor := ('+' | '-') factor | número | '(' expr ')'
    const factor = () => {
      const t = consumir();
      if (!t) throw new ErrorCalculo("Expresión incompleta");
      if (t.tipo === "-") return -factor();
      if (t.tipo === "+") return factor();
      if (t.tipo === "num") return t.valor;
      if (t.tipo === "(") {
        const valor = expr();
        if (!ver() || ver().tipo !== ")") throw new ErrorCalculo("Falta cerrar un paréntesis");
        consumir();
        return valor;
      }
      throw new ErrorCalculo("Expresión no válida");
    };

    if (tokens.length === 0) throw new ErrorCalculo("Expresión vacía");
    const resultado = expr();
    if (pos < tokens.length) throw new ErrorCalculo("Expresión no válida");
    if (!Number.isFinite(resultado)) throw new ErrorCalculo("Resultado fuera de rango");
    // Redondeo para evitar artefactos de coma flotante (0.1 + 0.2).
    return parseFloat(resultado.toPrecision(12));
  };

  /* ---------- Interfaz ---------- */

  const formatear = (texto) => texto.replace(/[*/-]/g, (op) => SIMBOLOS[op]);

  const mostrar = (resultado = null, esError = false) => {
    pantallaExpresion.textContent = formatear(expresion);
    pantallaResultado.classList.toggle("es-error", esError);
    if (resultado !== null) {
      pantallaResultado.textContent = resultado;
    } else {
      pantallaResultado.textContent = expresion ? formatear(expresion) : "0";
      pantallaExpresion.textContent = "";
    }
  };

  const ultimoNumero = () => {
    const coincidencia = expresion.match(/[0-9.]*$/);
    return coincidencia ? coincidencia[0] : "";
  };

  const insertar = (valor) => {
    if (mostrandoResultado) {
      // Tras un resultado: un operador continúa la cuenta; un número empieza otra.
      if (!OPERADORES.includes(valor)) expresion = "";
      mostrandoResultado = false;
    }
    if (expresion.length >= MAX_LONGITUD) return;

    const ultimo = expresion.slice(-1);

    if (OPERADORES.includes(valor)) {
      if (valor !== "-" && (expresion === "" || ultimo === "(")) return;
      const permiteNegativo = valor === "-" && (ultimo === "*" || ultimo === "/");
      if (OPERADORES.includes(ultimo) && !permiteNegativo) {
        // Sustituye el operador anterior (y un posible signo negativo previo).
        expresion = expresion.replace(/[*/]?[+\-*/]$/, "");
        if (valor !== "-" && (expresion === "" || expresion.endsWith("("))) {
          mostrar();
          return;
        }
      }
    } else if (valor === ".") {
      if (ultimoNumero().includes(".")) return;
      if (!/[0-9]/.test(ultimo)) valor = "0.";
    } else if (valor === ")") {
      const abiertos = (expresion.match(/\(/g) || []).length;
      const cerrados = (expresion.match(/\)/g) || []).length;
      if (abiertos <= cerrados || OPERADORES.includes(ultimo) || ultimo === "(" || ultimo === "") return;
    } else if (valor === "(") {
      if (/[0-9.)]/.test(ultimo)) valor = "*(";
    } else if (ultimo === ")") {
      valor = "*" + valor;
    }

    expresion += valor;
    mostrar();
  };

  const calcular = () => {
    if (!expresion || mostrandoResultado) return;
    try {
      const resultado = evaluar(expresion);
      mostrar(String(resultado));
      expresion = String(resultado);
      mostrandoResultado = true;
    } catch (error) {
      if (!(error instanceof ErrorCalculo)) throw error;
      mostrar(error.message, true);
    }
  };

  const retroceso = () => {
    if (mostrandoResultado) {
      mostrandoResultado = false;
    }
    expresion = expresion.slice(0, -1);
    mostrar();
  };

  const limpiar = () => {
    expresion = "";
    mostrandoResultado = false;
    mostrar();
  };

  const acciones = { limpiar, retroceso, calcular };

  teclado.addEventListener("click", (evento) => {
    const tecla = evento.target.closest(".tecla");
    if (!tecla) return;
    if (tecla.dataset.accion) acciones[tecla.dataset.accion]();
    else insertar(tecla.dataset.valor);
  });

  const resaltarTecla = (selector) => {
    const tecla = teclado.querySelector(selector);
    if (!tecla) return;
    tecla.classList.add("is-pulsada");
    setTimeout(() => tecla.classList.remove("is-pulsada"), 120);
  };

  document.addEventListener("keydown", (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    const { key } = evento;
    const mapa = { x: "*", X: "*", ",": "." };
    const valor = mapa[key] || key;

    if (/^[0-9]$/.test(valor) || "+-*/().".includes(valor)) {
      evento.preventDefault();
      insertar(valor);
      resaltarTecla(`[data-valor="${CSS.escape(valor)}"]`);
    } else if (key === "Enter" || key === "=") {
      evento.preventDefault();
      calcular();
      resaltarTecla('[data-accion="calcular"]');
    } else if (key === "Backspace") {
      evento.preventDefault();
      retroceso();
      resaltarTecla('[data-accion="retroceso"]');
    } else if (key === "Escape" || key === "Delete") {
      evento.preventDefault();
      limpiar();
      resaltarTecla('[data-accion="limpiar"]');
    }
  });

  mostrar();
})();
