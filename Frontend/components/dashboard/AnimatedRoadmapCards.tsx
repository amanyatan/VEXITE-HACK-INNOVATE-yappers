const cards = [
  {
    className: 'roadmap-card-yellow',
    eyebrow: 'Today',
    title: 'AI/ML roadmap',
    label: 'This week',
    detail: 'Python fundamentals + linear algebra basics',
  },
  {
    className: 'roadmap-card-blue',
    eyebrow: 'Focus',
    title: 'Study session',
    label: 'Deep work',
    detail: '45 minutes · Camera-enabled · Keep the streak alive',
  },
  {
    className: 'roadmap-card-violet',
    eyebrow: 'Support',
    title: 'One next step',
    label: 'Yappers says',
    detail: 'Break the workload into one small action and continue.',
  },
];

export function AnimatedRoadmapCards() {
  return (
    <div className="roadmap-stack" aria-label="Your learning rhythm">
      {cards.map((card) => (
        <article key={card.title} className={`roadmap-stack-card ${card.className}`}>
          <div className="roadmap-stack-content">
            <span className="roadmap-stack-eyebrow">{card.eyebrow}</span>
            <span className="roadmap-stack-title">{card.title}</span>
            <span className="roadmap-stack-label">{card.label}</span>
            <span className="roadmap-stack-detail">{card.detail}</span>
          </div>
        </article>
      ))}
      <div className="roadmap-stack-lines" aria-hidden="true">
        <span />
        <span />
      </div>
    </div>
  );
}
