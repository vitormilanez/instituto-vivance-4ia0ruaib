from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT_DIR = Path(__file__).resolve().parents[1] / "output" / "pdf"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#17372F")
PRIMARY = colors.HexColor("#0B7B68")
MINT = colors.HexColor("#E8F4F0")
PALE = colors.HexColor("#F4F7F5")
BORDER = colors.HexColor("#D7E3DF")
MUTED = colors.HexColor("#60766F")
AMBER = colors.HexColor("#FFF4D8")
AMBER_INK = colors.HexColor("#825B0B")
ROSE = colors.HexColor("#FDECEA")
ROSE_INK = colors.HexColor("#9C453F")
WHITE = colors.white

PAGE_WIDTH, PAGE_HEIGHT = A4


styles = getSampleStyleSheet()
TITLE = ParagraphStyle(
    "TitleVivance",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=22,
    leading=26,
    textColor=INK,
    alignment=TA_LEFT,
    spaceAfter=5,
)
SUBTITLE = ParagraphStyle(
    "SubtitleVivance",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9,
    leading=13,
    textColor=MUTED,
    spaceAfter=11,
)
SECTION = ParagraphStyle(
    "SectionVivance",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=9,
    leading=12,
    textColor=PRIMARY,
    spaceAfter=5,
    uppercase=True,
)
BODY = ParagraphStyle(
    "BodyVivance",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9.3,
    leading=14,
    textColor=colors.HexColor("#405D54"),
)
BODY_SMALL = ParagraphStyle(
    "BodySmallVivance",
    parent=BODY,
    fontSize=8,
    leading=11,
    textColor=MUTED,
)
METRIC_LABEL = ParagraphStyle(
    "MetricLabelVivance",
    parent=BODY_SMALL,
    fontName="Helvetica-Bold",
    fontSize=7,
    leading=9,
    textColor=MUTED,
)
METRIC_VALUE = ParagraphStyle(
    "MetricValueVivance",
    parent=BODY,
    fontName="Helvetica-Bold",
    fontSize=14,
    leading=17,
    textColor=INK,
)
CHIP = ParagraphStyle(
    "ChipVivance",
    parent=BODY_SMALL,
    fontName="Helvetica-Bold",
    fontSize=7.5,
    leading=10,
    textColor=PRIMARY,
    alignment=TA_CENTER,
)


def paragraph(text: str, style=BODY):
    return Paragraph(text, style)


def card(content, background=WHITE, padding=10, border=BORDER, width=174 * mm):
    table = Table([[content]], colWidths=[width])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), background),
                ("BOX", (0, 0), (-1, -1), 0.7, border),
                ("LEFTPADDING", (0, 0), (-1, -1), padding),
                ("RIGHTPADDING", (0, 0), (-1, -1), padding),
                ("TOPPADDING", (0, 0), (-1, -1), padding),
                ("BOTTOMPADDING", (0, 0), (-1, -1), padding),
            ]
        )
    )
    return table


def section_card(title: str, body: str, source: str | None = None, tone=WHITE, width=174 * mm):
    rows = [paragraph(escape(title).upper(), SECTION), paragraph(body, BODY)]
    if source:
        rows.extend([Spacer(1, 4), paragraph(f"Fonte: {escape(source)}", BODY_SMALL)])
    return card(rows, background=tone, width=width)


def metadata_table(rows):
    data = []
    for label, value in rows:
        data.append(
            [
                paragraph(escape(label).upper(), METRIC_LABEL),
                paragraph(escape(value), BODY_SMALL),
            ]
        )
    table = Table(data, colWidths=[38 * mm, 136 * mm])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.7, BORDER),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def metric_row(metrics):
    cells = []
    for label, value, note in metrics:
        cells.append(
            [
                paragraph(escape(label).upper(), METRIC_LABEL),
                Spacer(1, 2),
                paragraph(escape(value), METRIC_VALUE),
                paragraph(escape(note), BODY_SMALL),
            ]
        )
    table = Table([cells], colWidths=[174 * mm / len(cells)] * len(cells))
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 0.7, BORDER),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, BORDER),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 9),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    return table


def two_column(left, right, widths=(86 * mm, 86 * mm)):
    table = Table([[left, right]], colWidths=list(widths), hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, -1), 4),
                ("LEFTPADDING", (1, 0), (1, -1), 4),
                ("RIGHTPADDING", (1, 0), (1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#F7FAF8"))
    canvas.setFont("Helvetica-Bold", 44)
    canvas.translate(58 * mm, 85 * mm)
    canvas.rotate(35)
    canvas.drawString(0, 0, "DEMONSTRATIVO")
    canvas.rotate(-35)
    canvas.translate(-58 * mm, -85 * mm)

    canvas.setFillColor(PRIMARY)
    canvas.roundRect(18 * mm, PAGE_HEIGHT - 22 * mm, 12 * mm, 12 * mm, 3 * mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.drawCentredString(24 * mm, PAGE_HEIGHT - 15.2 * mm, "IV")
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 10.5)
    canvas.drawString(34 * mm, PAGE_HEIGHT - 13.7 * mm, "Instituto Vivance")
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.2)
    canvas.drawString(34 * mm, PAGE_HEIGHT - 18.2 * mm, "Cuidado continuo")
    canvas.setFillColor(PRIMARY)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawRightString(PAGE_WIDTH - 18 * mm, PAGE_HEIGHT - 15.7 * mm, "DOCUMENTO ASSISTIDO POR IA")

    canvas.setStrokeColor(BORDER)
    canvas.line(18 * mm, 15 * mm, PAGE_WIDTH - 18 * mm, 15 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 6.8)
    canvas.drawString(18 * mm, 10 * mm, "Gerado por IA - requer revisao medica - sem validade clinica")
    canvas.drawRightString(PAGE_WIDTH - 18 * mm, 10 * mm, f"Pagina {doc.page}")
    canvas.restoreState()


def build_pdf(filename: str, title: str, subtitle: str, story):
    path = OUTPUT_DIR / filename
    doc = SimpleDocTemplate(
        str(path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=28 * mm,
        bottomMargin=20 * mm,
        title=title,
        author="Instituto Vivance - prototipo demonstrativo",
        subject=subtitle,
    )
    contents = [paragraph(escape(title), TITLE), paragraph(escape(subtitle), SUBTITLE)]
    contents.extend(story)
    doc.build(contents, onFirstPage=on_page, onLaterPages=on_page)
    return path


def first_consultation():
    story = [
        metadata_table(
            [
                ("Paciente", "Marina Costa - perfil ficticio"),
                ("Consulta", "Primeira consulta - 12 de agosto de 2026"),
                ("Status", "Rascunho gerado automaticamente - revisao pendente"),
            ]
        ),
        Spacer(1, 8),
        section_card(
            "Objetivo nas palavras da paciente",
            "Quero perder peso com energia, dormir melhor e construir uma rotina que eu consiga manter.",
            "Conversa de pre-consulta por voz",
            MINT,
        ),
        Spacer(1, 7),
        two_column(
            section_card(
                "Historia organizada",
                "Relata dificuldade para manter horarios regulares de sono e jantar. Refere maior fome no fim do dia e tentativas anteriores com baixa sustentacao.",
                "Questionario + transcricao",
                width=82 * mm,
            ),
            section_card(
                "Contexto e preferencias",
                "Prefere orientacoes curtas, metas semanais e acompanhamento por mensagem. Nao informou alergias no formulario demonstrativo.",
                "Dados declarados pela paciente",
                width=82 * mm,
            ),
        ),
        Spacer(1, 7),
        two_column(
            section_card(
                "Pontos para validar",
                "- Qualidade e fragmentacao do sono<br/>- Rotina alimentar noturna<br/>- Historico de exames e medicamentos<br/>- Expectativas para o primeiro ciclo",
                "Sugestoes da IA para revisao",
                AMBER,
                width=82 * mm,
            ),
            section_card(
                "Decisoes registradas",
                "- Ciclo inicial de 90 dias<br/>- Check-in tres vezes por semana<br/>- Diario de sono e fotos de refeicoes<br/>- Retorno em 30 dias",
                "Notas demonstrativas do medico",
                MINT,
                width=82 * mm,
            ),
        ),
        Spacer(1, 8),
        section_card(
            "Rastreabilidade",
            "Conteudo organizado a partir de respostas da paciente, transcricao da pre-consulta e notas do medico. Nenhuma inferencia substitui anamnese, exame, diagnostico ou decisao clinica.",
            "Trilha de auditoria demonstrativa - versao 1.0",
            PALE,
        ),
    ]
    return build_pdf(
        "doc-demo-001.pdf",
        "Sintese da primeira consulta",
        "Marina Costa - documento demonstrativo gerado automaticamente",
        story,
    )


def evolution_report():
    story = [
        metadata_table(
            [
                ("Periodo", "11 a 25 de agosto de 2026"),
                ("Ciclo", "Dia 29 de 90"),
                ("Status", "Revisado em 24 de agosto - mock"),
            ]
        ),
        Spacer(1, 8),
        metric_row(
            [
                ("Peso", "-1,8 kg", "desde o inicio"),
                ("Adesao", "82%", "metas registradas"),
                ("Sono medio", "6h12", "14 noites"),
                ("Check-ins", "11/14", "periodo"),
            ]
        ),
        Spacer(1, 8),
        section_card(
            "Sintese longitudinal",
            "Houve evolucao consistente de peso e boa adesao geral. A energia relatada caiu nos dias posteriores a noites com menos de seis horas de sono. A associacao e apenas um padrao observacional e deve ser confirmada pelo medico.",
            "Check-ins, diario de sono e registros demonstrativos",
            MINT,
        ),
        Spacer(1, 7),
        two_column(
            section_card(
                "O que melhorou",
                "- Maior regularidade no cafe da manha<br/>- Aumento de passos em 9%<br/>- Mais registros de saciedade<br/>- Menor peso no periodo",
                "Comparacao com o ciclo anterior",
                width=82 * mm,
            ),
            section_card(
                "Sinais para revisar",
                "- Quatro noites abaixo de seis horas<br/>- Duas refeicoes sem confirmacao<br/>- Energia menor em tres check-ins<br/>- Exame anexado ainda nao revisado",
                "Caixa por excecao assistida",
                AMBER,
                width=82 * mm,
            ),
        ),
        Spacer(1, 7),
        section_card(
            "Preparacao sugerida para a proxima consulta",
            "1. Investigar despertares noturnos.  2. Confirmar tolerancia ao plano atual.  3. Revisar o exame anexado.  4. Definir uma meta simples para a proxima quinzena.",
            "Agenda proposta pela IA - requer aprovacao medica",
            PALE,
        ),
    ]
    return build_pdf(
        "doc-demo-002.pdf",
        "Relatorio de evolucao quinzenal",
        "Marina Costa - sintese longitudinal demonstrativa",
        story,
    )


def care_plan():
    story = [
        metadata_table(
            [
                ("Plano", "Ciclo inicial de 90 dias - versao 1.2"),
                ("Atualizacao", "25 de agosto de 2026"),
                ("Status", "Aguardando aprovacao medica"),
            ]
        ),
        Spacer(1, 8),
        section_card(
            "Objetivo compartilhado",
            "Promover reducao de peso sustentavel preservando energia, sono e autonomia. As metas abaixo sao demonstrativas e nao representam orientacao clinica real.",
            "Objetivo registrado durante a consulta",
            MINT,
        ),
        Spacer(1, 7),
        two_column(
            section_card(
                "Rotina e alimentacao",
                "- Registrar jantar e saciedade<br/>- Enviar foto quando desejar analise<br/>- Confirmar os alimentos reconhecidos<br/>- Sinalizar sintomas no mesmo dia",
                "Plano demonstrativo",
                width=82 * mm,
            ),
            section_card(
                "Sono e movimento",
                "- Registrar horario de dormir<br/>- Revisar despertares na consulta<br/>- Acompanhar passos sem meta punitiva<br/>- Priorizar consistencia semanal",
                "Plano demonstrativo",
                width=82 * mm,
            ),
        ),
        Spacer(1, 7),
        two_column(
            section_card(
                "O que a paciente faz",
                "Check-ins segunda, quarta e sexta; confirma analises de refeicao; relata sintomas; escolhe quais dados do relogio compartilhar.",
                "Responsabilidades acordadas",
                PALE,
                width=82 * mm,
            ),
            section_card(
                "O que o medico revisa",
                "Sinais fora do padrao, relatorios gerados, receitas, exames, tendencias de sono e qualquer sugestao antes de chegar a paciente.",
                "Governanca clinica",
                PALE,
                width=82 * mm,
            ),
        ),
        Spacer(1, 7),
        two_column(
            section_card(
                "Automacoes do cuidado",
                "- Lembrete de check-in contextual<br/>- Resumo semanal para revisao<br/>- Alerta de receita proxima do vencimento<br/>- PDF simples apos aprovacao",
                "Automacoes simuladas",
                AMBER,
                width=82 * mm,
            ),
            section_card(
                "Limites e consentimento",
                "A paciente pode corrigir dados e revogar integracoes. A IA nao diagnostica, prescreve, altera dose ou envia recomendacao clinica sem revisao do medico.",
                "Politica demonstrativa de seguranca",
                ROSE,
                width=82 * mm,
            ),
        ),
    ]
    return build_pdf(
        "doc-demo-003.pdf",
        "Plano de cuidado compartilhado",
        "Marina Costa - versao demonstrativa para revisao",
        story,
    )


def main():
    paths = [first_consultation(), evolution_report(), care_plan()]
    for path in paths:
        print(path)


if __name__ == "__main__":
    main()
