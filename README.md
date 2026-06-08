Sistema de Controle de Recursos para Missão Espacial
Como Executar
Baixe os arquivos do projeto.
Abra o arquivo index.html em um navegador.

Ou, no VS Code:

Instale a extensão Live Server.
Clique em Open with Live Server no arquivo index.html.r

Descrição

Aplicação web que auxilia operadores de missão a verificar se os recursos disponíveis são suficientes para manter a tripulação durante uma viagem espacial.

Usuário

Operador de Controle de Missão, responsável por monitorar suprimentos e garantir a segurança da tripulação.

Tarefa Crítica

Verificar rapidamente se os recursos disponíveis (água, comida, oxigênio, energia e combustível) serão suficientes até o fim da missão.

Direção Visual

A interface foi inspirada em centros de controle espaciais, utilizando:

Fundo escuro e tons de azul.
Painéis organizados em formato de dashboard.
Destaque visual para alertas e informações importantes.
Informações da missão.
Formulário para inserção de dados.
Área de resultados.

⚙️ Recursos de HTML Utilizados

Recurso | Aplicação|
<header>	Exibe o cabeçalho com identificação e status da missão
<nav>	Permite navegação entre as seções da página
<main>	Agrupa todo o conteúdo principal do sistema
<section>	Organiza as áreas de Dashboard, Telemetria, Suprimentos e Relatórios
<article>	Representa cada card independente de monitoramento
<footer>	Exibe informações finais do sistema
<h1> e <h2>	Estruturam títulos e subtítulos da interface
<table>	Exibe os dados dos suprimentos em formato tabular
<button>	Aciona funções da simulação e comunicação
<form>	Permite gerar relatórios da missão
<input>	Recebe informações do usuário
<select>	Permite escolher o tipo de relatório
id	Identifica elementos para navegação e JavaScript
aria-*	Melhora a acessibilidade da aplicação
<link>	Importa folhas de estilo e fontes externas
<script> Carrega o arquivo JavaScript
<meta> Define configurações de codificação e responsividade

🎨 Recursos de CSS Utilizados

Recurso | Aplicação|
:root	Centraliza variáveis de cores, fontes e espaçamentos
var()	Reutiliza valores definidos nas variáveis CSS
display: flex	Alinha elementos em linhas ou colunas flexíveis
display: grid	Organiza os cards em grade responsiva
flex-wrap	Permite quebra automática dos elementos
position: sticky	Mantém o menu visível durante a rolagem
position: fixed	Fixa notificações em uma posição da tela
@media	Adapta o layout para tablets e celulares
linear-gradient()	Cria fundos com efeito degradê
rgba()	Aplica transparência em elementos visuais
border-left	Destaca alertas por meio de cores laterais
box-shadow	Adiciona profundidade aos cards
font-family	Define as fontes utilizadas na interface
transition	Suaviza alterações visuais
:hover	Cria feedback ao passar o mouse
:focus	Destaca elementos selecionados pelo teclado
:disabled	Indica visualmente elementos desabilitados
outline	Exibe foco visível para acessibilidade
@keyframes	Cria animações para notificações e alertas


Manual de interatividade:

Sistema de monitoramento de suporte à vida para missões espaciais, desenvolvido como projeto de Front-End com interatividade em JavaScript.


Manual de Interatividade

▶ Botão "Iniciar Simulação"
 Painel de Controle, logo abaixo do texto de introdução.

O que acontece:
Uma notificação azul aparece informando que a conexão com o satélite foi iniciada
Após 2 segundos (simulando o delay de comunicação espacial), os dados começam a chegar
A cada 3 segundos, todos os valores do dashboard se atualizam automaticamente: Oxigênio, Água, Alimentos, Autonomia, Temperatura, Pressão, Umidade e CO₂
Os números mudam de cor conforme o nível: 🟢 verde (normal), 🟡 amarelo (atenção), 🔴 vermelho (crítico)
A tabela de Suprimentos e o painel de Alertas também são atualizados
Clicar novamente para a simulação


🚨 Botão "Emergência"
Onde: Painel de Controle, ao lado do botão de simulação.

O que acontece:
-bre uma janela confirm() do navegador perguntando se deseja notificar a base terrestre
O cabeçalho muda de "🟢 MISSÃO OPERACIONAL" para "🔴 ALERTA DE EMERGÊNCIA" com fundo vermelho
Uma notificação aparece confirmando ou cancelando o alerta
-licar novamente restaura o estado normal



📡 Botão "Comunicação (60s)
Onde: Painel de Controle, ao lado do botão de emergência.

O que acontece:
Um cronômetro regressivo de 60 segundos é exibido no canto direito do painel
O botão fica desabilitado durante a contagem
Ao zerar, uma notificação informa que os dados foram sincronizados com a Terra

📄 Formulário "Gerar Relatório
Onde: "Seção "Relatórios", no final da página.

O que acontece:
- Clicar em "Gerar Relatório" sem preencher os campos destaca os campos vazios em vermelho e exibe uma mensagem de erro
- Preenchendo corretamente, exibe "⏳ Gerando relatório..." e após 1,5 segundo confirma a geração com sucesso



⚙️ Recursos de JavaScript Utilizados

Recurso | Aplicação |
`setInterval` Atualiza a telemetria a cada 3 segundos
`setTimeout` Delay de comunicação, cronômetro, processamento do formulário
`clearInterval` Para a simulação quando o botão é clicado novamente
`window.confirm` Confirmação do protocolo de emergência
`addEventListener` Cliques nos botões e envio do formulário
`getElementById` Seleciona elementos para leitura e atualização
`classList.add/remove` Altera cores e estados visuais via classes CSS
`textContent` Atualiza valores numéricos no dashboard
`if / else` Classifica nível de alerta de cada recurso
`forEach` Percorre múltiplos elementos da interface