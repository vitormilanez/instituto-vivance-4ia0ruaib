import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="grid min-h-[70vh] place-items-center bg-[#f4f7f5] px-5 py-12 text-[#17372f]">
      <section className="w-full max-w-xl rounded-3xl border border-[#dfe8e3] bg-white p-7 text-center shadow-[0_10px_35px_rgba(28,55,47,0.05)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#0b7b68]">Contexto não encontrado</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Esta jornada demonstrativa não existe.</h1>
        <p className="mt-3 text-sm leading-6 text-[#60766f]">Verifique o paciente e a consulta da URL. Por segurança, o protótipo não substitui um contexto ausente por dados de outra pessoa.</p>
        <Link href="/medico" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#17372f] px-6 text-sm font-bold text-white">Voltar ao painel médico</Link>
      </section>
    </main>
  );
}
