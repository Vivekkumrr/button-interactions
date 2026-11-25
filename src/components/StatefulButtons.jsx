import { useButtonState } from "./useButtonState";
import "./StatefulButtons.css";

const DEFAULT_LABELS = {
  idle: "Send",
  loading: "Sending…",
  success: "Sent",
  error: "Failed · Try again",
};

function Spinner() {
  return (
    <svg className="sbtn__icon sbtn__spinner" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeDasharray="42 60" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="sbtn__icon sbtn__icon--pop" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="sbtn__icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function StatefulButton({
  onClick,
  labels,
  disabled = false,
  holdMs,
  className = "",
  ...rest
}) {
  const text = { ...DEFAULT_LABELS, ...labels };
  const { state, trigger, isBusy } = useButtonState({ onClick, disabled, holdMs });

  // Announced to screen readers; only outcomes, not every state
  const announcement =
    state === "success" ? text.success : state === "error" ? text.error : "";

  return (
    <>
      <button
        {...rest}
        type="button"
        className={`sbtn ${className}`.trim()}
        data-state={state}
        disabled={disabled}
        aria-busy={isBusy}
        aria-label={text[state] ?? text.idle}
        onClick={trigger}
      >
        {/* Color layers: faded with opacity instead of animating background-color */}
        <span className="sbtn__bg sbtn__bg--idle" aria-hidden="true" />
        <span className="sbtn__bg sbtn__bg--hover" aria-hidden="true" />
        <span className="sbtn__bg sbtn__bg--loading" aria-hidden="true" />
        <span className="sbtn__bg sbtn__bg--success" aria-hidden="true" />
        <span className="sbtn__bg sbtn__bg--error" aria-hidden="true" />
        <span className="sbtn__bg sbtn__bg--disabled" aria-hidden="true" />

        {/* Content layers stacked in one grid cell: the widest one sets the size, so no layout shift */}
        <span className="sbtn__content" aria-hidden="true">
          <span className="sbtn__layer sbtn__layer--idle">{text.idle}</span>
          <span className="sbtn__layer sbtn__layer--loading"><Spinner />{text.loading}</span>
          <span className="sbtn__layer sbtn__layer--success"><CheckIcon />{text.success}</span>
          <span className="sbtn__layer sbtn__layer--error"><CrossIcon />{text.error}</span>
          <span className="sbtn__layer sbtn__layer--disabled">{text.idle}</span>
        </span>
      </button>

      <span className="sbtn-sr-only" role="status" aria-live="polite">{announcement}</span>
    </>
  );
}