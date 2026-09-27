// Cloudflare D1 SQL Client for Tarbiyah Islamic Education Platform

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '7c5659591f26accb6f9e13b6c19cb75b';
const CLOUDFLARE_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || '46c97bed-e500-442d-a708-3b6ef4e24591';
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

export async function d1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql,
        params
      }),
      // Avoid Next.js cache for live real-time sync across devices
      cache: 'no-store'
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Cloudflare D1 query HTTP error:', res.status, errText);
      return [];
    }

    const data = await res.json();
    if (!data.success || !data.result || !data.result[0]) {
      console.error('Cloudflare D1 query execution error:', data.errors);
      return [];
    }

    return (data.result[0].results || []) as T[];
  } catch (err) {
    console.error('Cloudflare D1 network error:', err);
    return [];
  }
}

export async function d1Exec(sql: string, params: any[] = []): Promise<boolean> {
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql,
        params
      }),
      cache: 'no-store'
    });

    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error('Cloudflare D1 exec network error:', err);
    return false;
  }
}
