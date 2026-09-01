---
name: "Instituto Vivans"
description: "Clareza clínica contínua em uma interface serena e orientada à decisão."
colors:
  evergreen-ink: "#17372f"
  institutional-green: "#0b7b68"
  institutional-green-strong: "#0b6a5b"
  editorial-green: "#2e6253"
  body-ink: "#405d54"
  supporting-ink: "#526a62"
  muted-ink: "#60766f"
  mist-canvas: "#f4f7f5"
  white-surface: "#ffffff"
  soft-border: "#dfe8e3"
  control-border: "#d7e3df"
  accent-border: "#bfd4cd"
  divider-mist: "#e7eeea"
  mint-soft: "#e8f4f0"
  mint-hover: "#edf7f4"
  green-state-border: "#b9d8cf"
  amber-soft: "#fff4d8"
  amber-ink: "#825b0b"
  rose-soft: "#fdecea"
  rose-ink: "#9c453f"
  rose-state-border: "#efc7c3"
  blue-soft: "#edf3fb"
  blue-ink: "#456b9c"
  blue-state-border: "#c9d8ec"
  neutral-soft: "#f1f5f3"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, 'Times New Roman', serif"
    fontSize: "2.35rem"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  display-md:
    fontFamily: "Playfair Display, Georgia, 'Times New Roman', serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  display-lg:
    fontFamily: "Playfair Display, Georgia, 'Times New Roman', serif"
    fontSize: "3.65rem"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.333
    letterSpacing: "-0.03em"
  metric:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.333
    letterSpacing: "-0.035em"
  stat:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  section-title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  card-title:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  body-large:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5rem"
  label:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: "1rem"
  support-label:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: "1rem"
  action:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: "1.25rem"
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
components:
  button-primary:
    backgroundColor: "{colors.evergreen-ink}"
    textColor: "{colors.white-surface}"
    typography: "{typography.action}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#24483e"
    textColor: "{colors.white-surface}"
  button-secondary:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.institutional-green-strong}"
    typography: "{typography.action}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.mint-hover}"
    textColor: "{colors.institutional-green-strong}"
  input:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.supporting-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "44px"
    width: "100%"
  tab-active:
    backgroundColor: "{colors.evergreen-ink}"
    textColor: "{colors.white-surface}"
    typography: "{typography.action}"
    rounded: "{rounded.xl}"
    padding: "0 16px"
    height: "48px"
  status-green:
    backgroundColor: "{colors.mint-soft}"
    textColor: "{colors.institutional-green-strong}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  status-amber:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.amber-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  status-rose:
    backgroundColor: "{colors.rose-soft}"
    textColor: "{colors.rose-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  status-blue:
    backgroundColor: "{colors.blue-soft}"
    textColor: "{colors.blue-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  status-neutral:
    backgroundColor: "{colors.neutral-soft}"
    textColor: "{colors.supporting-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.evergreen-ink}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  review-strip:
    backgroundColor: "{colors.evergreen-ink}"
    textColor: "{colors.white-surface}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

# Design System: Instituto Vivans

## Overview

**Creative North Star: "Clareza clínica contínua"**

O sistema se comporta como um workspace clínico sereno: verde institucional funcional, superfícies brancas sobre uma névoa esverdeada, bordas suaves e pouca profundidade. A expressão vem da precisão da hierarquia, não de decoração; o contraste mais forte aparece apenas quando há estado, seleção, evidência ou ação humana a distinguir.

Em superfícies longitudinais, a leitura visual avança de pessoa e contexto para mudança, pendência, fonte e ação. Conteúdo aprofundado permanece agrupado em regiões claras e familiares, com densidade operacional suficiente para comparar sem transformar cada módulo em um concorrente visual.

**Key Characteristics:**

- Verde institucional raro e funcional sobre superfícies brancas e névoa.
- Material plano, bordas suaves e profundidade reservada a sobreposições.
- Geist para operação; Playfair apenas em momentos editoriais.
- Controles familiares com altura mínima de 44 px e estados explícitos.
- Hierarquia por pessoa, mudança, pendência, fonte e ação.

## Colors

A paleta combina verdes frios e neutros levemente esverdeados; âmbar, rosa e azul aparecem apenas como pares semânticos de estado.

### Primary

- **Evergreen Ink** (#17372f): texto de maior hierarquia, navegação selecionada, ações primárias contidas e faixas de revisão.
- **Institutional Green** (#0b7b68): foco, seleção, indicadores e acento institucional.
- **Institutional Green Strong** (#0b6a5b): texto de ações secundárias e estados positivos sobre fundos claros.
- **Editorial Green** (#2e6253): ênfase verde mais suave em momentos editoriais e ações de destaque fora do fluxo clínico denso.

### Secondary

- **Amber Soft / Amber Ink** (#fff4d8 / #825b0b): revisão pendente e atenção não urgente.
- **Rose Soft / Rose Ink** (#fdecea / #9c453f): erro localizado, restrição ou conflito.
- **Blue Soft / Blue Ink** (#edf3fb / #456b9c): conteúdo assistido, informacional ou ainda separado da decisão humana.
- **Mint Soft** (#e8f4f0): seleção positiva e estado concluído sem dominar a tela.
- **State Borders** (#b9d8cf / #c9d8ec / #efc7c3): contornos leves que mantêm estados verdes, azuis e rosas localizados.

### Neutral

- **Mist Canvas** (#f4f7f5): fundo contínuo da aplicação.
- **White Surface** (#ffffff): cartões, controles, menus e regiões de leitura.
- **Body Ink** (#405d54): texto operacional de contraste intermediário.
- **Supporting Ink** (#526a62): texto de apoio, metadados e descrições de estado.
- **Muted Ink** (#60766f): explicações, subtítulos e contexto secundário.
- **Soft Border** (#dfe8e3): divisão padrão entre superfícies.
- **Control Border** (#d7e3df): contorno de campos, seletores e controles.
- **Accent Border** (#bfd4cd): contorno de ações secundárias e estados verdes.
- **Divider Mist** (#e7eeea): separação interna de listas, tabelas e grades.
- **Mint Hover** (#edf7f4): resposta discreta de hover em ações verdes sobre superfície clara.
- **Neutral Soft** (#f1f5f3): estado neutro de chips e apoio tonal discreto.

### Named Rules

**The Clinical Contrast Rule.** Reserve o verde institucional e as cores semânticas para seleção, estado, foco, evidência e ação; grandes áreas permanecem brancas ou em névoa clara.

## Typography

**Display Font:** Playfair Display (com Georgia e Times New Roman como fallbacks)
**Body Font:** Geist (com Arial, Helvetica e sans-serif como fallbacks)
**Label/Mono Font:** Geist para rótulos; Geist Mono permanece disponível apenas para conteúdo monoespaçado real.

**Character:** Geist mantém leitura operacional direta em controles, tabelas, métricas e texto corrido. Playfair acrescenta uma pausa editorial pontual, sem entrar nos artefatos clínicos densos.

### Hierarchy

- **Display** (600, 2.35rem, 1.04): saudações ou aberturas editoriais; cresce responsivamente para 3rem e 3.65rem quando o espaço comporta.
- **Stat** (600, 2.25rem, 1): totais editoriais e resumos numéricos de alta hierarquia.
- **Headline** (600, 1.875rem, 1.2): títulos principais de área e identidade da pessoa selecionada.
- **Title** (600, 1.5rem, 1.333): títulos de seção, painéis e diálogos.
- **Metric** (600, 1.5rem, 1.333): valores resumidos com tracking levemente fechado.
- **Section Title** (600, 1.25rem, 1.75rem): títulos internos que precisam permanecer abaixo do título de área.
- **Card Title** (600, 1.125rem, 1.75rem): cabeçalhos de cartões e listas.
- **Body Large** (400, 1rem, 1.5rem): introduções curtas e contexto com maior respiro.
- **Body** (400, 0.875rem, 1.5rem): descrição, metadados e orientação operacional.
- **Label** (700, 0.75rem, 1rem): chips, estados e legendas curtas.
- **Support Label** (500, 0.6875rem, 1rem): descrição auxiliar em abas e metadados compactos; nunca é o único portador de uma ação.
- **Action** (700, 0.875rem, 1.25rem): botões, abas e links operacionais.

### Named Rules

**The Operational First Rule.** Geist conduz toda tarefa, controle, tabela, estado e evidência; Playfair aparece somente em momentos genuinamente editoriais.

## Layout

A base usa um ritmo de 4 px, com 8–12 px entre elementos relacionados, 16–24 px dentro de superfícies e 20–32 px entre blocos. O shell admite até 1540 px e as áreas de trabalho mais densas se concentram em até 1240 px, preservando margens laterais progressivas.

O sistema começa em 320 px com uma coluna, controles que podem rolar horizontalmente e conteúdo sem rolagem horizontal estrutural. Em 640 px a densidade interna aumenta; em 1024 px entram navegação lateral e grades auxiliares; em 1280 px painéis de apoio podem ocupar uma segunda coluna sem competir com a tarefa principal.

**The Progressive Compression Rule.** Ao reduzir a largura, empilhe regiões e permita rolagem local de abas ou filtros; não comprima controles, texto ou alvos abaixo da leitura confortável.

## Elevation & Depth

O material é plano por padrão. Superfícies se separam por fundo tonal, borda de 1 px e espaço; sombra aparece em menus, diálogos, marca e ações de destaque que realmente flutuam sobre o conteúdo.

### Shadow Vocabulary

- **Ambient Surface** (`box-shadow: 0 10px 35px rgba(28, 55, 47, 0.05)`): elevação baixa de painéis especiais sem romper a calma do workspace.
- **Floating Menu** (`box-shadow: 0 18px 48px rgba(23, 55, 47, 0.16)`): menus contextuais acima da camada de leitura.
- **Primary Action** (`box-shadow: 0 12px 30px rgba(46, 98, 83, 0.20)`): destaque raro para uma ação editorial ou de entrada.

### Named Rules

**The Flat-by-Default Rule.** Use borda e contraste tonal para estruturar a interface; sombra só comunica uma camada que de fato se eleva.

## Shapes

Controles compactos usam cantos suavemente curvos (8 px); botões, campos e abas usam 12 px; cartões recorrentes usam 16 px; diálogos e painéis de destaque usam 24 px. Avatares, indicadores e chips são circulares ou totalmente arredondados. Estados vazios podem trocar o contorno contínuo por tracejado, mantendo a mesma geometria.

## Components

Os componentes são refinados e contidos: familiares à primeira leitura, com estado explícito e feedback visual sem ornamento excessivo.

### Buttons

- **Shape:** controles de 44 px ou mais, cantos de 12 px e padding horizontal de 16–20 px.
- **Primary:** fundo Evergreen Ink, texto branco e peso 700; ícones acompanham o texto em 20 px.
- **Hover / Focus:** o fundo escurece de forma curta; foco visível usa contorno Institutional Green de 2 px com offset de 2 px.
- **Secondary:** superfície branca, texto Institutional Green Strong e borda Accent Border; hover usa uma camada verde muito clara.
- **Disabled:** mantém rótulo legível e reduz opacidade sem remover a distinção de forma.

### Chips

- **Style:** forma pill, padding de 6 px por 12 px, texto de 12 px em peso 700 e pares de fundo/texto coerentes por estado.
- **State:** toda cor acompanha um rótulo; verde, âmbar, rosa, azul e neutro nunca dependem apenas da tonalidade.

### Cards / Containers

- **Corner Style:** 16 px para cartões recorrentes; 24 px apenas para painéis de maior escala.
- **Background:** branco sobre Mist Canvas, com áreas auxiliares em tons muito claros.
- **Shadow Strategy:** sem sombra na maioria dos cartões; use a elevação definida apenas para camadas flutuantes ou painéis especiais.
- **Border:** 1 px em Soft Border; Accent Border marca controles ou estados verdes.
- **Internal Padding:** 16 px no compacto, 20 px por padrão e 24 px quando a leitura ganha largura.

### Inputs / Fields

- **Style:** fundo branco, contorno Control Border, 12 px de raio, altura mínima de 44 px e texto Geist de 14 px.
- **Focus:** contorno Institutional Green de 2 px com offset; o campo não depende de mudança de cor interna.
- **Error / Disabled:** o erro permanece localizado e rotulado; o estado desabilitado reduz ênfase sem ocultar o conteúdo necessário.

### Navigation

- **Style:** links semânticos com área mínima de 44 px; o item ativo usa fundo Evergreen Ink ou Mint Soft conforme a densidade do contexto.
- **Default / Hover / Focus:** estado padrão em Supporting Ink, hover em Mist Canvas e foco visível verde. Em telas estreitas, itens permanecem íntegros e rolam horizontalmente.

### Clinical Layer Badge

Um chip com ponto tonal distingue relato, fato observado, rascunho assistido e revisão humana. O rótulo sempre explicita a camada e preserva contraste entre fundo, borda, ponto e texto.

### Review Strip

A faixa de revisão é o padrão de maior contraste do sistema: superfície Evergreen Ink, estado rotulado, fonte visível, mudança concisa e uma ação clara para conferência. Ela destaca uma decisão humana sem transformar atenção em alarme.

**The Familiar Control Rule.** Toda ação essencial preserva pelo menos 44 px de altura, foco visível e um estado compreensível sem depender de hover.

## Do's and Don'ts

### Do:

- **Do** preserve superfícies brancas, bordas suaves e espaço como estrutura principal.
- **Do** reserve o verde mais forte para foco, seleção, ação e indicadores realmente funcionais.
- **Do** mantenha rótulo, origem ou descrição junto de toda cor semântica.
- **Do** use links semânticos quando a área possui histórico navegável ou endereço próprio.
- **Do** deixe abas e filtros rolarem horizontalmente antes de reduzir o alvo de toque.

### Don't:

- **Don't** use Playfair em controles, tabelas, chips, métricas clínicas ou texto operacional.
- **Don't** transforme cada cartão em uma camada elevada; a maior parte das superfícies permanece plana.
- **Don't** use verde, âmbar, rosa ou azul como decoração sem função de estado ou hierarquia.
- **Don't** comprima controles abaixo de 44 px nem remova o foco visível.
- **Don't** faça resumo, derivado ou estado visual competir com a fonte original que o sustenta.
