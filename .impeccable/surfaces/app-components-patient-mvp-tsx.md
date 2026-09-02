---
version: 1
slug: "app-components-patient-mvp-tsx"
primary_target: "app/components/patient-mvp.tsx"
related_targets: ["app/components/patient-mvp-data.ts","app/components/patient-mvp-sections.tsx","app/components/doctor-patient-checkin-review.tsx"]
---

# Superfície paciente — acompanhamento mobile-first

- Escopo: `app/components/patient-mvp.tsx`, `patient-mvp-sections.tsx`, `patient-mvp-data.ts` e a leitura correspondente no workspace médico.
- Modo: operar. A pessoa precisa saber o que fazer agora, concluir uma ação com pouca carga e entender o que acontece depois.
- Público: paciente em acompanhamento longitudinal, inclusive em momentos de baixa energia, pouca familiaridade digital ou desconforto com o registro.
- Ação central: Hoje apresenta uma única próxima ação contextual — ler uma orientação publicada, responder ao retorno, fazer o check-in ou continuar a preparação. O check-in volta a ficar disponível a cada três dias e também aceita o registro espontâneo de uma mudança.
- Arquitetura: quatro destinos estáveis — Hoje, Meu cuidado, Conversas e Evolução. Hoje prioriza uma única ação; módulos detalhados ficam no destino adequado.
- Direção visual: extensão do universo paciente já existente, com fundo claro e verde acolhedor; azul-marinho identifica decisões publicadas ou conexão com o médico. Bordas leves, pouco uso de sombra e hierarquia compacta.
- Distinção memorável: a fonte original e a organização opcional da IA permanecem em camadas separadas. A revisão final do paciente mostra as camadas em sequência; o recebimento médico as compara lado a lado no desktop. Sem autorização para IA, somente a fonte original segue pelo fluxo manual.
- Fluxo do check-in: escolha entre voz simulada e texto, relato original editável, organização assistida opcional, perguntas guiadas de energia, sono, experiência com o plano quando aplicável e sintomas, seguida de revisão explícita antes do envio.
- Estados de demonstração: Marina representa acompanhamento preenchido e percorre a prioridade orientação publicada → retorno → check-in; Lucas representa a preparação pendente em cinco etapas, com progresso e retomada. Ambos usam somente dados fictícios e estado da sessão.
- Recebimento médico: contempla carregamento, ausência explícita, seed visual identificado, envio real aguardando leitura e leitura humana registrada. Registrar leitura confirma apenas a abertura da fonte; não aprova conteúdo clínico nem publica orientação.
- Limites clínicos: IA não diagnostica, prescreve, define urgência, muda dose, substitui alimento ou publica orientação. Conteúdo clínico depende de revisão e aprovação médica.
- Integridade: a fonte original nunca é sobrescrita pelo resumo; áudio e fotos são placeholders simulados, sem captura ou upload real.
- Responsividade e acesso: prioridade para 390 x 844 e suporte mínimo a 320 px; alvos de toque com ao menos 44 px, foco visível, diálogo com teclado e mensagens de estado anunciadas.
- A validar com especialista: perguntas definitivas do check-in, técnica de cintura, protocolo de fotos, antecedência da receita e textos de segurança/urgência.
