'use client';

import { CheckCircle, FileArrowUp, FileText, NotePencil } from '@phosphor-icons/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { cn, Status } from './shared';

export type PatientQuickCaptureMode = 'exam' | 'record';
export type PatientQuickRecordKind = 'change' | 'wellbeing' | 'question';

export interface PatientExamShareInput {
  examDate: string;
  note: string;
}

export interface PatientQuickRecordInput {
  kind: PatientQuickRecordKind;
  occurredOn: string;
  body: string;
}

const recordOptions: Array<{ value: PatientQuickRecordKind; label: string }> = [
  { value: 'change', label: 'Mudança ou sintoma' },
  { value: 'wellbeing', label: 'Rotina e bem-estar' },
  { value: 'question', label: 'Dúvida para consulta' },
];

export const patientQuickRecordLabels: Record<PatientQuickRecordKind, string> = {
  change: 'Mudança ou sintoma',
  wellbeing: 'Rotina e bem-estar',
  question: 'Dúvida para consulta',
};

export function PatientQuickActions({
  examShared,
  onOpen,
}: {
  examShared: boolean;
  onOpen: (mode: PatientQuickCaptureMode) => void;
}) {
  return (
    <section
      aria-labelledby="patient-quick-actions-title"
      className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#dfe8e3] bg-white p-3 shadow-[0_8px_24px_rgba(28,55,47,0.04)] sm:flex-row sm:items-center"
    >
      <div className="min-w-0 sm:pl-1">
        <div className="flex flex-wrap items-center gap-2">
          <p id="patient-quick-actions-title" className="text-sm font-bold text-[#17372f]">Ações rápidas</p>
          {examShared ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0b6a5b]">
              <CheckCircle aria-hidden="true" size={15} weight="fill" />
              Exame compartilhado
            </span>
          ) : null}
        </div>
        <p className="mt-1 hidden text-xs text-[#698078] md:block">Envie um exame de exemplo ou guarde algo para a próxima conversa.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:w-auto">
        <button
          type="button"
          onClick={() => onOpen('exam')}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#bfd4cd] bg-white px-3 text-[13px] font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <FileArrowUp aria-hidden="true" size={19} />
          Enviar exame
        </button>
        <button
          type="button"
          onClick={() => onOpen('record')}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[#bfd4cd] bg-white px-3 text-[13px] font-bold text-[#0b6a5b] transition-colors hover:bg-[#edf7f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2 sm:gap-2 sm:px-4 sm:text-sm"
        >
          <NotePencil aria-hidden="true" size={19} />
          Registrar algo
        </button>
      </div>
    </section>
  );
}

export function PatientQuickCaptureDialog({
  mode,
  onClose,
  onShareExam,
  onSaveRecord,
}: {
  mode: PatientQuickCaptureMode;
  onClose: () => void;
  onShareExam: (input: PatientExamShareInput) => void;
  onSaveRecord: (input: PatientQuickRecordInput) => void;
}) {
  const [exampleSelected, setExampleSelected] = useState(false);
  const [examDate, setExamDate] = useState('2026-08-14');
  const [examNote, setExamNote] = useState('');
  const [recordKind, setRecordKind] = useState<PatientQuickRecordKind>('change');
  const [occurredOn, setOccurredOn] = useState('2026-09-02');
  const [recordBody, setRecordBody] = useState('');
  const [fileError, setFileError] = useState('');
  const [examDateError, setExamDateError] = useState('');
  const [recordError, setRecordError] = useState('');
  const [recordDateError, setRecordDateError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const backgroundRegions = [
      document.querySelector<HTMLElement>('header'),
      document.getElementById('main-content'),
      document.querySelector<HTMLElement>('.patient-bottom-navigation'),
    ].filter((region): region is HTMLElement => Boolean(region));
    const backgroundState = backgroundRegions.map((region) => ({
      region,
      hadInert: region.hasAttribute('inert'),
      ariaHidden: region.getAttribute('aria-hidden'),
    }));

    backgroundRegions.forEach((region) => {
      region.setAttribute('inert', '');
      region.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      backgroundState.forEach(({ region, hadInert, ariaHidden }) => {
        if (!hadInert) region.removeAttribute('inert');
        if (ariaHidden === null) region.removeAttribute('aria-hidden');
        else region.setAttribute('aria-hidden', ariaHidden);
      });
      previousFocus?.focus();
    };
  }, []);

  const submitExam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasError = false;
    if (!exampleSelected) {
      setFileError('Escolha o arquivo de exemplo para continuar.');
      hasError = true;
    }
    if (!examDate) {
      setExamDateError('Informe a data do exame.');
      hasError = true;
    }
    if (hasError) return;
    onShareExam({ examDate, note: examNote.trim() });
  };

  const submitRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = recordBody.trim();
    if (body.length < 5) {
      setRecordError('Conte em poucas palavras o que você quer registrar.');
    }
    if (!occurredOn) {
      setRecordDateError('Informe quando aconteceu.');
    }
    if (body.length < 5 || !occurredOn) return;
    onSaveRecord({ kind: recordKind, occurredOn, body });
  };

  const isExam = mode === 'exam';
  const title = isExam ? 'Enviar exame' : 'Registrar algo';
  const description = isExam
    ? 'Use o PDF fictício já disponível no protótipo.'
    : 'Anote algo que vale levar para a próxima conversa.';

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#102a24]/58 sm:items-center sm:p-5">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-capture-title"
        aria-describedby="quick-capture-description"
        className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#e2ebe7] bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 id="quick-capture-title" className="text-xl font-semibold tracking-[-0.025em] text-[#17372f]">{title}</h2>
            <p id="quick-capture-description" className="mt-1 text-sm leading-6 text-[#60766f]">{description}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={`Fechar ${title.toLocaleLowerCase('pt-BR')}`}
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-[#d7e3df] text-xl text-[#17372f] transition-colors hover:bg-[#f4f7f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2"
          >
            ×
          </button>
        </div>

        {isExam ? (
          <form onSubmit={submitExam} noValidate className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Status tone="amber">Arquivo demonstrativo</Status>
              <span className="text-xs text-[#698078]">Nenhum arquivo real é enviado</span>
            </div>

            <button
              type="button"
              aria-pressed={exampleSelected}
              aria-describedby={fileError ? 'exam-file-error' : undefined}
              onClick={() => {
                setExampleSelected(true);
                setFileError('');
              }}
              className={cn(
                'mt-5 flex min-h-20 w-full cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2',
                exampleSelected
                  ? 'border-[#0b7b68] bg-[#edf7f4]'
                  : 'border-[#d7e3df] bg-white hover:bg-[#f8faf9]',
              )}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#17372f] text-white">
                <FileText aria-hidden="true" size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block text-sm text-[#17372f]">Painel laboratorial · agosto</strong>
                <span className="mt-1 block text-xs text-[#698078]">PDF fictício · 14 ago 2026</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-[#0b6a5b]">{exampleSelected ? 'Selecionado' : 'Usar exemplo'}</span>
            </button>
            {fileError ? <p id="exam-file-error" role="alert" className="mt-2 text-sm font-semibold text-[#9c453f]">{fileError}</p> : null}

            <label htmlFor="quick-exam-date" className="mt-5 block text-sm font-bold text-[#17372f]">Data do exame</label>
            <input
              id="quick-exam-date"
              type="date"
              value={examDate}
              required
              aria-invalid={Boolean(examDateError)}
              aria-describedby={examDateError ? 'quick-exam-date-error' : undefined}
              onChange={(event) => {
                setExamDate(event.target.value);
                if (examDateError) setExamDateError('');
              }}
              className={cn(
                'mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#17372f] outline-none focus:ring-2',
                examDateError ? 'border-[#d38780] focus:ring-[#efb9b4]' : 'border-[#d7e3df] focus:ring-[#8bc6b9]',
              )}
            />
            {examDateError ? <p id="quick-exam-date-error" role="alert" className="mt-2 text-sm font-semibold text-[#9c453f]">{examDateError}</p> : null}

            <label htmlFor="quick-exam-note" className="mt-5 block text-sm font-bold text-[#17372f]">Observação <span className="font-normal text-[#789087]">(opcional)</span></label>
            <textarea
              id="quick-exam-note"
              value={examNote}
              onChange={(event) => setExamNote(event.target.value)}
              maxLength={240}
              rows={3}
              placeholder="Ex.: exame solicitado no retorno"
              className="mt-2 min-h-24 w-full resize-y rounded-xl border border-[#d7e3df] px-4 py-3 text-sm leading-6 text-[#17372f] outline-none placeholder:text-[#789087] focus:ring-2 focus:ring-[#8bc6b9]"
            />

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="min-h-12 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-5 text-sm font-bold text-[#0b6a5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Cancelar</button>
              <button type="submit" className="min-h-12 cursor-pointer rounded-xl bg-[#0b7b68] px-6 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Enviar exame</button>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-[#789087]">O envio é simulado nesta sessão e fica disponível para revisão humana.</p>
          </form>
        ) : (
          <form onSubmit={submitRecord} noValidate className="p-5 sm:p-6">
            <fieldset>
              <legend className="text-sm font-bold text-[#17372f]">Sobre o que é?</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {recordOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={recordKind === option.value}
                    onClick={() => setRecordKind(option.value)}
                    className={cn(
                      'min-h-12 cursor-pointer rounded-xl border px-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2',
                      recordKind === option.value
                        ? 'border-[#17372f] bg-[#17372f] text-white'
                        : 'border-[#d7e3df] bg-white text-[#60766f] hover:bg-[#edf7f4] hover:text-[#0b6a5b]',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label htmlFor="quick-record-body" className="mt-6 block text-sm font-bold text-[#17372f]">O que aconteceu?</label>
            <textarea
              id="quick-record-body"
              value={recordBody}
              onChange={(event) => {
                setRecordBody(event.target.value);
                if (recordError) setRecordError('');
              }}
              maxLength={420}
              rows={5}
              aria-invalid={Boolean(recordError)}
              aria-describedby={recordError ? 'quick-record-error' : 'quick-record-helper'}
              placeholder="Escreva do seu jeito..."
              className={cn(
                'mt-2 min-h-32 w-full resize-y rounded-xl border px-4 py-3 text-sm leading-6 text-[#17372f] outline-none placeholder:text-[#789087] focus:ring-2',
                recordError ? 'border-[#d38780] focus:ring-[#efb9b4]' : 'border-[#d7e3df] focus:ring-[#8bc6b9]',
              )}
            />
            <div className="mt-2 flex min-h-5 items-start justify-between gap-3 text-xs">
              <span id={recordError ? 'quick-record-error' : 'quick-record-helper'} className={recordError ? 'font-semibold text-[#9c453f]' : 'text-[#789087]'} role={recordError ? 'alert' : undefined}>
                {recordError || 'Seu texto será preservado como relato original.'}
              </span>
              <span className="shrink-0 text-[#789087]">{recordBody.length}/420</span>
            </div>

            <label htmlFor="quick-record-date" className="mt-5 block text-sm font-bold text-[#17372f]">Quando aconteceu?</label>
            <input
              id="quick-record-date"
              type="date"
              value={occurredOn}
              required
              aria-invalid={Boolean(recordDateError)}
              aria-describedby={recordDateError ? 'quick-record-date-error' : undefined}
              onChange={(event) => {
                setOccurredOn(event.target.value);
                if (recordDateError) setRecordDateError('');
              }}
              className={cn(
                'mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-sm text-[#17372f] outline-none focus:ring-2',
                recordDateError ? 'border-[#d38780] focus:ring-[#efb9b4]' : 'border-[#d7e3df] focus:ring-[#8bc6b9]',
              )}
            />
            {recordDateError ? <p id="quick-record-date-error" role="alert" className="mt-2 text-sm font-semibold text-[#9c453f]">{recordDateError}</p> : null}

            {recordKind === 'change' ? (
              <p className="mt-5 rounded-2xl border border-[#f0d59c] bg-[#fff8e9] p-4 text-xs leading-5 text-[#805f24]">O produto não classifica urgência automaticamente. Se precisar de atendimento imediato, procure um serviço de emergência.</p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="min-h-12 cursor-pointer rounded-xl border border-[#bfd4cd] bg-white px-5 text-sm font-bold text-[#0b6a5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Cancelar</button>
              <button type="submit" className="min-h-12 cursor-pointer rounded-xl bg-[#0b7b68] px-6 text-sm font-bold text-white transition-colors hover:bg-[#096b5b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b7b68] focus-visible:ring-offset-2">Salvar registro</button>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-[#789087]">O registro fica somente nesta sessão demonstrativa e não é monitorado continuamente.</p>
          </form>
        )}
      </div>
    </div>
  );
}
