import { ImageResponse } from 'next/og';

/*
  The site mark, generated rather than shipped as a binary so there is one place
  the blue is defined and nothing to re-export when it changes.

  It is referenced by the Organization node's `logo` in the entity graph, so it
  has to resolve — a logo URL that 404s is worse for Google's entity model than
  no logo at all.
*/
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1e57ea',
          color: '#ffffff',
          fontSize: 300,
          fontWeight: 700,
          letterSpacing: -14,
          fontFamily: 'sans-serif',
        }}
      >
        IC
      </div>
    ),
    size,
  );
}
