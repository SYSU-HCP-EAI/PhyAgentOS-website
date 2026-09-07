import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '../../components/ui/carousel';
import { activities, type Activity } from '../../data/activities';
import { useLang } from '../../i18n/LanguageContext';

const copy = {
  zh: {
    title: '近期活动',
    description: '探索 PhyAgentOS 的最新活动与社区动态',
    details: '查看详情',
    comingSoon: '敬请期待',
    close: '关闭活动列表',
    previous: '上一页海报',
    next: '下一页海报',
    page: '转到海报页',
    hint: '左右滑动，发现更多活动',
    newTab: '在新标签页打开',
  },
  en: {
    title: 'Recent Activities',
    description: 'Explore the latest events and community updates from PhyAgentOS',
    details: 'View details',
    comingSoon: 'Coming soon',
    close: 'Close activity gallery',
    previous: 'Previous poster page',
    next: 'Next poster page',
    page: 'Go to poster page',
    hint: 'Swipe to discover more activities',
    newTab: 'Opens in a new tab',
  },
};

function ActivityCard({ activity }: { activity: Activity }) {
  const { lang } = useLang();
  const labels = copy[lang];
  const content = (
    <>
      <div className="aspect-[3/4] overflow-hidden bg-brand-bg-tertiary">
        <img
          src={activity.poster}
          alt={`${activity.title[lang]} — ${activity.description[lang]}`}
          className="h-full w-full select-none object-contain"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-1 flex-col items-start p-4">
        <h3 className="font-sans text-base font-bold leading-snug text-brand-text">{activity.title[lang]}</h3>
        <p className="mb-4 mt-1.5 text-sm leading-relaxed text-brand-text-secondary">{activity.description[lang]}</p>
        <span className={`mt-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${activity.href ? 'bg-brand-accent text-brand-text-on-accent transition-colors group-hover:bg-brand-accent-dark' : 'bg-brand-bg-tertiary text-brand-text-secondary'}`}>
          {activity.href ? <>{activity.linkLabel?.[lang] ?? labels.details}<ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></> : <><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{labels.comingSoon}</>}
        </span>
      </div>
    </>
  );
  const className = 'group flex h-full flex-col overflow-hidden rounded-xl border border-brand-border/60 bg-brand-bg-secondary text-left';

  return activity.href ? (
    <a
      href={activity.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${activity.title[lang]} — ${activity.description[lang]} (${labels.newTab})`}
      className={`${className} transition-colors hover:border-brand-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-accent`}
    >
      {content}
    </a>
  ) : <article className={className}>{content}</article>;
}

function PosterCarousel() {
  const { lang } = useLang();
  const labels = copy[lang];
  const [api, setApi] = useState<CarouselApi>();
  const [pagination, setPagination] = useState({ selected: 0, count: 0 });

  useEffect(() => {
    if (!api) return;
    const update = () => setPagination({ selected: api.selectedScrollSnap(), count: api.scrollSnapList().length });
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ align: 'start', slidesToScroll: 1 }} aria-label={labels.title} className="min-w-0">
      <CarouselContent>
        {activities.map((activity, index) => (
          <CarouselItem key={activity.id} className="basis-full sm:basis-1/2 lg:basis-1/3" aria-label={`${index + 1} / ${activities.length}`}>
            <ActivityCard activity={activity} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {pagination.count > 1 && <>
      <div className="mt-4 flex items-center justify-center gap-3">
        <CarouselPrevious aria-label={labels.previous} className="static h-10 w-10 translate-y-0 border-brand-border bg-brand-bg-secondary text-brand-text shadow-sm hover:bg-brand-bg-tertiary sm:absolute sm:-left-6 sm:top-[40%] sm:-translate-y-1/2" />
        <div className="flex items-center justify-center" aria-label={labels.page}>
          {Array.from({ length: pagination.count }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${labels.page} ${index + 1}`}
              aria-current={index === pagination.selected ? 'true' : undefined}
              onClick={() => api?.scrollTo(index)}
              className="flex h-10 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${index === pagination.selected ? 'w-5 bg-brand-accent' : 'w-2.5 bg-brand-border hover:bg-brand-accent/50'}`} />
            </button>
          ))}
        </div>
        <CarouselNext aria-label={labels.next} className="static h-10 w-10 translate-y-0 border-brand-border bg-brand-bg-secondary text-brand-text shadow-sm hover:bg-brand-bg-tertiary sm:absolute sm:-right-6 sm:top-[40%] sm:-translate-y-1/2" />
      </div>
      <p className="text-center text-xs text-brand-text-secondary">{labels.hint}</p>
      </>}
    </Carousel>
  );
}

export default function ActivityGallery() {
  const { lang, t } = useLang();
  const labels = copy[lang];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="group glass flex items-center gap-2 whitespace-nowrap rounded-2xl px-5 py-4 text-sm font-semibold text-brand-text transition-all duration-300 hover:bg-brand-bg-secondary hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent xl:px-7 xl:text-base">
          <CalendarDays className="h-5 w-5 text-brand-accent" aria-hidden="true" />
          {t.hero.activeEvent}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[1000px] gap-5 overflow-y-auto overscroll-contain rounded-3xl border-brand-border bg-brand-bg p-5 shadow-2xl sm:max-w-[1000px] sm:p-8 lg:p-10"
      >
        <div className="flex flex-col gap-3 pr-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="shrink-0">
            <DialogTitle className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">{labels.title}</DialogTitle>
            <p className="mt-1.5 text-sm text-brand-text-secondary">Activity Gallery</p>
          </div>
          <DialogDescription className="max-w-sm text-sm leading-relaxed text-brand-text-secondary sm:text-right">{labels.description}</DialogDescription>
        </div>
        <DialogClose className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-brand-text-secondary transition-colors hover:bg-brand-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent sm:right-4 sm:top-4" aria-label={labels.close}>
          <X className="h-5 w-5" aria-hidden="true" />
        </DialogClose>
        <PosterCarousel />
      </DialogContent>
    </Dialog>
  );
}
