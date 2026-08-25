# Instituto Vivance

Protótipo de uma plataforma de cuidado contínuo para emagrecimento e envelhecimento saudável. O produto organiza a jornada antes, durante e depois da consulta, reduz a fragmentação das informações e usa IA para preparar contexto, estruturar acompanhamentos e destacar situações que merecem revisão do médico.

Versão publicada: https://lume-saude-prototipo.vitormilanez.chatgpt.site

## Experiências do produto

### Paciente — mobile-first

- visão diária com próximos passos e check-in;
- plano de cuidado em ações simples;
- diário alimentar com análise demonstrativa de refeição;
- evolução de peso, adesão, sono e passos;
- mensagens e consultas em um só lugar;
- pré-consulta conversacional por voz, com consentimento, transcrição e revisão antes do envio.

### Médico — desktop-first

- agenda e preparo de consultas;
- caixa de atenção organizada por exceção;
- briefing longitudinal do paciente;
- consulta com notas estruturadas e sala de vídeo simulada;
- compilação do plano de cuidado;
- mensagens e relatórios revisáveis;
- recebimento do objetivo, relato e transcrição da pré-consulta.

## Estado atual

O projeto é um protótipo interativo com dados fictícios. As experiências funcionam localmente com estado em memória, mas ainda não existem autenticação, persistência, uploads reais, integrações externas ou dados clínicos reais.

As integrações de Google Meet, relógios, microfone, prescrições e análise de refeições são demonstrações de produto. Nenhuma delas se conecta atualmente a serviços externos.

## IA e segurança clínica

- A IA organiza informações e sugere estruturas; não diagnostica nem decide conduta.
- O médico continua responsável por revisar e aprovar qualquer conteúdo clínico.
- Conteúdo gerado não deve ser enviado automaticamente ao paciente.
- A pré-consulta exige consentimento e permite revisão da transcrição e do resumo.
- O desenho proposto descarta o áudio após a transcrição por padrão.
- Relatos do paciente devem permanecer separados de inferências ou sínteses da IA.
- O aplicativo não substitui atendimento de urgência.
- Antes de usar dados reais, serão necessários controles de acesso, auditoria, consentimento, retenção de dados e adequação à LGPD.

## Como rodar localmente

Requisito: Node.js 22.13 ou superior.

~~~bash
npm ci
npm run dev
~~~

Acesse http://localhost:3000.

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
