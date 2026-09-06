import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site';

/*
  The social card. Generated rather than hand-designed so every calculator gets
  one for free and none of them can go stale when a title changes.

  Deliberately typographic — no photography, no icon set. The card carries the
  calculator's name, the site's name, and the one promise the site is built on,
  which is also the only thing worth reading at thumbnail size in a group chat.
*/

const BLUE = '#1e57ea';
const INK = '#11142b';
const WASH = '#f7f8fe';
const RULE = '#e7e9f3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('title')?.slice(0, 90).trim();
  const title = raw && raw.length > 0 ? raw : SITE_NAME;
  const isHome = title === SITE_NAME;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: WASH,
          padding: '68px 76px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 16, height: 16, borderRadius: 8, background: BLUE, display: 'flex' }} />
          <div style={{ fontSize: 26, fontWeight: 700, color: INK, letterSpacing: -0.5 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: title.length > 46 ? 62 : 76,
              fontWeight: 700,
              color: INK,
              letterSpacing: -2.5,
              lineHeight: 1.06,
              display: 'flex',
            }}
          >
            {isHome ? SITE_TAGLINE.split('.')[0] : title}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderTop: `2px solid ${RULE}`, paddingTop: 26 }}>
          <div style={{ fontSize: 25, color: BLUE, fontWeight: 600, display: 'flex' }}>
            Every formula shows its source
          </div>
          <div style={{ fontSize: 25, color: '#6b7189', display: 'flex' }}>· Free · No signup</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
