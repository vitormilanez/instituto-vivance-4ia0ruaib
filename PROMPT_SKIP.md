# Prompt mestre para o Skip - Instituto Vivans

Crie um novo projeto funcional e navegavel para o Instituto Vivans a partir da versao atual da branch `main` deste repositorio:

`https://github.com/vitormilanez/instituto-vivance-4ia0ruaib`

Antes de alterar qualquer coisa, leia `README.md` e `GUIA_DO_PROJETO.md`. Considere a `main` desse repositorio a unica fonte de verdade. Nao recupere codigo, decisoes ou componentes de versoes antigas geradas pelo Skip.

## Regra de nomenclatura

- Use **Instituto Vivans** em toda comunicacao visivel da nova interface.
- O identificador tecnico do repositorio pode continuar como `instituto-vivance`.
- Nao use a marca antiga **Lume Saude**.
- Nao misture `Vivance` e `Vivans` na mesma experiencia visivel.

## Objetivo do produto

Construa um prototipo web interativo de cuidado longitudinal para emagrecimento e saude do envelhecimento, acompanhando o paciente **antes, durante e depois da consulta**.

O produto deve reduzir a fragmentacao entre mensagens, agenda, relatos, fotos, documentos, plano de cuidado e evolucao. A experiencia deve demonstrar como a tecnologia organiza o contexto para o medico e torna o acompanhamento mais simples para o paciente.

Neste momento, priorize exclusivamente a experiencia do produto. Nao tome decisoes prematuras de escala, arquitetura de producao ou fornecedores definitivos.

## Escopo desta entrega

Entregue um prototipo convincente para validacao com medico e parceiros comerciais, com:

- experiencia do paciente mobile-first;
- experiencia do medico desktop-first;
- navegacao completa entre as duas areas;
- dados exclusivamente ficticios e coerentes entre todas as telas;
- interacoes e estados simulados que permitam percorrer as jornadas de ponta a ponta;
- interface responsiva, acessivel e pronta para demonstracao;
- nenhum botao principal sem comportamento;
- nenhum link que leve a uma tela vazia ou quebrada.

Nao implemente nesta fase:

- autenticacao real;
- banco de dados ou persistencia real;
- dados reais de pacientes;
- separacao real entre clinicas;
- upload real de fotos ou documentos;
- integracao real com Google Meet, WhatsApp, SMS, prontuario, farmacia ou receita digital;
- integracao real com Apple HealthKit, Health Connect ou relogios;
- pagamento;
- diagnostico, prescricao ou decisao clinica por IA;
- precos, contratos, equity ou termos comerciais dentro do produto.

Se uma integracao aparecer na interface, identifique-a claramente como **demonstracao simulada**. Nao afirme que ela esta conectada ou disponivel em producao.

## Direcao de experiencia e design

Crie uma experiencia de saude humana, serena, premium e confiavel. Evite a aparencia de um painel administrativo generico.

- Preserve os ativos, a paleta e a identidade visual existentes na `main` quando estiverem disponiveis.
- Use tokens de design centralizados para cores, tipografia, espacamento, raios, sombras e estados.
- Use fundos claros e quentes, verdes naturais, tons profundos para contraste e cores de alerta com moderacao.
- Nao use roxo como cor dominante e nao transforme o produto em dark mode.
- Use tipografia expressiva e altamente legivel, com hierarquia clara.
- Prefira cards editoriais, linhas do tempo, resumos e paineis de contexto a tabelas densas.
- Use animacoes discretas apenas para transicoes, confirmacoes e revelacao de contexto.
- Garanta contraste, foco visivel, navegacao por teclado, alvos de toque confortaveis e textos compreensiveis.
- No celular, use navegacao inferior para o paciente.
- No desktop, use navegacao lateral para o medico.
- Inclua um alternador de perfil apenas para fins de demonstracao, identificado como recurso do prototipo.

## Dados ficticios de referencia

Mantenha um unico conjunto tipado de dados mockados para evitar contradicoes entre telas.

- Medico principal: Dr. Guilherme Martins.
- Paciente principal da demonstracao: Marina Costa.
- Outros pacientes: Ana Ribeiro, Paulo Mendes, Rafael Lima e Lucia Barbosa.
- Cenario medico: 22 pacientes ativos, 17 regulares e 5 com check-in atrasado.
- Agenda demonstrativa: 5 consultas com horarios, status e proximas acoes coerentes.
- Todos os nomes, indicadores, documentos e mensagens devem exibir uma indicacao discreta de que sao ficticios.

## Area do paciente - mobile-first

Implemente as seguintes areas, com navegacao real entre elas:

### Hoje

- saudacao e resumo do dia;
- proxima consulta;
- check-in diario;
- proximas acoes do plano;
- lembretes e mensagens recentes;
- estado claro de conclusao depois de cada acao.

### Plano

- plano de cuidado dividido em acoes simples;
- frequencia, progresso e orientacoes aprovadas pelo medico;
- possibilidade de marcar uma acao como concluida;
- separacao visivel entre orientacao medica e sugestao ainda nao aprovada.

### Diario

- registro de refeicao com foto simulada;
- analise visual demonstrativa assistida por IA;
- aviso explicito de que uma foto nao determina com precisao ingredientes, quantidades ou valor nutricional;
- tres avaliacoes de 1 a 5 para contextualizar a refeicao;
- revisao das respostas antes do envio ao medico;
- confirmacao de envio simulado.

### Evolucao

- peso, adesao, sono e passos em periodos selecionaveis;
- indicador visual de "Quanto falta para meu objetivo?";
- tendencia e contexto sem prometer resultado clinico;
- estados vazios coerentes para metricas ainda sem informacao.

### Mensagens

- conversa simulada com a equipe medica;
- distincao visual entre mensagens, comunicados e rascunhos da IA;
- nenhuma resposta clinica automatica enviada em nome do medico.

### Consultas e pre-consulta

Crie um fluxo completo:

1. paciente visualiza a proxima consulta;
2. aceita um consentimento claro para a pre-consulta;
3. escolhe responder por texto ou voz simulada;
4. percorre perguntas conversacionais;
5. visualiza a transcricao;
6. pode corrigir o proprio relato;
7. revisa objetivo, respostas e resumo;
8. envia o conteudo ao medico;
9. recebe confirmacao e pode consultar o historico.

Explique que o audio seria descartado apos a transcricao por padrao. Nao capture audio real nesta fase.

## Area do medico - desktop-first

Implemente as seguintes areas, com rotas estaveis e navegacao real:

### Visao geral

- pacientes ativos, regulares e com check-in atrasado;
- consultas do dia;
- caixa de atencao organizada por excecao;
- relatorios aguardando revisao;
- agenda em linha do tempo;
- cards clicaveis que abrem a lista ou o contexto correspondente;
- acao simulada de "dar um cutucao" com confirmacao antes de concluir.

### Agenda

- visoes do dia e da semana;
- horarios, pacientes, status e modalidade;
- acesso direto a pre-consulta e ao ambiente de consulta;
- filtros funcionais e estados vazios.

### Pacientes

- busca e filtros funcionais;
- lista com proxima consulta, adesao e pendencias;
- perfil longitudinal de cada paciente;
- objetivo nas palavras do paciente;
- plano atual, evolucao, mensagens, documentos e linha do tempo;
- acesso ao dossie assistido por IA, sempre como rascunho revisavel.

### Pre-consulta

- relato original do paciente separado da sintese da IA;
- transcricao integral disponivel;
- objetivo principal em destaque;
- mudancas desde a ultima consulta;
- perguntas sugeridas para o medico considerar;
- aprovacao, edicao ou descarte do resumo antes de qualquer uso.

### Ambiente de consulta

- sala de video claramente simulada;
- notas livres e notas estruturadas;
- copiloto que apenas organiza o que foi registrado;
- compilacao do plano de cuidado;
- relatorio e plano salvos primeiro como rascunho;
- aprovacao medica obrigatoria antes de qualquer envio ao paciente.

### Mensagens e relatorios

- caixa de entrada organizada por paciente e prioridade operacional;
- relatorios semanais, quinzenais e mensais simulados;
- filtros por paciente, periodo e status;
- visualizacao e exportacao simulada de PDF;
- estados `rascunho`, `em revisao`, `aprovado` e `compartilhado`;
- historico simples de quem aprovou e quando, usando dados ficticios.

## Papel e limites da inteligencia artificial

A IA e um copiloto do cuidado e pode:

- organizar informacoes;
- resumir relatos e conversas;
- estruturar notas;
- preparar rascunhos;
- correlacionar indicadores para revisao;
- destacar informacoes que merecem leitura do medico;
- sugerir perguntas ou estruturas de acompanhamento.

A IA nao pode:

- diagnosticar;
- prescrever;
- alterar tratamento ou dosagem;
- interpretar autonomamente uma urgencia;
- decidir conduta clinica;
- enviar conteudo clinico ao paciente sem aprovacao;
- apresentar uma inferencia como se fosse um fato relatado pelo paciente.

Em todo conteudo assistido por IA:

- mostre o rotulo `Rascunho gerado com IA - requer validacao medica`;
- mantenha o relato original acessivel;
- permita editar, aprovar ou descartar;
- registre visualmente o status de revisao;
- nunca aprove ou envie automaticamente.

Inclua um aviso geral de que o aplicativo nao substitui atendimento de urgencia. Esse aviso deve ser informativo e nao pode simular triagem clinica personalizada.

## Evidencias medicas futuras

Represente a futura camada de evidencias apenas como mock. Quando houver uma sugestao demonstrativa para o medico, mostre:

- fonte;
- titulo;
- data;
- tipo de evidencia;
- nivel de confianca ou limitacao;
- link demonstrativo;
- aviso de que a decisao permanece com o medico.

Use PubMed, Cochrane e Conitec como referencias conceituais, sem afirmar que existe integracao real ou fazer recomendacoes clinicas automaticas.

## Privacidade e LGPD

- Use somente dados ficticios.
- Solicite consentimento no contexto da pre-consulta.
- Separe relato do paciente, sintese da IA e decisao do medico.
- Demonstre conceitos de minimizacao, revogacao e exclusao sem prometer implementacao real.
- Nao use dados para treinamento.
- Nao inclua segredos, chaves, tokens ou informacoes pessoais no codigo.
- Explique no README que autenticacao, controle de acesso, auditoria, retencao, exclusao, fornecedores e resposta a incidentes ainda dependem de projeto especifico antes de qualquer piloto real.

## Robustez obrigatoria

O projeto anterior apresentou erros de runtime causados por colecoes indefinidas. Previna explicitamente essa classe de problema.

- Centralize os dados mockados e seus tipos.
- Inicialize colecoes como arrays vazios quando nao houver dados.
- Nao execute `.map`, `.filter`, `.length` ou operacoes equivalentes sobre valores possivelmente indefinidos.
- Crie estados de carregamento, vazio e erro onde forem relevantes.
- Nao dependa de uma propriedade com nome diferente daquela exposta pelo contexto.
- Garanta que atualizacoes de estado preservem o formato esperado em todas as telas.
- Nao silencie erros com dados falsos incoerentes; corrija a origem do estado.

## Rotas minimas para validar

Adapte os caminhos a estrutura do projeto, mas mantenha URLs diretas e estaveis equivalentes a:

- `/medico`
- `/medico/agenda`
- `/medico/pacientes`
- `/medico/pacientes/:id`
- `/medico/mensagens`
- `/medico/relatorios`
- `/medico/consulta/:id`
- `/paciente`
- `/paciente/plano`
- `/paciente/diario`
- `/paciente/evolucao`
- `/paciente/mensagens`
- `/paciente/consultas`
- `/paciente/pre-consulta`

## Processo de implementacao

1. Importe e inspecione a `main` indicada como fonte de verdade.
2. Apresente um plano curto baseado nas jornadas, sem redesenhar o escopo.
3. Implemente a experiencia completa usando componentes reutilizaveis e dados mockados tipados.
4. Preserve o que ja funciona e altere apenas o necessario para atender este prompt.
5. Rode build, verificacao de TypeScript, lint e o Bug Scanner disponivel.
6. Corrija todos os erros encontrados; nao pare depois do primeiro erro.
7. Percorra manualmente todas as rotas e jornadas listadas, tanto como medico quanto como paciente.
8. Verifique desktop e celular, incluindo modais, tabs, filtros, botoes, estados vazios e URLs diretas.
9. Publique a previa somente depois que a verificacao estiver limpa.
10. Ao finalizar, entregue um relatorio objetivo do que foi construido, do que continua mockado e das evidencias de QA.

## Criterios de aceite

Considere a entrega concluida somente quando:

- todas as rotas minimas abrirem diretamente sem erro;
- nao houver erro no console ou no Bug Scanner;
- build, TypeScript e lint terminarem sem erro;
- os fluxos de check-in, diario, pre-consulta, consulta e aprovacao de relatorio puderem ser concluidos;
- todos os cards, botoes, tabs, filtros, modais e links principais responderem;
- medico e paciente enxergarem dados coerentes do mesmo cenario;
- a interface funcionar em desktop e celular;
- todo dado clinico for claramente ficticio;
- toda saida de IA permanecer identificada como rascunho sujeito a validacao medica;
- nenhuma integracao simulada for apresentada como real;
- o README explicar como executar o projeto e delimitar claramente prototipo, mock, privacidade e pendencias de producao;
- o relatorio final separar `implementado`, `simulado`, `validado` e `pendente`.

Nao declare o projeto pronto apenas porque o codigo foi gerado, o build terminou ou a previa foi publicada. A conclusao exige a navegacao manual das jornadas acima e a ausencia de regressao nos dois perfis.
