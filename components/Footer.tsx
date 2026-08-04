export default function Footer() {
  return (
    <footer className="bg-ink px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-paper sm:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 border-t border-paper/10 pt-6 sm:flex-row">
        <span
          aria-hidden="true"
          className="font-mono text-[10px] tracking-[0.5em] text-paper/40"
        >
          |||‖|‖|||‖||‖|||
        </span>
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-paper/40">
          &copy; 2026 Ankit &middot; being_frzi
        </p>
      </div>
    </footer>
  );
}
