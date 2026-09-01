# Plano de aproveitamento do protótipo Skip

## Objetivo

Aplicar ao protótipo principal as melhores ideias de produto e interface do projeto Skip, sem realizar merge direto e sem importar o backend, os dados clínicos ou as integrações simuladas do export.

A jornada-alvo do MVP-1 é:

```text
pré-consulta por texto
-> fonte original preservada
-> organização assistida em rascunho
-> revisão médica
-> plano aprovado
-> publicação para a paciente
```

Nesta branch, a primeira entrega implementa e valida a parte inicial dessa jornada:

```text
pré-consulta por texto
-> fonte original preservada
-> organização assistida opcional em rascunho
-> recebimento no preparo médico
```

Aprovação do plano e publicação para a paciente permanecem planejadas para os lotes 2 e 3; ainda não devem ser consideradas entregues.

## Princípios

- O projeto atual permanece como base.
- O Skip é uma referência de UX e decomposição de páginas.
- Toda informação permanece fictícia durante a fase de protótipo.
- Rascunho de IA e decisão médica são estados diferentes.
- A paciente vê apenas conteúdo aprovado e publicado.
- O fluxo manual continua funcionando quando a IA não é autorizada ou está indisponível.
- Feegow permanece como prontuário oficial proposto; confirmação manual não significa sincronização.

## Matriz de aproveitamento

| Elemento do Skip | Decisão | Momento |
| --- | --- | --- |
| Camadas `relato`, `fato`, `síntese IA` e `decisão médica` | Adaptar | MVP-1 |
| Pré-consulta textual em etapas | Adaptar com consentimento e campos vazios | MVP-1 |
| Dossiê longitudinal | Aplicar em versão mínima | MVP-1 |
| Workspace de consulta | Aplicar sem vídeo nativo | MVP-1 |
| Confirmação antes de publicar o plano | Aplicar com versão e autoria | MVP-1 |
| Plano da paciente com ação, frequência e justificativa | Adaptar | MVP-1 |
| Navegação modular médico/paciente | Aplicar gradualmente | MVP-1 |
| Página Hoje | Adiar | MVP-2 |
| Check-ins e atenção operacional | Adiar | MVP-2 |
| Diário, evolução, mensagens e relatório assistido | Adiar | P1 |
| PocketBase, migrations, seed e agente do Skip | Não reutilizar | Excluído |
| Teleconsulta, receitas e evidências fictícias | Não reutilizar | Fora do MVP |

## Lotes de implementação

### Lote 1 — Fundação e primeira fatia vertical — implementado nesta branch

- Padronizar a marca como Instituto Vivans.
- Criar componentes de proveniência clínica.
- Substituir a pré-consulta por voz simulada por texto guiado.
- Começar com campos vazios e validação acessível.
- Registrar ciência para compartilhamento com a equipe.
- Tornar a assistência de IA opcional.
- Preservar relato original e rascunho em camadas separadas.
- Compartilhar a submissão entre as visões paciente e médico.
- Persistir somente na sessão do navegador, com dados fictícios.

### Lote 2 — Dossiê e workspace médico

- Dividir `doctor.tsx` e `patient.tsx` em componentes menores.
- Criar rotas reais para paciente, dossiê, pré-consulta e consulta.
- Exibir fontes, notas, rascunhos e versões separadamente.
- Permitir edição, rejeição e aprovação do rascunho.
- Manter todo o fluxo disponível manualmente.

### Lote 3 — Plano aprovado

- Criar rascunho de plano a partir de decisões registradas.
- Exigir confirmação explícita do médico.
- Congelar a versão aprovada.
- Publicar somente a versão ativa para a paciente.
- Criar nova versão em vez de sobrescrever a anterior.
- Registrar separadamente a transferência manual ao Feegow.

### Lote 4 — Hardening do MVP-1

- Implementar autenticação, vínculos e papéis.
- Adicionar auditoria, consentimentos versionados e direitos LGPD.
- Criar testes de autorização, identidade, recusa de IA e troca de versão.
- Validar teclado, foco, responsividade, contraste e redução de movimento.
- Remover afirmações de integrações que ainda não existam.

### Lote 5 — MVP-2

- Página Hoje alimentada pelo plano publicado.
- Check-ins autorrelatados.
- Confirmação opcional de execução.
- Histórico longitudinal.
- Atenção baseada apenas em regras operacionais determinísticas aprovadas.

## Critérios de aceite do primeiro ciclo

- A pré-consulta começa sem respostas clínicas preenchidas.
- A paciente consegue continuar sem assistência de IA.
- Erros aparecem junto ao campo e são anunciados ao leitor de tela.
- A paciente revisa todas as respostas antes do envio.
- A visão médica recebe exatamente o texto enviado.
- A síntese assistida aparece como simulação de rascunho.
- Trocar entre paciente e médico não apaga a submissão.
- Recarregar a página mantém a submissão durante a sessão de demonstração.
- Nenhum conteúdo interno ou rascunho é apresentado como decisão aprovada.
- Build, lint e validação visual passam.

## Itens explicitamente excluídos

- `pocketbase/` do Skip.
- Usuários, senhas e dados de seed.
- Agente com permissões de escrita clínica.
- Script externo `goskip.dev/skip.js`.
- Conteúdo de `mockData.ts`.
- Sugestões de IA na área da paciente.
- Mensagens sem vínculo por paciente.
- Prescrições, ICP-Brasil e downloads simulados.
- Teleconsulta e compartilhamento de tela apresentados como integrações reais.
- Evidências PubMed, Cochrane ou Conitec sem fonte real verificável.
