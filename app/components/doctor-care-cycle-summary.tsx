'use client';

import Link from 'next/link';
import { useCareDemo } from './care-demo-store';
import { getPatientMessagesHref } from './demo-routes';
import { Status } from './shared';

const cadenceLabel = {
  daily: 'diária',
  'three-times-week': '3 vezes por semana',
  weekly: 'semanal',
} as const;

export function DoctorCareCycleSummary({
  patientId,
  encounterId,
}: {
  patientId: string;
  encounterId: string;
}) {
  const {
    latestCheckIn,
    latestCheckInReview,
    activeFollowUpConfiguration,
    latestFollowUpContact,
    diaryEntries,
    actionConfirmations,
    conversationMessages,
    latestPublishedCarePlan,
  } = useCareDemo(patientId, encounterId);

  const latestPatientMessage = [...conversationMessages].reverse().find(
    (message) => message.sender === 'patient',
  ) ?? null;
  const doctorReplyAfterLatestPatientMessage = latestPatientMessage
    ? conversationMessages.some(
        (message) => message.sender === 'doctor' && message.sentAtIso > latestPatientMessage.sentAtIso,
      )
    : false;
  const hasUnansweredMessage = Boolean(latestPatientMessage && !doctorReplyAfterLatestPatientMessage);
  const checkInAfterConfiguration = activeFollowUpConfiguration
    ? Boolean(latestCheckIn && latestCheckIn.submittedAtIso >= activeFollowUpConfiguration.configuredAtIso)
    : false;
  const missingExpectedCheckIn = Boolean(
    activeFollowUpConfiguration && !checkInAfterConfiguration && !latestFollowUpContact,
  );
  const hasUnreviewedCheckIn = Boolean(latestCheckIn && !latestCheckInReview);

  const summary = hasUnreviewedCheckIn
    ? {
        tone: 'amber' as const,
        status: 'Leitura pendente',
        action: 'Um check-in aguarda leitura humana',
        evidence: `Check-in v${latestCheckIn?.version} registrado em ${latestCheckIn?.submittedAt}${latestCheckIn?.newSymptom ? ', com marcação de sintoma novo' : ''}.`,
        next: 'Abrir o acompanhamento e registrar apenas que a fonte foi lida.',
        destination: 'follow-up' as const,
      }
    : hasUnansweredMessage
      ? {
          tone: 'blue' as const,
          status: 'Conversa nova',
          action: 'Há uma mensagem contextualizada sem resposta nesta sessão',
          evidence: `Mensagem v${latestPatientMessage?.version} vinculada a ${latestPatientMessage?.context === 'care-plan' ? 'plano de cuidado' : latestPatientMessage?.context === 'check-in' ? 'check-in' : latestPatientMessage?.context === 'diary' ? 'diário' : 'outro assunto'}.`,
          next: 'Ler o conteúdo na conversa e responder dentro do mesmo contexto.',
          destination: 'messages' as const,
        }
      : missingExpectedCheckIn
        ? {
            tone: 'amber' as const,
            status: 'Acompanhamento aberto',
            action: 'Ainda não há registro depois da cadência combinada',
            evidence: `Cadência ${cadenceLabel[activeFollowUpConfiguration!.cadence]} vinculada ao plano v${activeFollowUpConfiguration!.planVersion}.`,
            next: 'Avaliar um contato manual; a ausência não é classificada como risco ou urgência.',
            destination: 'follow-up' as const,
          }
        : {
            tone: 'green' as const,
            status: 'Ciclo organizado',
            action: 'Nenhuma ação operacional pendente nesta sessão',
            evidence: `${latestPublishedCarePlan ? `Plano v${latestPublishedCarePlan.version}` : 'Sem plano publicado'}, ${diaryEntries.length} ${diaryEntries.length === 1 ? 'registro de diário' : 'registros de diário'} e ${actionConfirmations.length} ${actionConfirmations.length === 1 ? 'confirmação' : 'confirmações'}.`,
            next: 'Revisar as fontes do histórico antes da próxima conversa.',
            destination: 'follow-up' as const,
          };

  return (
    <section aria-labelledby="care-cycle-summary-title" className="border-t border-[#e7edf5] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 id="care-cycle-summary-title" className="text-xl font-semibold tracking-[-0.02em] text-[#071a3a]">O que fazer agora, com a fonte visível</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#61718a]">Prioridade operacional determinística da sessão; não é inferência clínica, triagem ou monitoramento contínuo.</p>
        </div>
        <Status tone={summary.tone}>{summary.status}</Status>
      </div>

      <dl className="mt-5 grid overflow-hidden rounded-xl border border-[#dbe4f0] bg-[#e7edf5] lg:grid-cols-3">
        <div className="bg-white p-4">
          <dt className="text-xs font-bold text-[#50627f]">O que merece ação</dt>
          <dd className="mt-2 text-sm font-bold leading-6 text-[#071a3a]">{summary.action}</dd>
        </div>
        <div className="border-t border-[#e7edf5] bg-white p-4 lg:border-l lg:border-t-0">
          <dt className="text-xs font-bold text-[#50627f]">Por quê · evidência</dt>
          <dd className="mt-2 text-sm leading-6 text-[#405675]">{summary.evidence}</dd>
        </div>
        <div className="border-t border-[#c8d8eb] bg-[#edf3fb] p-4 lg:border-l lg:border-t-0">
          <dt className="text-xs font-bold text-[#124da0]">Próximo passo humano</dt>
          <dd className="mt-2 text-sm leading-6 text-[#405675]">{summary.next}</dd>
          {summary.destination === 'messages' ? (
            <Link href={getPatientMessagesHref(patientId)} className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-[#124da0] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">
              Abrir conversa
            </Link>
          ) : (
            <a href="#follow-up-workspace-title" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-[#124da0] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] focus-visible:ring-offset-2">
              Ir para acompanhamento
            </a>
          )}
        </div>
      </dl>
    </section>
  );
}
