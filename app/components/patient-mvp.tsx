'use client';

import {
  ArrowRight,
  ChartLineUp,
  ChatCircle,
  Check,
  CheckCircle,
  CookingPot,
  Heart,
  House,
  ShieldCheck,
  TrendDown,
} from '@phosphor-icons/react';
import Link from 'next/link';
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useCareDemo } from './care-demo-store';
import type {
  CareCheckIn,
  CareCheckInInput,
} from './care-demo-types';
import {
  getPatientPrimaryView,
  getPatientSectionHref,
  patientNavigation,
  type PatientView,
} from './demo-routes';
import {
  getInitialPatientMvpSessionState,
  getPatientMvpData,
  normalizePatientMvpSessionState,
  patientMvpScenarioLinks,
  type FilledPatientMvpData,
  type PatientMvpAppointmentChoice,
  type PatientMvpData,
  type PatientMvpPhotoPose,
  type PatientMvpPreparationStepId,
  type PatientMvpSessionState,
  type PendingPatientMvpData,
} from './patient-mvp-data';
import {
  CareScreen,
  CheckInDialog,
  ConversationScreen,
  EvolutionScreen,
  type CareDestination,
} from './patient-mvp-sections';
import { PatientQuickActions } from './patient-quick-actions';
import { cn, Status, Toast } from './shared';
import { useSessionDemoState } from './use-session-demo-state';

const patientNavigationIcons = {
  Hoje: House,
  'Meu cuidado': Heart,
  Conversas: ChatCircle,
  Evolução: ChartLineUp,
} as const;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2';
const primaryButton = cn(
  'inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0b7b68] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(11,123,104,0.2)] transition-colors hover:bg-[#096b5b] disabled:cursor-not-allowed disabled:bg-[#829c95] disabled:shadow-none',
  focusRing,
);

function normalizeFilledSession(value: unknown) {
  return normalizePatientMvpSessionState(
    value,
    getInitialPatientMvpSessionState('pac-demo-001'),
  );
}

function normalizePendingSession(value: unknown) {
  return normalizePatientMvpSessionState(
    value,
    getInitialPatientMvpSessionState('pac-demo-006'),
  );
}

function getInitialCareDestination(view: PatientView): CareDestination {
  if (view === 'Diário') return 'journal';
  if (view === 'Consultas') return 'appointments';
  if (view === 'Medicamentos') return 'medications';
  return 'plan';
}

function useScrollAwarePatientNavigation() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const downwardTravel = useRef(0);
  const upwardTravel = useRef(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    lastY.current = Math.max(0, window.scrollY);

    const update = () => {
      frame.current = null;
      const nextY = Math.max(0, window.scrollY);
      const delta = nextY - lastY.current;

      if (nextY <= 24) {
        downwardTravel.current = 0;
        upwardTravel.current = 0;
        setVisible(true);
      } else if (Math.abs(delta) >= 2) {
        if (delta > 0) {
          downwardTravel.current += delta;
          upwardTravel.current = 0;
          if (downwardTravel.current >= 32) {
            setVisible(false);
            downwardTravel.current = 0;
          }
        } else {
          upwardTravel.current += Math.abs(delta);
          downwardTravel.current = 0;
          if (upwardTravel.current >= 16) {
            setVisible(true);
            upwardTravel.current = 0;
          }
        }
      }

      lastY.current = nextY;
    };

    const onScroll = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return visible;
}

export default function PatientMvpWorkspace({
  patientId,
  encounterId,
  initialView,
}: {
  patientId: string;
  encounterId: string;
  initialView: PatientView;
}) {
  const data = getPatientMvpData(patientId);
  const primaryView = getPatientPrimaryView(initialView);
  const {
    hydrated,
    latestCheckIn,
    latestCheckInReview,
    conversationMessages,
    submitCheckIn,
    sendConversationMessage,
  } = useCareDemo(patientId, encounterId);
  const [session, setSession, sessionHydrated] = useSessionDemoState(
    `vivanse-patient-mvp-v1:${patientId}`,
    getInitialPatientMvpSessionState(patientId),
    data.scenario === 'pending' ? normalizePendingSession : normalizeFilledSession,
  );
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [careDestination, setCareDestination] = useState<CareDestination>(() =>
    getInitialCareDestination(initialView),
  );
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | null>(null);
  const navigationVisible = useScrollAwarePatientNavigation();

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
  }, []);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3600);
  };

  const addCompletedStep = (step: PatientMvpPreparationStepId) => {
    setSession((current) => ({
      ...current,
      completedPreparationSteps: current.completedPreparationSteps.includes(step)
        ? current.completedPreparationSteps
        : [...current.completedPreparationSteps, step],
    }));
  };

  const completeCheckIn = (input: CareCheckInInput) => {
    submitCheckIn(input);
    addCompletedStep('story');
    notify(
      input.aiAssistanceAllowed === false
        ? 'Seu relato original chegou ao médico. Você optou por não gerar um rascunho.'
        : data.scenario === 'pending'
        ? 'Seu relato foi enviado. O original e o rascunho chegaram separados ao médico.'
        : 'Check-in enviado. Seu relato original foi preservado para revisão médica.',
    );
    setCheckInOpen(false);
  };

  const markMedicationRead = () => {
    if (session.medicationRead) return;
    setSession((current) => ({ ...current, medicationRead: true }));
    sendConversationMessage('patient', {
      context: 'care-plan',
      body: 'Confirmação demonstrativa: li a orientação fictícia de medicamento publicada pelo médico. Esta confirmação registra leitura, não uso.',
    });
    notify('Leitura confirmada. O médico verá apenas que você leu, não que usou o medicamento.');
  };

  const chooseAppointment = (choice: PatientMvpAppointmentChoice) => {
    setSession((current) => ({ ...current, appointmentChoice: choice }));
    sendConversationMessage('patient', {
      context: 'general',
      body: choice === 'confirmed'
        ? 'Retorno fictício de 16 de setembro, às 14h30, confirmado pela paciente.'
        : 'Solicitação demonstrativa: gostaria de ver outras opções para o retorno.',
    });
    notify(choice === 'confirmed' ? 'Horário confirmado no mock.' : 'Pedido de outras opções enviado ao médico.');
  };

  const saveMeasures = (weight: string, waist: string) => {
    setSession((current) => ({
      ...current,
      measures: { weight, waist },
      completedPreparationSteps: current.completedPreparationSteps.includes('measures')
        ? current.completedPreparationSteps
        : [...current.completedPreparationSteps, 'measures'],
    }));
    sendConversationMessage('patient', {
      context: 'general',
      body: `Medidas iniciais fictícias informadas pelo paciente: peso ${weight} kg e cintura ${waist} cm.`,
    });
    notify('Medidas demonstrativas salvas e identificadas como autorrelato.');
  };

  const saveMedicationReport = (choice: 'uses' | 'none', report: string) => {
    setSession((current) => ({
      ...current,
      medicationChoice: choice,
      medicationReport: report,
      completedPreparationSteps: current.completedPreparationSteps.includes('medications')
        ? current.completedPreparationSteps
        : [...current.completedPreparationSteps, 'medications'],
    }));
    sendConversationMessage('patient', {
      context: 'general',
      body: choice === 'none'
        ? 'Informação original do paciente: não uso medicamentos atualmente.'
        : `Informação original do paciente sobre medicamentos atuais: ${report}`,
    });
    notify('Resposta salva como informação do paciente, ainda sem validação médica.');
  };

  const choosePhotoPath = (choice: 'protocol' | 'alternative') => {
    setSession((current) => ({
      ...current,
      photoChoice: choice,
      completedPreparationSteps: choice === 'alternative'
        ? current.completedPreparationSteps.includes('photos')
          ? current.completedPreparationSteps
          : [...current.completedPreparationSteps, 'photos']
        : current.completedPreparationSteps.filter((step) => step !== 'photos'),
    }));
    if (choice === 'alternative') {
      sendConversationMessage('patient', {
        context: 'general',
        body: 'Escolha original do paciente: prefiro uma alternativa às fotos corporais. Aguardo revisão do médico sobre como seguir.',
      });
      notify('Sua preferência por uma alternativa foi enviada ao médico.');
    }
  };

  const togglePhotoSlot = (pose: PatientMvpPhotoPose['id']) => {
    setSession((current) => {
      const photoSlots = current.photoSlots.includes(pose)
        ? current.photoSlots.filter((slot) => slot !== pose)
        : [...current.photoSlots, pose];
      const completedPreparationSteps: PatientMvpPreparationStepId[] = photoSlots.length === 3
        ? current.completedPreparationSteps.includes('photos')
          ? current.completedPreparationSteps
          : [...current.completedPreparationSteps, 'photos']
        : current.completedPreparationSteps.filter((step) => step !== 'photos');
      return { ...current, photoSlots, completedPreparationSteps };
    });
  };

  const askMedicationQuestion = () => {
    sendConversationMessage('patient', {
      context: 'care-plan',
      body: 'Tenho uma dúvida sobre a orientação fictícia de medicamento publicada. Gostaria de conversar com o médico antes de confirmar a leitura.',
    });
    notify('Dúvida enviada à conversa. Nenhuma resposta clínica foi gerada automaticamente.');
  };

  if (!hydrated || !sessionHydrated) {
    return (
      <main id="main-content" className="mx-auto min-h-[calc(100vh-72px)] max-w-5xl px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-[#d9e5e0] bg-white p-5 text-sm text-[#526a62]">
          Preparando seu cenário demonstrativo...
        </div>
      </main>
    );
  }

  return (
    <>
      <main
        id="main-content"
        className="mx-auto min-h-[calc(100vh-72px)] max-w-5xl px-4 pb-28 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8"
      >
        <ScenarioSwitcher patientId={patientId} initialView={initialView} />

        {primaryView === 'Hoje' ? (
          <TodayScreen
            data={data}
            session={session}
            latestCheckIn={latestCheckIn}
            onOpenCheckIn={() => setCheckInOpen(true)}
            onMarkMedicationRead={markMedicationRead}
            onAskMedicationQuestion={askMedicationQuestion}
            onChooseAppointment={chooseAppointment}
            onSaveMeasures={saveMeasures}
          />
        ) : null}

        {primaryView === 'Meu cuidado' ? (
          <CareScreen
            data={data}
            session={session}
            latestCheckIn={latestCheckIn}
            latestCheckInReviewed={Boolean(latestCheckInReview)}
            activeDestination={careDestination}
            onChangeDestination={setCareDestination}
            onOpenCheckIn={() => setCheckInOpen(true)}
            onMarkMedicationRead={markMedicationRead}
            onAskMedicationQuestion={askMedicationQuestion}
            onChooseAppointment={chooseAppointment}
            onSaveMedication={saveMedicationReport}
            onPlanExperience={(planExperience) =>
              setSession((current) => ({ ...current, planExperience }))
            }
          />
        ) : null}

        {primaryView === 'Conversas' ? (
          <ConversationScreen
            data={data}
            messages={conversationMessages}
            onSend={(body) => {
              sendConversationMessage('patient', { context: 'general', body });
              notify('Mensagem demonstrativa enviada para a equipe.');
            }}
          />
        ) : null}

        {primaryView === 'Evolução' ? (
          <EvolutionScreen
            data={data}
            session={session}
            onSaveMeasures={saveMeasures}
            onChoosePhotoPath={choosePhotoPath}
            onTogglePhotoSlot={togglePhotoSlot}
          />
        ) : null}
      </main>

      <div className="patient-bottom-navigation" data-visible={navigationVisible ? 'true' : 'false'}>
        <nav
          aria-label="Navegação do paciente"
          className="floating-navigation-glass grid w-full max-w-[600px] grid-cols-4 gap-1 rounded-[22px] p-1.5"
        >
          {patientNavigation.map(({ label }) => {
            const Icon = patientNavigationIcons[label];
            const active = primaryView === label;
            return (
              <Link
                key={label}
                href={getPatientSectionHref(patientId, label)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-12 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124da0] md:min-h-11 md:flex-row md:gap-2 md:px-3 md:text-xs',
                  active
                    ? 'bg-[#061b3e]/92 text-white shadow-[0_7px_18px_rgba(3,19,45,0.18)]'
                    : 'text-[#405675] hover:bg-white/70 hover:text-[#071a3a]',
                )}
              >
                <Icon aria-hidden="true" size={16} weight={active ? 'fill' : 'regular'} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {checkInOpen ? (
        <CheckInDialog
          patient={data}
          onClose={() => setCheckInOpen(false)}
          onComplete={completeCheckIn}
        />
      ) : null}

      <Toast text={toast} patient />
    </>
  );
}

function ScenarioSwitcher({
  patientId,
  initialView,
}: {
  patientId: string;
  initialView: PatientView;
}) {
  return (
    <section
      aria-label="Alternar cenário demonstrativo"
      className="mb-5 flex items-center gap-2 rounded-2xl border border-[#d9e5e0] bg-white p-2 sm:p-2.5"
    >
      <p className="sr-only">Cenário fictício</p>
      <div className="grid flex-1 grid-cols-2 gap-1 rounded-xl bg-[#edf4f1] p-1">
        {patientMvpScenarioLinks.map((scenario) => {
          const active = patientId === scenario.patientId;
          return (
            <Link
              key={scenario.patientId}
              href={getPatientSectionHref(scenario.patientId, initialView)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-10 items-center justify-center rounded-lg px-2 text-center text-[11px] font-bold leading-4 transition-colors sm:min-h-11 sm:text-xs',
                focusRing,
                active
                  ? 'bg-white text-[#17372f] shadow-[0_4px_12px_rgba(28,55,47,0.08)]'
                  : 'text-[#526a62] hover:bg-white/70 hover:text-[#17372f]',
              )}
            >
              {scenario.label}
            </Link>
          );
        })}
      </div>
      <Link
        href={`/medico/pacientes/${patientId}`}
        aria-label="Ver este cenário na área médica"
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-xl text-[#124da0] transition-colors hover:bg-[#edf3fb] sm:inline-flex sm:w-auto sm:gap-2 sm:px-3',
          focusRing,
        )}
      >
        <span className="hidden sm:inline">Ver no médico</span>
        <ArrowRight aria-hidden="true" size={15} />
      </Link>
    </section>
  );
}

function ScreenIntro({
  status,
  title,
  description,
}: {
  status: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">{status}</div>
      <h1 className="mt-3 max-w-2xl text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[#17372f] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526a62]">{description}</p>
    </header>
  );
}

function TodayScreen({
  data,
  session,
  latestCheckIn,
  onOpenCheckIn,
  onMarkMedicationRead,
  onAskMedicationQuestion,
  onChooseAppointment,
  onSaveMeasures,
}: {
  data: PatientMvpData;
  session: PatientMvpSessionState;
  latestCheckIn: CareCheckIn | null;
  onOpenCheckIn: () => void;
  onMarkMedicationRead: () => void;
  onAskMedicationQuestion: () => void;
  onChooseAppointment: (choice: PatientMvpAppointmentChoice) => void;
  onSaveMeasures: (weight: string, waist: string) => void;
}) {
  return (
    <section>
      <ScreenIntro
        status={(
          <>
            <Status tone="amber">Dados fictícios</Status>
            <Status tone={data.scenario === 'filled' ? 'green' : 'blue'}>
              {data.scenario === 'filled' ? 'Acompanhamento ativo' : 'Preparação inicial'}
            </Status>
          </>
        )}
        title={data.scenario === 'filled' ? `Olá, ${data.firstName}.` : 'Vamos montar seu ponto de partida?'}
        description={data.scenario === 'filled'
          ? 'Você vê primeiro o que precisa da sua atenção. O restante fica organizado para consultar quando quiser.'
          : 'Uma etapa por vez, no seu ritmo. Você pode falar, escrever, salvar e continuar depois.'}
      />

      {data.scenario === 'filled' ? (
        <FilledToday
          data={data}
          session={session}
          latestCheckIn={latestCheckIn}
          onOpenCheckIn={onOpenCheckIn}
          onMarkMedicationRead={onMarkMedicationRead}
          onAskMedicationQuestion={onAskMedicationQuestion}
          onChooseAppointment={onChooseAppointment}
          onSaveMeasures={onSaveMeasures}
        />
      ) : (
        <PendingToday
          data={data}
          session={session}
          latestCheckIn={latestCheckIn}
          onOpenCheckIn={onOpenCheckIn}
        />
      )}
    </section>
  );
}

function FilledToday({
  data,
  session,
  latestCheckIn,
  onOpenCheckIn,
  onMarkMedicationRead,
  onAskMedicationQuestion,
  onChooseAppointment,
  onSaveMeasures,
}: {
  data: FilledPatientMvpData;
  session: PatientMvpSessionState;
  latestCheckIn: CareCheckIn | null;
  onOpenCheckIn: () => void;
  onMarkMedicationRead: () => void;
  onAskMedicationQuestion: () => void;
  onChooseAppointment: (choice: PatientMvpAppointmentChoice) => void;
  onSaveMeasures: (weight: string, waist: string) => void;
}) {
  return (
    <>
      <PatientQuickActions
        data={data}
        session={session}
        latestCheckIn={latestCheckIn}
        onOpenCheckIn={onOpenCheckIn}
        onMarkMedicationRead={onMarkMedicationRead}
        onAskMedicationQuestion={onAskMedicationQuestion}
        onChooseAppointment={onChooseAppointment}
        onSaveMeasures={onSaveMeasures}
      />

      <section aria-labelledby="filled-progress-title" className="mt-8 rounded-2xl border border-[#d9e5e0] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="filled-progress-title" className="text-xl font-semibold tracking-[-0.02em]">Seu caminho até aqui</h2>
            <p className="mt-1 text-sm text-[#60766f]">Autorrelatos e medidas preservados com data e origem.</p>
          </div>
          <Status tone="green">Plano alimentar aprovado</Status>
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <MetricChange label="Peso" from="94,8 kg" to="91,6 kg" change="−3,2 kg" />
          <MetricChange label="Cintura" from="109 cm" to="104,5 cm" change="−4,5 cm" />
          <div className="border-t border-[#e4ece8] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
            <dt className="text-xs font-bold text-[#60766f]">Plano publicado</dt>
            <dd className="mt-2 text-lg font-semibold text-[#17372f]">{data.foodPlan.approvedAt}</dd>
            <p className="mt-1 text-xs leading-5 text-[#60766f]">Revisado por {data.doctorName}</p>
          </div>
        </dl>
        <p className="mt-5 border-t border-[#e4ece8] pt-4 text-xs leading-5 text-[#60766f]">
          Os resultados variam. Seu médico avalia o conjunto das informações; uma medida isolada não define sucesso ou falha.
        </p>
      </section>

      <DoctorHandoff
        patientId={data.patientId}
        hasSubmission={Boolean(latestCheckIn)}
        aiAssistanceAllowed={latestCheckIn?.aiAssistanceAllowed ?? null}
      />
    </>
  );
}

function PendingToday({
  data,
  session,
  latestCheckIn,
  onOpenCheckIn,
}: {
  data: PendingPatientMvpData;
  session: PatientMvpSessionState;
  latestCheckIn: CareCheckIn | null;
  onOpenCheckIn: () => void;
}) {
  const storyComplete = session.completedPreparationSteps.includes('story') || Boolean(latestCheckIn);
  const stepIsComplete = (step: PatientMvpPreparationStepId) =>
    session.completedPreparationSteps.includes(step) || (step === 'story' && storyComplete);
  const completedCount = data.preparationSteps.filter((step) => stepIsComplete(step.id)).length;
  const nextStep = data.preparationSteps.find(
    (step) => !stepIsComplete(step.id),
  );
  const progress = Math.min(100, (completedCount / data.preparationSteps.length) * 100);
  const nextStepHref = nextStep?.id === 'measures' || nextStep?.id === 'photos'
    ? `${getPatientSectionHref(data.patientId, 'Evolução')}#patient-${nextStep.id}`
    : nextStep?.id === 'medications'
      ? getPatientSectionHref(data.patientId, 'Medicamentos')
      : null;

  return (
    <>
      <article className="mt-6 overflow-hidden rounded-2xl border border-[#9fc9bd] bg-white">
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#0b6a5b]">{completedCount} de 5 etapas concluídas</p>
              <h2 className="mt-2 max-w-xl text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#17372f] sm:text-[2rem]">
                {storyComplete && nextStep
                  ? nextStep.title
                  : storyComplete
                    ? 'Seu ponto de partida está completo'
                    : 'Conte seu objetivo e como está se sentindo'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#526a62]">
                {storyComplete
                  ? nextStep
                    ? nextStep.description
                    : 'As informações demonstrativas foram organizadas para revisão da equipe.'
                  : 'Isso ajuda o médico a entender seu ponto de partida. Fale ou escreva do seu jeito; leva cerca de 2 minutos.'}
              </p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf7f4] text-[#0b6a5b]">
              {storyComplete ? <CheckCircle aria-hidden="true" size={24} weight="fill" /> : <ChatCircle aria-hidden="true" size={24} weight="duotone" />}
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e3ebe7]" role="progressbar" aria-label="Progresso da preparação" aria-valuemin={0} aria-valuemax={5} aria-valuenow={completedCount}>
            <div className="h-full rounded-full bg-[#0b7b68] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            {!storyComplete ? (
              <button type="button" onClick={onOpenCheckIn} className={primaryButton}>
                Contar meu ponto de partida
                <ArrowRight aria-hidden="true" size={17} weight="bold" />
              </button>
            ) : nextStepHref ? (
              <Link href={nextStepHref} className={primaryButton}>
                Continuar preparação
                <ArrowRight aria-hidden="true" size={17} weight="bold" />
              </Link>
            ) : (
              <Link href={`/medico/pacientes/${data.patientId}`} className={primaryButton}>
                Ver o que chegou ao médico
                <ArrowRight aria-hidden="true" size={17} weight="bold" />
              </Link>
            )}
            <span className="text-xs leading-5 text-[#60766f]">
              {storyComplete ? 'Próxima etapa · você pode continuar depois' : `${data.remainingTime} · você pode continuar depois`}
            </span>
          </div>
        </div>
        <div className="border-t border-[#e4ece8] bg-[#f7faf8] px-5 py-3 text-xs leading-5 text-[#526a62] sm:px-7">
          {latestCheckIn
            ? latestCheckIn.aiAssistanceAllowed
              ? 'Você + equipe · fonte e rascunho separados · revisão médica.'
              : 'Você + equipe · somente relato original · revisão médica.'
            : 'Você + equipe · IA opcional · revisão médica.'}
        </div>
      </article>

      <section aria-labelledby="pending-steps-title" className="mt-8">
        <h2 id="pending-steps-title" className="text-xl font-semibold tracking-[-0.02em]">Sua preparação, sem pressa</h2>
        <p className="mt-1 text-sm text-[#60766f]">As fotos são condicionais; as outras etapas explicam por que foram pedidas.</p>
        <ol className="mt-4 divide-y divide-[#dfe8e3] border-y border-[#dfe8e3]">
          {data.preparationSteps.map((step) => {
            const done = stepIsComplete(step.id);
            const current = !done && step.id === nextStep?.id;
            return (
              <li key={step.id} className="flex gap-3 py-4">
                <span className={cn(
                  'mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold',
                  done
                    ? 'border-[#0b7b68] bg-[#0b7b68] text-white'
                    : current
                      ? 'border-[#0b7b68] bg-[#edf7f4] text-[#0b6a5b]'
                      : 'border-[#c9d6d1] bg-white text-[#526a62]',
                )}>
                  {done ? <Check aria-hidden="true" size={14} weight="bold" /> : data.preparationSteps.indexOf(step) + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#17372f]">{step.title}</h3>
                    <span className="text-xs font-semibold text-[#60766f]">{done ? 'Concluído' : step.duration}</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#60766f]">{step.description}</p>
                  <span className="mt-2 inline-flex text-[11px] font-bold text-[#526a62]">{step.requirement}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-8 flex items-start gap-3 rounded-2xl border border-[#d9e5e0] bg-white p-5">
        <CookingPot aria-hidden="true" size={23} className="mt-0.5 shrink-0 text-[#0b6a5b]" />
        <div>
          <h2 className="text-base font-semibold">Seu plano ainda está sendo preparado</h2>
          <p className="mt-1 text-sm leading-6 text-[#60766f]">O médico usará apenas as informações que você enviar e publicará o plano depois da revisão. A IA não cria orientações clínicas sozinha.</p>
        </div>
      </section>

      <DoctorHandoff
        patientId={data.patientId}
        hasSubmission={Boolean(latestCheckIn)}
        aiAssistanceAllowed={latestCheckIn?.aiAssistanceAllowed ?? null}
      />
    </>
  );
}

function MetricChange({
  label,
  from,
  to,
  change,
}: {
  label: string;
  from: string;
  to: string;
  change: string;
}) {
  return (
    <div className="border-t border-[#e4ece8] pt-4 first:border-0 first:pt-0 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:first:pl-0">
      <dt className="text-xs font-bold text-[#60766f]">{label}</dt>
      <dd className="mt-2 flex items-center gap-2 text-lg font-semibold tabular-nums text-[#17372f]">
        <span>{from}</span>
        <ArrowRight aria-hidden="true" size={15} className="text-[#8aa098]" />
        <span>{to}</span>
      </dd>
      <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#526a62]">
        <TrendDown aria-hidden="true" size={14} />
        {change} desde o início
      </p>
    </div>
  );
}

function DoctorHandoff({
  patientId,
  hasSubmission,
  aiAssistanceAllowed,
}: {
  patientId: string;
  hasSubmission: boolean;
  aiAssistanceAllowed: boolean | null;
}) {
  const assistantTitle = hasSubmission
    ? aiAssistanceAllowed === false ? '2. Sem rascunho da IA' : '2. Rascunho da IA'
    : '2. Organização opcional';
  const assistantDescription = hasSubmission
    ? aiAssistanceAllowed === false
      ? 'Você não autorizou esta etapa; nenhuma síntese foi criada.'
      : 'Organiza fatos, sem decidir conduta.'
    : 'Se você autorizar, organiza fatos sem decidir conduta.';

  return (
    <section aria-labelledby="doctor-handoff-title" className="mt-8 rounded-2xl bg-[#edf3fb] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" size={24} weight="duotone" className="mt-0.5 shrink-0 text-[#124da0]" />
        <div className="min-w-0 flex-1">
          <h2 id="doctor-handoff-title" className="text-base font-semibold text-[#071a3a]">
            {hasSubmission ? 'Como seu registro chegou ao médico' : 'O que acontece quando você enviar'}
          </h2>
          <div className="mt-4 divide-y divide-[#cad9ec] border-y border-[#cad9ec] text-xs leading-5 text-[#405675] sm:grid sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <p className="py-3 sm:pr-4"><strong className="block text-[#071a3a]">1. Seu relato</strong>O texto original fica preservado.</p>
            <p className="py-3 sm:px-4"><strong className="block text-[#071a3a]">{assistantTitle}</strong>{assistantDescription}</p>
            <p className="py-3 sm:pl-4"><strong className="block text-[#071a3a]">3. Revisão médica</strong>O médico confere e aprova o conteúdo clínico.</p>
          </div>
          <Link href={`/medico/pacientes/${patientId}`} className={cn('mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#124da0]', focusRing)}>
            Ver recebimento na área médica do mock
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
