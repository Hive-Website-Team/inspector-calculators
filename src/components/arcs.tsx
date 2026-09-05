/**
 * The Omni arc decoration.
 *
 * On omnicalculator.com the corners carry a broken ring: a circle drawn as a
 * few thick dashes in blue, red and yellow with wide gaps between them, cropped
 * by the edge of the section. It is the single most recognisable thing about
 * the page, and a solid ring does not read as the same device — the gaps are
 * the point.
 *
 * Drawn as SVG rather than a bordered div so each dash can take its own colour
 * and length. Decorative only: aria-hidden, no title, no focus target.
 */

interface Dash {
  /** degrees clockwise from 12 o'clock where this dash starts */
  from: number;
  /** length of the dash in degrees */
  len: number;
  color: string;
}

/** Arc geometry, in the order the reference draws them: blue, red, yellow. */
const RING: Dash[] = [
  { from: 8, len: 62, color: 'var(--om-blue)' },
  { from: 82, len: 30, color: 'var(--om-red)' },
  { from: 124, len: 54, color: 'var(--om-yellow)' },
  { from: 192, len: 76, color: 'var(--om-blue)' },
  { from: 280, len: 26, color: 'var(--om-red)' },
  { from: 318, len: 30, color: 'var(--om-yellow)' },
];

const R = 44;
const CIRCUMFERENCE = 2 * Math.PI * R;

function Ring({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
      <g transform={`rotate(${rotate} 50 50)`}>
        {RING.map((d) => (
          <circle
            key={`${d.from}-${d.color}`}
            cx="50"
            cy="50"
            r={R}
            stroke={d.color}
            strokeWidth="9"
            strokeLinecap="butt"
            /* Draw one dash of `len` degrees, then a gap for the rest of the
               circle; rotate it into place with the dash offset. */
            strokeDasharray={`${(d.len / 360) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={-((d.from / 360) * CIRCUMFERENCE)}
            transform="rotate(-90 50 50)"
          />
        ))}
      </g>
    </svg>
  );
}

export function HeroArcs() {
  return (
    <>
      <span className="om-ring om-ring-tl">
        <Ring rotate={-18} />
      </span>
      <span className="om-ring om-ring-br">
        <Ring rotate={132} />
      </span>
    </>
  );
}

export function FooterArc() {
  return (
    <span className="om-ring om-ring-fl">
      <Ring rotate={54} />
    </span>
  );
}
