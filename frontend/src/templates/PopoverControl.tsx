import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Popover, PopoverOrigin } from '@mui/material';

type PopoverPosition = 'top' | 'right' | 'bottom' | 'left';

const makePopoverOriginSet = (position?: PopoverPosition) => {
  const anchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'center',
  };

  const transformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'center',
  };

  switch (position) {
    case 'top':
      anchorOrigin.vertical = 'top';
      anchorOrigin.horizontal = 'center';
      transformOrigin.vertical = 'bottom';
      transformOrigin.horizontal = 'center';
      break;
    case 'right':
      anchorOrigin.vertical = 'top';
      anchorOrigin.horizontal = 'right';
      transformOrigin.vertical = 'top';
      transformOrigin.horizontal = 'left';
      break;
    case 'left':
      anchorOrigin.vertical = 'top';
      anchorOrigin.horizontal = 'left';
      transformOrigin.vertical = 'top';
      transformOrigin.horizontal = 'right';
      break;
    case 'bottom':
    default:
      break;
  }

  return { anchorOrigin, transformOrigin };
};

type PopoverControlProps = {
  children: React.ReactNode;
  trigger: JSX.Element;
  position?: PopoverPosition;
};

const PopoverControl = memo(function PopoverControl(
  props: PopoverControlProps
): JSX.Element {
  const { children, trigger, position } = props;
  const [className, setClassName] = useState<string | undefined>('contents');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const timeoutRef = useRef(0);

  const open = Boolean(anchorEl);
  const htmlId = open ? 'menu' : undefined;

  const { anchorOrigin, transformOrigin } = useMemo(
    () => makePopoverOriginSet(position),
    [position]
  );

  useEffect(() => {
    return function cleanup() {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * - `open`時には`class (display: 'contents')`を排除
   * - 時間差を設けてこれを実行することで`Warning: Failed prop type`を回避
   */
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>): void => {
      const targetElement = event.currentTarget; // 値の確保
      const readinessTime = 10; // 適当な待機時間
      timeoutRef.current = window.setTimeout(() => {
        setAnchorEl(targetElement);
      }, readinessTime);
      setClassName(undefined);
    },
    []
  );

  const handleClose = useCallback((): void => {
    setClassName('contents');
    setAnchorEl(null);
  }, []);

  return (
    <>
      <div
        aria-describedby={htmlId}
        onClick={handleClick}
        aria-label="menu"
        className={className}
      >
        {trigger}
      </div>
      <Popover
        id={htmlId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <div className="w-72 rounded border border-solid border-blue-400">
          {children}
        </div>
      </Popover>
    </>
  );
});

export default PopoverControl;
