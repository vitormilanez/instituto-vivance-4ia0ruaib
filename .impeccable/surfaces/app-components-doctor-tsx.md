---
version: 1
slug: "app-components-doctor-tsx"
primary_target: "app/components/doctor.tsx"
related_targets:
  - "app/medico/pacientes/[patientId]/page.tsx"
  - "app/components/doctor-patient-longitudinal.tsx"
  - "app/components/doctor-care-cycle-summary.tsx"
  - "app/components/doctor-ai-preparation-workspace.tsx"
  - "app/components/longitudinal-dossier.tsx"
  - "app/components/shared.tsx"
  - "app/globals.css"
---

# Histórico e evolução do paciente

- Escopo: rota individual do paciente na área profissional; modo Operate.
- THESIS: “Clareza para cuidar” — contexto, evidência e próxima ação humana devem ser compreendidos antes de qualquer aprofundamento.
- Público e trabalho: médico responsável preparando, conduzindo ou acompanhando uma consulta; precisa compreender contexto, mudança, evidência e próxima ação humana rapidamente.
- STORY: identificar paciente e contexto; ver o que merece atenção, as métricas e a próxima ação; aprofundar sob demanda sem perder fonte, autoria, versão ou estado.
- Estrutura aprovada: cabeçalho persistente do paciente e quatro áreas primárias — Visão geral, Linha do tempo, Documentos e Evolução.
- Primeira dobra: no computador, inclui identidade e contexto, ação principal, faixa de atenção completa e quatro métricas; no celular, inclui paciente, ação principal e faixa de atenção completa, com as métricas imediatamente depois.
- Momento memorável: a faixa “O que merece atenção agora” conecta mudança observada, cobertura das fontes e conferência humana sem transformar atenção em urgência.
- Aprofundamento: situação do acompanhamento, próximas ações, ciclo de cuidado e preparação assistida ficam progressivamente reveláveis; linha do tempo, documentos e evolução mantêm filtros e alternativas textuais.
- IA: prepara pauta com fatos, lacunas, perguntas e fontes; o médico inclui ou descarta cada item e salva uma nova versão. Nunca diagnostica, prescreve, altera dose, define urgência ou decide conduta; indisponibilidade ou recusa preserva o fluxo manual.
- Governança: original preservado; origem, autoria, status e versão visíveis; aprovação separada de publicação/exportação; mock fictício e não substituto do prontuário oficial.
- Estados: vazio, carregando, erro localizado, incompleto, grande volume, sem permissão, IA indisponível, fonte conflitante e versão mais nova.
- Responsivo: desktop em duas colunas; tablet reorganiza a lateral; mobile em uma coluna, menu global compacto na barra superior, abas roláveis e nenhuma coorte antes do paciente.
- Acessibilidade: alvos essenciais têm pelo menos 44 px; abas e seletores expõem estado; gráficos têm descrição e tabela equivalente; cor nunca comunica estado sozinha.
- OWN-WORLD / FORM: extensão do mundo VIVANSE com seed key `existing-world:vivanse-dashboard-final3`; azul-marinho, superfícies clínicas sólidas, estados contidos, vidro somente em barras e menus, raios de 12–16 px e degradê restrito à ação principal.
- QUALITY BAR: produto de saúde seguro e humano, nunca aplicativo genérico de IA. Evidências finais: `.impeccable/review/vivanse-patient-desktop.png` e `.impeccable/review/vivanse-patient-mobile.png`; disposição da revisão final: `ship`.
- Decisões abertas: volumes reais e integração oficial permanecem fora deste mock.
