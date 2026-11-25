import { useState, useEffect, useRef, useCallback } from "react";

export const STATES = {
    IDLE : "idle",
    LOADING : "loading",
    SUCCESS : "success",
    ERROR : "error",
    DISABLED : "disabled",
}

const DEFAULT_HOLD_MS = 1800;

export function useButtonState({ onClick, disabled = false, holdMs = DEFAULT_HOLD_MS } = {}) {
  const [status, setStatus] = useState(STATES.IDLE);

  const timerRef = useRef(null);   // timer that returns result back to idle
  const runIdRef = useRef(0);      // identifies the latest request
  const mountedRef = useRef(true);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

    useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimer();
    };
  }, [clearTimer]);

    const scheduleReset = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) setStatus(STATES.IDLE);
    }, holdMs);
  }, [clearTimer, holdMs]);
  const trigger = useCallback(async () => {
    // Guards: disabled, already loading, or success still showing
    if (disabled || status === STATES.LOADING || status === STATES.SUCCESS) return;

    clearTimer(); // clicking during error cancels the pending reset (retry)
    const runId = ++runIdRef.current;
    setStatus(STATES.LOADING);

    try {
      await onClick?.();
      if (!mountedRef.current || runId !== runIdRef.current) return; // stale
      setStatus(STATES.SUCCESS);
    } catch {
      if (!mountedRef.current || runId !== runIdRef.current) return; // stale
      setStatus(STATES.ERROR);
    }
    scheduleReset();
  }, [disabled, status, onClick, clearTimer, scheduleReset]);
    const state = disabled ? STATES.DISABLED : status;

  return {
    state,
    trigger,
    isBusy: state === STATES.LOADING,
  };

}