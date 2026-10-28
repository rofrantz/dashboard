import {forwardRef, type HTMLAttributes} from 'react';

import type {DashboardConfig} from '../dashboard/dashboard.types';

type DashboardItemData = DashboardConfig['items'][number];

type DashboardItemProps = HTMLAttributes<HTMLElement> & {
  item: DashboardItemData;
};

export const DashboardItem = forwardRef<HTMLElement, DashboardItemProps>(function DashboardItem(
  {item, children: gridChildren, className, style, ...gridProps},
  ref,
) {
  return (
    <section
      ref={ref}
      {...gridProps}
      className={['flex h-full flex-col rounded-2xl bg-white p-5 shadow-sm', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {item.title &&
        <div className="dashboard-card__title-handle flex cursor-move items-center gap-2 font-bold mb-2" aria-label={`Move ${item.title}`}>
          <span className="text-[22px] leading-none text-slate-400" aria-hidden="true">⠿</span>
          <span>{item.title}</span>
          {item.lastUpdated && <time
            className="ml-auto whitespace-nowrap text-[11px] font-medium tracking-[.02em] text-slate-400"
            dateTime={item.lastUpdated}>
            Updated {new Date(item.lastUpdated).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
          })}
          </time>}
        </div>}
      {item.description && <p className="my-2 text-sm text-slate-500">{item.description}</p>}
      {item.items && <div
        className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-color:#c5ccda_transparent] scrollbar-thin">
        <ul className="mt-4 grid gap-2">{item.items.map((entry) => <li
          className="rounded-lg bg-slate-100 p-3 text-sm" key={entry}>{entry}</li>)}</ul>
      </div>}
      {gridChildren}
    </section>
  );
});
