/**
 * Error message component
 * Displays error messages with consistent styling
 */
interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="p-6 bg-red-50 border-2 border-red-400 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-900 mb-2">
            Wystąpił błąd
          </h3>
          <p className="text-red-800 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold transition-colors"
            >
              Spróbuj ponownie
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline error message (smaller, for forms)
 */
export function InlineError({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
      <span>⚠️</span>
      {message}
    </p>
  );
}

/**
 * Empty state component
 */
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: string;
}

export function EmptyState({ title, description, action, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="p-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <p className="text-5xl mb-4">{icon}</p>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}


