const missao = {
  oxigenio:    82,
  agua:        76,
  alimentos:   91,
  autonomia:   128,
  temperatura: 23,
  pressao:     101.3,
  umidade:     48,
  co2:         0.04,
};

const limites = {
  oxigenio:    { atencao: 75, critico: 60 },
  agua:        { atencao: 70, critico: 50 },
  alimentos:   { atencao: 60, critico: 40 },
  temperatura: { atencao: 27, critico: 30 },
  co2:         { atencao: 0.5, critico: 1.0 },
};

function notificar(mensagem, tipo) {
  const area = document.getElementById("area-notificacoes");
  if (!area) return;

  const div = document.createElement("div");
  div.className = `notif ${tipo}`;
  div.textContent = mensagem;
  div.setAttribute("role", "alert");

  div.addEventListener("click", () => div.remove());

  area.appendChild(div);

  setTimeout(() => {
    if (div.parentNode) div.remove();
  }, 5000);
}

function classificar(recurso, valor) {
  const lim = limites[recurso];
  if (!lim) return "normal";

  if (recurso === "co2" || recurso === "temperatura") {
    if (valor >= lim.critico) return "critico";
    if (valor >= lim.atencao) return "atencao";
    return "normal";
  }

  if (valor <= lim.critico) return "critico";
  if (valor <= lim.atencao) return "atencao";
  return "normal";
}

function atualizarEl(id, valor, recurso) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = valor;

  if (recurso) {
    el.classList.remove("normal", "atencao", "critico");
    el.classList.add(classificar(recurso, parseFloat(valor)));
  }
}

function atualizarTabela(idQtd, idSt, qtdTexto, classe, texto) {
  const qtd = document.getElementById(idQtd);
  const st  = document.getElementById(idSt);
  if (qtd) qtd.textContent = qtdTexto;
  if (st) {
    st.textContent = texto;
    st.className = classe;
  }
}

let intervaloSimulacao = null;
let simulacaoAtiva = false;

function variar(base, delta, min, max, dec) {
  const novo = base + (Math.random() * 2 - 1) * delta;
  return parseFloat(Math.min(max, Math.max(min, novo)).toFixed(dec || 0));
}

function cicloSimulacao() {
  missao.oxigenio    = variar(missao.oxigenio,    0.8, 0,  100, 0);
  missao.agua        = variar(missao.agua,         0.5, 0,  100, 0);
  missao.alimentos   = variar(missao.alimentos,    0.3, 0,  100, 0);
  missao.temperatura = variar(missao.temperatura,  0.5, 15, 40,  1);
  missao.pressao     = variar(missao.pressao,      0.3, 90, 115, 1);
  missao.umidade     = variar(missao.umidade,      1,   15, 90,  0);
  missao.co2         = variar(missao.co2,          0.01, 0.01, 2, 2);
  if (missao.autonomia > 0) missao.autonomia--;

  atualizarEl("val-oxigenio",  missao.oxigenio + "%",  "oxigenio");
  atualizarEl("val-agua",      missao.agua + "%",       "agua");
  atualizarEl("val-alimentos", missao.alimentos + "%",  "alimentos");
  atualizarEl("val-autonomia", missao.autonomia,        "");

  atualizarEl("val-temperatura", missao.temperatura + "°C", "temperatura");
  atualizarEl("val-pressao",     missao.pressao,            "");
  atualizarEl("val-umidade",     missao.umidade + "%",      "");
  atualizarEl("val-co2",         missao.co2 + "%",          "co2");

  const classeOxi  = "status-" + classificar("oxigenio", missao.oxigenio);
  const classeAgua = "status-" + classificar("agua",     missao.agua);
  const textoOxi   = missao.oxigenio <= limites.oxigenio.critico ? "Crítico"
                   : missao.oxigenio <= limites.oxigenio.atencao  ? "Atenção" : "Normal";
  const textoAgua  = missao.agua <= limites.agua.critico ? "Crítico"
                   : missao.agua <= limites.agua.atencao  ? "Atenção" : "Normal";

  atualizarTabela("qtd-oxigenio", "st-oxigenio",
    Math.round(missao.oxigenio * 10) + " kg", classeOxi, textoOxi);
  atualizarTabela("qtd-agua", "st-agua",
    Math.round(missao.agua * 20) + " L", classeAgua, textoAgua);

  atualizarAlertas();
}

function iniciarSimulacao() {
  if (simulacaoAtiva) return;
  simulacaoAtiva = true;

  const btn = document.getElementById("btn-simulacao");
  btn.textContent = "⏹ Parar Simulação";
  btn.classList.replace("parado", "rodando");

  notificar("📡 Conectando ao satélite...", "info");

  setTimeout(() => {
    notificar("🛰️ Telemetria recebida. Dados ao vivo!", "info");
    cicloSimulacao();
    intervaloSimulacao = setInterval(cicloSimulacao, 3000);
  }, 2000);
}

function pararSimulacao() {
  if (!simulacaoAtiva) return;
  simulacaoAtiva = false;

  clearInterval(intervaloSimulacao);

  const btn = document.getElementById("btn-simulacao");
  btn.textContent = "▶ Iniciar Simulação";
  btn.classList.replace("rodando", "parado");

  notificar("📡 Simulação pausada.", "aviso");
}

function atualizarAlertas() {
  const painel = document.getElementById("painel-alertas");
  if (!painel) return;

  const alertas = [];

  if (missao.oxigenio <= limites.oxigenio.critico) {
    alertas.push({ tipo: "alert-critical", msg: `🚨 CRÍTICO: Oxigênio em ${missao.oxigenio}%. Acionar reservas!` });
  } else if (missao.oxigenio <= limites.oxigenio.atencao) {
    alertas.push({ tipo: "alert-warning", msg: `⚠ Oxigênio em ${missao.oxigenio}%. Monitoramento contínuo.` });
  }

  if (missao.agua <= limites.agua.critico) {
    alertas.push({ tipo: "alert-critical", msg: `🚨 CRÍTICO: Água em ${missao.agua}%. Racionamento obrigatório!` });
  } else if (missao.agua <= limites.agua.atencao) {
    alertas.push({ tipo: "alert-warning", msg: `⚠ Água em ${missao.agua}%. Reduzir consumo.` });
  }

  if (missao.co2 >= limites.co2.critico) {
    alertas.push({ tipo: "alert-critical", msg: `🚨 CRÍTICO: CO₂ em ${missao.co2}%. Ativar scrubbers!` });
  } else if (missao.co2 >= limites.co2.atencao) {
    alertas.push({ tipo: "alert-warning", msg: `⚠ CO₂ elevado: ${missao.co2}%. Aumentar ventilação.` });
  }

  if (missao.temperatura >= limites.temperatura.critico) {
    alertas.push({ tipo: "alert-critical", msg: `🚨 Temperatura: ${missao.temperatura}°C. Verificar resfriamento!` });
  } else if (missao.temperatura >= limites.temperatura.atencao) {
    alertas.push({ tipo: "alert-warning", msg: `⚠ Temperatura: ${missao.temperatura}°C. Acima do ideal.` });
  }

  if (alertas.length === 0) {
    painel.innerHTML = `<div class="alert-ok">✅ Todos os sistemas dentro dos parâmetros normais.</div>`;
    return;
  }

  painel.innerHTML = alertas
    .map(a => `<div class="${a.tipo}">${a.msg}</div>`)
    .join("");
}

let emergenciaAtiva = false;

function alternarEmergencia() {
  const statusEl = document.getElementById("status-missao");
  const btn      = document.getElementById("btn-emergencia");

  emergenciaAtiva = !emergenciaAtiva;

  if (emergenciaAtiva) {
    const confirmado = window.confirm(
      "🚨 PROTOCOLO DE EMERGÊNCIA\n\nDeseja notificar a base terrestre e iniciar os procedimentos de segurança?"
    );

    statusEl.textContent = "🔴 ALERTA DE EMERGÊNCIA";
    statusEl.classList.add("emergencia");
    btn.textContent = "✅ Encerrar Emergência";
    btn.classList.add("ativo");

    notificar(
      confirmado
        ? "📡 Base terrestre notificada! Aguardando resposta (~20 min)."
        : "⚠ Emergência ativa. Notificação cancelada pelo operador.",
      confirmado ? "critico" : "aviso"
    );
  } else {
    statusEl.textContent = "🟢 MISSÃO OPERACIONAL";
    statusEl.classList.remove("emergencia");
    btn.textContent = "🚨 Emergência";
    btn.classList.remove("ativo");
    notificar("✅ Protocolo encerrado. Operação normal.", "info");
  }
}

let contagemAtiva = false;

function iniciarCronometro(segundos) {
  if (contagemAtiva) {
    notificar("⏱ Comunicação já em andamento.", "aviso");
    return;
  }

  contagemAtiva = true;
  const btn     = document.getElementById("btn-comunicacao");
  const display = document.getElementById("display-cronometro");

  btn.disabled = true;
  notificar(`📡 Janela de comunicação iniciada: ${segundos}s`, "info");

  function tick(restante) {
    const min = String(Math.floor(restante / 60)).padStart(2, "0");
    const sec = String(restante % 60).padStart(2, "0");
    display.textContent = `${min}:${sec}`;

    if (restante <= 0) {
      contagemAtiva = false;
      btn.disabled  = false;
      notificar("✅ Comunicação encerrada. Dados sincronizados.", "info");
      return;
    }

    setTimeout(() => tick(restante - 1), 1000);
  }

  tick(segundos);
}

function validarFormulario(e) {
  e.preventDefault();

  const nome     = document.getElementById("nome-relatorio");
  const data     = document.getElementById("data-relatorio");
  const tipo     = document.getElementById("tipo-relatorio");
  const feedback = document.getElementById("feedback-form");

  let valido = true;

  if (!nome.value.trim()) {
    nome.classList.add("erro");
    nome.classList.remove("ok");
    valido = false;
  } else {
    nome.classList.remove("erro");
    nome.classList.add("ok");
  }

  if (!data.value) {
    data.classList.add("erro");
    data.classList.remove("ok");
    valido = false;
  } else {
    data.classList.remove("erro");
    data.classList.add("ok");
  }

  if (!valido) {
    feedback.textContent = "❌ Preencha todos os campos obrigatórios.";
    feedback.className   = "erro";
    return;
  }

  feedback.textContent = "⏳ Gerando relatório...";
  feedback.className   = "ok";

  setTimeout(() => {
    feedback.textContent = `✅ "${nome.value.trim()}" (${tipo.value}) gerado com sucesso em ${data.value}!`;
    notificar(`📄 Relatório "${nome.value.trim()}" gerado!`, "info");
  }, 1500);
}

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("btn-simulacao")
    .addEventListener("click", () => simulacaoAtiva ? pararSimulacao() : iniciarSimulacao());

  document.getElementById("btn-emergencia")
    .addEventListener("click", alternarEmergencia);

  document.getElementById("btn-comunicacao")
    .addEventListener("click", () => iniciarCronometro(60));

  document.getElementById("form-relatorio")
    .addEventListener("submit", validarFormulario);

  setTimeout(() => notificar("🚀 SpaceLife Control iniciado.", "info"), 400);

  setTimeout(() => {
    const iniciar = window.confirm("Deseja iniciar a simulação de telemetria automaticamente?");
    if (iniciar) iniciarSimulacao();
  }, 800);

});
