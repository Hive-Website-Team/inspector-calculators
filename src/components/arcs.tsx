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

/**
 * Arc geometry, read off the reference ring: clockwise from 12 o'clock it runs
 * yellow, red, blue, red, yellow, blue, with wide gaps between the dashes.
 */
const RING: Dash[] = [
  { from: 20, len: 26, color: 'var(--om-yellow)' },
  { from: 58, len: 58, color: 'var(--om-red)' },
  { from: 126, len: 62, color: 'var(--om-blue)' },
  { from: 200, len: 20, color: 'var(--om-red)' },
  { from: 232, len: 52, color: 'var(--om-yellow)' },
  { from: 296, len: 34, color: 'var(--om-blue)' },
];

const R = 44;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * `weight` is the stroke in viewBox units. It is passed per ring rather than
 * fixed here because the reference draws every ring at the same screen weight
 * whatever its radius, and these rings render at three different sizes — a
 * single viewBox-relative width would make the big footer ring three times as
 * heavy as the small corner one. (vector-effect="non-scaling-stroke" is not the
 * answer: it takes the dash array out of user units too, which shreds the
 * dashes.)
 */
function Ring({ rotate = 0, weight = 4 }: { rotate?: number; weight?: number }) {
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
            strokeWidth={weight}
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
        <Ring rotate={-18} weight={5.4} />
      </span>
      <span className="om-ring om-ring-br">
        <Ring rotate={30} weight={3.7} />
      </span>
    </>
  );
}

export function FooterArc() {
  return (
    <span className="om-ring om-ring-fl">
      <Ring rotate={0} weight={3.4} />
    </span>
  );
}
