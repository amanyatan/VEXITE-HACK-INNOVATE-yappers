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
      className="group block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-violet-400/50 hover:bg-violet-500/[0.06]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">{source || 'Resource'}</p>
          <h4 className="mt-2 text-base font-semibold text-zinc-100">{title}</h4>
        </div>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">Open</span>
      </div>
      {description && <p className="mt-3 line-clamp-3 text-sm text-zinc-400">{description}</p>}
    </a>
  );
}
