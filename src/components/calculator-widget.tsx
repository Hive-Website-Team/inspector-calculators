'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCalculator } from '@/calculators';

/**
 * The interactive part of a calculator page. Everything else on the page is
 * a server component; this is the only piece that needs the browser.
 *
 * State initializes from the record's stated defaults (never from an async
 * fetch or useEffect), so the server-rendered HTML — and anyone with JS
 * disabled — already shows a complete, correctly computed result. On mount,
 * if the page was opened with a querystring (a shared result link), those
 * values are read and override the defaults.
 */
export function CalculatorWidget({ slug }: { slug: string }) {
  const mod = getCalculator(slug);

  const defaultInputs = useMemo(() => {
    const obj: Record<string, number> = {};
    if (mod) for (const input of mod.record.inputs) obj[input.key] = input.default;
    return obj;
  }, [mod]);

  const [inputs, setInputs] = useState<Record<string, number>>(defaultInputs);
  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);
  /* Gates the first querystring write — see the sync effect below. */
  const [readDone, setReadDone] = useState(false);

  // Read a shared result URL's querystring once, on mount, client-side only.
  useEffect(() => {
    if (typeof window === 'undefined' || !mod) return;
    const params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length === 0) {
      setReadDone(true);
      return;
    }
    setInputs((prev) => {
      const next = { ...prev };
      for (const input of mod.record.inputs) {
        const raw = params.get(input.key);
        if (raw !== null && raw !== '' && !Number.isNaN(Number(raw))) next[input.key] = Number(raw);
      }
      return next;
    });
    setHydratedFromUrl(true);
    setReadDone(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    Keep the querystring in sync so a result can be shared as a link.

    `readDone` gates the first write. Without it this effect fires on mount with
    `inputs` still holding the record's defaults — before the read effect's
    setInputs has committed — and overwrites an incoming shared link's
    querystring with the defaults. React StrictMode then re-runs the read effect
    against that already-overwritten URL, so in `next dev` the shared values are
    lost outright.
  */
  useEffect(() => {
    if (typeof window === 'undefined' || !mod || !readDone) return;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(inputs)) params.set(key, String(value));
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', next);
  }, [inputs, mod, readDone]);

  if (!mod) return null;
  const { record, compute } = mod;
  const result = compute(inputs);

  return (
    <div className="calculator-widget" data-hydrated-from-url={hydratedFromUrl}>
      <div className="calculator-inputs">
        {record.inputs.map((input) => (
          <label key={input.key} className="calculator-input">
            <span className="calculator-input-label">
              {input.label}
              {input.unit ? ` (${input.unit})` : ''}
            </span>
            <input
              type="number"
              inputMode="decimal"
              value={inputs[input.key]}
              min={input.min}
              max={input.max}
              step={input.step ?? 'any'}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : Number(e.target.value);
                setInputs((prev) => ({ ...prev, [input.key]: value }));
              }}
            />
            {input.help ? <small className="calculator-input-help">{input.help}</small> : null}
          </label>
        ))}
      </div>

      <div className="calculator-results" aria-live="polite">
        {record.outputs.map((output) => (
          <div key={output.key} className="calculator-result">
            <span className="calculator-result-label">{output.label}</span>
            <span className="calculator-result-value">
              {result[output.key]}
              {output.unit ? <span className="calculator-result-unit"> {output.unit}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
