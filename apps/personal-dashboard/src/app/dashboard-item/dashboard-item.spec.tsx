import {createRef} from 'react';
import {fireEvent, render} from '@testing-library/react';

import {DashboardItem} from './dashboard-item';

const item = {
  id: 'focus',
  type: 'checkbox-list',
  title: 'Today’s focus',
  lastUpdated: '2026-10-28',
  description: 'Keep the next few hours simple and intentional.',
  items: ['Finish the dashboard shell', 'Review the market brief'],
};

describe('DashboardItem', () => {
  it('renders the card content and drag handle', () => {
    const {getByLabelText, getByText, getByRole} = render(<DashboardItem item={item}/>);

    expect(getByLabelText('Move Today’s focus')).toBeTruthy();
    expect(getByText('Keep the next few hours simple and intentional.')).toBeTruthy();
    expect(getByText('Finish the dashboard shell')).toBeTruthy();
    expect((getByRole('time') as unknown as {getAttribute: (name: string) => string | null})
      .getAttribute('datetime')).toBe('2026-10-28');
  });

  it('forwards grid props, refs, and injected resize children to the root section', () => {
    const ref = createRef<HTMLElement>();
    const onMouseDown = vi.fn();
    const {container, getByTestId} = render(
      <DashboardItem
        ref={ref}
        item={item}
        className="react-grid-item"
        style={{width: '320px', transform: 'translate(10px, 20px)'}}
        onMouseDown={onMouseDown}
      >
        <span data-testid="resize-handle" className="react-resizable-handle react-resizable-handle-se" />
      </DashboardItem>,
    );

    const html = (container as unknown as {innerHTML: string}).innerHTML;
    expect(ref.current).toBeTruthy();
    expect(html).toContain('react-grid-item');
    expect(html).toContain('width: 320px');
    expect(html).toContain('transform: translate(10px, 20px)');
    expect(getByTestId('resize-handle')).toBeTruthy();

    fireEvent.mouseDown(getByTestId('resize-handle'));
    expect(onMouseDown).toHaveBeenCalledOnce();
  });
});
