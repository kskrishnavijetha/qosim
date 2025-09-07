
import React from 'react';
import { ErrorModal } from './ErrorModal';
import { ErrorToast } from './ErrorToast';
import { ErrorConsolePanel } from './ErrorConsolePanel';
import { useQuantumErrorHandler } from '@/hooks/useQuantumErrorHandler';

export function QuantumErrorHandler() {
  const {
    errors,
    currentError,
    showModal,
    showToast,
    consoleVisible,
    dismissToast,
    viewErrorDetails,
    closeModal,
    clearAllErrors,
    toggleConsole
  } = useQuantumErrorHandler();

  return (
    <>
      {/* Error Toast */}
      {showToast && currentError && (
        <ErrorToast
          error={currentError}
          onDismiss={dismissToast}
          onViewDetails={() => viewErrorDetails()}
        />
      )}

      {/* Error Modal */}
      <ErrorModal
        error={currentError}
        isOpen={showModal}
        onClose={closeModal}
      />

      {/* Error Console */}
      <ErrorConsolePanel
        errors={errors}
        onClearAll={clearAllErrors}
        onViewError={viewErrorDetails}
        isVisible={consoleVisible}
        onToggleVisibility={toggleConsole}
      />
    </>
  );
}

// Export the hook for use in circuit components
export { useQuantumErrorHandler };
