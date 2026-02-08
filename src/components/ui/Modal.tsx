import { ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus na przycisku zamknięcia gdy modal się otworzy
      closeButtonRef.current?.focus();

      // Trap focus w modalu
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }

        // ESC zamyka modal
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleTab);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-[600px] w-full max-h-[90vh] overflow-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 id="modal-title" className="m-0 text-2xl font-semibold">{title}</h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-1 leading-none hover:text-gray-700 transition-colors"
            aria-label="Zamknij modal"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

