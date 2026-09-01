---
version: 1
slug: "app-components-doctor-tsx"
primary_target: "app/components/doctor.tsx"
related_targets: ["app/medico/pacientes/[patientId]/page.tsx"]
---

# Histórico e evolução do paciente

- Escopo: rota individual do paciente na área profissional; modo Operate.
- Público e trabalho: médico responsável preparando, conduzindo ou acompanhando uma consulta; precisa compreender contexto, mudança, evidência e próxima ação humana rapidamente.
- Estrutura aprovada: cabeçalho persistente do paciente e quatro áreas primárias — Visão geral, Linha do tempo, Documentos e Evolução.
- Primeira dobra: identidade, objetivo, situação do plano, última/próxima consulta, itens para revisão, até quatro indicadores e uma ação primária contextual.
- Direção: histórico orientado à decisão; herda o azul-marinho, as superfícies claras, o arredondamento e a sobriedade da VIVANSE.
- Momento memorável: a faixa “O que revisar agora” conecta mudança, fonte e próxima ação sem transformar atenção em urgência.
- IA: rascunho com fontes e revisão item a item; nunca diagnóstico, prescrição, dose, urgência ou conduta.
- Governança: original preservado; origem, autoria, status e versão visíveis; aprovação separada de publicação/exportação; mock fictício e não substituto do prontuário oficial.
- Estados: vazio, carregando, erro localizado, incompleto, grande volume, sem permissão, IA indisponível, fonte conflitante e versão mais nova.
- Responsivo: desktop em duas colunas; tablet reorganiza a lateral; mobile em uma coluna, abas roláveis e nenhuma coorte antes do paciente.
- Decisões abertas: volumes reais e integração oficial permanecem fora deste mock.
