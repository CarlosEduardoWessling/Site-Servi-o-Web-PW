"use strict";

function calcularViagem(dados) {
  const { distancia, consumo, preco, pedagios, extras, passageiros, idaVolta } = dados;
  const valores = [distancia, consumo, preco, pedagios, extras, passageiros];

  for (const numero of valores) {
    if (!Number.isFinite(numero)) {
      throw new Error("Informe apenas números válidos nos campos da calculadora.");
    }
  }

  if (distancia <= 0 || consumo <= 0) {
    throw new Error("Distância e consumo precisam ser maiores que zero.");
  }
  if (preco < 0 || pedagios < 0 || extras < 0) {
    throw new Error("Os valores de combustível, pedágios e despesas não podem ser negativos.");
  }
  if (!Number.isInteger(passageiros) || passageiros < 1 || passageiros > 50) {
    throw new Error("Informe uma quantidade de pessoas entre 1 e 50.");
  }

  const distanciaTotal = distancia * (idaVolta ? 2 : 1);
  const litros = distanciaTotal / consumo;
  const custoCombustivel = litros * preco;

  const despesas = [
    { nome: "Combustível", valor: custoCombustivel },
    { nome: "Pedágios", valor: pedagios },
    { nome: "Outras despesas", valor: extras }
  ];

  let custoTotal = 0;
  for (const despesa of despesas) {
    custoTotal += despesa.valor;
  }

  return {
    distanciaTotal,
    litros,
    custoCombustivel,
    custoPedagios: pedagios,
    custoExtras: extras,
    custoTotal,
    custoPorPessoa: custoTotal / passageiros,
    despesas
  };
}

function moeda(valor) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function numeroBR(valor, casas = 1) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(valor);
}

function lerNumero(texto, padrao = NaN) {
  if (texto === null || String(texto).trim() === "") return padrao;
  return Number(String(texto).replace(",", "."));
}

function mostrarResultado(resultado) {
  document.getElementById("custo-total").textContent = moeda(resultado.custoTotal);
  document.getElementById("por-pessoa").textContent = moeda(resultado.custoPorPessoa);
  document.getElementById("distancia-total").textContent = `${numeroBR(resultado.distanciaTotal)} km`;
  document.getElementById("litros").textContent = `${numeroBR(resultado.litros, 2)} L`;
  document.getElementById("custo-combustivel").textContent = moeda(resultado.custoCombustivel);
  document.getElementById("custo-pedagios").textContent = moeda(resultado.custoPedagios);
  document.getElementById("custo-extras").textContent = moeda(resultado.custoExtras);
  document.getElementById("resultado").hidden = false;
  document.getElementById("resultado").scrollIntoView({ behavior: "auto", block: "start" });
}

function iniciar() {
  const parametros = new URLSearchParams(window.location.search);
  if (!parametros.has("distancia")) return;

  const formulario = document.getElementById("form-viagem");
  for (const campo of formulario.elements) {
    if (!campo.name || !parametros.has(campo.name)) continue;
    if (campo.type === "checkbox") campo.checked = parametros.get(campo.name) === "sim";
    else campo.value = parametros.get(campo.name);
  }

  const dados = {
    distancia: lerNumero(parametros.get("distancia")),
    consumo: lerNumero(parametros.get("consumo")),
    preco: lerNumero(parametros.get("preco")),
    pedagios: lerNumero(parametros.get("pedagios"), 0),
    extras: lerNumero(parametros.get("extras"), 0),
    passageiros: lerNumero(parametros.get("passageiros")),
    idaVolta: parametros.get("ida_volta") === "sim"
  };

  try {
    mostrarResultado(calcularViagem(dados));
  } catch (erro) {
    const aviso = document.getElementById("mensagem-erro");
    aviso.textContent = erro.message;
    aviso.hidden = false;
  }
}

iniciar();