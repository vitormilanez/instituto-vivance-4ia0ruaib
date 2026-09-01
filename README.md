# Instituto Vivans

Protótipo de uma plataforma de cuidado contínuo para emagrecimento e envelhecimento saudável. O produto organiza a jornada antes, durante e depois da consulta, reduz a fragmentação das informações e usa IA para preparar contexto, estruturar acompanhamentos e destacar situações que merecem revisão do médico.

Versão publicada: https://lume-saude-prototipo.vitormilanez.chatgpt.site

## Experiências do produto

### Paciente — mobile-first

- visão diária com próximos passos e check-in;
- plano de cuidado em ações simples;
- diário alimentar com análise demonstrativa de refeição;
- evolução de peso, adesão, sono e passos;
- mensagens e consultas em um só lugar;
- pré-consulta guiada por texto, com ciência, assistência de IA opcional e revisão antes do envio;

### Médico — desktop-first

- agenda e preparo de consultas;
- caixa de atenção organizada por exceção;
- briefing longitudinal do paciente;
- consulta com notas estruturadas e sala de vídeo simulada;
- compilação do plano de cuidado;
- mensagens e relatórios revisáveis;
- recebimento do objetivo e dos relatos originais da pré-consulta, separados do rascunho assistido.
- workspace médico com edição, rejeição justificada, aprovação restrita ao preparo e histórico de versões.
- navegação por URLs reais para agenda, dossiê, pré-consulta e consulta, com contexto sintético de paciente e atendimento.

## Estado atual

O projeto é um protótipo interativo com dados fictícios. A pré-consulta, suas versões de revisão e os estados das ações demonstrativas permanecem na `sessionStorage` somente durante a sessão do navegador. O contexto clínico é isolado pela combinação de paciente e consulta, e as ações de interface são isoladas por perfil/paciente. Ainda não existem autenticação, autorização, persistência durável, uploads reais, integrações externas ou dados clínicos reais.

As integrações de Google Meet, relógios, prescrições e análise de refeições são demonstrações de produto. Nenhuma delas se conecta atualmente a serviços externos. Áudio e transcrição ficam fora do primeiro ciclo do MVP.

## IA e segurança clínica

- A IA organiza informações e sugere estruturas; não diagnostica nem decide conduta.
- O médico continua responsável por revisar e aprovar qualquer conteúdo clínico.
- Conteúdo gerado não deve ser enviado automaticamente ao paciente.
- A pré-consulta registra ciência, começa com campos vazios e permite revisar o relato antes do envio.
- A assistência de IA é opcional e sua recusa não impede o fluxo manual.
- Aprovar a revisão da pré-consulta valida somente o preparo médico; não publica plano nem sincroniza prontuário.
- Áudio e transcrição exigirão autorização específica antes de uma implementação futura.
- Relatos do paciente devem permanecer separados de inferências ou sínteses da IA.
- O aplicativo não substitui atendimento de urgência.
- Antes de usar dados reais, serão necessários controles de acesso, auditoria, consentimento, retenção de dados e adequação à LGPD.

## Como rodar localmente

Requisito: Node.js 22.13 ou superior.

~~~bash
npm ci
npm run dev
~~~

Acesse http://localhost:3000. A raiz encaminha para o painel médico.

Rotas principais do protótipo:

- `http://localhost:3000/medico`
- `http://localhost:3000/medico/pacientes/pac-demo-001`
- `http://localhost:3000/medico/pacientes/pac-demo-001/mensagens`
- `http://localhost:3000/medico/pacientes/pac-demo-001/pre-consulta/enc-demo-002`
- `http://localhost:3000/medico/pacientes/pac-demo-001/consultas/enc-demo-002`
- `http://localhost:3000/paciente/pac-demo-001`

Para validar a versão de produção:

~~~bash
npm run build
~~~

## Próximos marcos

1. Validar as jornadas e prioridades com o médico especialista.
2. Definir limites clínicos, consentimentos, retenção e auditoria.
3. Implementar autenticação e persistência com separação entre clínicas.
4. Integrar agenda, videoconferência, mensagens e documentos.
5. Avaliar integrações de Apple Health, Health Connect e fabricantes de relógios.
6. Criar uma camada de conhecimento médico com fontes rastreáveis e avaliações de qualidade.
7. Projetar métricas de adesão, alertas e relatórios configuráveis por clínica.
8. Conduzir um piloto pequeno com dados controlados antes de qualquer escala.

O plano de extração seletiva do protótipo Skip está documentado em [`PLANO_APROVEITAMENTO_SKIP.md`](./PLANO_APROVEITAMENTO_SKIP.md).
