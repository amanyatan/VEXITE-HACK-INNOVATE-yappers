type ResourceCardProps = {
  title: string;
  description?: string;
  url: string;
  source?: string;
};

export function ResourceCard({ title, description, url, source }: ResourceCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-sky-500/60 hover:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">{source || 'Resource'}</p>
          <h4 className="mt-2 text-base font-semibold text-white">{title}</h4>
        </div>
        <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">Open</span>
      </div>
      {description && <p className="mt-3 line-clamp-3 text-sm text-slate-300">{description}</p>}
    </a>
  );
}
