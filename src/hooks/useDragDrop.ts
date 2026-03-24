import { useState, useCallback } from 'react';

export const useDragDrop = (onDrop: (taskId: string, status: string) => void) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, taskId: string) => {
    setDraggedId(taskId);
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !draggedId) {
        setDraggedId(null);
        setIsDragging(false);
        return;
      }

      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const dropZone = elements.find((el) => el instanceof HTMLElement && el.getAttribute('data-drop-zone')) as HTMLElement | undefined;

      if (dropZone) {
        const status = dropZone.getAttribute('data-drop-zone');
        if (status) {
          onDrop(draggedId, status);
        }
      }

      setDraggedId(null);
      setIsDragging(false);
    },
    [draggedId, isDragging, onDrop],
  );

  return { draggedId, isDragging, handlePointerDown, handlePointerUp };
};
