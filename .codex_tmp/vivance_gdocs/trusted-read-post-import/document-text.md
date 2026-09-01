# Instituto Vivance — Contexto do Produto, Escopo do MVP e Casos de Uso

- Document ID: 19BlSHfSUZibHrTQKnuDA5sen-lspiXMO1Gm0RrGmZ7w
- Revision ID: ANLCKQlV1KlVtDju6AM7wCGRg9itkQiFT985wJmp_a9d_lqnMOnHb1d0P1qs1XwYRA4Pt1Zraa3so9vD6L9asdI5rL-80AScVDxUXBKwCUY
- Selected tab: t.0
- Protected controls: 0
- Opaque controls: 0
- Authoritative dropdowns: 0

Protected-control annotations are preservation instructions. Do not insert their displayed placeholder text to recreate a native control.

## Tab 1 (t.0)

[P00001 | 1:71 | NORMAL_TEXT]
Instituto Vivance — Contexto do Produto, Escopo do MVP e Casos de Uso

[P00002 | 71:144 | NORMAL_TEXT]
Status: documento-base para discovery, produto, design e desenvolvimento

[P00003 | 144:145 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00004 | 145:183 | NORMAL_TEXT]
Atualizado em: 1º de setembro de 2026

[P00005 | 183:184 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00006 | 184:246 | NORMAL_TEXT]
Escopo: produto clínico e operacional, sem conteúdo comercial

[P00007 | 246:247 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00008 | 247:280 | NORMAL_TEXT]
Idioma do MVP recomendado: PT-BR

[P00009 | 280:317 | HEADING_1]
0. Como usar este documento no Codex

[P00010 | 317:456 | NORMAL_TEXT]
Este documento consolida o conhecimento disponível sobre o Instituto Vivance e propõe um recorte realista para o primeiro MVP operacional.

[P00011 | 456:498 | NORMAL_TEXT]
Ao trabalhar neste projeto, o Codex deve:

[P00012 | 498:583 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Tratar os limites clínicos, de privacidade e segurança como requisitos obrigatórios.

[P00013 | 583:700 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Diferenciar fatos confirmados, informações fornecidas pelo médico, hipóteses de produto, mocks e decisões pendentes.

[P00014 | 700:795 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Inspecionar o código e os testes antes de assumir que uma funcionalidade ou integração existe.

[P00015 | 795:901 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Manter a IA como copiloto e todo conteúdo clínico gerado como rascunho até aprovação explícita do médico.

[P00016 | 901:988 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Priorizar o menor fluxo ponta a ponta que entregue valor real ao médico e ao paciente.

[P00017 | 988:1106 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Evitar transformar todas as telas do protótipo ou todos os usos pessoais de IA do Dr. Guilherme em requisitos do MVP.

[P00018 | 1106:1195 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Não incluir funcionalidades comerciais, marketing, aquisição, pagamentos ou monetização.

[P00019 | 1195:1344 | NORMAL_TEXT | LIST id=kix.list.10 level=0]
Não inventar regras clínicas, faixas, alertas, diagnósticos, protocolos ou campos de prontuário. Esses itens dependem de validação do Dr. Guilherme.

[P00020 | 1344:1367 | HEADING_2]
Etiquetas de confiança

[P00021 | 1367:1463 | NORMAL_TEXT]
Sempre que uma nova informação for adicionada ao projeto, classificá-la quando necessário como:

[P00022 | 1463:1542 | NORMAL_TEXT | LIST id=kix.list.11 level=0]
VALIDADO: decisão confirmada pelo responsável de produto e pelo Dr. Guilherme.

[P00023 | 1542:1619 | NORMAL_TEXT | LIST id=kix.list.11 level=0]
OBSERVADO NO CÓDIGO: comportamento comprovado no repositório ou em execução.

[P00024 | 1619:1739 | NORMAL_TEXT | LIST id=kix.list.11 level=0]
INFORMADO PELO MÉDICO — A CONFIRMAR: informação presente nos MDs fornecidos pelo Dr. Guilherme, ainda sem demonstração.

[P00025 | 1739:1798 | NORMAL_TEXT | LIST id=kix.list.11 level=0]
HIPÓTESE DE PRODUTO: recomendação que precisa ser testada.

[P00026 | 1798:1874 | NORMAL_TEXT | LIST id=kix.list.11 level=0]
MOCK/PROTÓTIPO: experiência visual ou dado demonstrativo sem operação real.

[P00027 | 1874:1946 | NORMAL_TEXT | LIST id=kix.list.11 level=0]
DECISÃO PENDENTE: ponto que bloqueia definição segura do comportamento.

[P00028 | 1946:1988 | NORMAL_TEXT | LIST id=kix.list.11 level=0]
FORA DO MVP: item conscientemente adiado.

[P00029 | 1988:2033 | HEADING_1]
1. Fontes utilizadas e hierarquia de verdade

[P00030 | 2033:2053 | HEADING_2]
Fontes consolidadas

[P00031 | 2053:2129 | NORMAL_TEXT | LIST id=kix.list.12 level=0]
Memória do Projeto — Instituto Vivance, atualizada em 31 de agosto de 2026.

[P00032 | 2129:2221 | NORMAL_TEXT | LIST id=kix.list.12 level=0]
Como Claude Auxilia Dr. Guilherme Martins, fornecido pelo próprio médico em agosto de 2026.

[P00033 | 2221:2302 | NORMAL_TEXT | LIST id=kix.list.12 level=0]
Como o ChatGPT me ajuda no meu fluxo de trabalho, fornecido pelo próprio médico.

[P00034 | 2302:2375 | NORMAL_TEXT | LIST id=kix.list.12 level=0]
Protótipo, repositório e estado técnico descritos na memória do projeto.

[P00035 | 2375:2629 | NORMAL_TEXT]
Os dois documentos fornecidos pelo Dr. Guilherme são fontes primárias de discovery sobre sua rotina, necessidades, ferramentas e modo desejado de trabalhar. Eles não comprovam, isoladamente, que integrações, scripts ou automações já estejam em produção.

[P00036 | 2629:2652 | HEADING_2]
Hierarquia recomendada

[P00037 | 2652:2695 | NORMAL_TEXT]
Em caso de divergência, seguir esta ordem:

[P00038 | 2695:2762 | NORMAL_TEXT | LIST id=kix.list.13 level=0]
Requisitos legais, clínicos, de segurança e privacidade aprovados.

[P00039 | 2762:2854 | NORMAL_TEXT | LIST id=kix.list.13 level=0]
Decisões registradas e datadas, validadas pelo Dr. Guilherme e pelo responsável de produto.

[P00040 | 2854:2922 | NORMAL_TEXT | LIST id=kix.list.13 level=0]
Fluxos e requisitos clínicos demonstrados e validados com o médico.

[P00041 | 2922:3027 | NORMAL_TEXT | LIST id=kix.list.13 level=0]
Código executável, testes e documentação oficial das integrações, como evidência do estado implementado.

[P00042 | 3027:3062 | NORMAL_TEXT | LIST id=kix.list.13 level=0]
Documentos fornecidos pelo médico.

[P00043 | 3062:3099 | NORMAL_TEXT | LIST id=kix.list.13 level=0]
Protótipos, mocks e dados fictícios.

[P00044 | 3099:3141 | NORMAL_TEXT | LIST id=kix.list.13 level=0]
Recomendações ou sínteses geradas por IA.

[P00045 | 3141:3265 | NORMAL_TEXT]
O código comprova o que existe, mas não substitui nem pode contrariar um requisito clínico, legal ou de segurança validado.

[P00046 | 3265:3289 | HEADING_1]
2. Exclusões explícitas

[P00047 | 3289:3319 | NORMAL_TEXT]
Este documento não considera:

[P00048 | 3319:3357 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
Valores, pagamentos ou parcelamentos.

[P00049 | 3357:3403 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
Contratos, equity, comissões ou participação.

[P00050 | 3403:3452 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
Precificação, faturamento ou modelos de receita.

[P00051 | 3452:3502 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
CAC, LTV, funil de vendas ou análise de anúncios.

[P00052 | 3502:3536 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
Captação e qualificação de leads.

[P00053 | 3536:3584 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
Marketing, criação de conteúdo ou infoprodutos.

[P00054 | 3584:3622 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
Comercialização para outras clínicas.

[P00055 | 3622:3677 | NORMAL_TEXT | LIST id=kix.list.14 level=0]
Promessas de economia, retenção ou retorno financeiro.

[P00056 | 3677:3819 | NORMAL_TEXT]
As estimativas de tempo presentes nos documentos do médico podem ser usadas apenas como hipóteses a medir, nunca como resultados comprovados.

[P00057 | 3819:3839 | HEADING_1]
3. Visão do produto

[P00058 | 3839:3984 | NORMAL_TEXT]
O Instituto Vivance é uma plataforma de cuidado longitudinal, inicialmente voltada ao acompanhamento de emagrecimento e saúde do envelhecimento.

[P00059 | 3984:4193 | NORMAL_TEXT]
O produto deve acompanhar o paciente antes, durante e depois da consulta, centralizando informações que hoje ficam fragmentadas entre mensagens, exames, notas, fotos, documentos, agenda e diferentes sistemas.

[P00060 | 4193:4210 | HEADING_2]
Problema central

[P00061 | 4210:4435 | NORMAL_TEXT]
O médico recebe informações em formatos desestruturados, precisa reconstruir o contexto do paciente, documentar a consulta, transformar decisões em orientações compreensíveis e acompanhar a execução do plano entre consultas.

[P00062 | 4435:4610 | NORMAL_TEXT]
O paciente, por sua vez, precisa entender o que foi combinado, registrar sua evolução com pouco esforço e saber quais informações serão vistas pelo médico na próxima revisão.

[P00063 | 4610:4642 | HEADING_2]
Proposta de valor não comercial

[P00064 | 4642:4735 | NORMAL_TEXT]
O Vivance deve reduzir a distância entre a informação bruta e uma ação aprovada pelo médico:

[P00065 | 4735:4737 | NORMAL_TEXT]
[INLINE_OBJECT i.0]

[P00066 | 4737:4778 | NORMAL_TEXT]
Figura 1 — Ciclo longitudinal de cuidado

[P00067 | 4778:4935 | NORMAL_TEXT]
O valor não está em uma resposta isolada da IA, mas em preservar contexto, organizar o trabalho, apoiar a decisão humana e fechar o ciclo de acompanhamento.

[P00068 | 4935:4975 | HEADING_1]
4. Usuários e estratégia de experiência

[P00069 | 4975:4993 | HEADING_2]
Usuários iniciais

[P00070 | 4993:5002 | HEADING_3]
Paciente

[P00071 | 5002:5032 | NORMAL_TEXT | LIST id=kix.list.15 level=0]
Experiência web mobile-first.

[P00072 | 5032:5104 | NORMAL_TEXT | LIST id=kix.list.15 level=0]
Adulto em acompanhamento de emagrecimento e/ou saúde do envelhecimento.

[P00073 | 5104:5189 | NORMAL_TEXT | LIST id=kix.list.15 level=0]
Registra informações, responde à pré-consulta, consulta o plano e realiza check-ins.

[P00074 | 5189:5260 | NORMAL_TEXT | LIST id=kix.list.15 level=0]
Acessa somente seus próprios dados e conteúdos publicados pelo médico.

[P00075 | 5260:5267 | HEADING_3]
Médico

[P00076 | 5267:5298 | NORMAL_TEXT | LIST id=kix.list.16 level=0]
Experiência web desktop-first.

[P00077 | 5298:5342 | NORMAL_TEXT | LIST id=kix.list.16 level=0]
Operação inicial centrada no Dr. Guilherme.

[P00078 | 5342:5425 | NORMAL_TEXT | LIST id=kix.list.16 level=0]
Revisa contexto, atende, registra decisões, aprova rascunhos e acompanha exceções.

[P00079 | 5425:5519 | NORMAL_TEXT | LIST id=kix.list.16 level=0]
É o responsável final por diagnóstico, conduta, prescrição, comunicação clínica e assinatura.

[P00080 | 5519:5541 | HEADING_3]
Administrador técnico

[P00081 | 5541:5590 | NORMAL_TEXT | LIST id=kix.list.17 level=0]
Papel restrito à configuração e suporte técnico.

[P00082 | 5590:5634 | NORMAL_TEXT | LIST id=kix.list.17 level=0]
Não deve receber acesso clínico por padrão.

[P00083 | 5634:5738 | NORMAL_TEXT | LIST id=kix.list.17 level=0]
Qualquer acesso excepcional a dados sensíveis precisa ser justificado, limitado, temporário e auditado.

[P00084 | 5738:5768 | HEADING_2]
Usuários futuros, fora do MVP

[P00085 | 5768:5784 | NORMAL_TEXT | LIST id=kix.list.18 level=0]
Outros médicos.

[P00086 | 5784:5794 | NORMAL_TEXT | LIST id=kix.list.18 level=0]
Recepção.

[P00087 | 5794:5837 | NORMAL_TEXT | LIST id=kix.list.18 level=0]
Nutricionistas ou equipe multidisciplinar.

[P00088 | 5837:5858 | NORMAL_TEXT | LIST id=kix.list.18 level=0]
Gestores de clínica.

[P00089 | 5858:5888 | NORMAL_TEXT | LIST id=kix.list.18 level=0]
Múltiplas clínicas ou marcas.

[P00090 | 5888:5943 | HEADING_1]
5. O que foi aprendido sobre a rotina do Dr. Guilherme

[P00091 | 5943:5972 | HEADING_2]
5.1 Método geral de trabalho

[P00092 | 5972:6073 | NORMAL_TEXT]
O Dr. Guilherme usa IA como uma camada de inteligência operacional entre informação bruta e decisão:

[P00093 | 6073:6175 | NORMAL_TEXT]
Entrada bruta → Contexto → Análise → Pesquisa/validação → Refinamento → Decisão → Execução → Feedback

[P00094 | 6175:6250 | NORMAL_TEXT]
Ele espera poder enviar materiais sem preparar um briefing perfeito, como:

[P00095 | 6250:6269 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Texto e perguntas.

[P00096 | 6269:6285 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Fotos e prints.

[P00097 | 6285:6304 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
PDFs e documentos.

[P00098 | 6304:6326 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Resultados de exames.

[P00099 | 6326:6337 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Conversas.

[P00100 | 6337:6348 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Planilhas.

[P00101 | 6348:6355 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Links.

[P00102 | 6355:6377 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Áudio ou transcrição.

[P00103 | 6377:6397 | NORMAL_TEXT | LIST id=kix.list.19 level=0]
Ideias incompletas.

[P00104 | 6397:6475 | NORMAL_TEXT]
O sistema deve organizar o material, recuperar contexto pertinente e separar:

[P00105 | 6475:6500 | NORMAL_TEXT | LIST id=kix.list.20 level=0]
Fatos e dados originais.

[P00106 | 6500:6523 | NORMAL_TEXT | LIST id=kix.list.20 level=0]
Informações faltantes.

[P00107 | 6523:6536 | NORMAL_TEXT | LIST id=kix.list.20 level=0]
Inferências.

[P00108 | 6536:6544 | NORMAL_TEXT | LIST id=kix.list.20 level=0]
Riscos.

[P00109 | 6544:6558 | NORMAL_TEXT | LIST id=kix.list.20 level=0]
Alternativas.

[P00110 | 6558:6649 | NORMAL_TEXT | LIST id=kix.list.20 level=0]
Sugestão operacional ou alternativa para revisão, nunca recomendação terapêutica autônoma.

[P00111 | 6649:6672 | NORMAL_TEXT | LIST id=kix.list.20 level=0]
Próxima ação possível.

[P00112 | 6672:6747 | NORMAL_TEXT]
O médico permanece como camada final de julgamento, autorização e decisão.

[P00113 | 6747:7010 | NORMAL_TEXT]
Essas entradas descrevem o modo geral como o Dr. Guilherme trabalha com IA. Elas não viram automaticamente escopo do produto. No primeiro MVP, as entradas ficam limitadas à pré-consulta por texto, notas do médico e dados explicitamente aprovados para cada fluxo.

[P00114 | 7010:7056 | HEADING_2]
5.2 Fluxos clínicos e operacionais informados

[P00115 | 7056:7080 | HEADING_3]
Consulta e documentação

[P00116 | 7080:7106 | NORMAL_TEXT]
Fluxo desejado/informado:

[P00117 | 7106:7138 | NORMAL_TEXT | LIST id=kix.list.21 level=0]
Consulta presencial ou on-line.

[P00118 | 7138:7172 | NORMAL_TEXT | LIST id=kix.list.21 level=0]
Gravação autorizada ou anotações.

[P00119 | 7172:7185 | NORMAL_TEXT | LIST id=kix.list.21 level=0]
Transcrição.

[P00120 | 7185:7226 | NORMAL_TEXT | LIST id=kix.list.21 level=0]
Organização em nota clínica estruturada.

[P00121 | 7226:7258 | NORMAL_TEXT | LIST id=kix.list.21 level=0]
Revisão e correção pelo médico.

[P00122 | 7258:7298 | NORMAL_TEXT | LIST id=kix.list.21 level=0]
Assinatura ou registro final no Feegow.

[P00123 | 7298:7515 | NORMAL_TEXT]
O documento cita Whisper e um script chamado agente_vivance.py. Como o mesmo documento afirma que a automação está “em setup”, esse fluxo deve ser tratado como PoC ou intenção não comprovada até demonstração técnica.

[P00124 | 7515:7535 | HEADING_3]
Exames e relatórios

[P00125 | 7535:7553 | NORMAL_TEXT]
Entradas citadas:

[P00126 | 7553:7576 | NORMAL_TEXT | LIST id=kix.list.22 level=0]
Calorimetria indireta.

[P00127 | 7576:7595 | NORMAL_TEXT | LIST id=kix.list.22 level=0]
Bioimpedância/BIA.

[P00128 | 7595:7617 | NORMAL_TEXT | LIST id=kix.list.22 level=0]
Exames laboratoriais.

[P00129 | 7617:7635 | NORMAL_TEXT]
Saídas desejadas:

[P00130 | 7635:7669 | NORMAL_TEXT | LIST id=kix.list.23 level=0]
Extração e organização dos dados.

[P00131 | 7669:7715 | NORMAL_TEXT | LIST id=kix.list.23 level=0]
Relatório explicativo em linguagem acessível.

[P00132 | 7715:7749 | NORMAL_TEXT | LIST id=kix.list.23 level=0]
PDF visual e/ou DOCX estruturado.

[P00133 | 7749:7779 | NORMAL_TEXT | LIST id=kix.list.23 level=0]
Mensagem educativa associada.

[P00134 | 7779:7875 | NORMAL_TEXT]
Qualquer interpretação, plano ou orientação deve permanecer como rascunho até aprovação médica.

[P00135 | 7875:7901 | HEADING_3]
Comunicação com pacientes

[P00136 | 7901:8059 | NORMAL_TEXT]
O médico utiliza o WhatsApp para retorno de exames, explicações e acompanhamento. A IA pode ajudar a redigir textos claros, calorosos e prontos para revisão.

[P00137 | 8059:8219 | NORMAL_TEXT]
No MVP, wa.me ou uma mensagem redigida não devem ser confundidos com integração real. Nenhuma mensagem clínica gerada pela IA pode ser enviada automaticamente.

[P00138 | 8219:8241 | HEADING_3]
Contexto longitudinal

[P00139 | 8241:8284 | NORMAL_TEXT]
O valor aumenta quando o sistema preserva:

[P00140 | 8284:8332 | NORMAL_TEXT | LIST id=kix.list.24 level=0]
Objetivo do paciente em suas próprias palavras.

[P00141 | 8332:8353 | NORMAL_TEXT | LIST id=kix.list.24 level=0]
Decisões anteriores.

[P00142 | 8353:8384 | NORMAL_TEXT | LIST id=kix.list.24 level=0]
Planos e orientações vigentes.

[P00143 | 8384:8406 | NORMAL_TEXT | LIST id=kix.list.24 level=0]
Check-ins e evolução.

[P00144 | 8406:8441 | NORMAL_TEXT | LIST id=kix.list.24 level=0]
Conversas e documentos relevantes.

[P00145 | 8441:8453 | NORMAL_TEXT | LIST id=kix.list.24 level=0]
Pendências.

[P00146 | 8453:8485 | NORMAL_TEXT | LIST id=kix.list.24 level=0]
Resultado das ações anteriores.

[P00147 | 8485:8508 | HEADING_2]
5.3 Ecossistema citado

[P00148 | 8511:8533 | NORMAL_TEXT | TABLE row=0 col=0]
Sistema ou ferramenta

[P00149 | 8534:8550 | NORMAL_TEXT | TABLE row=0 col=1]
Papel informado

[P00150 | 8551:8569 | NORMAL_TEXT | TABLE row=0 col=2]
Estado para o MVP

[P00151 | 8571:8578 | NORMAL_TEXT | TABLE row=1 col=0]
Feegow

[P00152 | 8579:8621 | NORMAL_TEXT | TABLE row=1 col=1]
Prontuário eletrônico e registro assinado

[P00153 | 8622:8682 | NORMAL_TEXT | TABLE row=1 col=2]
Tratar como fonte oficial recomendada até decisão contrária

[P00154 | 8684:8701 | NORMAL_TEXT | TABLE row=2 col=0]
Visus Vector 2.0

[P00155 | 8702:8717 | NORMAL_TEXT | TABLE row=2 col=1]
CRM da clínica

[P00156 | 8718:8765 | NORMAL_TEXT | TABLE row=2 col=2]
Fora do MVP até validação de necessidade e API

[P00157 | 8767:8773 | NORMAL_TEXT | TABLE row=3 col=0]
PULSE

[P00158 | 8774:8797 | NORMAL_TEXT | TABLE row=3 col=1]
Contatos e seguimentos

[P00159 | 8798:8824 | NORMAL_TEXT | TABLE row=3 col=2]
Fora do MVP até validação

[P00160 | 8826:8839 | NORMAL_TEXT | TABLE row=4 col=0]
Google Drive

[P00161 | 8840:8863 | NORMAL_TEXT | TABLE row=4 col=1]
Documentos e templates

[P00162 | 8864:8898 | NORMAL_TEXT | TABLE row=4 col=2]
Não assumir integração automática

[P00163 | 8900:8917 | NORMAL_TEXT | TABLE row=5 col=0]
WhatsApp / wa.me

[P00164 | 8918:8952 | NORMAL_TEXT | TABLE row=5 col=1]
Comunicação utilizada pelo médico

[P00165 | 8953:8987 | NORMAL_TEXT | TABLE row=5 col=2]
Envio manual ou integração futura

[P00166 | 8989:8997 | NORMAL_TEXT | TABLE row=6 col=0]
Whisper

[P00167 | 8998:9010 | NORMAL_TEXT | TABLE row=6 col=1]
Transcrição

[P00168 | 9011:9065 | NORMAL_TEXT | TABLE row=6 col=2]
Extensão após consentimento e avaliação do fornecedor

[P00169 | 9067:9085 | NORMAL_TEXT | TABLE row=7 col=0]
agente_vivance.py

[P00170 | 9086:9142 | NORMAL_TEXT | TABLE row=7 col=1]
Integração alegada entre áudio, IA, documentos e Feegow

[P00171 | 9143:9196 | NORMAL_TEXT | TABLE row=7 col=2]
Não assumir existência ou funcionamento sem inspeção

[P00172 | 9197:9198 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00173 | 9198:9238 | HEADING_2]
5.4 Informações profissionais a validar

[P00174 | 9238:9273 | NORMAL_TEXT]
Existe divergência nos documentos:

[P00175 | 9273:9316 | NORMAL_TEXT | LIST id=kix.list.25 level=0]
Um MD apresenta CRM-PR 182364 | RQE 73549.

[P00176 | 9316:9403 | NORMAL_TEXT | LIST id=kix.list.25 level=0]
O cadastro utilizado anteriormente apresenta CRM-SP 182364 | CRM-PR 34614 | RQE 73549.

[P00177 | 9403:9485 | NORMAL_TEXT]
Não reutilizar nem publicar esses dados sem confirmação oficial do Dr. Guilherme.

[P00178 | 9485:9531 | HEADING_1]
6. Papel e limites da inteligência artificial

[P00179 | 9531:9541 | HEADING_2]
A IA pode

[P00180 | 9541:9571 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Transcrever áudio autorizado.

[P00181 | 9571:9603 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Resumir informações fornecidas.

[P00182 | 9603:9633 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Organizar respostas por tema.

[P00183 | 9633:9683 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Identificar lacunas ou contradições para revisão.

[P00184 | 9683:9741 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Gerar rascunhos de notas, relatórios, planos e mensagens.

[P00185 | 9741:9769 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Resumir uma linha do tempo.

[P00186 | 9769:9825 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Sugerir perguntas que o médico talvez queira confirmar.

[P00187 | 9825:9897 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Apoiar pesquisa de evidências para uso exclusivo do médico, com fontes.

[P00188 | 9897:9957 | NORMAL_TEXT | LIST id=kix.list.26 level=0]
Indicar padrões descritivos sem tratá-los como causalidade.

[P00189 | 9957:9971 | HEADING_2]
A IA não pode

[P00190 | 9971:9985 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Diagnosticar.

[P00191 | 9985:9997 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Prescrever.

[P00192 | 9997:10035 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Criar ou alterar dose de medicamento.

[P00193 | 10035:10057 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Modificar tratamento.

[P00194 | 10057:10082 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Decidir conduta clínica.

[P00195 | 10082:10102 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Assinar documentos.

[P00196 | 10102:10169 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Publicar plano, nota, relatório ou mensagem clínica sem aprovação.

[P00197 | 10169:10223 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Responder clinicamente ao paciente de forma autônoma.

[P00198 | 10223:10274 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Declarar que um paciente está seguro ou sem risco.

[P00199 | 10274:10324 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Substituir atendimento de urgência ou emergência.

[P00200 | 10324:10410 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Estimar com precisão ingredientes, porções, calorias ou nutrientes a partir de fotos.

[P00201 | 10410:10505 | NORMAL_TEXT | LIST id=kix.list.27 level=0]
Usar dados dos pacientes para treinamento sem autorização específica e juridicamente validada.

[P00202 | 10505:10554 | HEADING_2]
Ciclo obrigatório dos artefatos clínicos gerados

[P00203 | 10554:10664 | NORMAL_TEXT]
Rascunho da IA→ Em revisão médica→ Aprovado pelo médico→ Publicado ou exportado→ Nova versão, se alterado

[P00204 | 10664:10685 | NORMAL_TEXT]
Regras obrigatórias:

[P00205 | 10685:10743 | NORMAL_TEXT | LIST id=kix.list.28 level=0]
O conteúdo original nunca pode ser ocultado pela síntese.

[P00206 | 10743:10801 | NORMAL_TEXT | LIST id=kix.list.28 level=0]
Cada afirmação clínica deve ser rastreável à fonte usada.

[P00207 | 10801:10869 | NORMAL_TEXT | LIST id=kix.list.28 level=0]
Campos sem evidência devem ficar vazios ou marcados como pendentes.

[P00208 | 10869:10965 | NORMAL_TEXT | LIST id=kix.list.28 level=0]
Diagnóstico, conduta e medicação só podem aparecer quando inseridos ou confirmados pelo médico.

[P00209 | 10965:11074 | NORMAL_TEXT | LIST id=kix.list.28 level=0]
O sistema deve registrar modelo/serviço, versão do prompt, fontes, data, autor da revisão e versão aprovada.

[P00210 | 11074:11139 | NORMAL_TEXT | LIST id=kix.list.28 level=0]
Deve existir um caminho manual quando a IA estiver indisponível.

[P00211 | 11139:11170 | HEADING_2]
Recusa do uso de IA no cuidado

[P00212 | 11170:11216 | NORMAL_TEXT]
Quando o paciente exercer a recusa informada:

[P00213 | 11216:11272 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
O status deve ser registrado e ficar visível ao médico.

[P00214 | 11272:11329 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
Pré-consulta continua disponível, mas sem síntese de IA.

[P00215 | 11329:11397 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
Dossiê continua acessível pelas fontes originais, sem resumo de IA.

[P00216 | 11397:11438 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
Nota e plano são elaborados manualmente.

[P00217 | 11438:11491 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
Áudio não é enviado a serviço de transcrição por IA.

[P00218 | 11491:11567 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
Nenhum dado daquele paciente é enviado ao provedor para os casos recusados.

[P00219 | 11567:11632 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
A recusa não impede acesso, consulta ou continuidade do cuidado.

[P00220 | 11632:11722 | NORMAL_TEXT | LIST id=kix.list.29 level=0]
Eventual mudança de escolha deve ser versionada e valer apenas para novos processamentos.

[P00221 | 11722:11748 | HEADING_1]
7. Estado atual conhecido

[P00222 | 11748:11769 | HEADING_2]
Protótipo construído

[P00223 | 11769:11778 | HEADING_3]
Paciente

[P00224 | 11778:11784 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Hoje.

[P00225 | 11784:11791 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Plano.

[P00226 | 11791:11799 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Diário.

[P00227 | 11799:11809 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Evolução.

[P00228 | 11809:11820 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Mensagens.

[P00229 | 11820:11831 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Consultas.

[P00230 | 11831:11848 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Check-in diário.

[P00231 | 11848:11879 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Pré-consulta por voz ou texto.

[P00232 | 11879:11916 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Registro demonstrativo de refeições.

[P00233 | 11916:11960 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Indicadores de peso, adesão, sono e passos.

[P00234 | 11960:11999 | NORMAL_TEXT | LIST id=kix.list.30 level=0]
Histórico e relatórios demonstrativos.

[P00235 | 11999:12006 | HEADING_3]
Médico

[P00236 | 12006:12019 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Visão geral.

[P00237 | 12019:12027 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Agenda.

[P00238 | 12027:12038 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Pacientes.

[P00239 | 12038:12049 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Mensagens.

[P00240 | 12049:12061 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Relatórios.

[P00241 | 12061:12083 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Ambiente de consulta.

[P00242 | 12083:12113 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Caixa de atenção por exceção.

[P00243 | 12113:12134 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Dossiê longitudinal.

[P00244 | 12134:12154 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Notas estruturadas.

[P00245 | 12154:12186 | NORMAL_TEXT | LIST id=kix.list.31 level=0]
Rascunhos de relatório e plano.

[P00246 | 12186:12264 | NORMAL_TEXT]
Os pacientes, consultas, métricas, alertas e documentos atuais são fictícios.

[P00247 | 12264:12314 | HEADING_2]
Estado técnico registrado em 31 de agosto de 2026

[P00248 | 12314:12324 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
React 19.

[P00249 | 12324:12336 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
Next.js 16.

[P00250 | 12336:12348 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
TypeScript.

[P00251 | 12348:12362 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
Tailwind CSS.

[P00252 | 12362:12394 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
Menção adicional a Vinext/Vite.

[P00253 | 12394:12428 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
Preparação para Sites/Cloudflare.

[P00254 | 12428:12453 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
Branch registrada: main.

[P00255 | 12453:12514 | NORMAL_TEXT | LIST id=kix.list.32 level=0]
Commit registrado: 8fe9cf59b055615ea736cdbf734baf86a9b3ec70.

[P00256 | 12514:12677 | NORMAL_TEXT]
Antes de modificar o projeto, o Codex deve conferir o repositório real. A combinação Next.js e Vinext/Vite, o commit, a hospedagem e a estrutura podem ter mudado.

[P00257 | 12677:12912 | NORMAL_TEXT]
Na memória datada de 31 de agosto, os principais componentes eram descritos como doctor.tsx e patient.tsx, e os PDFs mockados ficavam em output/pdf/. Esses caminhos são referências históricas e precisam ser confirmados no repositório.

[P00258 | 12912:13101 | NORMAL_TEXT]
A URL publicada ainda utilizava a marca antiga Lume Saúde e respondeu HTTP 401 em verificação anônima. Não tratá-la como ambiente de produção nem apresentá-la externamente sem revalidação.

[P00259 | 13101:13139 | HEADING_2]
Ainda não comprovado como operacional

[P00260 | 13139:13158 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Autenticação real.

[P00261 | 13158:13186 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Banco de dados persistente.

[P00262 | 13186:13208 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Upload real e seguro.

[P00263 | 13208:13234 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Separação entre clínicas.

[P00264 | 13234:13257 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Integração com Feegow.

[P00265 | 13257:13282 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Integração com WhatsApp.

[P00266 | 13282:13318 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Gravação e transcrição em produção.

[P00267 | 13318:13345 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Google Meet ou vídeo real.

[P00268 | 13345:13365 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Prescrição digital.

[P00269 | 13365:13392 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Integração com prontuário.

[P00270 | 13392:13437 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Apple HealthKit, Health Connect ou relógios.

[P00271 | 13437:13460 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Base médica conectada.

[P00272 | 13460:13479 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Operação 24 horas.

[P00273 | 13479:13531 | NORMAL_TEXT | LIST id=kix.list.33 level=0]
Certificação como prontuário ou dispositivo médico.

[P00274 | 13531:13566 | HEADING_1]
8. Hipótese recomendada para o MVP

[P00275 | 13566:13688 | NORMAL_TEXT]
O produto possui duas hipóteses de valor relacionadas, mas não deve tentar validá-las simultaneamente no primeiro piloto.

[P00276 | 13688:13719 | HEADING_2]
MVP-1 — Eficiência da consulta

[P00277 | 13719:13792 | NORMAL_TEXT]
Primeiro, validar se uma plataforma supervisionada pelo médico consegue:

[P00278 | 13792:13832 | NORMAL_TEXT | LIST id=kix.list.34 level=0]
Organizar o contexto antes da consulta.

[P00279 | 13832:13888 | NORMAL_TEXT | LIST id=kix.list.34 level=0]
Reduzir o trabalho manual de preparação e documentação.

[P00280 | 13888:13958 | NORMAL_TEXT | LIST id=kix.list.34 level=0]
Transformar decisões médicas em uma nota rastreável e um plano claro.

[P00281 | 13958:13999 | NORMAL_TEXT | LIST id=kix.list.34 level=0]
Manter o Feegow como prontuário oficial.

[P00282 | 13999:14142 | NORMAL_TEXT]
Essa é a primeira fatia recomendada porque os documentos do Dr. Guilherme descrevem dores concretas de preparação, transcrição e documentação.

[P00283 | 14142:14178 | HEADING_2]
MVP-2 — Acompanhamento longitudinal

[P00284 | 14178:14245 | NORMAL_TEXT]
Depois que o MVP-1 estiver estável, validar se o Vivance consegue:

[P00285 | 14245:14293 | NORMAL_TEXT | LIST id=kix.list.35 level=0]
Acompanhar a execução do plano entre consultas.

[P00286 | 14293:14337 | NORMAL_TEXT | LIST id=kix.list.35 level=0]
Coletar check-ins simples com baixo atrito.

[P00287 | 14337:14383 | NORMAL_TEXT | LIST id=kix.list.35 level=0]
Destacar pendências operacionais explicáveis.

[P00288 | 14383:14440 | NORMAL_TEXT | LIST id=kix.list.35 level=0]
Permitir que o médico registre uma ação e feche o ciclo.

[P00289 | 14440:14472 | HEADING_2]
Recorte operacional recomendado

[P00290 | 14472:14504 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Uma clínica: Instituto Vivance.

[P00291 | 14504:14530 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Um médico: Dr. Guilherme.

[P00292 | 14530:14569 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Poucos pacientes em piloto controlado.

[P00293 | 14569:14614 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Adultos, salvo decisão clínica em contrário.

[P00294 | 14614:14668 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Feegow como fonte oficial do prontuário e assinatura.

[P00295 | 14668:14776 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Vivance como camada de preparação, rascunhos e contexto; acompanhamento longitudinal é adicionado no MVP-2.

[P00296 | 14776:14846 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Transferência manual segura ao Feegow antes de integração automática.

[P00297 | 14846:14921 | NORMAL_TEXT | LIST id=kix.list.36 level=0]
Regras de atenção inicialmente operacionais, sem triagem ou score clínico.

[P00298 | 14921:14957 | HEADING_2]
Jornadas divididas em duas entregas

[P00299 | 14957:14999 | HEADING_3]
MVP-1: Jornada A — Preparação da consulta

[P00300 | 14999:15100 | NORMAL_TEXT]
Convite → Ciência/aceites aplicáveis → Objetivo → Pré-consulta→ Síntese com fontes → Revisão médica

[P00301 | 15100:15142 | HEADING_3]
MVP-1: Jornada B — Consulta, nota e plano

[P00302 | 15142:15283 | NORMAL_TEXT]
Contexto → Notas ou transcrição existente → Rascunho→ Edição/aprovação médica → Exportação ao Feegow→ Plano aprovado publicado ao paciente

[P00303 | 15283:15329 | HEADING_3]
MVP-2: Jornada C — Acompanhamento por exceção

[P00304 | 15329:15432 | NORMAL_TEXT]
Plano ativo → Check-in curto → Regra transparente→ Item de atenção → Revisão e ação médica → Feedback

[P00305 | 15432:15454 | HEADING_1]
9. Escopo recomendado

[P00306 | 15454:15501 | HEADING_2]
9.1 MVP-1 — obrigatório para o primeiro piloto

[P00307 | 15504:15511 | NORMAL_TEXT | TABLE row=0 col=0]
Módulo

[P00308 | 15512:15530 | NORMAL_TEXT | TABLE row=0 col=1]
Incluído no MVP-1

[P00309 | 15532:15552 | NORMAL_TEXT | TABLE row=1 col=0]
Identidade e acesso

[P00310 | 15553:15645 | NORMAL_TEXT | TABLE row=1 col=1]
Login seguro, MFA do médico, convite individual, recuperação de acesso e sessões protegidas

[P00311 | 15647:15655 | NORMAL_TEXT | TABLE row=2 col=0]
Vínculo

[P00312 | 15656:15718 | NORMAL_TEXT | TABLE row=2 col=1]
Médico cria, verifica e pode revogar a relação com o paciente

[P00313 | 15720:15742 | NORMAL_TEXT | TABLE row=3 col=0]
Privacidade e aceites

[P00314 | 15743:15828 | NORMAL_TEXT | TABLE row=3 col=1]
Ciência do aviso, aceite de termos e consentimento granular somente quando aplicável

[P00315 | 15830:15846 | NORMAL_TEXT | TABLE row=4 col=0]
Cadastro mínimo

[P00316 | 15847:15928 | NORMAL_TEXT | TABLE row=4 col=1]
Identificação, objetivo nas palavras do paciente e referência opcional ao Feegow

[P00317 | 15930:15943 | NORMAL_TEXT | TABLE row=5 col=0]
Pré-consulta

[P00318 | 15944:16009 | NORMAL_TEXT | TABLE row=5 col=1]
Questionário por texto, salvamento de progresso, revisão e envio

[P00319 | 16011:16029 | NORMAL_TEXT | TABLE row=6 col=0]
Síntese assistida

[P00320 | 16030:16078 | NORMAL_TEXT | TABLE row=6 col=1]
Resumo com fontes, lacunas e pontos a confirmar

[P00321 | 16080:16094 | NORMAL_TEXT | TABLE row=7 col=0]
Painel médico

[P00322 | 16095:16142 | NORMAL_TEXT | TABLE row=7 col=1]
Pacientes, pré-consultas e rascunhos pendentes

[P00323 | 16144:16151 | NORMAL_TEXT | TABLE row=8 col=0]
Dossiê

[P00324 | 16152:16215 | NORMAL_TEXT | TABLE row=8 col=1]
Objetivo, pré-consultas, planos, notas e linha do tempo mínima

[P00325 | 16217:16235 | NORMAL_TEXT | TABLE row=9 col=0]
Workspace clínico

[P00326 | 16236:16309 | NORMAL_TEXT | TABLE row=9 col=1]
Notas manuais ou transcrição já existente, organização pela IA e revisão

[P00327 | 16311:16324 | NORMAL_TEXT | TABLE row=10 col=0]
Nota clínica

[P00328 | 16325:16392 | NORMAL_TEXT | TABLE row=10 col=1]
Rascunho versionado, aprovação e cópia/exportação segura ao Feegow

[P00329 | 16394:16411 | NORMAL_TEXT | TABLE row=11 col=0]
Plano de cuidado

[P00330 | 16412:16467 | NORMAL_TEXT | TABLE row=11 col=1]
Rascunho, aprovação, publicação e histórico de versões

[P00331 | 16469:16493 | NORMAL_TEXT | TABLE row=12 col=0]
Privacidade operacional

[P00332 | 16494:16583 | NORMAL_TEXT | TABLE row=12 col=1]
Canal e processo auditável para revogação, acesso, correção e exclusão conforme política

[P00333 | 16585:16595 | NORMAL_TEXT | TABLE row=13 col=0]
Auditoria

[P00334 | 16596:16634 | NORMAL_TEXT | TABLE row=13 col=1]
Registro de acessos e ações sensíveis

[P00335 | 16635:16636 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00336 | 16636:16676 | HEADING_2]
9.2 MVP-2 — acompanhamento longitudinal

[P00337 | 16676:16722 | NORMAL_TEXT]
Adicionar somente após o MVP-1 estar estável:

[P00338 | 16725:16732 | NORMAL_TEXT | TABLE row=0 col=0]
Módulo

[P00339 | 16733:16751 | NORMAL_TEXT | TABLE row=0 col=1]
Incluído no MVP-2

[P00340 | 16753:16762 | NORMAL_TEXT | TABLE row=1 col=0]
Check-in

[P00341 | 16763:16824 | NORMAL_TEXT | TABLE row=1 col=1]
Formulário curto, histórico e identificação como autorrelato

[P00342 | 16826:16842 | NORMAL_TEXT | TABLE row=2 col=0]
Plano acionável

[P00343 | 16843:16937 | NORMAL_TEXT | TABLE row=2 col=1]
Paciente visualiza as ações aprovadas; confirmação de execução é opcional e deve ser definida

[P00344 | 16939:16955 | NORMAL_TEXT | TABLE row=3 col=0]
Evolução mínima

[P00345 | 16956:17002 | NORMAL_TEXT | TABLE row=3 col=1]
Histórico simples, sem inferir dados ausentes

[P00346 | 17004:17024 | NORMAL_TEXT | TABLE row=4 col=0]
Atenção operacional

[P00347 | 17025:17082 | NORMAL_TEXT | TABLE row=4 col=1]
Pré-consulta, check-in, nota, plano ou revisão pendentes

[P00348 | 17084:17096 | NORMAL_TEXT | TABLE row=5 col=0]
Ação médica

[P00349 | 17097:17161 | NORMAL_TEXT | TABLE row=5 col=1]
Registro de revisão, contato externo, relevância e encerramento

[P00350 | 17162:17163 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00351 | 17163:17314 | NORMAL_TEXT]
Regras baseadas em sintomas, piora, risco ou urgência não fazem parte desta entrega sem avaliação de risco, validação clínica e cobertura operacional.

[P00352 | 17314:17355 | HEADING_2]
9.3 P1 — extensões após o núcleo estável

[P00353 | 17355:17427 | NORMAL_TEXT]
Escolher uma extensão de cada vez, com base no maior gargalo observado:

[P00354 | 17427:17515 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Upload de documentos: PDF/imagem, armazenamento privado, metadados e acesso controlado.

[P00355 | 17515:17651 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Áudio e transcrição nativa: consentimento específico, upload/gravação, transcrição, marcação de baixa confiança e política de retenção.

[P00356 | 17651:17770 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Relatório assistido de um tipo de exame: começar por calorimetria ou bioimpedância, usando um único template aprovado.

[P00357 | 17770:17876 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Integração Feegow: somente após comprovação de API, autenticação, permissões, campos, duplicidade e logs.

[P00358 | 17876:17972 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Mensagens internas: canal assíncrono com expectativa de resposta e sem resposta autônoma da IA.

[P00359 | 17972:18042 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
WhatsApp: lembretes e textos aprovados, sem envio clínico automático.

[P00360 | 18042:18127 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Evolução visual: gráficos simples e reproduzíveis de peso, adesão, sono e bem-estar.

[P00361 | 18127:18204 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Refeições: foto e contexto subjetivo, sem estimativas nutricionais precisas.

[P00362 | 18204:18285 | NORMAL_TEXT | LIST id=kix.list.37 level=0]
Relatórios periódicos: narrativa gerada e publicada somente após revisão médica.

[P00363 | 18285:18301 | HEADING_2]
9.4 Fora do MVP

[P00364 | 18301:18348 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Substituir o Feegow por um prontuário próprio.

[P00365 | 18348:18408 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Diagnóstico, prescrição ou alteração de tratamento pela IA.

[P00366 | 18408:18434 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Chatbot clínico autônomo.

[P00367 | 18434:18482 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Monitoramento 24 horas ou promessa de urgência.

[P00368 | 18482:18513 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Teleconsulta nativa com vídeo.

[P00369 | 18513:18555 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Prescrição digital e emissão de receitas.

[P00370 | 18555:18585 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Agenda bidirecional completa.

[P00371 | 18585:18653 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Integrações simultâneas com Feegow, PULSE, Visus, Drive e WhatsApp.

[P00372 | 18653:18714 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Multi-clínica operacional, white label ou equipes complexas.

[P00373 | 18714:18751 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Protocolos totalmente configuráveis.

[P00374 | 18751:18815 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
HealthKit, Health Connect, smartwatches ou balanças conectadas.

[P00375 | 18815:18867 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Análise precisa de calorias ou nutrientes por foto.

[P00376 | 18867:18901 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Motor preditivo de risco clínico.

[P00377 | 18901:18953 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Pesquisa clínica aplicando conduta automaticamente.

[P00378 | 18953:18974 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Internacionalização.

[P00379 | 18974:19002 | NORMAL_TEXT | LIST id=kix.list.38 level=0]
Funcionalidades comerciais.

[P00380 | 19002:19051 | HEADING_1]
10. Fronteira recomendada entre Vivance e Feegow

[P00381 | 19051:19125 | NORMAL_TEXT]
Esta é uma recomendação de MVP e deve ser confirmada com o Dr. Guilherme.

[P00382 | 19128:19145 | NORMAL_TEXT | TABLE row=0 col=0]
Entidade ou ação

[P00383 | 19146:19164 | NORMAL_TEXT | TABLE row=0 col=1]
Fonte recomendada

[P00384 | 19165:19182 | NORMAL_TEXT | TABLE row=0 col=2]
Regra no Vivance

[P00385 | 19184:19209 | NORMAL_TEXT | TABLE row=1 col=0]
Cadastro clínico oficial

[P00386 | 19210:19217 | NORMAL_TEXT | TABLE row=1 col=1]
Feegow

[P00387 | 19218:19274 | NORMAL_TEXT | TABLE row=1 col=2]
Manter somente os campos mínimos e a referência externa

[P00388 | 19276:19303 | NORMAL_TEXT | TABLE row=2 col=0]
Prontuário e nota assinada

[P00389 | 19304:19311 | NORMAL_TEXT | TABLE row=2 col=1]
Feegow

[P00390 | 19312:19425 | NORMAL_TEXT | TABLE row=2 col=2]
Manter fontes, rascunho, versão aprovada para exportação e evidência da transferência conforme retenção definida

[P00391 | 19427:19447 | NORMAL_TEXT | TABLE row=3 col=0]
Diagnóstico oficial

[P00392 | 19448:19455 | NORMAL_TEXT | TABLE row=3 col=1]
Feegow

[P00393 | 19456:19487 | NORMAL_TEXT | TABLE row=3 col=2]
Não criar diagnóstico autônomo

[P00394 | 19489:19510 | NORMAL_TEXT | TABLE row=4 col=0]
Prescrição e receita

[P00395 | 19511:19540 | NORMAL_TEXT | TABLE row=4 col=1]
Feegow ou sistema autorizado

[P00396 | 19541:19564 | NORMAL_TEXT | TABLE row=4 col=2]
Fora do Vivance no MVP

[P00397 | 19566:19581 | NORMAL_TEXT | TABLE row=5 col=0]
Agenda oficial

[P00398 | 19582:19589 | NORMAL_TEXT | TABLE row=5 col=1]
Feegow

[P00399 | 19590:19626 | NORMAL_TEXT | TABLE row=5 col=2]
No máximo, referência manual no MVP

[P00400 | 19628:19641 | NORMAL_TEXT | TABLE row=6 col=0]
Pré-consulta

[P00401 | 19642:19650 | NORMAL_TEXT | TABLE row=6 col=1]
Vivance

[P00402 | 19651:19737 | NORMAL_TEXT | TABLE row=6 col=2]
Fonte original; médico decide o que é clinicamente relevante para registrar no Feegow

[P00403 | 19739:19759 | NORMAL_TEXT | TABLE row=7 col=0]
Resumo preparatório

[P00404 | 19760:19768 | NORMAL_TEXT | TABLE row=7 col=1]
Vivance

[P00405 | 19769:19800 | NORMAL_TEXT | TABLE row=7 col=2]
Artefato derivado e rastreável

[P00406 | 19802:19828 | NORMAL_TEXT | TABLE row=8 col=0]
Plano exibido ao paciente

[P00407 | 19829:19837 | NORMAL_TEXT | TABLE row=8 col=1]
Vivance

[P00408 | 19838:19936 | NORMAL_TEXT | TABLE row=8 col=2]
Decisões clínicas relevantes também precisam ser registradas no Feegow conforme processo aprovado

[P00409 | 19938:19948 | NORMAL_TEXT | TABLE row=9 col=0]
Check-ins

[P00410 | 19949:19957 | NORMAL_TEXT | TABLE row=9 col=1]
Vivance

[P00411 | 19958:20040 | NORMAL_TEXT | TABLE row=9 col=2]
Autorrelatos; informações clinicamente relevantes podem exigir registro no Feegow

[P00412 | 20042:20068 | NORMAL_TEXT | TABLE row=10 col=0]
Fila e ações operacionais

[P00413 | 20069:20077 | NORMAL_TEXT | TABLE row=10 col=1]
Vivance

[P00414 | 20078:20191 | NORMAL_TEXT | TABLE row=10 col=2]
A fila é operacional; observação, contato ou ação clínica relevante deve ser registrada e reconciliada no Feegow

[P00415 | 20193:20218 | NORMAL_TEXT | TABLE row=11 col=0]
Transferência automática

[P00416 | 20219:20236 | NORMAL_TEXT | TABLE row=11 col=1]
Nenhuma no MVP-1

[P00417 | 20237:20257 | NORMAL_TEXT | TABLE row=11 col=2]
Só após homologação

[P00418 | 20258:20259 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00419 | 20259:20304 | NORMAL_TEXT]
Antes do piloto, definir para cada entidade:

[P00420 | 20304:20319 | NORMAL_TEXT | LIST id=kix.list.39 level=0]
Fonte oficial.

[P00421 | 20319:20357 | NORMAL_TEXT | LIST id=kix.list.39 level=0]
Versão que deve ser levada ao Feegow.

[P00422 | 20357:20387 | NORMAL_TEXT | LIST id=kix.list.39 level=0]
Prazo de retenção no Vivance.

[P00423 | 20387:20410 | NORMAL_TEXT | LIST id=kix.list.39 level=0]
Identificador externo.

[P00424 | 20410:20442 | NORMAL_TEXT | LIST id=kix.list.39 level=0]
Responsável pela transferência.

[P00425 | 20442:20487 | NORMAL_TEXT | LIST id=kix.list.39 level=0]
Comportamento quando a transferência falhar.

[P00426 | 20487:20544 | NORMAL_TEXT | LIST id=kix.list.39 level=0]
Processo de reconciliação quando os sistemas divergirem.

[P00427 | 20544:20578 | NORMAL_TEXT]
Estados mínimos da transferência:

[P00428 | 20578:20588 | NORMAL_TEXT | LIST id=kix.list.40 level=0]
Pendente.

[P00429 | 20588:20621 | NORMAL_TEXT | LIST id=kix.list.40 level=0]
Exportado, ainda não verificado.

[P00430 | 20621:20657 | NORMAL_TEXT | LIST id=kix.list.40 level=0]
Confirmado manualmente pelo médico.

[P00431 | 20657:20697 | NORMAL_TEXT | LIST id=kix.list.40 level=0]
Sincronizado por integração homologada.

[P00432 | 20697:20705 | NORMAL_TEXT | LIST id=kix.list.40 level=0]
Falhou.

[P00433 | 20705:20906 | NORMAL_TEXT]
Uma confirmação manual é evidência operacional; não significa sincronização. Se houver divergência em conteúdo clínico oficial, o Feegow prevalece até que uma nova versão seja revisada e reconciliada.

[P00434 | 20906:20938 | HEADING_1]
11. Papéis e permissões mínimas

[P00435 | 20941:20946 | NORMAL_TEXT | TABLE row=0 col=0]
Ação

[P00436 | 20947:20956 | NORMAL_TEXT | TABLE row=0 col=1]
Paciente

[P00437 | 20957:20964 | NORMAL_TEXT | TABLE row=0 col=2]
Médico

[P00438 | 20965:20979 | NORMAL_TEXT | TABLE row=0 col=3]
Admin técnico

[P00439 | 20981:21000 | NORMAL_TEXT | TABLE row=1 col=0]
Ver próprios dados

[P00440 | 21001:21005 | NORMAL_TEXT | TABLE row=1 col=1]
Sim

[P00441 | 21006:21008 | NORMAL_TEXT | TABLE row=1 col=2]
—

[P00442 | 21009:21024 | NORMAL_TEXT | TABLE row=1 col=3]
Não por padrão

[P00443 | 21026:21049 | NORMAL_TEXT | TABLE row=2 col=0]
Ver paciente vinculado

[P00444 | 21050:21054 | NORMAL_TEXT | TABLE row=2 col=1]
Não

[P00445 | 21055:21059 | NORMAL_TEXT | TABLE row=2 col=2]
Sim

[P00446 | 21060:21075 | NORMAL_TEXT | TABLE row=2 col=3]
Não por padrão

[P00447 | 21077:21109 | NORMAL_TEXT | TABLE row=3 col=0]
Responder pré-consulta/check-in

[P00448 | 21110:21114 | NORMAL_TEXT | TABLE row=3 col=1]
Sim

[P00449 | 21115:21125 | NORMAL_TEXT | TABLE row=3 col=2]
Consultar

[P00450 | 21126:21130 | NORMAL_TEXT | TABLE row=3 col=3]
Não

[P00451 | 21132:21166 | NORMAL_TEXT | TABLE row=4 col=0]
Ver conteúdo original do paciente

[P00452 | 21167:21175 | NORMAL_TEXT | TABLE row=4 col=1]
Próprio

[P00453 | 21176:21180 | NORMAL_TEXT | TABLE row=4 col=2]
Sim

[P00454 | 21181:21196 | NORMAL_TEXT | TABLE row=4 col=3]
Não por padrão

[P00455 | 21198:21217 | NORMAL_TEXT | TABLE row=5 col=0]
Criar nota clínica

[P00456 | 21218:21222 | NORMAL_TEXT | TABLE row=5 col=1]
Não

[P00457 | 21223:21227 | NORMAL_TEXT | TABLE row=5 col=2]
Sim

[P00458 | 21228:21232 | NORMAL_TEXT | TABLE row=5 col=3]
Não

[P00459 | 21234:21256 | NORMAL_TEXT | TABLE row=6 col=0]
Gerar rascunho por IA

[P00460 | 21257:21282 | NORMAL_TEXT | TABLE row=6 col=1]
Apenas fluxos permitidos

[P00461 | 21283:21287 | NORMAL_TEXT | TABLE row=6 col=2]
Sim

[P00462 | 21288:21292 | NORMAL_TEXT | TABLE row=6 col=3]
Não

[P00463 | 21294:21319 | NORMAL_TEXT | TABLE row=7 col=0]
Aprovar conteúdo clínico

[P00464 | 21320:21324 | NORMAL_TEXT | TABLE row=7 col=1]
Não

[P00465 | 21325:21329 | NORMAL_TEXT | TABLE row=7 col=2]
Sim

[P00466 | 21330:21334 | NORMAL_TEXT | TABLE row=7 col=3]
Não

[P00467 | 21336:21364 | NORMAL_TEXT | TABLE row=8 col=0]
Publicar plano ou relatório

[P00468 | 21365:21369 | NORMAL_TEXT | TABLE row=8 col=1]
Não

[P00469 | 21370:21374 | NORMAL_TEXT | TABLE row=8 col=2]
Sim

[P00470 | 21375:21379 | NORMAL_TEXT | TABLE row=8 col=3]
Não

[P00471 | 21381:21405 | NORMAL_TEXT | TABLE row=9 col=0]
Alterar regras clínicas

[P00472 | 21406:21410 | NORMAL_TEXT | TABLE row=9 col=1]
Não

[P00473 | 21411:21431 | NORMAL_TEXT | TABLE row=9 col=2]
Sim, após validação

[P00474 | 21432:21436 | NORMAL_TEXT | TABLE row=9 col=3]
Não

[P00475 | 21438:21472 | NORMAL_TEXT | TABLE row=10 col=0]
Gerenciar consentimentos próprios

[P00476 | 21473:21477 | NORMAL_TEXT | TABLE row=10 col=1]
Sim

[P00477 | 21478:21506 | NORMAL_TEXT | TABLE row=10 col=2]
Consultar quando necessário

[P00478 | 21507:21525 | NORMAL_TEXT | TABLE row=10 col=3]
Operação restrita

[P00479 | 21527:21555 | NORMAL_TEXT | TABLE row=11 col=0]
Consultar auditoria clínica

[P00480 | 21556:21560 | NORMAL_TEXT | TABLE row=11 col=1]
Não

[P00481 | 21561:21582 | NORMAL_TEXT | TABLE row=11 col=2]
Conforme necessidade

[P00482 | 21583:21609 | NORMAL_TEXT | TABLE row=11 col=3]
Somente escopo autorizado

[P00483 | 21610:21611 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00484 | 21611:21720 | NORMAL_TEXT]
Autorização deve ser aplicada no backend. Ocultar um botão na interface não é controle de acesso suficiente.

[P00485 | 21720:21982 | NORMAL_TEXT]
O responsável por privacidade é um papel organizacional separado do administrador técnico. No MVP, solicitações podem ser executadas por processo externo aprovado, desde que o Vivance registre a solicitação, o status e a evidência da conclusão quando aplicável.

[P00486 | 21982:22021 | HEADING_1]
12. Requisitos funcionais transversais

[P00487 | 22021:22042 | HEADING_2]
Identidade e vínculo

[P00488 | 22042:22091 | NORMAL_TEXT | LIST id=kix.list.41 level=0]
Convites individuais, expiráveis e de uso único.

[P00489 | 22091:22124 | NORMAL_TEXT | LIST id=kix.list.41 level=0]
Identificadores não previsíveis.

[P00490 | 22124:22167 | NORMAL_TEXT | LIST id=kix.list.41 level=0]
Paciente acessa apenas seu próprio perfil.

[P00491 | 22167:22211 | NORMAL_TEXT | LIST id=kix.list.41 level=0]
Médico acessa somente pacientes vinculados.

[P00492 | 22211:22244 | NORMAL_TEXT | LIST id=kix.list.41 level=0]
Sessões expiráveis e revogáveis.

[P00493 | 22244:22273 | NORMAL_TEXT | LIST id=kix.list.41 level=0]
Recuperação de conta segura.

[P00494 | 22273:22310 | HEADING_2]
Privacidade, avisos e consentimentos

[P00495 | 22310:22439 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Registrar separadamente a ciência do aviso de privacidade, o aceite de termos e o consentimento quando ele for a base aplicável.

[P00496 | 22439:22499 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Definir finalidade e base legal antes de criar a interface.

[P00497 | 22499:22584 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Não chamar um tratamento de dados de “obrigatório” apenas porque o produto o deseja.

[P00498 | 22584:22631 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Consentimentos opcionais devem ser granulares.

[P00499 | 22631:22682 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Gravação/transcrição exige autorização específica.

[P00500 | 22682:22777 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Recusa do uso de IA ligado ao cuidado deve oferecer um fluxo integralmente manual equivalente.

[P00501 | 22777:22835 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Recusa não pode ser convertida silenciosamente em aceite.

[P00502 | 22835:22925 | NORMAL_TEXT | LIST id=kix.list.42 level=0]
Revogação deve interromper novos processamentos abrangidos, respeitando retenções legais.

[P00503 | 22925:22947 | HEADING_2]
Conteúdo clínico e IA

[P00504 | 22947:23001 | NORMAL_TEXT | LIST id=kix.list.43 level=0]
Todo artefato gerado deve ter fonte, status e versão.

[P00505 | 23001:23045 | NORMAL_TEXT | LIST id=kix.list.43 level=0]
Rascunhos nunca ficam visíveis ao paciente.

[P00506 | 23045:23080 | NORMAL_TEXT | LIST id=kix.list.43 level=0]
Apenas o médico publica ou aprova.

[P00507 | 23080:23193 | NORMAL_TEXT | LIST id=kix.list.43 level=0]
O sistema deve mostrar a diferença entre dado do paciente, nota do médico, inferência da IA e conteúdo aprovado.

[P00508 | 23193:23226 | NORMAL_TEXT | LIST id=kix.list.43 level=0]
Nenhum envio clínico automático.

[P00509 | 23226:23271 | NORMAL_TEXT | LIST id=kix.list.43 level=0]
Falha de IA não pode impedir o fluxo manual.

[P00510 | 23271:23286 | HEADING_2]
Linha do tempo

[P00511 | 23286:23335 | NORMAL_TEXT | LIST id=kix.list.44 level=0]
Cada evento registra data, autor, origem e tipo.

[P00512 | 23335:23403 | NORMAL_TEXT | LIST id=kix.list.44 level=0]
No MVP-1, o médico filtra por pré-consulta, consulta, nota e plano.

[P00513 | 23403:23464 | NORMAL_TEXT | LIST id=kix.list.44 level=0]
Check-in e atenção entram no MVP-2; documentos entram no P1.

[P00514 | 23464:23509 | NORMAL_TEXT | LIST id=kix.list.44 level=0]
Paciente vê apenas eventos destinados a ele.

[P00515 | 23509:23592 | NORMAL_TEXT | LIST id=kix.list.44 level=0]
Ausência de dados deve ser exibida como ausência, nunca preenchida por estimativa.

[P00516 | 23592:23612 | HEADING_2]
Atenção por exceção

[P00517 | 23612:23676 | NORMAL_TEXT | LIST id=kix.list.45 level=0]
No MVP-2, começar apenas com regras operacionais transparentes.

[P00518 | 23676:23741 | NORMAL_TEXT | LIST id=kix.list.45 level=0]
Cada item mostra a regra, fonte, data e resposta que o originou.

[P00519 | 23741:23805 | NORMAL_TEXT | LIST id=kix.list.45 level=0]
Estados mínimos: novo, em revisão, ação registrada e encerrado.

[P00520 | 23805:23861 | NORMAL_TEXT | LIST id=kix.list.45 level=0]
O médico registra se o item foi útil ou falso positivo.

[P00521 | 23861:23909 | NORMAL_TEXT | LIST id=kix.list.45 level=0]
A fila não representa vigilância em tempo real.

[P00522 | 23909:24030 | NORMAL_TEXT | LIST id=kix.list.45 level=0]
Regras baseadas em sintomas, piora ou risco exigem avaliação de risco, validação clínica e processo operacional próprio.

[P00523 | 24030:24046 | HEADING_2]
Documentos (P1)

[P00524 | 24046:24076 | NORMAL_TEXT | LIST id=kix.list.46 level=0]
Preservar o arquivo original.

[P00525 | 24076:24116 | NORMAL_TEXT | LIST id=kix.list.46 level=0]
Validar formato, tamanho e integridade.

[P00526 | 24116:24179 | NORMAL_TEXT | LIST id=kix.list.46 level=0]
Registrar tipo, data, origem, paciente e consulta relacionada.

[P00527 | 24179:24236 | NORMAL_TEXT | LIST id=kix.list.46 level=0]
Controlar upload, visualização e download por permissão.

[P00528 | 24236:24307 | NORMAL_TEXT | LIST id=kix.list.46 level=0]
Não tratar documento enviado pelo paciente como validado clinicamente.

[P00529 | 24307:24342 | HEADING_1]
13. Casos de uso principais do MVP

[P00530 | 24342:24353 | HEADING_2]
Convenções

[P00531 | 24353:24429 | NORMAL_TEXT | LIST id=kix.list.47 level=0]
MVP-1: primeira validação, focada em preparação e documentação da consulta.

[P00532 | 24429:24494 | NORMAL_TEXT | LIST id=kix.list.47 level=0]
MVP-2: segunda validação, focada no acompanhamento longitudinal.

[P00533 | 24494:24566 | NORMAL_TEXT | LIST id=kix.list.47 level=0]
P1: extensão posterior, adicionada somente após estabilidade do núcleo.

[P00534 | 24566:24637 | NORMAL_TEXT | LIST id=kix.list.47 level=0]
Ator principal: pessoa responsável por iniciar ou concluir o objetivo.

[P00535 | 24637:24723 | NORMAL_TEXT | LIST id=kix.list.47 level=0]
Copiloto de IA: componente que produz transcrição, síntese ou rascunho; nunca aprova.

[P00536 | 24723:24730 | HEADING_2]
Resumo

[P00537 | 24733:24736 | NORMAL_TEXT | TABLE row=0 col=0]
ID

[P00538 | 24737:24749 | NORMAL_TEXT | TABLE row=0 col=1]
Caso de uso

[P00539 | 24750:24761 | NORMAL_TEXT | TABLE row=0 col=2]
Prioridade

[P00540 | 24762:24777 | NORMAL_TEXT | TABLE row=0 col=3]
Ator principal

[P00541 | 24779:24785 | NORMAL_TEXT | TABLE row=1 col=0]
UC-00

[P00542 | 24786:24843 | NORMAL_TEXT | TABLE row=1 col=1]
Autenticar médico, vincular paciente e controlar convite

[P00543 | 24844:24850 | NORMAL_TEXT | TABLE row=1 col=2]
MVP-1

[P00544 | 24851:24858 | NORMAL_TEXT | TABLE row=1 col=3]
Médico

[P00545 | 24860:24866 | NORMAL_TEXT | TABLE row=2 col=0]
UC-01

[P00546 | 24867:24908 | NORMAL_TEXT | TABLE row=2 col=1]
Ativar conta e registrar ciência/aceites

[P00547 | 24909:24915 | NORMAL_TEXT | TABLE row=2 col=2]
MVP-1

[P00548 | 24916:24925 | NORMAL_TEXT | TABLE row=2 col=3]
Paciente

[P00549 | 24927:24933 | NORMAL_TEXT | TABLE row=3 col=0]
UC-02

[P00550 | 24934:24971 | NORMAL_TEXT | TABLE row=3 col=1]
Completar cadastro mínimo e objetivo

[P00551 | 24972:24978 | NORMAL_TEXT | TABLE row=3 col=2]
MVP-1

[P00552 | 24979:24988 | NORMAL_TEXT | TABLE row=3 col=3]
Paciente

[P00553 | 24990:24996 | NORMAL_TEXT | TABLE row=4 col=0]
UC-03

[P00554 | 24997:25019 | NORMAL_TEXT | TABLE row=4 col=1]
Realizar pré-consulta

[P00555 | 25020:25026 | NORMAL_TEXT | TABLE row=4 col=2]
MVP-1

[P00556 | 25027:25036 | NORMAL_TEXT | TABLE row=4 col=3]
Paciente

[P00557 | 25038:25044 | NORMAL_TEXT | TABLE row=5 col=0]
UC-04

[P00558 | 25045:25082 | NORMAL_TEXT | TABLE row=5 col=1]
Revisar painel e preparar a consulta

[P00559 | 25083:25089 | NORMAL_TEXT | TABLE row=5 col=2]
MVP-1

[P00560 | 25090:25097 | NORMAL_TEXT | TABLE row=5 col=3]
Médico

[P00561 | 25099:25105 | NORMAL_TEXT | TABLE row=6 col=0]
UC-05

[P00562 | 25106:25138 | NORMAL_TEXT | TABLE row=6 col=1]
Consultar o dossiê longitudinal

[P00563 | 25139:25145 | NORMAL_TEXT | TABLE row=6 col=2]
MVP-1

[P00564 | 25146:25153 | NORMAL_TEXT | TABLE row=6 col=3]
Médico

[P00565 | 25155:25161 | NORMAL_TEXT | TABLE row=7 col=0]
UC-06

[P00566 | 25162:25195 | NORMAL_TEXT | TABLE row=7 col=1]
Criar e aprovar uma nota clínica

[P00567 | 25196:25202 | NORMAL_TEXT | TABLE row=7 col=2]
MVP-1

[P00568 | 25203:25210 | NORMAL_TEXT | TABLE row=7 col=3]
Médico

[P00569 | 25212:25218 | NORMAL_TEXT | TABLE row=8 col=0]
UC-07

[P00570 | 25219:25255 | NORMAL_TEXT | TABLE row=8 col=1]
Criar e publicar o plano de cuidado

[P00571 | 25256:25262 | NORMAL_TEXT | TABLE row=8 col=2]
MVP-1

[P00572 | 25263:25270 | NORMAL_TEXT | TABLE row=8 col=3]
Médico

[P00573 | 25272:25278 | NORMAL_TEXT | TABLE row=9 col=0]
UC-08

[P00574 | 25279:25298 | NORMAL_TEXT | TABLE row=9 col=1]
Registrar check-in

[P00575 | 25299:25305 | NORMAL_TEXT | TABLE row=9 col=2]
MVP-2

[P00576 | 25306:25315 | NORMAL_TEXT | TABLE row=9 col=3]
Paciente

[P00577 | 25317:25323 | NORMAL_TEXT | TABLE row=10 col=0]
UC-09

[P00578 | 25324:25362 | NORMAL_TEXT | TABLE row=10 col=1]
Revisar e resolver um item de atenção

[P00579 | 25363:25369 | NORMAL_TEXT | TABLE row=10 col=2]
MVP-2

[P00580 | 25370:25377 | NORMAL_TEXT | TABLE row=10 col=3]
Médico

[P00581 | 25379:25386 | NORMAL_TEXT | TABLE row=11 col=0]
UC-10A

[P00582 | 25387:25413 | NORMAL_TEXT | TABLE row=11 col=1]
Visualizar plano aprovado

[P00583 | 25414:25420 | NORMAL_TEXT | TABLE row=11 col=2]
MVP-1

[P00584 | 25421:25430 | NORMAL_TEXT | TABLE row=11 col=3]
Paciente

[P00585 | 25432:25439 | NORMAL_TEXT | TABLE row=12 col=0]
UC-10B

[P00586 | 25440:25472 | NORMAL_TEXT | TABLE row=12 col=1]
Visualizar histórico e evolução

[P00587 | 25473:25479 | NORMAL_TEXT | TABLE row=12 col=2]
MVP-2

[P00588 | 25480:25489 | NORMAL_TEXT | TABLE row=12 col=3]
Paciente

[P00589 | 25491:25497 | NORMAL_TEXT | TABLE row=13 col=0]
UC-11

[P00590 | 25498:25542 | NORMAL_TEXT | TABLE row=13 col=1]
Gerenciar privacidade e direitos do titular

[P00591 | 25543:25587 | NORMAL_TEXT | TABLE row=13 col=2]
Processo obrigatório; autosserviço opcional

[P00592 | 25588:25597 | NORMAL_TEXT | TABLE row=13 col=3]
Paciente

[P00593 | 25599:25605 | NORMAL_TEXT | TABLE row=14 col=0]
UC-12

[P00594 | 25606:25643 | NORMAL_TEXT | TABLE row=14 col=1]
Gerar relatório explicativo de exame

[P00595 | 25644:25647 | NORMAL_TEXT | TABLE row=14 col=2]
P1

[P00596 | 25648:25655 | NORMAL_TEXT | TABLE row=14 col=3]
Médico

[P00597 | 25657:25663 | NORMAL_TEXT | TABLE row=15 col=0]
UC-13

[P00598 | 25664:25694 | NORMAL_TEXT | TABLE row=15 col=1]
Transcrever áudio de consulta

[P00599 | 25695:25698 | NORMAL_TEXT | TABLE row=15 col=2]
P1

[P00600 | 25699:25706 | NORMAL_TEXT | TABLE row=15 col=3]
Médico

[P00601 | 25708:25714 | NORMAL_TEXT | TABLE row=16 col=0]
UC-14

[P00602 | 25715:25750 | NORMAL_TEXT | TABLE row=16 col=1]
Trocar mensagens dentro do Vivance

[P00603 | 25751:25754 | NORMAL_TEXT | TABLE row=16 col=2]
P1

[P00604 | 25755:25771 | NORMAL_TEXT | TABLE row=16 col=3]
Paciente/Médico

[P00605 | 25772:25773 | NORMAL_TEXT]
⟦EMPTY PARAGRAPH⟧

[P00606 | 25773:25838 | HEADING_2]
UC-00 — Autenticar médico, vincular paciente e controlar convite

[P00607 | 25838:25857 | NORMAL_TEXT | LIST id=kix.list.48 level=0]
Prioridade: MVP-1.

[P00608 | 25857:25883 | NORMAL_TEXT | LIST id=kix.list.48 level=0]
Atores: médico e sistema.

[P00609 | 25883:25988 | NORMAL_TEXT | LIST id=kix.list.48 level=0]
Objetivo: garantir que a pré-consulta seja enviada à pessoa correta e que o vínculo possa ser encerrado.

[P00610 | 25988:26089 | NORMAL_TEXT | LIST id=kix.list.48 level=0]
Pré-condições: perfil do Dr. Guilherme verificado; MFA configurado; política de identidade definida.

[P00611 | 26089:26158 | NORMAL_TEXT | LIST id=kix.list.48 level=0]
Gatilho: médico acessa o painel ou inicia a inclusão de um paciente.

[P00612 | 26158:26174 | HEADING_3]
Fluxo principal

[P00613 | 26174:26202 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
O médico autentica com MFA.

[P00614 | 26202:26248 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
Busca o paciente por identificadores mínimos.

[P00615 | 26248:26312 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
O sistema verifica possível duplicidade e referências externas.

[P00616 | 26312:26361 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
O médico confirma a identidade e cria o vínculo.

[P00617 | 26361:26431 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
Define manualmente o período ou atendimento associado à pré-consulta.

[P00618 | 26431:26492 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
O sistema gera convite individual, expirável e de uso único.

[P00619 | 26492:26532 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
O médico acompanha o status do convite.

[P00620 | 26532:26588 | NORMAL_TEXT | LIST id=kix.list.49 level=0]
Quando necessário, revoga o convite ou o acesso futuro.

[P00621 | 26588:26597 | HEADING_3]
Exceções

[P00622 | 26597:26619 | NORMAL_TEXT | LIST id=kix.list.50 level=0]
Possível duplicidade.

[P00623 | 26619:26642 | NORMAL_TEXT | LIST id=kix.list.50 level=0]
Paciente já vinculado.

[P00624 | 26642:26661 | NORMAL_TEXT | LIST id=kix.list.50 level=0]
Contato incorreto.

[P00625 | 26661:26679 | NORMAL_TEXT | LIST id=kix.list.50 level=0]
Convite expirado.

[P00626 | 26679:26723 | NORMAL_TEXT | LIST id=kix.list.50 level=0]
Conta do médico sem MFA ou sessão expirada.

[P00627 | 26723:26737 | HEADING_3]
Pós-condições

[P00628 | 26737:26796 | NORMAL_TEXT | LIST id=kix.list.51 level=0]
Vínculo auditável e convite associado ao paciente correto.

[P00629 | 26796:26815 | HEADING_3]
Participação da IA

[P00630 | 26815:26885 | NORMAL_TEXT]
Nenhuma. Identidade, vínculo, convite e revogação não dependem de IA.

[P00631 | 26885:26908 | HEADING_3]
Critérios de aceitação

[P00632 | 26908:26941 | NORMAL_TEXT | LIST id=kix.list.52 level=0]
MFA é obrigatório para o médico.

[P00633 | 26941:26991 | NORMAL_TEXT | LIST id=kix.list.52 level=0]
Duplicidades exigem confirmação antes da criação.

[P00634 | 26991:27025 | NORMAL_TEXT | LIST id=kix.list.52 level=0]
Convite não expõe dados clínicos.

[P00635 | 27025:27105 | NORMAL_TEXT | LIST id=kix.list.52 level=0]
Revogação invalida convites pendentes e impede novos acessos conforme política.

[P00636 | 27105:27149 | NORMAL_TEXT | LIST id=kix.list.52 level=0]
Vínculo, revogação e envio ficam auditados.

[P00637 | 27149:27198 | HEADING_2]
UC-01 — Ativar conta e registrar ciência/aceites

[P00638 | 27198:27217 | NORMAL_TEXT | LIST id=kix.list.53 level=0]
Prioridade: MVP-1.

[P00639 | 27217:27253 | NORMAL_TEXT | LIST id=kix.list.53 level=0]
Atores: paciente, médico e sistema.

[P00640 | 27253:27358 | NORMAL_TEXT | LIST id=kix.list.53 level=0]
Objetivo: permitir acesso seguro e registrar ciência, termos e consentimentos somente quando aplicáveis.

[P00641 | 27358:27446 | NORMAL_TEXT | LIST id=kix.list.53 level=0]
Pré-condições: paciente convidado; textos legais, finalidades e bases legais definidos.

[P00642 | 27446:27491 | NORMAL_TEXT | LIST id=kix.list.53 level=0]
Gatilho: paciente abre o convite individual.

[P00643 | 27491:27507 | HEADING_3]
Fluxo principal

[P00644 | 27507:27569 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
O paciente abre um link individual, expirável e de uso único.

[P00645 | 27569:27618 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
Confirma sua identidade e cria suas credenciais.

[P00646 | 27618:27668 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
Lê o aviso de privacidade e os termos aplicáveis.

[P00647 | 27668:27715 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
Registra ciência do aviso e aceite dos termos.

[P00648 | 27715:27830 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
Manifesta consentimento separado apenas para finalidades em que ele seja a base aplicável, como gravação opcional.

[P00649 | 27830:27896 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
É informado sobre o uso de IA ligado ao cuidado e pode recusá-lo.

[P00650 | 27896:27984 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
O sistema registra documento, versão, finalidade, base aplicável, data, hora e usuário.

[P00651 | 27984:28045 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
A conta é vinculada ao Dr. Guilherme e ao Instituto Vivance.

[P00652 | 28045:28090 | NORMAL_TEXT | LIST id=kix.list.54 level=0]
O paciente é direcionado ao cadastro mínimo.

[P00653 | 28090:28099 | HEADING_3]
Exceções

[P00654 | 28099:28143 | NORMAL_TEXT | LIST id=kix.list.55 level=0]
Convite expirado, inválido ou já utilizado.

[P00655 | 28143:28187 | NORMAL_TEXT | LIST id=kix.list.55 level=0]
E-mail ou telefone vinculado a outra conta.

[P00656 | 28187:28283 | NORMAL_TEXT | LIST id=kix.list.55 level=0]
Recusa de gravação, de uso de IA no cuidado ou de outro processamento baseado em consentimento.

[P00657 | 28283:28300 | NORMAL_TEXT | LIST id=kix.list.55 level=0]
Sessão expirada.

[P00658 | 28300:28314 | HEADING_3]
Pós-condições

[P00659 | 28314:28339 | NORMAL_TEXT | LIST id=kix.list.56 level=0]
Conta ativa e vinculada.

[P00660 | 28339:28408 | NORMAL_TEXT | LIST id=kix.list.56 level=0]
Registros de ciência, aceite e consentimentos aplicáveis auditáveis.

[P00661 | 28408:28486 | NORMAL_TEXT | LIST id=kix.list.56 level=0]
Nenhum dado clínico liberado antes da autenticação e dos aceites necessários.

[P00662 | 28486:28505 | HEADING_3]
Participação da IA

[P00663 | 28505:28571 | NORMAL_TEXT]
Nenhuma decisão. A ativação e o consentimento não dependem de IA.

[P00664 | 28571:28594 | HEADING_3]
Critérios de aceitação

[P00665 | 28594:28636 | NORMAL_TEXT | LIST id=kix.list.57 level=0]
Um convite válido ativa apenas uma conta.

[P00666 | 28636:28714 | NORMAL_TEXT | LIST id=kix.list.57 level=0]
O paciente não acessa dados de outro paciente alterando URL ou identificador.

[P00667 | 28714:28778 | NORMAL_TEXT | LIST id=kix.list.57 level=0]
Ciência, termos e consentimentos são armazenados separadamente.

[P00668 | 28778:28832 | NORMAL_TEXT | LIST id=kix.list.57 level=0]
Cada registro possui versão, finalidade, data e hora.

[P00669 | 28832:28903 | NORMAL_TEXT | LIST id=kix.list.57 level=0]
Consentimentos podem ser recusados sem serem registrados como aceitos.

[P00670 | 28903:29000 | NORMAL_TEXT | LIST id=kix.list.57 level=0]
A recusa do uso de IA no cuidado ativa um fluxo integralmente manual, sem impedir o atendimento.

[P00671 | 29000:29063 | NORMAL_TEXT | LIST id=kix.list.57 level=0]
A revogação posterior pode ser relacionada ao aceite original.

[P00672 | 29063:29108 | HEADING_2]
UC-02 — Completar cadastro mínimo e objetivo

[P00673 | 29108:29127 | NORMAL_TEXT | LIST id=kix.list.58 level=0]
Prioridade: MVP-1.

[P00674 | 29127:29155 | NORMAL_TEXT | LIST id=kix.list.58 level=0]
Atores: paciente e sistema.

[P00675 | 29155:29233 | NORMAL_TEXT | LIST id=kix.list.58 level=0]
Objetivo: coletar somente os dados necessários para iniciar o acompanhamento.

[P00676 | 29233:29261 | NORMAL_TEXT | LIST id=kix.list.58 level=0]
Pré-condições: conta ativa.

[P00677 | 29261:29308 | NORMAL_TEXT | LIST id=kix.list.58 level=0]
Gatilho: primeiro acesso ou perfil incompleto.

[P00678 | 29308:29324 | HEADING_3]
Fluxo principal

[P00679 | 29324:29379 | NORMAL_TEXT | LIST id=kix.list.59 level=0]
O paciente informa nome, data de nascimento e contato.

[P00680 | 29379:29440 | NORMAL_TEXT | LIST id=kix.list.59 level=0]
O sistema apresenta os dados já conhecidos para confirmação.

[P00681 | 29440:29499 | NORMAL_TEXT | LIST id=kix.list.59 level=0]
O paciente descreve seu objetivo principal em texto livre.

[P00682 | 29499:29547 | NORMAL_TEXT | LIST id=kix.list.59 level=0]
O sistema salva o texto original integralmente.

[P00683 | 29547:29623 | NORMAL_TEXT | LIST id=kix.list.59 level=0]
A IA pode produzir uma versão curta do objetivo, identificada como síntese.

[P00684 | 29623:29652 | NORMAL_TEXT | LIST id=kix.list.59 level=0]
O paciente revisa e conclui.

[P00685 | 29652:29661 | HEADING_3]
Exceções

[P00686 | 29661:29688 | NORMAL_TEXT | LIST id=kix.list.60 level=0]
Campo obrigatório ausente.

[P00687 | 29688:29722 | NORMAL_TEXT | LIST id=kix.list.60 level=0]
Possível duplicidade de paciente.

[P00688 | 29722:29771 | NORMAL_TEXT | LIST id=kix.list.60 level=0]
Informação conflitante com um vínculo existente.

[P00689 | 29771:29785 | HEADING_3]
Pós-condições

[P00690 | 29785:29807 | NORMAL_TEXT | LIST id=kix.list.61 level=0]
Perfil mínimo criado.

[P00691 | 29807:29871 | NORMAL_TEXT | LIST id=kix.list.61 level=0]
Objetivo original e eventual síntese preservados separadamente.

[P00692 | 29871:29890 | HEADING_3]
Participação da IA

[P00693 | 29890:29960 | NORMAL_TEXT]
Pode resumir o objetivo sem substituir o texto escrito pelo paciente.

[P00694 | 29960:29983 | HEADING_3]
Critérios de aceitação

[P00695 | 29983:30034 | NORMAL_TEXT | LIST id=kix.list.62 level=0]
O texto original nunca é sobrescrito pela síntese.

[P00696 | 30034:30107 | NORMAL_TEXT | LIST id=kix.list.62 level=0]
O sistema diferencia dado fornecido pelo paciente e texto gerado por IA.

[P00697 | 30107:30185 | NORMAL_TEXT | LIST id=kix.list.62 level=0]
Campos já mantidos oficialmente no Feegow não são duplicados sem necessidade.

[P00698 | 30185:30261 | NORMAL_TEXT | LIST id=kix.list.62 level=0]
O identificador externo do Feegow é opcional e validado antes de ser salvo.

[P00699 | 30261:30291 | HEADING_2]
UC-03 — Realizar pré-consulta

[P00700 | 30291:30310 | NORMAL_TEXT | LIST id=kix.list.63 level=0]
Prioridade: MVP-1.

[P00701 | 30310:30362 | NORMAL_TEXT | LIST id=kix.list.63 level=0]
Atores: paciente, médico, sistema e copiloto de IA.

[P00702 | 30362:30423 | NORMAL_TEXT | LIST id=kix.list.63 level=0]
Objetivo: coletar e organizar informações antes da consulta.

[P00703 | 30423:30502 | NORMAL_TEXT | LIST id=kix.list.63 level=0]
Pré-condições: paciente autenticado; questionário aprovado pelo Dr. Guilherme.

[P00704 | 30502:30594 | NORMAL_TEXT | LIST id=kix.list.63 level=0]
Gatilho: paciente inicia uma pré-consulta vinculada a um atendimento ou período de revisão.

[P00705 | 30594:30610 | HEADING_3]
Fluxo principal

[P00706 | 30610:30685 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
O sistema explica a finalidade e informa que não é um canal de emergência.

[P00707 | 30685:30717 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
Apresenta uma pergunta por vez.

[P00708 | 30717:30748 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
O paciente responde por texto.

[P00709 | 30748:30785 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
O progresso é salvo automaticamente.

[P00710 | 30785:30823 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
O paciente revisa todas as respostas.

[P00711 | 30823:30845 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
Envia a versão final.

[P00712 | 30845:30912 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
A IA organiza as respostas, identifica lacunas e gera uma síntese.

[P00713 | 30912:30984 | NORMAL_TEXT | LIST id=kix.list.64 level=0]
O médico recebe respostas originais e síntese, com vínculo entre ambas.

[P00714 | 30984:30993 | HEADING_3]
Exceções

[P00715 | 30993:31021 | NORMAL_TEXT | LIST id=kix.list.65 level=0]
Preenchimento interrompido.

[P00716 | 31021:31038 | NORMAL_TEXT | LIST id=kix.list.65 level=0]
Conexão perdida.

[P00717 | 31038:31059 | NORMAL_TEXT | LIST id=kix.list.65 level=0]
Resposta incompleta.

[P00718 | 31059:31072 | NORMAL_TEXT | LIST id=kix.list.65 level=0]
Falha da IA.

[P00719 | 31072:31143 | NORMAL_TEXT | LIST id=kix.list.65 level=0]
Paciente recusou IA: respostas originais seguem ao médico sem síntese.

[P00720 | 31143:31157 | HEADING_3]
Pós-condições

[P00721 | 31157:31190 | NORMAL_TEXT | LIST id=kix.list.66 level=0]
Pré-consulta com status enviada.

[P00722 | 31190:31230 | NORMAL_TEXT | LIST id=kix.list.66 level=0]
Conteúdo original disponível ao médico.

[P00723 | 31230:31261 | NORMAL_TEXT | LIST id=kix.list.66 level=0]
Síntese marcada como rascunho.

[P00724 | 31261:31280 | HEADING_3]
Participação da IA

[P00725 | 31280:31412 | NORMAL_TEXT]
Resumir, organizar e indicar pontos a confirmar. Não diagnosticar, priorizar clinicamente de forma autônoma ou orientar tratamento.

[P00726 | 31412:31435 | HEADING_3]
Critérios de aceitação

[P00727 | 31435:31484 | NORMAL_TEXT | LIST id=kix.list.67 level=0]
O paciente retoma um preenchimento interrompido.

[P00728 | 31484:31546 | NORMAL_TEXT | LIST id=kix.list.67 level=0]
Respostas incompletas não são apresentadas como versão final.

[P00729 | 31546:31584 | NORMAL_TEXT | LIST id=kix.list.67 level=0]
A submissão gera confirmação visível.

[P00730 | 31584:31645 | NORMAL_TEXT | LIST id=kix.list.67 level=0]
Cada item da síntese permite localizar a resposta de origem.

[P00731 | 31645:31715 | NORMAL_TEXT | LIST id=kix.list.67 level=0]
A falha da IA não impede o envio e a leitura das respostas originais.

[P00732 | 31715:31809 | NORMAL_TEXT | LIST id=kix.list.67 level=0]
A orientação de emergência aparece de forma permanente e não depende de um detector de texto.

[P00733 | 31809:31876 | NORMAL_TEXT | LIST id=kix.list.67 level=0]
Voz fica fora do MVP-1; texto é o caminho obrigatório e funcional.

[P00734 | 31876:31921 | HEADING_2]
UC-04 — Revisar painel e preparar a consulta

[P00735 | 31921:31940 | NORMAL_TEXT | LIST id=kix.list.68 level=0]
Prioridade: MVP-1.

[P00736 | 31940:31982 | NORMAL_TEXT | LIST id=kix.list.68 level=0]
Atores: médico, sistema e copiloto de IA.

[P00737 | 31982:32073 | NORMAL_TEXT | LIST id=kix.list.68 level=0]
Objetivo: apresentar rapidamente as pendências e o contexto necessário para o atendimento.

[P00738 | 32073:32130 | NORMAL_TEXT | LIST id=kix.list.68 level=0]
Pré-condições: médico autenticado; pacientes vinculados.

[P00739 | 32130:32166 | NORMAL_TEXT | LIST id=kix.list.68 level=0]
Gatilho: médico abre a visão geral.

[P00740 | 32166:32182 | HEADING_3]
Fluxo principal

[P00741 | 32182:32280 | NORMAL_TEXT | LIST id=kix.list.69 level=0]
O sistema apresenta pacientes com pré-consulta pronta ou pendente e rascunhos aguardando revisão.

[P00742 | 32280:32320 | NORMAL_TEXT | LIST id=kix.list.69 level=0]
Cada item mostra motivo, data e status.

[P00743 | 32320:32361 | NORMAL_TEXT | LIST id=kix.list.69 level=0]
O médico busca ou seleciona um paciente.

[P00744 | 32361:32392 | NORMAL_TEXT | LIST id=kix.list.69 level=0]
O dossiê é aberto diretamente.

[P00745 | 32392:32434 | NORMAL_TEXT | LIST id=kix.list.69 level=0]
A IA mostra um resumo recente com fontes.

[P00746 | 32434:32480 | NORMAL_TEXT | LIST id=kix.list.69 level=0]
O médico valida os pontos que deseja abordar.

[P00747 | 32480:32489 | HEADING_3]
Exceções

[P00748 | 32489:32513 | NORMAL_TEXT | LIST id=kix.list.70 level=0]
Paciente sem histórico.

[P00749 | 32513:32541 | NORMAL_TEXT | LIST id=kix.list.70 level=0]
Pré-consulta não concluída.

[P00750 | 32541:32562 | NORMAL_TEXT | LIST id=kix.list.70 level=0]
Resumo indisponível.

[P00751 | 32562:32586 | NORMAL_TEXT | LIST id=kix.list.70 level=0]
Informação conflitante.

[P00752 | 32586:32600 | HEADING_3]
Pós-condições

[P00753 | 32600:32663 | NORMAL_TEXT | LIST id=kix.list.71 level=0]
Médico preparado com acesso às fontes, sem depender do resumo.

[P00754 | 32663:32682 | HEADING_3]
Participação da IA

[P00755 | 32682:32770 | NORMAL_TEXT]
Sintetizar fatos registrados e apontar lacunas. Não determinar diagnóstico ou urgência.

[P00756 | 32770:32793 | HEADING_3]
Critérios de aceitação

[P00757 | 32793:32829 | NORMAL_TEXT | LIST id=kix.list.72 level=0]
Cada pendência exibe motivo e data.

[P00758 | 32829:32865 | NORMAL_TEXT | LIST id=kix.list.72 level=0]
Clicar no paciente abre seu dossiê.

[P00759 | 32865:32915 | NORMAL_TEXT | LIST id=kix.list.72 level=0]
Ausência de informação é mostrada explicitamente.

[P00760 | 32915:32962 | NORMAL_TEXT | LIST id=kix.list.72 level=0]
Conteúdo gerado por IA é visualmente distinto.

[P00761 | 32962:33019 | NORMAL_TEXT | LIST id=kix.list.72 level=0]
Notas internas do médico não ficam visíveis ao paciente.

[P00762 | 33019:33075 | NORMAL_TEXT | LIST id=kix.list.72 level=0]
Uma agenda completa do Feegow não é requisito do MVP-1.

[P00763 | 33075:33115 | HEADING_2]
UC-05 — Consultar o dossiê longitudinal

[P00764 | 33115:33134 | NORMAL_TEXT | LIST id=kix.list.73 level=0]
Prioridade: MVP-1.

[P00765 | 33134:33160 | NORMAL_TEXT | LIST id=kix.list.73 level=0]
Atores: médico e sistema.

[P00766 | 33160:33240 | NORMAL_TEXT | LIST id=kix.list.73 level=0]
Objetivo: reunir o histórico relevante sem misturar origens e níveis de acesso.

[P00767 | 33240:33310 | NORMAL_TEXT | LIST id=kix.list.73 level=0]
Pré-condições: paciente vinculado e pelo menos um registro existente.

[P00768 | 33310:33343 | NORMAL_TEXT | LIST id=kix.list.73 level=0]
Gatilho: médico abre o paciente.

[P00769 | 33343:33359 | HEADING_3]
Fluxo principal

[P00770 | 33359:33415 | NORMAL_TEXT | LIST id=kix.list.74 level=0]
O sistema apresenta identificação e objetivo principal.

[P00771 | 33415:33453 | NORMAL_TEXT | LIST id=kix.list.74 level=0]
Exibe uma linha do tempo cronológica.

[P00772 | 33453:33521 | NORMAL_TEXT | LIST id=kix.list.74 level=0]
No MVP-1, o médico filtra por pré-consulta, consulta, nota e plano.

[P00773 | 33521:33560 | NORMAL_TEXT | LIST id=kix.list.74 level=0]
Abre o conteúdo original de cada item.

[P00774 | 33560:33604 | NORMAL_TEXT | LIST id=kix.list.74 level=0]
Consulta uma síntese longitudinal opcional.

[P00775 | 33604:33657 | NORMAL_TEXT | LIST id=kix.list.74 level=0]
Registra uma observação ou abre o workspace clínico.

[P00776 | 33657:33666 | HEADING_3]
Exceções

[P00777 | 33666:33690 | NORMAL_TEXT | LIST id=kix.list.75 level=0]
Histórico insuficiente.

[P00778 | 33690:33725 | NORMAL_TEXT | LIST id=kix.list.75 level=0]
Registro corrigido ou substituído.

[P00779 | 33725:33757 | NORMAL_TEXT | LIST id=kix.list.75 level=0]
Síntese falha ou desatualizada.

[P00780 | 33757:33771 | HEADING_3]
Pós-condições

[P00781 | 33771:33851 | NORMAL_TEXT | LIST id=kix.list.76 level=0]
Contexto acessado e evento de visualização sensível auditado conforme política.

[P00782 | 33851:33870 | HEADING_3]
Participação da IA

[P00783 | 33870:33985 | NORMAL_TEXT]
Gerar síntese descritiva com links às fontes; correlações devem ser apresentadas como hipótese, nunca causalidade.

[P00784 | 33985:34008 | HEADING_3]
Critérios de aceitação

[P00785 | 34008:34049 | NORMAL_TEXT | LIST id=kix.list.77 level=0]
Cada evento mostra data, autor e origem.

[P00786 | 34049:34104 | NORMAL_TEXT | LIST id=kix.list.77 level=0]
O médico consegue abrir as fontes usadas pela síntese.

[P00787 | 34104:34148 | NORMAL_TEXT | LIST id=kix.list.77 level=0]
Ausência de dados não é preenchida pela IA.

[P00788 | 34148:34216 | NORMAL_TEXT | LIST id=kix.list.77 level=0]
O paciente não acessa notas internas, rascunhos ou itens restritos.

[P00789 | 34216:34257 | NORMAL_TEXT | LIST id=kix.list.77 level=0]
Correções preservam histórico e autoria.

[P00790 | 34257:34298 | HEADING_2]
UC-06 — Criar e aprovar uma nota clínica

[P00791 | 34298:34317 | NORMAL_TEXT | LIST id=kix.list.78 level=0]
Prioridade: MVP-1.

[P00792 | 34317:34359 | NORMAL_TEXT | LIST id=kix.list.78 level=0]
Atores: médico, sistema e copiloto de IA.

[P00793 | 34359:34449 | NORMAL_TEXT | LIST id=kix.list.78 level=0]
Objetivo: reduzir o trabalho de documentação mantendo autoria e responsabilidade médicas.

[P00794 | 34449:34519 | NORMAL_TEXT | LIST id=kix.list.78 level=0]
Pré-condições: paciente selecionado; consulta ou encontro registrado.

[P00795 | 34519:34561 | NORMAL_TEXT | LIST id=kix.list.78 level=0]
Gatilho: médico abre o workspace clínico.

[P00796 | 34561:34577 | HEADING_3]
Fluxo principal

[P00797 | 34577:34629 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
O médico vê a pré-consulta e o resumo longitudinal.

[P00798 | 34629:34708 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Registra notas manualmente ou cola uma transcrição obtida por meio autorizado.

[P00799 | 34708:34744 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Solicita a organização do conteúdo.

[P00800 | 34744:34779 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
A IA gera um rascunho estruturado.

[P00801 | 34779:34822 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
O médico compara o rascunho com as fontes.

[P00802 | 34822:34871 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Edita, complementa, rejeita ou gera nova versão.

[P00803 | 34871:34909 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Aprova explicitamente a versão final.

[P00804 | 34909:34996 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Confere nome completo, data de nascimento e identificador do Feegow quando disponível.

[P00805 | 34996:35043 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Confirma explicitamente o paciente de destino.

[P00806 | 35043:35091 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Copia ou exporta a nota aprovada para o Feegow.

[P00807 | 35091:35179 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Registra na nota destinada ao Feegow que houve apoio de IA, conforme processo aprovado.

[P00808 | 35179:35218 | NORMAL_TEXT | LIST id=kix.list.79 level=0]
Confirma que realizou a transferência.

[P00809 | 35218:35227 | HEADING_3]
Exceções

[P00810 | 35227:35244 | NORMAL_TEXT | LIST id=kix.list.80 level=0]
IA indisponível.

[P00811 | 35244:35294 | NORMAL_TEXT | LIST id=kix.list.80 level=0]
Paciente recusou IA: nota é integralmente manual.

[P00812 | 35294:35329 | NORMAL_TEXT | LIST id=kix.list.80 level=0]
Fonte incompleta ou contraditória.

[P00813 | 35329:35359 | NORMAL_TEXT | LIST id=kix.list.80 level=0]
Conteúdo sem rastreabilidade.

[P00814 | 35359:35377 | NORMAL_TEXT | LIST id=kix.list.80 level=0]
Exportação falha.

[P00815 | 35377:35415 | NORMAL_TEXT | LIST id=kix.list.80 level=0]
Integração com Feegow não homologada.

[P00816 | 35415:35429 | HEADING_3]
Pós-condições

[P00817 | 35429:35468 | NORMAL_TEXT | LIST id=kix.list.81 level=0]
Nota aprovada, versionada e auditável.

[P00818 | 35468:35544 | NORMAL_TEXT | LIST id=kix.list.81 level=0]
Registro da transferência manual, sem alegação de sincronização automática.

[P00819 | 35544:35563 | HEADING_3]
Participação da IA

[P00820 | 35563:35679 | NORMAL_TEXT]
Estruturar somente informações presentes nas fontes. Não inventar diagnóstico, medicamento, dose, exame ou conduta.

[P00821 | 35679:35702 | HEADING_3]
Critérios de aceitação

[P00822 | 35702:35734 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
O fluxo manual funciona sem IA.

[P00823 | 35734:35781 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
O rascunho nunca é exibido como nota assinada.

[P00824 | 35781:35830 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
Campo sem evidência permanece vazio ou pendente.

[P00825 | 35830:35909 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
Diagnóstico e conduta aparecem apenas se inseridos ou confirmados pelo médico.

[P00826 | 35909:35959 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
A aprovação registra médico, data, hora e versão.

[P00827 | 35959:36062 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
O uso de IA é informado ao paciente e registrado no prontuário conforme a Resolução CFM nº 2.454/2026.

[P00828 | 36062:36177 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
A exportação exige confirmação por pelo menos dois identificadores do paciente e pelo ID Feegow quando disponível.

[P00829 | 36177:36226 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
Divergência de identidade bloqueia a exportação.

[P00830 | 36226:36274 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
Alteração posterior gera nova versão ou adendo.

[P00831 | 36274:36338 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
A interface não informa “sincronizado” sem confirmação técnica.

[P00832 | 36338:36391 | NORMAL_TEXT | LIST id=kix.list.82 level=0]
A versão aprovada não é sobrescrita silenciosamente.

[P00833 | 36391:36435 | HEADING_2]
UC-07 — Criar e publicar o plano de cuidado

[P00834 | 36435:36454 | NORMAL_TEXT | LIST id=kix.list.83 level=0]
Prioridade: MVP-1.

[P00835 | 36454:36506 | NORMAL_TEXT | LIST id=kix.list.83 level=0]
Atores: médico, paciente, sistema e copiloto de IA.

[P00836 | 36506:36578 | NORMAL_TEXT | LIST id=kix.list.83 level=0]
Objetivo: transformar decisões médicas em ações claras para o paciente.

[P00837 | 36578:36647 | NORMAL_TEXT | LIST id=kix.list.83 level=0]
Pré-condições: paciente vinculado; decisões registradas pelo médico.

[P00838 | 36647:36692 | NORMAL_TEXT | LIST id=kix.list.83 level=0]
Gatilho: médico inicia ou atualiza um plano.

[P00839 | 36692:36708 | HEADING_3]
Fluxo principal

[P00840 | 36708:36774 | NORMAL_TEXT | LIST id=kix.list.84 level=0]
O médico inicia o plano manualmente ou a partir da nota aprovada.

[P00841 | 36774:36816 | NORMAL_TEXT | LIST id=kix.list.84 level=0]
A IA organiza as orientações em rascunho.

[P00842 | 36816:36885 | NORMAL_TEXT | LIST id=kix.list.84 level=0]
O médico define objetivo, ações, frequência/prazo e data de revisão.

[P00843 | 36885:36902 | NORMAL_TEXT | LIST id=kix.list.84 level=0]
Revisa e aprova.

[P00844 | 36902:36919 | NORMAL_TEXT | LIST id=kix.list.84 level=0]
Publica o plano.

[P00845 | 36919:36990 | NORMAL_TEXT | LIST id=kix.list.84 level=0]
O paciente recebe notificação genérica, sem conteúdo clínico sensível.

[P00846 | 36990:37026 | NORMAL_TEXT | LIST id=kix.list.84 level=0]
O plano aparece na área Hoje/Plano.

[P00847 | 37026:37035 | HEADING_3]
Exceções

[P00848 | 37035:37053 | NORMAL_TEXT | LIST id=kix.list.85 level=0]
Plano incompleto.

[P00849 | 37053:37079 | NORMAL_TEXT | LIST id=kix.list.85 level=0]
Orientações conflitantes.

[P00850 | 37079:37100 | NORMAL_TEXT | LIST id=kix.list.85 level=0]
Rascunho abandonado.

[P00851 | 37100:37122 | NORMAL_TEXT | LIST id=kix.list.85 level=0]
Plano anterior ativo.

[P00852 | 37122:37139 | NORMAL_TEXT | LIST id=kix.list.85 level=0]
IA indisponível.

[P00853 | 37139:37191 | NORMAL_TEXT | LIST id=kix.list.85 level=0]
Paciente recusou IA: plano é elaborado manualmente.

[P00854 | 37191:37205 | HEADING_3]
Pós-condições

[P00855 | 37205:37260 | NORMAL_TEXT | LIST id=kix.list.86 level=0]
Uma única versão ativa e aprovada visível ao paciente.

[P00856 | 37260:37282 | NORMAL_TEXT | LIST id=kix.list.86 level=0]
Histórico preservado.

[P00857 | 37282:37301 | HEADING_3]
Participação da IA

[P00858 | 37301:37387 | NORMAL_TEXT]
Organizar decisões já registradas. Não criar prescrição, dose ou mudança terapêutica.

[P00859 | 37387:37410 | HEADING_3]
Critérios de aceitação

[P00860 | 37410:37450 | NORMAL_TEXT | LIST id=kix.list.87 level=0]
Rascunhos não são visíveis ao paciente.

[P00861 | 37450:37488 | NORMAL_TEXT | LIST id=kix.list.87 level=0]
Apenas o médico publica ou substitui.

[P00862 | 37488:37538 | NORMAL_TEXT | LIST id=kix.list.87 level=0]
A publicação registra autor, data, hora e versão.

[P00863 | 37538:37601 | NORMAL_TEXT | LIST id=kix.list.87 level=0]
Substituição preserva o plano anterior e identifica o vigente.

[P00864 | 37601:37647 | NORMAL_TEXT | LIST id=kix.list.87 level=0]
Sugestão da IA não altera um plano publicado.

[P00865 | 37647:37700 | NORMAL_TEXT | LIST id=kix.list.87 level=0]
Prescrição e receita digital ficam fora deste fluxo.

[P00866 | 37700:37727 | HEADING_2]
UC-08 — Registrar check-in

[P00867 | 37727:37746 | NORMAL_TEXT | LIST id=kix.list.88 level=0]
Prioridade: MVP-2.

[P00868 | 37746:37782 | NORMAL_TEXT | LIST id=kix.list.88 level=0]
Atores: paciente, médico e sistema.

[P00869 | 37782:37849 | NORMAL_TEXT | LIST id=kix.list.88 level=0]
Objetivo: captar sinais simples entre consultas com baixo esforço.

[P00870 | 37849:37911 | NORMAL_TEXT | LIST id=kix.list.88 level=0]
Pré-condições: plano ativo ou protocolo de check-in aprovado.

[P00871 | 37911:37955 | NORMAL_TEXT | LIST id=kix.list.88 level=0]
Gatilho: paciente abre o check-in previsto.

[P00872 | 37955:37971 | HEADING_3]
Fluxo principal

[P00873 | 37971:38009 | NORMAL_TEXT | LIST id=kix.list.89 level=0]
O sistema apresenta formulário curto.

[P00874 | 38009:38054 | NORMAL_TEXT | LIST id=kix.list.89 level=0]
O paciente responde aos campos configurados.

[P00875 | 38054:38102 | NORMAL_TEXT | LIST id=kix.list.89 level=0]
O sistema valida formato e valores impossíveis.

[P00876 | 38102:38129 | NORMAL_TEXT | LIST id=kix.list.89 level=0]
O paciente revisa e envia.

[P00877 | 38129:38149 | NORMAL_TEXT | LIST id=kix.list.89 level=0]
Recebe confirmação.

[P00878 | 38149:38206 | NORMAL_TEXT | LIST id=kix.list.89 level=0]
O registro aparece na linha do tempo e no painel médico.

[P00879 | 38206:38267 | NORMAL_TEXT | LIST id=kix.list.89 level=0]
A ausência do check-in pode gerar uma pendência operacional.

[P00880 | 38267:38314 | HEADING_3]
Conjunto inicial sugerido, sujeito à validação

[P00881 | 38314:38348 | NORMAL_TEXT | LIST id=kix.list.90 level=0]
Peso informado, quando aplicável.

[P00882 | 38348:38366 | NORMAL_TEXT | LIST id=kix.list.90 level=0]
Adesão percebida.

[P00883 | 38366:38385 | NORMAL_TEXT | LIST id=kix.list.90 level=0]
Qualidade do sono.

[P00884 | 38385:38402 | NORMAL_TEXT | LIST id=kix.list.90 level=0]
Bem-estar geral.

[P00885 | 38402:38425 | NORMAL_TEXT | LIST id=kix.list.90 level=0]
Dificuldade principal.

[P00886 | 38425:38468 | NORMAL_TEXT | LIST id=kix.list.90 level=0]
Campo livre para algo que deseja discutir.

[P00887 | 38468:38477 | HEADING_3]
Exceções

[P00888 | 38477:38493 | NORMAL_TEXT | LIST id=kix.list.91 level=0]
Valor inválido.

[P00889 | 38493:38513 | NORMAL_TEXT | LIST id=kix.list.91 level=0]
Check-in duplicado.

[P00890 | 38513:38530 | NORMAL_TEXT | LIST id=kix.list.91 level=0]
Conexão perdida.

[P00891 | 38530:38561 | NORMAL_TEXT | LIST id=kix.list.91 level=0]
Campo opcional não respondido.

[P00892 | 38561:38575 | HEADING_3]
Pós-condições

[P00893 | 38575:38634 | NORMAL_TEXT | LIST id=kix.list.92 level=0]
Check-in datado, com origem identificada como autorrelato.

[P00894 | 38634:38653 | HEADING_3]
Participação da IA

[P00895 | 38653:38744 | NORMAL_TEXT]
Pode resumir tendências posteriormente. Não interpretar um sinal isolado como diagnóstico.

[P00896 | 38744:38767 | HEADING_3]
Critérios de aceitação

[P00897 | 38767:38821 | NORMAL_TEXT | LIST id=kix.list.93 level=0]
Formulário distingue campos obrigatórios e opcionais.

[P00898 | 38821:38865 | NORMAL_TEXT | LIST id=kix.list.93 level=0]
Falha de conexão não apaga o preenchimento.

[P00899 | 38865:38905 | NORMAL_TEXT | LIST id=kix.list.93 level=0]
O médico acessa cada resposta original.

[P00900 | 38905:38971 | NORMAL_TEXT | LIST id=kix.list.93 level=0]
Dado declarado não é apresentado como medição clínica confirmada.

[P00901 | 38971:39043 | NORMAL_TEXT | LIST id=kix.list.93 level=0]
Pendências operacionais exibem exatamente o evento e o critério usados.

[P00902 | 39043:39105 | NORMAL_TEXT | LIST id=kix.list.93 level=0]
A interface comunica que o sistema não é monitorado 24 horas.

[P00903 | 39105:39219 | NORMAL_TEXT | LIST id=kix.list.93 level=0]
Regras baseadas no conteúdo clínico das respostas não são ativadas sem avaliação de risco e validação específica.

[P00904 | 39219:39265 | HEADING_2]
UC-09 — Revisar e resolver um item de atenção

[P00905 | 39265:39284 | NORMAL_TEXT | LIST id=kix.list.94 level=0]
Prioridade: MVP-2.

[P00906 | 39284:39310 | NORMAL_TEXT | LIST id=kix.list.94 level=0]
Atores: médico e sistema.

[P00907 | 39310:39390 | NORMAL_TEXT | LIST id=kix.list.94 level=0]
Objetivo: organizar o trabalho por exceção sem criar uma falsa triagem clínica.

[P00908 | 39390:39443 | NORMAL_TEXT | LIST id=kix.list.94 level=0]
Pré-condições: regras aprovadas e dados suficientes.

[P00909 | 39443:39508 | NORMAL_TEXT | LIST id=kix.list.94 level=0]
Gatilho: uma regra explícita é atendida ou o médico abre a fila.

[P00910 | 39508:39524 | HEADING_3]
Fluxo principal

[P00911 | 39524:39577 | NORMAL_TEXT | LIST id=kix.list.95 level=0]
O sistema cria o item mostrando regra, fonte e data.

[P00912 | 39577:39603 | NORMAL_TEXT | LIST id=kix.list.95 level=0]
O médico abre o contexto.

[P00913 | 39603:39665 | NORMAL_TEXT | LIST id=kix.list.95 level=0]
Decide revisar, adiar, registrar contato externo ou encerrar.

[P00914 | 39665:39706 | NORMAL_TEXT | LIST id=kix.list.95 level=0]
Registra uma observação e a ação tomada.

[P00915 | 39706:39757 | NORMAL_TEXT | LIST id=kix.list.95 level=0]
Informa se o item foi relevante ou falso positivo.

[P00916 | 39757:39815 | NORMAL_TEXT | LIST id=kix.list.95 level=0]
O sistema atualiza o status e preserva o evento original.

[P00917 | 39815:39824 | HEADING_3]
Exceções

[P00918 | 39824:39840 | NORMAL_TEXT | LIST id=kix.list.96 level=0]
Item duplicado.

[P00919 | 39840:39861 | NORMAL_TEXT | LIST id=kix.list.96 level=0]
Regra desatualizada.

[P00920 | 39861:39877 | NORMAL_TEXT | LIST id=kix.list.96 level=0]
Dado corrigido.

[P00921 | 39877:39908 | NORMAL_TEXT | LIST id=kix.list.96 level=0]
Paciente sem canal de contato.

[P00922 | 39908:39922 | HEADING_3]
Pós-condições

[P00923 | 39922:39973 | NORMAL_TEXT | LIST id=kix.list.97 level=0]
Item tratado, adiado ou mantido com justificativa.

[P00924 | 39973:40015 | NORMAL_TEXT | LIST id=kix.list.97 level=0]
Feedback disponível para avaliar a regra.

[P00925 | 40015:40034 | HEADING_3]
Participação da IA

[P00926 | 40034:40165 | NORMAL_TEXT]
Pode resumir o contexto. No MVP-2, a fila depende de regra operacional explícita, não de score opaco ou interpretação de sintomas.

[P00927 | 40165:40188 | HEADING_3]
Critérios de aceitação

[P00928 | 40188:40227 | NORMAL_TEXT | LIST id=kix.list.98 level=0]
Todo item mostra motivo, fonte e data.

[P00929 | 40227:40274 | NORMAL_TEXT | LIST id=kix.list.98 level=0]
Duplicidades do mesmo evento são consolidadas.

[P00930 | 40274:40323 | NORMAL_TEXT | LIST id=kix.list.98 level=0]
Encerrar não apaga o evento que originou o item.

[P00931 | 40323:40360 | NORMAL_TEXT | LIST id=kix.list.98 level=0]
O médico registra ação e relevância.

[P00932 | 40360:40414 | NORMAL_TEXT | LIST id=kix.list.98 level=0]
O sistema não envia mensagem clínica automaticamente.

[P00933 | 40414:40498 | NORMAL_TEXT | LIST id=kix.list.98 level=0]
A interface não usa linguagem de diagnóstico, emergência ou monitoramento contínuo.

[P00934 | 40498:40533 | HEADING_2]
UC-10A — Visualizar plano aprovado

[P00935 | 40533:40552 | NORMAL_TEXT | LIST id=kix.list.99 level=0]
Prioridade: MVP-1.

[P00936 | 40552:40580 | NORMAL_TEXT | LIST id=kix.list.99 level=0]
Atores: paciente e sistema.

[P00937 | 40580:40660 | NORMAL_TEXT | LIST id=kix.list.99 level=0]
Objetivo: permitir que o paciente entenda o plano vigente aprovado pelo médico.

[P00938 | 40660:40717 | NORMAL_TEXT | LIST id=kix.list.99 level=0]
Pré-condições: paciente autenticado; conteúdo publicado.

[P00939 | 40717:40755 | NORMAL_TEXT | LIST id=kix.list.99 level=0]
Gatilho: paciente abre Hoje ou Plano.

[P00940 | 40755:40771 | HEADING_3]
Fluxo principal

[P00941 | 40771:40816 | NORMAL_TEXT | LIST id=kix.list.100 level=0]
O sistema mostra o plano ativo e suas ações.

[P00942 | 40816:40860 | NORMAL_TEXT | LIST id=kix.list.100 level=0]
O paciente consulta orientações publicadas.

[P00943 | 40860:40869 | HEADING_3]
Exceções

[P00944 | 40869:40893 | NORMAL_TEXT | LIST id=kix.list.101 level=0]
Nenhum plano publicado.

[P00945 | 40893:40925 | NORMAL_TEXT | LIST id=kix.list.101 level=0]
Plano encerrado ou substituído.

[P00946 | 40925:40939 | HEADING_3]
Pós-condições

[P00947 | 40939:40989 | NORMAL_TEXT | LIST id=kix.list.102 level=0]
Paciente informado sem acesso a conteúdo interno.

[P00948 | 40989:41008 | HEADING_3]
Participação da IA

[P00949 | 41008:41070 | NORMAL_TEXT]
Nenhuma. O paciente vê somente a versão aprovada pelo médico.

[P00950 | 41070:41093 | HEADING_3]
Critérios de aceitação

[P00951 | 41093:41129 | NORMAL_TEXT | LIST id=kix.list.103 level=0]
Apenas conteúdo aprovado é exibido.

[P00952 | 41129:41178 | NORMAL_TEXT | LIST id=kix.list.103 level=0]
O sistema identifica claramente o plano vigente.

[P00953 | 41178:41219 | NORMAL_TEXT | LIST id=kix.list.103 level=0]
Rascunhos e notas internas não aparecem.

[P00954 | 41219:41279 | NORMAL_TEXT | LIST id=kix.list.103 level=0]
Um plano substituído não permanece identificado como ativo.

[P00955 | 41279:41331 | NORMAL_TEXT | LIST id=kix.list.103 level=0]
Notificações externas não contêm conteúdo sensível.

[P00956 | 41331:41372 | HEADING_2]
UC-10B — Visualizar histórico e evolução

[P00957 | 41372:41391 | NORMAL_TEXT | LIST id=kix.list.104 level=0]
Prioridade: MVP-2.

[P00958 | 41391:41419 | NORMAL_TEXT | LIST id=kix.list.104 level=0]
Atores: paciente e sistema.

[P00959 | 41419:41503 | NORMAL_TEXT | LIST id=kix.list.104 level=0]
Objetivo: permitir que o paciente acompanhe check-ins e evolução ao longo do tempo.

[P00960 | 41503:41567 | NORMAL_TEXT | LIST id=kix.list.104 level=0]
Pré-condições: paciente autenticado; dados do MVP-2 existentes.

[P00961 | 41567:41600 | NORMAL_TEXT | LIST id=kix.list.104 level=0]
Gatilho: paciente abre Evolução.

[P00962 | 41600:41616 | HEADING_3]
Fluxo principal

[P00963 | 41616:41693 | NORMAL_TEXT | LIST id=kix.list.105 level=0]
O sistema apresenta o histórico de check-ins e planos anteriores permitidos.

[P00964 | 41693:41755 | NORMAL_TEXT | LIST id=kix.list.105 level=0]
Mostra indicadores simples baseados nos registros existentes.

[P00965 | 41755:41786 | NORMAL_TEXT | LIST id=kix.list.105 level=0]
O paciente escolhe um período.

[P00966 | 41786:41795 | HEADING_3]
Exceções

[P00967 | 41795:41816 | NORMAL_TEXT | LIST id=kix.list.106 level=0]
Dados insuficientes.

[P00968 | 41816:41839 | NORMAL_TEXT | LIST id=kix.list.106 level=0]
Período sem registros.

[P00969 | 41839:41853 | HEADING_3]
Pós-condições

[P00970 | 41853:41913 | NORMAL_TEXT | LIST id=kix.list.107 level=0]
Paciente vê seu histórico sem inferência de dados ausentes.

[P00971 | 41913:41932 | HEADING_3]
Participação da IA

[P00972 | 41932:42017 | NORMAL_TEXT]
Nenhuma obrigatória. Narrativas de evolução ficam para P1 e exigem aprovação médica.

[P00973 | 42017:42040 | HEADING_3]
Critérios de aceitação

[P00974 | 42040:42079 | NORMAL_TEXT | LIST id=kix.list.108 level=0]
Ausência de dados não gera estimativa.

[P00975 | 42079:42140 | NORMAL_TEXT | LIST id=kix.list.108 level=0]
Cálculos são reproduzíveis a partir dos registros originais.

[P00976 | 42140:42192 | NORMAL_TEXT | LIST id=kix.list.108 level=0]
Notificações externas não contêm conteúdo sensível.

[P00977 | 42192:42244 | HEADING_2]
UC-11 — Gerenciar privacidade e direitos do titular

[P00978 | 42244:42330 | NORMAL_TEXT | LIST id=kix.list.109 level=0]
Prioridade: processo obrigatório antes do piloto; autosserviço no produto é opcional.

[P00979 | 42330:42402 | NORMAL_TEXT | LIST id=kix.list.109 level=0]
Atores: paciente, responsável organizacional por privacidade e sistema.

[P00980 | 42402:42495 | NORMAL_TEXT | LIST id=kix.list.109 level=0]
Objetivo: permitir transparência, revogação e atendimento auditável aos direitos do titular.

[P00981 | 42495:42551 | NORMAL_TEXT | LIST id=kix.list.109 level=0]
Pré-condições: políticas e responsabilidades definidas.

[P00982 | 42551:42613 | NORMAL_TEXT | LIST id=kix.list.109 level=0]
Gatilho: paciente consulta aceites ou inicia uma solicitação.

[P00983 | 42613:42629 | HEADING_3]
Fluxo principal

[P00984 | 42629:42715 | NORMAL_TEXT | LIST id=kix.list.110 level=0]
O paciente consulta documentos e registros vigentes no produto ou pelo canal oficial.

[P00985 | 42715:42836 | NORMAL_TEXT | LIST id=kix.list.110 level=0]
Solicita acesso, correção, revogação, portabilidade quando aplicável ou exclusão pelo produto ou canal externo aprovado.

[P00986 | 42836:42898 | NORMAL_TEXT | LIST id=kix.list.110 level=0]
O responsável confirma a identidade e registra a solicitação.

[P00987 | 42898:42943 | NORMAL_TEXT | LIST id=kix.list.110 level=0]
O responsável avalia obrigações de retenção.

[P00988 | 42943:42995 | NORMAL_TEXT | LIST id=kix.list.110 level=0]
Executa a ação aplicável ou registra justificativa.

[P00989 | 42995:43026 | NORMAL_TEXT | LIST id=kix.list.110 level=0]
O paciente recebe o resultado.

[P00990 | 43026:43054 | NORMAL_TEXT | LIST id=kix.list.110 level=0]
Todo o processo é auditado.

[P00991 | 43054:43063 | HEADING_3]
Exceções

[P00992 | 43063:43090 | NORMAL_TEXT | LIST id=kix.list.111 level=0]
Identidade não confirmada.

[P00993 | 43090:43141 | NORMAL_TEXT | LIST id=kix.list.111 level=0]
Pedido incompatível com obrigação legal de guarda.

[P00994 | 43141:43191 | NORMAL_TEXT | LIST id=kix.list.111 level=0]
Dados compartilhados com operador ou suboperador.

[P00995 | 43191:43209 | NORMAL_TEXT | LIST id=kix.list.111 level=0]
Pedido duplicado.

[P00996 | 43209:43223 | HEADING_3]
Pós-condições

[P00997 | 43223:43260 | NORMAL_TEXT | LIST id=kix.list.112 level=0]
Solicitação atendida ou justificada.

[P00998 | 43260:43331 | NORMAL_TEXT | LIST id=kix.list.112 level=0]
Novos processamentos opcionais interrompidos após revogação aplicável.

[P00999 | 43331:43350 | HEADING_3]
Participação da IA

[P01000 | 43350:43415 | NORMAL_TEXT]
Nenhuma decisão. IA não determina direito, retenção ou exclusão.

[P01001 | 43415:43438 | HEADING_3]
Critérios de aceitação

[P01002 | 43438:43478 | NORMAL_TEXT | LIST id=kix.list.113 level=0]
Histórico de versões e aceites visível.

[P01003 | 43478:43516 | NORMAL_TEXT | LIST id=kix.list.113 level=0]
Revogar áudio não impede nota manual.

[P01004 | 43516:43593 | NORMAL_TEXT | LIST id=kix.list.113 level=0]
O sistema não promete exclusão de registros sujeitos a retenção obrigatória.

[P01005 | 43593:43649 | NORMAL_TEXT | LIST id=kix.list.113 level=0]
Solicitação registra tipo, status, responsável e datas.

[P01006 | 43649:43699 | NORMAL_TEXT | LIST id=kix.list.113 level=0]
Processo contempla dados enviados a fornecedores.

[P01007 | 43699:43826 | NORMAL_TEXT | LIST id=kix.list.113 level=0]
O primeiro piloto pode executar a solicitação fora do produto, desde que exista canal, responsabilidade e evidência auditável.

[P01008 | 43826:43848 | HEADING_2]
Casos resumidos de P1

[P01009 | 43848:44004 | NORMAL_TEXT]
Os casos a seguir registram intenção e limites principais. Antes de entrarem em desenvolvimento, precisam ser detalhados no mesmo nível dos casos do MVP-1.

[P01010 | 44004:44049 | HEADING_2]
UC-12 — Gerar relatório explicativo de exame

[P01011 | 44049:44065 | NORMAL_TEXT | LIST id=kix.list.114 level=0]
Prioridade: P1.

[P01012 | 44065:44117 | NORMAL_TEXT | LIST id=kix.list.114 level=0]
Atores: médico, paciente, sistema e copiloto de IA.

[P01013 | 44117:44188 | NORMAL_TEXT | LIST id=kix.list.114 level=0]
Objetivo: reduzir o esforço para explicar um tipo de exame homologado.

[P01014 | 44188:44261 | NORMAL_TEXT | LIST id=kix.list.114 level=0]
Pré-condições: um tipo de documento e um template aprovados pelo médico.

[P01015 | 44261:44325 | NORMAL_TEXT | LIST id=kix.list.114 level=0]
Gatilho: médico envia um PDF ou imagem para o paciente correto.

[P01016 | 44325:44341 | HEADING_3]
Fluxo principal

[P01017 | 44341:44389 | NORMAL_TEXT | LIST id=kix.list.115 level=0]
O sistema valida e preserva o arquivo original.

[P01018 | 44389:44447 | NORMAL_TEXT | LIST id=kix.list.115 level=0]
A IA extrai dados suportados e aponta a região de origem.

[P01019 | 44447:44488 | NORMAL_TEXT | LIST id=kix.list.115 level=0]
Valores de baixa confiança são marcados.

[P01020 | 44488:44516 | NORMAL_TEXT | LIST id=kix.list.115 level=0]
O médico valida a extração.

[P01021 | 44516:44564 | NORMAL_TEXT | LIST id=kix.list.115 level=0]
A IA gera um relatório explicativo em rascunho.

[P01022 | 44564:44591 | NORMAL_TEXT | LIST id=kix.list.115 level=0]
O médico corrige e aprova.

[P01023 | 44591:44625 | NORMAL_TEXT | LIST id=kix.list.115 level=0]
O relatório aprovado é publicado.

[P01024 | 44625:44659 | HEADING_3]
Critérios de aceitação essenciais

[P01025 | 44659:44710 | NORMAL_TEXT | LIST id=kix.list.116 level=0]
Começar com somente calorimetria ou bioimpedância.

[P01026 | 44710:44763 | NORMAL_TEXT | LIST id=kix.list.116 level=0]
Nenhuma conclusão clínica é publicada sem aprovação.

[P01027 | 44763:44825 | NORMAL_TEXT | LIST id=kix.list.116 level=0]
Documento original e valores extraídos permanecem vinculados.

[P01028 | 44825:44855 | NORMAL_TEXT | LIST id=kix.list.116 level=0]
Dado ausente não é inventado.

[P01029 | 44855:44909 | NORMAL_TEXT | LIST id=kix.list.116 level=0]
Documento não suportado segue para tratamento manual.

[P01030 | 44909:44947 | HEADING_2]
UC-13 — Transcrever áudio de consulta

[P01031 | 44947:44963 | NORMAL_TEXT | LIST id=kix.list.117 level=0]
Prioridade: P1.

[P01032 | 44963:45023 | NORMAL_TEXT | LIST id=kix.list.117 level=0]
Atores: médico, paciente, sistema e serviço de transcrição.

[P01033 | 45023:45098 | NORMAL_TEXT | LIST id=kix.list.117 level=0]
Objetivo: transformar áudio autorizado em uma fonte revisável para a nota.

[P01034 | 45098:45179 | NORMAL_TEXT | LIST id=kix.list.117 level=0]
Pré-condições: consentimento específico; fornecedor aprovado; retenção definida.

[P01035 | 45179:45246 | NORMAL_TEXT | LIST id=kix.list.117 level=0]
Gatilho: médico inicia gravação visível ou envia áudio autorizado.

[P01036 | 45246:45262 | HEADING_3]
Fluxo principal

[P01037 | 45262:45298 | NORMAL_TEXT | LIST id=kix.list.118 level=0]
O sistema verifica o consentimento.

[P01038 | 45298:45358 | NORMAL_TEXT | LIST id=kix.list.118 level=0]
O médico inicia conscientemente a captura ou envia arquivo.

[P01039 | 45358:45380 | NORMAL_TEXT | LIST id=kix.list.118 level=0]
O serviço transcreve.

[P01040 | 45380:45423 | NORMAL_TEXT | LIST id=kix.list.118 level=0]
Trechos de baixa confiança são destacados.

[P01041 | 45423:45454 | NORMAL_TEXT | LIST id=kix.list.118 level=0]
O médico revisa a transcrição.

[P01042 | 45454:45501 | NORMAL_TEXT | LIST id=kix.list.118 level=0]
A transcrição validada pode alimentar o UC-06.

[P01043 | 45501:45558 | NORMAL_TEXT | LIST id=kix.list.118 level=0]
O áudio é retido ou excluído conforme política aprovada.

[P01044 | 45558:45592 | HEADING_3]
Critérios de aceitação essenciais

[P01045 | 45592:45634 | NORMAL_TEXT | LIST id=kix.list.119 level=0]
Não existe gravação automática ou oculta.

[P01046 | 45634:45681 | NORMAL_TEXT | LIST id=kix.list.119 level=0]
Sem consentimento, o médico usa notas manuais.

[P01047 | 45681:45731 | NORMAL_TEXT | LIST id=kix.list.119 level=0]
O paciente percebe claramente quando há gravação.

[P01048 | 45731:45793 | NORMAL_TEXT | LIST id=kix.list.119 level=0]
Áudio, transcrição e nota possuem vínculo e regras de acesso.

[P01049 | 45793:45842 | NORMAL_TEXT | LIST id=kix.list.119 level=0]
Falha de transcrição não bloqueia o atendimento.

[P01050 | 45842:45885 | HEADING_2]
UC-14 — Trocar mensagens dentro do Vivance

[P01051 | 45885:45901 | NORMAL_TEXT | LIST id=kix.list.120 level=0]
Prioridade: P1.

[P01052 | 45901:45953 | NORMAL_TEXT | LIST id=kix.list.120 level=0]
Atores: paciente, médico, sistema e copiloto de IA.

[P01053 | 45953:46033 | NORMAL_TEXT | LIST id=kix.list.120 level=0]
Objetivo: centralizar comunicação assíncrona com expectativa clara de resposta.

[P01054 | 46033:46100 | NORMAL_TEXT | LIST id=kix.list.120 level=0]
Pré-condições: política operacional e prazo de resposta definidos.

[P01055 | 46100:46149 | NORMAL_TEXT | LIST id=kix.list.120 level=0]
Gatilho: paciente ou médico inicia uma conversa.

[P01056 | 46149:46165 | HEADING_3]
Fluxo principal

[P01057 | 46165:46193 | NORMAL_TEXT | LIST id=kix.list.121 level=0]
O usuário envia a mensagem.

[P01058 | 46193:46231 | NORMAL_TEXT | LIST id=kix.list.121 level=0]
O sistema registra entrega e leitura.

[P01059 | 46231:46261 | NORMAL_TEXT | LIST id=kix.list.121 level=0]
O médico consulta o contexto.

[P01060 | 46261:46292 | NORMAL_TEXT | LIST id=kix.list.121 level=0]
A IA pode sugerir um rascunho.

[P01061 | 46292:46316 | NORMAL_TEXT | LIST id=kix.list.121 level=0]
O médico edita e envia.

[P01062 | 46316:46357 | NORMAL_TEXT | LIST id=kix.list.121 level=0]
A conversa é vinculada à linha do tempo.

[P01063 | 46357:46391 | HEADING_3]
Critérios de aceitação essenciais

[P01064 | 46391:46437 | NORMAL_TEXT | LIST id=kix.list.122 level=0]
A tela informa que não é canal de emergência.

[P01065 | 46437:46470 | NORMAL_TEXT | LIST id=kix.list.122 level=0]
A IA nunca responde diretamente.

[P01066 | 46470:46522 | NORMAL_TEXT | LIST id=kix.list.122 level=0]
Notificações externas não mostram conteúdo clínico.

[P01067 | 46522:46566 | NORMAL_TEXT | LIST id=kix.list.122 level=0]
Falhas podem ser reenviadas sem duplicação.

[P01068 | 46566:46616 | NORMAL_TEXT | LIST id=kix.list.122 level=0]
Conta ou vínculo revogado impede novas mensagens.

[P01069 | 46616:46659 | HEADING_1]
14. Regras iniciais para a fila de atenção

[P01070 | 46659:46792 | NORMAL_TEXT]
O MVP-2 deve começar somente com regras operacionais determinísticas. Parâmetros e textos precisam ser aprovados pelo Dr. Guilherme.

[P01071 | 46792:46810 | NORMAL_TEXT]
Possíveis regras:

[P01072 | 46810:46856 | NORMAL_TEXT | LIST id=kix.list.123 level=0]
Pré-consulta não concluída antes da consulta.

[P01073 | 46856:46899 | NORMAL_TEXT | LIST id=kix.list.123 level=0]
Pré-consulta enviada e ainda não revisada.

[P01074 | 46899:46942 | NORMAL_TEXT | LIST id=kix.list.123 level=0]
Check-in atrasado por período configurado.

[P01075 | 46942:46976 | NORMAL_TEXT | LIST id=kix.list.123 level=0]
Nota ou plano aguardando revisão.

[P01076 | 46976:47036 | NORMAL_TEXT | LIST id=kix.list.123 level=0]
Documento aguardando validação, quando o módulo P1 existir.

[P01077 | 47036:47061 | NORMAL_TEXT | LIST id=kix.list.123 level=0]
Próxima revisão vencida.

[P01078 | 47061:47089 | NORMAL_TEXT]
Cada regra precisa definir:

[P01079 | 47089:47106 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Nome e objetivo.

[P01080 | 47106:47122 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Dado de origem.

[P01081 | 47122:47138 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Condição exata.

[P01082 | 47138:47165 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Prioridade organizacional.

[P01083 | 47165:47178 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Quem revisa.

[P01084 | 47178:47197 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Prazo operacional.

[P01085 | 47197:47212 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Ação esperada.

[P01086 | 47212:47238 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Critério de encerramento.

[P01087 | 47238:47268 | NORMAL_TEXT | LIST id=kix.list.124 level=0]
Comportamento em duplicidade.

[P01088 | 47268:47532 | NORMAL_TEXT]
O termo “atenção” não equivale a diagnóstico, triagem, emergência ou risco clínico confirmado. Regras que interpretem sintomas, piora ou risco exigem avaliação preliminar de risco, validação clínica, governança e cobertura operacional antes de serem consideradas.

[P01089 | 47532:47559 | HEADING_1]
15. Modelo de dados mínimo

[P01090 | 47559:47626 | NORMAL_TEXT]
Os nomes abaixo são conceituais; adaptar ao padrão do repositório.

[P01091 | 47626:47651 | HEADING_2]
Identidade e organização

[P01092 | 47651:47665 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
Organization.

[P01093 | 47665:47678 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
UserAccount.

[P01094 | 47678:47690 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
Membership.

[P01095 | 47690:47696 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
Role.

[P01096 | 47696:47711 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
DoctorProfile.

[P01097 | 47711:47727 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
PatientProfile.

[P01098 | 47727:47746 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
DoctorPatientLink.

[P01099 | 47746:47765 | NORMAL_TEXT | LIST id=kix.list.125 level=0]
ExternalReference.

[P01100 | 47765:47956 | NORMAL_TEXT]
Mesmo com uma única clínica no piloto, registros clínicos devem possuir um identificador de organização. O tenant deve ser derivado da sessão autenticada, nunca aceito livremente do cliente.

[P01101 | 47956:47968 | HEADING_2]
Privacidade

[P01102 | 47968:47990 | NORMAL_TEXT | LIST id=kix.list.126 level=0]
PrivacyNoticeVersion.

[P01103 | 47990:48005 | NORMAL_TEXT | LIST id=kix.list.126 level=0]
ConsentRecord.

[P01104 | 48005:48028 | NORMAL_TEXT | LIST id=kix.list.126 level=0]
DataProcessingPurpose.

[P01105 | 48028:48048 | NORMAL_TEXT | LIST id=kix.list.126 level=0]
DataSubjectRequest.

[P01106 | 48048:48065 | NORMAL_TEXT | LIST id=kix.list.126 level=0]
RetentionPolicy.

[P01107 | 48065:48090 | NORMAL_TEXT | LIST id=kix.list.126 level=0]
LegalHold, se aplicável.

[P01108 | 48090:48164 | NORMAL_TEXT]
Consentimentos diferentes não devem ser comprimidos em um único booleano.

[P01109 | 48164:48185 | HEADING_2]
Cuidado longitudinal

[P01110 | 48185:48196 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
Encounter.

[P01111 | 48196:48213 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
PreConsultation.

[P01112 | 48213:48228 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
Questionnaire.

[P01113 | 48228:48251 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
QuestionnaireResponse.

[P01114 | 48251:48264 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
Observation.

[P01115 | 48264:48273 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
CheckIn.

[P01116 | 48273:48283 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
CarePlan.

[P01117 | 48283:48299 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
CarePlanAction.

[P01118 | 48299:48313 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
ClinicalNote.

[P01119 | 48313:48323 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
Document.

[P01120 | 48323:48335 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
MediaAsset.

[P01121 | 48335:48350 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
AttentionRule.

[P01122 | 48350:48365 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
AttentionItem.

[P01123 | 48365:48379 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
DoctorAction.

[P01124 | 48379:48394 | NORMAL_TEXT | LIST id=kix.list.127 level=0]
TimelineEvent.

[P01125 | 48394:48444 | NORMAL_TEXT]
Cada observação deve registrar, quando aplicável:

[P01126 | 48444:48468 | NORMAL_TEXT | LIST id=kix.list.128 level=0]
Organização e paciente.

[P01127 | 48468:48486 | NORMAL_TEXT | LIST id=kix.list.128 level=0]
Origem e autoria.

[P01128 | 48486:48526 | NORMAL_TEXT | LIST id=kix.list.128 level=0]
Momento observado e momento registrado.

[P01129 | 48526:48551 | NORMAL_TEXT | LIST id=kix.list.128 level=0]
Valor, unidade e método.

[P01130 | 48551:48572 | NORMAL_TEXT | LIST id=kix.list.128 level=0]
Status de validação.

[P01131 | 48572:48601 | NORMAL_TEXT | LIST id=kix.list.128 level=0]
Correção ou versão anterior.

[P01132 | 48601:48621 | HEADING_2]
IA e revisão humana

[P01133 | 48621:48632 | NORMAL_TEXT | LIST id=kix.list.129 level=0]
AIUseCase.

[P01134 | 48632:48645 | NORMAL_TEXT | LIST id=kix.list.129 level=0]
AIExecution.

[P01135 | 48645:48657 | NORMAL_TEXT | LIST id=kix.list.129 level=0]
AIArtifact.

[P01136 | 48657:48673 | NORMAL_TEXT | LIST id=kix.list.129 level=0]
ReviewDecision.

[P01137 | 48673:48696 | NORMAL_TEXT | LIST id=kix.list.129 level=0]
PromptTemplateVersion.

[P01138 | 48696:48718 | NORMAL_TEXT | LIST id=kix.list.129 level=0]
ModelProviderVersion.

[P01139 | 48718:48740 | NORMAL_TEXT]
Registrar, no mínimo:

[P01140 | 48740:48752 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Finalidade.

[P01141 | 48752:48801 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Caso de uso e classificação preliminar de risco.

[P01142 | 48801:48829 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Serviço e versão do modelo.

[P01143 | 48829:48856 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Versão do prompt/template.

[P01144 | 48856:48882 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Referências das entradas.

[P01145 | 48882:48891 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Horário.

[P01146 | 48891:48911 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Status do artefato.

[P01147 | 48911:48920 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Revisor.

[P01148 | 48920:48951 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Decisão de aprovação/rejeição.

[P01149 | 48951:48991 | NORMAL_TEXT | LIST id=kix.list.130 level=0]
Motivo de rejeição ou edição relevante.

[P01150 | 48991:49172 | NORMAL_TEXT]
Evitar duplicar dados pessoais dentro do registro técnico da execução. Quando possível, guardar referências protegidas às fontes em vez de copiar todo o conteúdo clínico para logs.

[P01151 | 49172:49196 | HEADING_2]
Integrações e auditoria

[P01152 | 49196:49219 | NORMAL_TEXT | LIST id=kix.list.131 level=0]
IntegrationConnection.

[P01153 | 49219:49228 | NORMAL_TEXT | LIST id=kix.list.131 level=0]
SyncJob.

[P01154 | 49228:49241 | NORMAL_TEXT | LIST id=kix.list.131 level=0]
SyncAttempt.

[P01155 | 49241:49258 | NORMAL_TEXT | LIST id=kix.list.131 level=0]
FeegowReference.

[P01156 | 49258:49270 | NORMAL_TEXT | LIST id=kix.list.131 level=0]
AuditEvent.

[P01157 | 49270:49288 | NORMAL_TEXT | LIST id=kix.list.131 level=0]
SecurityIncident.

[P01158 | 49288:49418 | NORMAL_TEXT]
A auditoria registra ator, ação, organização, recurso, data, resultado e origem sem copiar desnecessariamente o conteúdo clínico.

[P01159 | 49418:49457 | HEADING_1]
16. Arquitetura recomendada para o MVP

[P01160 | 49457:49465 | HEADING_2]
Direção

[P01161 | 49465:49556 | NORMAL_TEXT]
Começar com um monólito modular, com fronteiras claras, evitando microserviços prematuros.

[P01162 | 49556:49582 | NORMAL_TEXT]
Componentes recomendados:

[P01163 | 49582:49607 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
Frontend web responsivo.

[P01164 | 49607:49620 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
API privada.

[P01165 | 49620:49638 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
Banco PostgreSQL.

[P01166 | 49638:49672 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
Armazenamento privado de objetos.

[P01167 | 49672:49732 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
Fila e worker para IA, transcrição e geração de documentos.

[P01168 | 49732:49771 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
Gateway próprio para provedores de IA.

[P01169 | 49771:49794 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
Camada de integrações.

[P01170 | 49794:49823 | NORMAL_TEXT | LIST id=kix.list.132 level=0]
Auditoria e observabilidade.

[P01171 | 49823:49842 | NORMAL_TEXT]
Módulos sugeridos:

[P01172 | 49842:49863 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Identidade e acesso.

[P01173 | 49863:49900 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Organizações, vínculos e permissões.

[P01174 | 49900:49928 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Pacientes e consentimentos.

[P01175 | 49928:49942 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Pré-consulta.

[P01176 | 49942:49972 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Consultas e notas auxiliares.

[P01177 | 49972:49997 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Planos e acompanhamento.

[P01178 | 49997:50020 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Arquivos e documentos.

[P01179 | 50020:50041 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
IA e revisão humana.

[P01180 | 50041:50054 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Integrações.

[P01181 | 50054:50079 | NORMAL_TEXT | LIST id=kix.list.133 level=0]
Auditoria e privacidade.

[P01182 | 50079:50111 | HEADING_2]
Compatibilidade com o protótipo

[P01183 | 50111:50264 | NORMAL_TEXT]
React/Next.js/TypeScript/Tailwind podem ser preservados caso o repositório real confirme essa arquitetura. Antes de implementar backend ou persistência:

[P01184 | 50264:50327 | NORMAL_TEXT | LIST id=kix.list.134 level=0]
Confirmar se o projeto usa Next.js diretamente ou Vinext/Vite.

[P01185 | 50327:50377 | NORMAL_TEXT | LIST id=kix.list.134 level=0]
Identificar componentes puramente demonstrativos.

[P01186 | 50377:50426 | NORMAL_TEXT | LIST id=kix.list.134 level=0]
Remover dependência de estado apenas em memória.

[P01187 | 50426:50489 | NORMAL_TEXT | LIST id=kix.list.134 level=0]
Criar contratos de domínio antes de ligar telas a dados reais.

[P01188 | 50489:50565 | NORMAL_TEXT | LIST id=kix.list.134 level=0]
Preservar a experiência mobile-first do paciente e desktop-first do médico.

[P01189 | 50565:50594 | HEADING_2]
Regras técnicas obrigatórias

[P01190 | 50594:50654 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Autorização validada no servidor em toda leitura e mutação.

[P01191 | 50654:50707 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Segredos e tokens fora do frontend e do repositório.

[P01192 | 50707:50747 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Chamadas de IA realizadas pelo backend.

[P01193 | 50747:50812 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Dados clínicos não armazenados persistentemente em localStorage.

[P01194 | 50812:50872 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Páginas autenticadas com dados sensíveis sem cache público.

[P01195 | 50872:50923 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Buckets privados e URLs temporárias para arquivos.

[P01196 | 50923:50998 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Validação de tipo real, tamanho, malware e conteúdo inesperado em uploads.

[P01197 | 50998:51059 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Criptografia em trânsito e em repouso, inclusive em backups.

[P01198 | 51059:51112 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Separação entre produção, staging e desenvolvimento.

[P01199 | 51112:51147 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
MFA para médico e administradores.

[P01200 | 51147:51183 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Proibição de contas compartilhadas.

[P01201 | 51183:51219 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Logs técnicos sem conteúdo clínico.

[P01202 | 51219:51263 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Backup criptografado e restauração testada.

[P01203 | 51263:51327 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Feature flag e desligamento rápido para cada caso de uso de IA.

[P01204 | 51327:51387 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Rate limiting, proteção contra abuso e expiração de sessão.

[P01205 | 51387:51452 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
UUIDs internos; e-mail, telefone e CPF não são chaves primárias.

[P01206 | 51452:51517 | NORMAL_TEXT | LIST id=kix.list.135 level=0]
Testes automáticos de isolamento entre pacientes e organizações.

[P01207 | 51517:51531 | HEADING_2]
Multi-clínica

[P01208 | 51531:51658 | NORMAL_TEXT]
A interface e a operação multi-clínica ficam fora do MVP. Entretanto, a estrutura deve evitar mistura de dados desde o início:

[P01209 | 51658:51721 | NORMAL_TEXT | LIST id=kix.list.136 level=0]
Identificador de organização em todos os registros relevantes.

[P01210 | 51721:51747 | NORMAL_TEXT | LIST id=kix.list.136 level=0]
Autorização na aplicação.

[P01211 | 51747:51818 | NORMAL_TEXT | LIST id=kix.list.136 level=0]
Isolamento no banco, como Row-Level Security ou mecanismo equivalente.

[P01212 | 51818:51902 | NORMAL_TEXT | LIST id=kix.list.136 level=0]
Testes que tentem enumerar, consultar, alterar e baixar dados de outra organização.

[P01213 | 51902:51963 | NORMAL_TEXT]
Não criar um prontuário global compartilhado entre clínicas.

[P01214 | 51963:51992 | HEADING_1]
17. Princípios de integração

[P01215 | 51992:51999 | HEADING_2]
Feegow

[P01216 | 51999:52051 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Confirmar oficialmente a API, permissões e limites.

[P01217 | 52051:52084 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Mapear identificadores externos.

[P01218 | 52084:52125 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Começar com cópia/exportação controlada.

[P01219 | 52125:52188 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Implementar idempotência antes de qualquer escrita automática.

[P01220 | 52188:52242 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Nunca sobrescrever registro assinado silenciosamente.

[P01221 | 52242:52281 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Exibir status e data da transferência.

[P01222 | 52281:52321 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Manter fila de erros e correção manual.

[P01223 | 52321:52356 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Registrar quem aprovou o conteúdo.

[P01224 | 52356:52420 | NORMAL_TEXT | LIST id=kix.list.137 level=0]
Inspecionar e testar o agente_vivance.py antes de reutilizá-lo.

[P01225 | 52420:52451 | HEADING_2]
Provedores de IA e transcrição

[P01226 | 52451:52526 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Usar conta/API corporativa aprovada, nunca conta pessoal para dados reais.

[P01227 | 52526:52581 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Confirmar que dados não serão usados para treinamento.

[P01228 | 52581:52649 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Definir retenção, subprocessadores e transferências internacionais.

[P01229 | 52649:52686 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Enviar somente os dados necessários.

[P01230 | 52686:52747 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Usar identificador interno quando o nome não for necessário.

[P01231 | 52747:52783 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Fixar e registrar versão do modelo.

[P01232 | 52783:52822 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Validar saídas por schema estruturado.

[P01233 | 52822:52925 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Tratar PDFs, mensagens e transcrições como entradas não confiáveis e proteger contra prompt injection.

[P01234 | 52925:52978 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Não permitir troca silenciosa de modelo em produção.

[P01235 | 52978:53052 | NORMAL_TEXT | LIST id=kix.list.138 level=0]
Manter o produto independente de Claude, GPT ou de uma versão específica.

[P01236 | 53052:53061 | HEADING_2]
WhatsApp

[P01237 | 53061:53149 | NORMAL_TEXT]
No MVP-1, o contato pode continuar externo e ser apenas registrado como ação do médico.

[P01238 | 53149:53175 | NORMAL_TEXT]
Se integrado futuramente:

[P01239 | 53175:53203 | NORMAL_TEXT | LIST id=kix.list.139 level=0]
Usar fornecedor autorizado.

[P01240 | 53203:53245 | NORMAL_TEXT | LIST id=kix.list.139 level=0]
Registrar preferência de canal e opt-out.

[P01241 | 53245:53286 | NORMAL_TEXT | LIST id=kix.list.139 level=0]
Evitar detalhes clínicos desnecessários.

[P01242 | 53286:53330 | NORMAL_TEXT | LIST id=kix.list.139 level=0]
Exigir aprovação antes de conteúdo clínico.

[P01243 | 53330:53400 | NORMAL_TEXT | LIST id=kix.list.139 level=0]
Não comunicar diagnóstico, prognóstico ou tratamento por IA autônoma.

[P01244 | 53400:53413 | HEADING_2]
Google Drive

[P01245 | 53413:53477 | NORMAL_TEXT | LIST id=kix.list.140 level=0]
Não usar pastas pessoais ou links públicos para dados clínicos.

[P01246 | 53477:53573 | NORMAL_TEXT | LIST id=kix.list.140 level=0]
Uma integração futura exige conta corporativa, permissão mínima, auditoria e contrato adequado.

[P01247 | 53573:53645 | NORMAL_TEXT | LIST id=kix.list.140 level=0]
O armazenamento clínico principal deve permanecer privado e controlado.

[P01248 | 53645:53696 | HEADING_2]
PULSE, Visus Vector, wearables e bases científicas

[P01249 | 53696:53724 | NORMAL_TEXT]
Permanecem pós-MVP até que:

[P01250 | 53724:53759 | NORMAL_TEXT | LIST id=kix.list.141 level=0]
O fluxo principal esteja validado.

[P01251 | 53759:53805 | NORMAL_TEXT | LIST id=kix.list.141 level=0]
A fonte oficial de cada dado esteja definida.

[P01252 | 53805:53846 | NORMAL_TEXT | LIST id=kix.list.141 level=0]
Haja documentação técnica e autorização.

[P01253 | 53846:53906 | NORMAL_TEXT | LIST id=kix.list.141 level=0]
O ganho clínico justifique a superfície adicional de risco.

[P01254 | 53906:53947 | HEADING_1]
18. Segurança clínica, LGPD e governança

[P01255 | 53947:54059 | NORMAL_TEXT]
Esta seção orienta produto e engenharia; não substitui revisão médica, jurídica, de privacidade ou regulatória.

[P01256 | 54059:54097 | HEADING_2]
18.1 Gate antes de qualquer dado real

[P01257 | 54097:54224 | NORMAL_TEXT]
Enquanto os itens abaixo não estiverem concluídos, todos os ambientes devem usar exclusivamente dados fictícios ou sintéticos.

[P01258 | 54224:54284 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Papel do Vivance e fonte oficial do prontuário confirmados.

[P01259 | 54284:54334 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Público, duração e critérios do piloto definidos.

[P01260 | 54334:54416 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Responsável médico e responsáveis por produto, privacidade e segurança definidos.

[P01261 | 54416:54475 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Inventário de dados, finalidades e bases legais concluído.

[P01262 | 54475:54526 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Controlador, operadores e suboperadores definidos.

[P01263 | 54526:54592 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Aviso de privacidade e fluxo de direitos dos titulares aprovados.

[P01264 | 54592:54698 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Ciência do aviso, termos, bases legais e consentimentos aplicáveis definidos e versionados separadamente.

[P01265 | 54698:54795 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Fluxo integralmente manual definido para a recusa do uso de IA ligado ao cuidado ou da gravação.

[P01266 | 54795:54864 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Avaliação preliminar de risco de cada caso de uso de IA documentada.

[P01267 | 54864:54940 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Autenticação, autorização, criptografia, auditoria e backups implementados.

[P01268 | 54940:54993 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Retenção e exclusão definidas por categoria de dado.

[P01269 | 54993:55089 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Fornecedores avaliados quanto a segurança, treinamento, retenção e transferência internacional.

[P01270 | 55089:55130 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Plano de resposta a incidentes aprovado.

[P01271 | 55130:55203 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Horários, expectativa de resposta e escalonamento operacional definidos.

[P01272 | 55203:55284 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Testes de isolamento, backup/restauração, falhas de IA e integrações concluídos.

[P01273 | 55284:55358 | NORMAL_TEXT | LIST id=kix.list.142 level=0]
Aprovação formal clínica, técnica e de privacidade para iniciar o piloto.

[P01274 | 55358:55498 | NORMAL_TEXT]
Recomenda-se um Relatório de Impacto à Proteção de Dados ou avaliação equivalente antes do piloto, sujeito à orientação jurídica aplicável.

[P01275 | 55498:55541 | HEADING_2]
18.2 Requisitos atuais para IA na medicina

[P01276 | 55541:55667 | NORMAL_TEXT]
A Resolução CFM nº 2.454/2026 está vigente desde 26 de agosto de 2026. Para este produto, os principais efeitos práticos são:

[P01277 | 55667:55745 | NORMAL_TEXT | LIST id=kix.list.143 level=0]
A IA é ferramenta de apoio; o médico mantém responsabilidade e decisão final.

[P01278 | 55745:55813 | NORMAL_TEXT | LIST id=kix.list.143 level=0]
O uso de IA como apoio à decisão deve ser registrado no prontuário.

[P01279 | 55813:55981 | NORMAL_TEXT | LIST id=kix.list.143 level=0]
Qualquer utilização de IA deve ser comunicada e explicada ao paciente; quando o apoio influenciar o cuidado, a explicação precisa ser especialmente clara e rastreável.

[P01280 | 55981:56033 | NORMAL_TEXT | LIST id=kix.list.143 level=0]
A recusa informada do paciente deve ser respeitada.

[P01281 | 56033:56126 | NORMAL_TEXT | LIST id=kix.list.143 level=0]
A comunicação de diagnóstico, prognóstico ou decisão terapêutica não pode ser delegada à IA.

[P01282 | 56126:56272 | NORMAL_TEXT | LIST id=kix.list.143 level=0]
A instituição deve realizar avaliação preliminar e classificar o risco antes do uso, informando essa classificação ao usuário conforme aplicável.

[P01283 | 56272:56359 | NORMAL_TEXT | LIST id=kix.list.143 level=0]
Supervisão humana, auditoria, monitoramento, segurança e privacidade são obrigatórios.

[P01284 | 56359:56570 | NORMAL_TEXT]
Antes do piloto, obter avaliação jurídica sobre a aplicação ao Instituto Vivance da Comissão de IA e Telemedicina prevista no art. 14, parágrafo único, para instituições que desenvolvam sistemas próprios de IA.

[P01285 | 56570:56614 | NORMAL_TEXT]
Fonte oficial: [Resolução CFM nº 2.454/2026](https://sistemas.cfm.org.br/normas/arquivos/resolucoes/BR/2026/2454_2026.pdf).

[P01286 | 56614:56642 | HEADING_2]
18.3 Privacidade por padrão

[P01287 | 56642:56761 | NORMAL_TEXT]
Dados de saúde são dados pessoais sensíveis. Aplicar minimização desde banco, arquivos e prompts até logs e analytics.

[P01288 | 56761:56777 | NORMAL_TEXT]
Regras mínimas:

[P01289 | 56777:56829 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Não tratar consentimento como autorização genérica.

[P01290 | 56829:56881 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Definir finalidade e base legal para cada operação.

[P01291 | 56881:56946 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Não confundir ciência do aviso de privacidade com consentimento.

[P01292 | 56946:56976 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Coletar somente o necessário.

[P01293 | 56976:57041 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Não usar dados reais em desenvolvimento, staging, demo ou teste.

[P01294 | 57041:57123 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Não enviar dados de pacientes para contas pessoais ou ferramentas públicas de IA.

[P01295 | 57123:57215 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Não incluir dados clínicos em URLs, nomes públicos de arquivos, telemetria ou logs de erro.

[P01296 | 57215:57296 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Não instalar pixels de marketing ou trackers de terceiros em áreas autenticadas.

[P01297 | 57296:57349 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Não colocar conteúdo clínico em push, SMS ou e-mail.

[P01298 | 57349:57421 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Criar processo para acesso, correção, informação, revogação e exclusão.

[P01299 | 57421:57467 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Avaliar transferência internacional de dados.

[P01300 | 57467:57526 | NORMAL_TEXT | LIST id=kix.list.144 level=0]
Manter canal de privacidade e responsabilidades definidas.

[P01301 | 57526:57594 | NORMAL_TEXT]
Fonte oficial: [Lei Geral de Proteção de Dados — Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm).

[P01302 | 57594:57608 | HEADING_2]
18.4 Retenção

[P01303 | 57608:57640 | NORMAL_TEXT]
Criar uma matriz separada para:

[P01304 | 57640:57664 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Registro clínico final.

[P01305 | 57664:57690 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Pré-consulta e check-ins.

[P01306 | 57690:57712 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Documentos originais.

[P01307 | 57712:57719 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Áudio.

[P01308 | 57719:57732 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Transcrição.

[P01309 | 57732:57766 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Rascunhos aprovados e rejeitados.

[P01310 | 57766:57777 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Mensagens.

[P01311 | 57777:57796 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Logs de auditoria.

[P01312 | 57796:57811 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Logs técnicos.

[P01313 | 57811:57820 | NORMAL_TEXT | LIST id=kix.list.145 level=0]
Backups.

[P01314 | 57820:58154 | NORMAL_TEXT]
Se um artefato fizer parte do prontuário, não deve ser apagado automaticamente em resposta a uma solicitação genérica. A Lei nº 13.787/2018 exige integridade, autenticidade e confidencialidade e prevê, para prontuários, prazo mínimo de 20 anos a partir do último registro antes de eventual eliminação, ressalvadas regras específicas.

[P01315 | 58154:58189 | NORMAL_TEXT]
Fonte oficial: [Lei nº 13.787/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13787.htm).

[P01316 | 58189:58347 | NORMAL_TEXT]
Para áudio de consulta, utilizar o menor prazo necessário e excluir após validação da transcrição e da nota, salvo justificativa clínica e jurídica expressa.

[P01317 | 58347:58363 | HEADING_2]
18.5 Incidentes

[P01318 | 58363:58385 | NORMAL_TEXT]
O plano deve incluir:

[P01319 | 58385:58412 | NORMAL_TEXT | LIST id=kix.list.146 level=0]
Classificação e contenção.

[P01320 | 58412:58439 | NORMAL_TEXT | LIST id=kix.list.146 level=0]
Preservação de evidências.

[P01321 | 58439:58475 | NORMAL_TEXT | LIST id=kix.list.146 level=0]
Responsáveis e comunicação interna.

[P01322 | 58475:58509 | NORMAL_TEXT | LIST id=kix.list.146 level=0]
Avaliação do risco aos titulares.

[P01323 | 58509:58560 | NORMAL_TEXT | LIST id=kix.list.146 level=0]
Comunicação à ANPD e aos titulares quando exigida.

[P01324 | 58560:58600 | NORMAL_TEXT | LIST id=kix.list.146 level=0]
Revisão posterior e medidas corretivas.

[P01325 | 58600:58805 | NORMAL_TEXT]
Quando o incidente puder causar risco ou dano relevante, a Resolução CD/ANPD nº 15/2024 estabelece comunicação pelo controlador à ANPD e aos titulares em três dias úteis, ressalvada legislação específica.

[P01326 | 58805:58866 | NORMAL_TEXT]
Fonte oficial: [Comunicação de Incidente de Segurança — ANPD](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis).

[P01327 | 58866:58893 | HEADING_2]
18.6 Segurança do paciente

[P01328 | 58893:58948 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Informar que o aplicativo não é serviço de emergência.

[P01329 | 58948:59019 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Informar que mensagens e check-ins podem não ser vistos imediatamente.

[P01330 | 59019:59058 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Exibir o canal correto para urgências.

[P01331 | 59058:59095 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Não prometer monitoramento contínuo.

[P01332 | 59095:59165 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Não usar “seguro”, “sem risco” ou equivalentes com base apenas na IA.

[P01333 | 59165:59228 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Validar questionários e regras clinicamente antes da ativação.

[P01334 | 59228:59285 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Publicar conteúdo clínico somente após aprovação médica.

[P01335 | 59285:59337 | NORMAL_TEXT | LIST id=kix.list.147 level=0]
Permitir desligar rapidamente um caso de uso de IA.

[P01336 | 59337:59377 | HEADING_2]
18.7 Possível enquadramento regulatório

[P01337 | 59377:59581 | NORMAL_TEXT]
Antes de introduzir diagnóstico, predição clínica, triagem, score de risco ou recomendação terapêutica, realizar avaliação específica sobre Software as a Medical Device. Esses recursos ficam fora do MVP.

[P01338 | 59581:59657 | NORMAL_TEXT]
Fonte oficial: [Anvisa — RDC nº 657/2022 e Software como Dispositivo Médico](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2022/software-como-dispositivo-medico-perguntas-e-respostas).

[P01339 | 59657:59687 | HEADING_1]
19. Requisitos não funcionais

[P01340 | 59687:59711 | HEADING_2]
Segurança e privacidade

[P01341 | 59711:59752 | NORMAL_TEXT | LIST id=kix.list.148 level=0]
Controle de acesso com menor privilégio.

[P01342 | 59752:59783 | NORMAL_TEXT | LIST id=kix.list.148 level=0]
MFA para perfis privilegiados.

[P01343 | 59783:59819 | NORMAL_TEXT | LIST id=kix.list.148 level=0]
Criptografia em trânsito e repouso.

[P01344 | 59819:59849 | NORMAL_TEXT | LIST id=kix.list.148 level=0]
Auditoria de ações sensíveis.

[P01345 | 59849:59874 | NORMAL_TEXT | LIST id=kix.list.148 level=0]
Segregação de ambientes.

[P01346 | 59874:59912 | NORMAL_TEXT | LIST id=kix.list.148 level=0]
Varredura de dependências e segredos.

[P01347 | 59912:59961 | NORMAL_TEXT | LIST id=kix.list.148 level=0]
Testes contra acesso horizontal entre pacientes.

[P01348 | 59961:59976 | HEADING_2]
Confiabilidade

[P01349 | 59976:60021 | NORMAL_TEXT | LIST id=kix.list.149 level=0]
Fluxo manual quando IA ou integração falhar.

[P01350 | 60021:60045 | NORMAL_TEXT | LIST id=kix.list.149 level=0]
Operações idempotentes.

[P01351 | 60045:60077 | NORMAL_TEXT | LIST id=kix.list.149 level=0]
Reprocessamento seguro de jobs.

[P01352 | 60077:60110 | NORMAL_TEXT | LIST id=kix.list.149 level=0]
Backups com restauração testada.

[P01353 | 60110:60142 | NORMAL_TEXT | LIST id=kix.list.149 level=0]
Estados de erro compreensíveis.

[P01354 | 60142:60193 | NORMAL_TEXT | LIST id=kix.list.149 level=0]
Nenhuma indicação falsa de envio ou sincronização.

[P01355 | 60193:60204 | HEADING_2]
Desempenho

[P01356 | 60204:60259 | NORMAL_TEXT | LIST id=kix.list.150 level=0]
Interfaces principais utilizáveis em rede móvel comum.

[P01357 | 60259:60311 | NORMAL_TEXT | LIST id=kix.list.150 level=0]
Check-in e pré-consulta com salvamento progressivo.

[P01358 | 60311:60358 | NORMAL_TEXT | LIST id=kix.list.150 level=0]
Jobs demorados executados de forma assíncrona.

[P01359 | 60358:60415 | NORMAL_TEXT | LIST id=kix.list.150 level=0]
Feedback claro de processamento, falha e nova tentativa.

[P01360 | 60415:60435 | HEADING_2]
Acessibilidade e UX

[P01361 | 60435:60480 | NORMAL_TEXT | LIST id=kix.list.151 level=0]
Navegação por teclado na experiência médica.

[P01362 | 60480:60530 | NORMAL_TEXT | LIST id=kix.list.151 level=0]
Contraste e tamanho de toque adequados no mobile.

[P01363 | 60530:60564 | NORMAL_TEXT | LIST id=kix.list.151 level=0]
Linguagem simples para pacientes.

[P01364 | 60564:60619 | NORMAL_TEXT | LIST id=kix.list.151 level=0]
Estados da IA e da aprovação claramente diferenciados.

[P01365 | 60619:60657 | NORMAL_TEXT | LIST id=kix.list.151 level=0]
Sem dark patterns nos consentimentos.

[P01366 | 60657:60673 | HEADING_2]
Observabilidade

[P01367 | 60673:60709 | NORMAL_TEXT | LIST id=kix.list.152 level=0]
Logs técnicos sem conteúdo clínico.

[P01368 | 60709:60738 | NORMAL_TEXT | LIST id=kix.list.152 level=0]
Métricas de erro e latência.

[P01369 | 60738:60775 | NORMAL_TEXT | LIST id=kix.list.152 level=0]
Monitoramento de jobs e integrações.

[P01370 | 60775:60797 | NORMAL_TEXT | LIST id=kix.list.152 level=0]
Alertas de segurança.

[P01371 | 60797:60837 | NORMAL_TEXT | LIST id=kix.list.152 level=0]
Métricas de qualidade das saídas da IA.

[P01372 | 60837:60851 | HEADING_2]
Testabilidade

[P01373 | 60851:60892 | NORMAL_TEXT | LIST id=kix.list.153 level=0]
Testes unitários de regras e permissões.

[P01374 | 60892:60930 | NORMAL_TEXT | LIST id=kix.list.153 level=0]
Testes de integração do banco e jobs.

[P01375 | 60930:60975 | NORMAL_TEXT | LIST id=kix.list.153 level=0]
Testes de contrato para provedores externos.

[P01376 | 60975:61026 | NORMAL_TEXT | LIST id=kix.list.153 level=0]
Testes E2E das jornadas incluídas em cada entrega.

[P01377 | 61026:61097 | NORMAL_TEXT | LIST id=kix.list.153 level=0]
Testes com entradas maliciosas, arquivos inválidos e prompt injection.

[P01378 | 61097:61178 | NORMAL_TEXT | LIST id=kix.list.153 level=0]
Casos de regressão para alucinação, omissão e inclusão indevida de medicamentos.

[P01379 | 61178:61201 | HEADING_1]
20. Métricas do piloto

[P01380 | 61201:61219 | HEADING_2]
Eficiência médica

[P01381 | 61219:61254 | NORMAL_TEXT | LIST id=kix.list.154 level=0]
Tempo de preparação para consulta.

[P01382 | 61254:61283 | NORMAL_TEXT | LIST id=kix.list.154 level=0]
Tempo para finalizar a nota.

[P01383 | 61283:61327 | NORMAL_TEXT | LIST id=kix.list.154 level=0]
Tempo entre consulta e publicação do plano.

[P01384 | 61327:61372 | NORMAL_TEXT | LIST id=kix.list.154 level=0]
Quantidade de edição necessária no rascunho.

[P01385 | 61372:61431 | NORMAL_TEXT | LIST id=kix.list.154 level=0]
Percentual de rascunhos aprovados, rejeitados ou refeitos.

[P01386 | 61431:61460 | NORMAL_TEXT | LIST id=kix.list.154 level=0]
Tipos de correção do médico.

[P01387 | 61460:61484 | HEADING_2]
Experiência do paciente

[P01388 | 61484:61522 | NORMAL_TEXT | LIST id=kix.list.155 level=0]
Pré-consultas iniciadas e concluídas.

[P01389 | 61522:61550 | NORMAL_TEXT | LIST id=kix.list.155 level=0]
Tempo e abandono por etapa.

[P01390 | 61550:61583 | NORMAL_TEXT | LIST id=kix.list.155 level=0]
Pacientes que acessaram o plano.

[P01391 | 61583:61605 | NORMAL_TEXT | LIST id=kix.list.155 level=0]
Adesão aos check-ins.

[P01392 | 61605:61636 | NORMAL_TEXT | LIST id=kix.list.155 level=0]
Percepção de clareza do plano.

[P01393 | 61636:61658 | HEADING_2]
Qualidade operacional

[P01394 | 61658:61684 | NORMAL_TEXT | LIST id=kix.list.156 level=0]
Itens de atenção gerados.

[P01395 | 61684:61718 | NORMAL_TEXT | LIST id=kix.list.156 level=0]
Percentual considerado relevante.

[P01396 | 61718:61736 | NORMAL_TEXT | LIST id=kix.list.156 level=0]
Falsos positivos.

[P01397 | 61736:61755 | NORMAL_TEXT | LIST id=kix.list.156 level=0]
Tempo até revisão.

[P01398 | 61755:61777 | NORMAL_TEXT | LIST id=kix.list.156 level=0]
Falhas de exportação.

[P01399 | 61777:61812 | NORMAL_TEXT | LIST id=kix.list.156 level=0]
Erros de permissão ou privacidade.

[P01400 | 61812:61828 | HEADING_2]
Segurança da IA

[P01401 | 61828:61852 | NORMAL_TEXT | LIST id=kix.list.157 level=0]
Informações inventadas.

[P01402 | 61852:61873 | NORMAL_TEXT | LIST id=kix.list.157 level=0]
Omissões relevantes.

[P01403 | 61873:61920 | NORMAL_TEXT | LIST id=kix.list.157 level=0]
Diagnóstico ou medicamento inserido sem fonte.

[P01404 | 61920:61954 | NORMAL_TEXT | LIST id=kix.list.157 level=0]
Conteúdo publicado sem aprovação.

[P01405 | 61954:62007 | NORMAL_TEXT | LIST id=kix.list.157 level=0]
Divergência entre fonte, rascunho e versão aprovada.

[P01406 | 62007:62061 | NORMAL_TEXT | LIST id=kix.list.157 level=0]
Uso de IA sem o registro ou a transparência exigidos.

[P01407 | 62061:62214 | NORMAL_TEXT]
Não declarar sucesso apenas por resultado clínico como perda de peso. O piloto deve primeiro validar segurança, utilidade, adesão e redução de trabalho.

[P01408 | 62214:62290 | NORMAL_TEXT]
Metas numéricas devem ser definidas depois de medir uma linha de base real.

[P01409 | 62290:62329 | HEADING_1]
21. Ordem recomendada de implementação

[P01410 | 62329:62368 | HEADING_2]
Etapa 0 — Decisões e gate de segurança

[P01411 | 62368:62400 | NORMAL_TEXT | LIST id=kix.list.158 level=0]
Confirmar fronteira com Feegow.

[P01412 | 62400:62450 | NORMAL_TEXT | LIST id=kix.list.158 level=0]
Confirmar o MVP-1 e o momento de iniciar o MVP-2.

[P01413 | 62450:62545 | NORMAL_TEXT | LIST id=kix.list.158 level=0]
Aprovar questionário e plano; check-in e regras de atenção podem ser aprovados antes do MVP-2.

[P01414 | 62545:62640 | NORMAL_TEXT | LIST id=kix.list.158 level=0]
Definir bases legais, avisos, consentimentos aplicáveis, privacidade, retenção e fornecedores.

[P01415 | 62640:62701 | NORMAL_TEXT | LIST id=kix.list.158 level=0]
Confirmar responsáveis e critérios de interrupção do piloto.

[P01416 | 62701:62720 | HEADING_2]
Etapa 1 — Fundação

[P01417 | 62720:62734 | NORMAL_TEXT | LIST id=kix.list.159 level=0]
Autenticação.

[P01418 | 62734:62773 | NORMAL_TEXT | LIST id=kix.list.159 level=0]
Organização e vínculo médico-paciente.

[P01419 | 62773:62831 | NORMAL_TEXT | LIST id=kix.list.159 level=0]
Avisos, termos, bases legais e consentimentos aplicáveis.

[P01420 | 62831:62850 | NORMAL_TEXT | LIST id=kix.list.159 level=0]
Banco persistente.

[P01421 | 62850:62874 | NORMAL_TEXT | LIST id=kix.list.159 level=0]
Autorização no backend.

[P01422 | 62874:62885 | NORMAL_TEXT | LIST id=kix.list.159 level=0]
Auditoria.

[P01423 | 62885:62912 | NORMAL_TEXT | LIST id=kix.list.159 level=0]
Estrutura de IA e revisão.

[P01424 | 62912:62945 | HEADING_2]
Etapa 2 — Preparação da consulta

[P01425 | 62945:62962 | NORMAL_TEXT | LIST id=kix.list.160 level=0]
Cadastro mínimo.

[P01426 | 62962:62986 | NORMAL_TEXT | LIST id=kix.list.160 level=0]
Pré-consulta por texto.

[P01427 | 62986:62994 | NORMAL_TEXT | LIST id=kix.list.160 level=0]
Dossiê.

[P01428 | 62994:63014 | NORMAL_TEXT | LIST id=kix.list.160 level=0]
Síntese com fontes.

[P01429 | 63014:63036 | NORMAL_TEXT | LIST id=kix.list.160 level=0]
Painel de pendências.

[P01430 | 63036:63070 | HEADING_2]
Etapa 3 — Consulta e documentação

[P01431 | 63070:63081 | NORMAL_TEXT | LIST id=kix.list.161 level=0]
Workspace.

[P01432 | 63081:63110 | NORMAL_TEXT | LIST id=kix.list.161 level=0]
Notas ou transcrição colada.

[P01433 | 63110:63132 | NORMAL_TEXT | LIST id=kix.list.161 level=0]
Rascunho estruturado.

[P01434 | 63132:63153 | NORMAL_TEXT | LIST id=kix.list.161 level=0]
Revisão e aprovação.

[P01435 | 63153:63206 | NORMAL_TEXT | LIST id=kix.list.161 level=0]
Exportação e confirmação de transferência ao Feegow.

[P01436 | 63206:63249 | NORMAL_TEXT | LIST id=kix.list.161 level=0]
Plano de cuidado e publicação ao paciente.

[P01437 | 63249:63287 | HEADING_2]
Etapa 4 — Hardening e piloto do MVP-1

[P01438 | 63287:63324 | NORMAL_TEXT | LIST id=kix.list.162 level=0]
Testes completos das jornadas A e B.

[P01439 | 63324:63369 | NORMAL_TEXT | LIST id=kix.list.162 level=0]
Revisão de segurança, privacidade e clínica.

[P01440 | 63369:63392 | NORMAL_TEXT | LIST id=kix.list.162 level=0]
Treinamento do médico.

[P01441 | 63392:63421 | NORMAL_TEXT | LIST id=kix.list.162 level=0]
Piloto pequeno e controlado.

[P01442 | 63421:63465 | NORMAL_TEXT | LIST id=kix.list.162 level=0]
Coleta de métricas, correções e incidentes.

[P01443 | 63465:63510 | HEADING_2]
Etapa 5 — MVP-2: acompanhamento longitudinal

[P01444 | 63510:63520 | NORMAL_TEXT | LIST id=kix.list.163 level=0]
Check-in.

[P01445 | 63520:63536 | NORMAL_TEXT | LIST id=kix.list.163 level=0]
Linha do tempo.

[P01446 | 63536:63575 | NORMAL_TEXT | LIST id=kix.list.163 level=0]
Regras operacionais e fila de atenção.

[P01447 | 63575:63600 | NORMAL_TEXT | LIST id=kix.list.163 level=0]
Registro da ação médica.

[P01448 | 63600:63644 | NORMAL_TEXT | LIST id=kix.list.163 level=0]
Nova revisão do gate e piloto da jornada C.

[P01449 | 63644:63670 | HEADING_2]
Etapa 6 — Uma extensão P1

[P01450 | 63670:63691 | NORMAL_TEXT]
Escolher apenas uma:

[P01451 | 63691:63711 | NORMAL_TEXT | LIST id=kix.list.164 level=0]
Transcrição nativa.

[P01452 | 63711:63755 | NORMAL_TEXT | LIST id=kix.list.164 level=0]
Relatório de calorimetria ou bioimpedância.

[P01453 | 63755:63774 | NORMAL_TEXT | LIST id=kix.list.164 level=0]
Integração Feegow.

[P01454 | 63774:63794 | NORMAL_TEXT | LIST id=kix.list.164 level=0]
Mensagens internas.

[P01455 | 63794:63857 | NORMAL_TEXT]
A escolha deve responder ao maior gargalo observado no piloto.

[P01456 | 63857:63880 | HEADING_1]
22. Definition of Done

[P01457 | 63880:63905 | HEADING_2]
MVP-1 pronto para piloto

[P01458 | 63905:63991 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
O médico autentica com MFA, verifica o paciente, cria o vínculo e controla o convite.

[P01459 | 63991:64110 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Um paciente é convidado, autentica, registra ciência/aceites aplicáveis e completa a pré-consulta sem suporte técnico.

[P01460 | 64110:64164 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
O médico vê respostas originais e síntese rastreável.

[P01461 | 64164:64205 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
O médico cria, revisa e aprova uma nota.

[P01462 | 64205:64253 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
A IA nunca publica ou aprova por conta própria.

[P01463 | 64253:64317 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
A nota aprovada pode ser transferida de forma segura ao Feegow.

[P01464 | 64317:64351 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
O médico cria e publica um plano.

[P01465 | 64351:64387 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
O paciente acessa o plano aprovado.

[P01466 | 64387:64429 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Todas as ações sensíveis ficam auditadas.

[P01467 | 64429:64477 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Um paciente não acessa dados de outro paciente.

[P01468 | 64477:64540 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Um usuário de outra organização não acessa dados do Instituto.

[P01469 | 64540:64614 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Existem backup, restauração, revogação e processo de direitos do titular.

[P01470 | 64614:64672 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
O fluxo principal funciona quando a IA está indisponível.

[P01471 | 64672:64745 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Dados originais, inferência da IA e conteúdo aprovado são distinguíveis.

[P01472 | 64745:64853 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Bases legais, avisos, consentimentos aplicáveis, transparência e registro do uso de IA estão implementados.

[P01473 | 64853:64926 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
Testes com dados fictícios foram concluídos antes de qualquer dado real.

[P01474 | 64926:64991 | NORMAL_TEXT | LIST id=kix.list.165 level=0]
O gate clínico, técnico, jurídico e de privacidade foi aprovado.

[P01475 | 64991:65016 | HEADING_2]
MVP-2 pronto para piloto

[P01476 | 65016:65045 | NORMAL_TEXT]
Além dos critérios do MVP-1:

[P01477 | 65045:65117 | NORMAL_TEXT | LIST id=kix.list.166 level=0]
O paciente responde ao check-in e vê seu histórico sem dados inferidos.

[P01478 | 65117:65184 | NORMAL_TEXT | LIST id=kix.list.166 level=0]
Uma regra operacional aprovada cria um item de atenção explicável.

[P01479 | 65184:65229 | NORMAL_TEXT | LIST id=kix.list.166 level=0]
O médico registra uma ação e encerra o item.

[P01480 | 65229:65286 | NORMAL_TEXT | LIST id=kix.list.166 level=0]
Não há interpretação automática de sintomas ou urgência.

[P01481 | 65286:65351 | NORMAL_TEXT | LIST id=kix.list.166 level=0]
A relevância e os falsos positivos das regras podem ser medidos.

[P01482 | 65351:65421 | NORMAL_TEXT | LIST id=kix.list.166 level=0]
O novo escopo passou por avaliação de risco e nova aprovação do gate.

[P01483 | 65421:65477 | HEADING_1]
23. Decisões pendentes para validar com o Dr. Guilherme

[P01484 | 65477:65494 | HEADING_2]
Produto e piloto

[P01485 | 65494:65588 | NORMAL_TEXT | LIST id=kix.list.167 level=0]
O problema prioritário é preparação/documentação médica, acompanhamento do paciente ou ambos?

[P01486 | 65588:65674 | NORMAL_TEXT | LIST id=kix.list.167 level=0]
A ordem recomendada — MVP-1 de eficiência e depois MVP-2 longitudinal — está correta?

[P01487 | 65674:65709 | NORMAL_TEXT | LIST id=kix.list.167 level=0]
O piloto será somente com adultos?

[P01488 | 65709:65760 | NORMAL_TEXT | LIST id=kix.list.167 level=0]
Quantos pacientes participarão e por quanto tempo?

[P01489 | 65760:65798 | NORMAL_TEXT | LIST id=kix.list.167 level=0]
Quais critérios interrompem o piloto?

[P01490 | 65798:65812 | HEADING_2]
Fluxo clínico

[P01491 | 65812:65861 | NORMAL_TEXT | LIST id=kix.list.168 level=0]
Quais perguntas entram na primeira pré-consulta?

[P01492 | 65861:65912 | NORMAL_TEXT | LIST id=kix.list.168 level=0]
Quais campos formam a nota a ser levada ao Feegow?

[P01493 | 65912:65949 | NORMAL_TEXT | LIST id=kix.list.168 level=0]
Qual é o primeiro template de plano?

[P01494 | 65949:65995 | NORMAL_TEXT | LIST id=kix.list.168 level=0]
Qual é a frequência e o conteúdo do check-in?

[P01495 | 65995:66034 | NORMAL_TEXT | LIST id=kix.list.168 level=0]
Quais regras criam um item de atenção?

[P01496 | 66034:66086 | NORMAL_TEXT | LIST id=kix.list.168 level=0]
Qual prazo de resposta será comunicado ao paciente?

[P01497 | 66086:66174 | NORMAL_TEXT | LIST id=kix.list.168 level=0]
Qual orientação permanente e quais canais devem ser mostrados para urgência/emergência?

[P01498 | 66174:66197 | HEADING_2]
Sistemas e integrações

[P01499 | 66197:66242 | NORMAL_TEXT | LIST id=kix.list.169 level=0]
O Feegow continuará como prontuário oficial?

[P01500 | 66242:66287 | NORMAL_TEXT | LIST id=kix.list.169 level=0]
A agenda oficial permanece apenas no Feegow?

[P01501 | 66287:66339 | NORMAL_TEXT | LIST id=kix.list.169 level=0]
A transferência inicial será cópia, arquivo ou API?

[P01502 | 66339:66407 | NORMAL_TEXT | LIST id=kix.list.169 level=0]
O agente_vivance.py existe, onde roda e o que realmente lê/escreve?

[P01503 | 66407:66477 | NORMAL_TEXT | LIST id=kix.list.169 level=0]
Feegow, PULSE, Visus e Drive possuem APIs e autorizações disponíveis?

[P01504 | 66477:66529 | NORMAL_TEXT | LIST id=kix.list.169 level=0]
Qual canal será oficial para comunicação no piloto?

[P01505 | 66529:66551 | HEADING_2]
Dados, IA e segurança

[P01506 | 66551:66607 | NORMAL_TEXT | LIST id=kix.list.170 level=0]
Quais dados podem ser enviados a cada fornecedor de IA?

[P01507 | 66607:66657 | NORMAL_TEXT | LIST id=kix.list.170 level=0]
Qual fornecedor poderá processar dados sensíveis?

[P01508 | 66657:66737 | NORMAL_TEXT | LIST id=kix.list.170 level=0]
Qual retenção será aplicada a áudio, transcrição, documentos, rascunhos e logs?

[P01509 | 66737:66800 | NORMAL_TEXT | LIST id=kix.list.170 level=0]
Quem será controlador, operador e responsável por privacidade?

[P01510 | 66800:66860 | NORMAL_TEXT | LIST id=kix.list.170 level=0]
Como o uso de IA será informado e registrado no prontuário?

[P01511 | 66860:66922 | NORMAL_TEXT | LIST id=kix.list.170 level=0]
Quem aprova a avaliação preliminar de risco dos casos de uso?

[P01512 | 66922:67016 | NORMAL_TEXT | LIST id=kix.list.170 level=0]
O Vivance precisará da Comissão de IA e Telemedicina prevista na Resolução CFM nº 2.454/2026?

[P01513 | 67016:67035 | HEADING_2]
Identidade e marca

[P01514 | 67035:67091 | NORMAL_TEXT | LIST id=kix.list.171 level=0]
Qual é o nome oficial da marca e o domínio de produção?

[P01515 | 67091:67142 | NORMAL_TEXT | LIST id=kix.list.171 level=0]
Quais são CRM, UF e RQE corretos do Dr. Guilherme?

[P01516 | 67142:67219 | NORMAL_TEXT | LIST id=kix.list.171 level=0]
O endereço profissional em Presidente Prudente está correto para documentos?

[P01517 | 67219:67254 | HEADING_1]
24. O que o Codex não deve inferir

[P01518 | 67254:67307 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que todos os itens dos MDs são requisitos aprovados.

[P01519 | 67307:67351 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que toda tela do protótipo pertence ao MVP.

[P01520 | 67351:67397 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que uma funcionalidade visual possui backend.

[P01521 | 67397:67441 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que o agente_vivance.py existe ou funciona.

[P01522 | 67441:67516 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que Feegow, WhatsApp, PULSE, Visus ou Drive possuem integração disponível.

[P01523 | 67516:67561 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que wa.me significa integração com WhatsApp.

[P01524 | 67561:67608 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que números fictícios representam volume real.

[P01525 | 67608:67660 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que PDFs mockados são templates clínicos aprovados.

[P01526 | 67660:67716 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que a IA pode “estruturar conduta” criando uma conduta.

[P01527 | 67716:67771 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que revisão humana, sozinha, resolve LGPD e segurança.

[P01528 | 67771:67867 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que dados não persistidos na memória de uma IA não são processados ou retidos por fornecedores.

[P01529 | 67867:67940 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que o paciente autoriza qualquer uso de IA ao aceitar um termo genérico.

[P01530 | 67940:67993 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que alertas equivalem a risco clínico ou emergência.

[P01531 | 67993:68043 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que mensagens podem ser enviadas automaticamente.

[P01532 | 68043:68128 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que o produto será multi-clínica, 24/7, multilíngue ou integrado a wearables no MVP.

[P01533 | 68128:68196 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que um modelo específico de Claude ou GPT é requisito arquitetural.

[P01534 | 68196:68290 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que informações profissionais, URL, commit ou stack registrados em agosto continuam corretos.

[P01535 | 68290:68344 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que dados clínicos podem ser usados para treinamento.

[P01536 | 68344:68415 | NORMAL_TEXT | LIST id=kix.list.172 level=0]
Que o Vivance pode substituir o prontuário oficial sem nova avaliação.

[P01537 | 68415:68455 | HEADING_1]
25. Resumo executivo para implementação

[P01538 | 68455:68583 | NORMAL_TEXT]
O MVP recomendado não tenta construir um prontuário completo nem reproduzir todos os usos de ChatGPT e Claude do Dr. Guilherme.

[P01539 | 68583:68616 | NORMAL_TEXT]
O MVP-1 entrega um ciclo seguro:

[P01540 | 68616:68662 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
Médico verifica o paciente e envia o convite.

[P01541 | 68662:68748 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
Paciente entra, recebe as informações obrigatórias e manifesta os aceites aplicáveis.

[P01542 | 68748:68777 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
Paciente prepara a consulta.

[P01543 | 68777:68812 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
Médico recebe contexto rastreável.

[P01544 | 68812:68837 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
IA organiza um rascunho.

[P01545 | 68837:68868 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
Médico decide, edita e aprova.

[P01546 | 68868:68906 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
Nota segue para o prontuário oficial.

[P01547 | 68906:68940 | NORMAL_TEXT | LIST id=kix.list.173 level=0]
Plano aprovado chega ao paciente.

[P01548 | 68940:68958 | NORMAL_TEXT]
O MVP-2 adiciona:

[P01549 | 68958:68977 | NORMAL_TEXT | LIST id=kix.list.174 level=0]
Check-ins simples.

[P01550 | 68977:69016 | NORMAL_TEXT | LIST id=kix.list.174 level=0]
Pendências operacionais transparentes.

[P01551 | 69016:69041 | NORMAL_TEXT | LIST id=kix.list.174 level=0]
Registro da ação médica.

[P01552 | 69041:69090 | NORMAL_TEXT | LIST id=kix.list.174 level=0]
Novo contexto longitudinal para o próximo ciclo.

[P01553 | 69090:69338 | NORMAL_TEXT]
Se o MVP-1 for seguro, útil e mensuravelmente melhor que o processo atual, o produto terá base para validar o acompanhamento longitudinal e depois adicionar transcrição, exames, mensagens e integrações sem inflar prematuramente o risco e o escopo.

