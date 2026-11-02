// Node.js >=20: direct HTTP request to a Facebook GraphQL endpoint.
// Generic request example only: not a confirmed video-upload/publish API.
const endpoint = 'https://www.facebook.com/api/graphql/';
const cookie = process.env.FACEBOOK_COOKIE;
const docId = process.env.FACEBOOK_DOC_ID;
const fbDtsg = process.env.FACEBOOK_FB_DTSG;
const lsd = process.env.FACEBOOK_LSD;
const variables = JSON.parse(process.env.FACEBOOK_VARIABLES || '{}');

if (!cookie || !docId || !fbDtsg) {
  throw new Error('Missing FACEBOOK_COOKIE, FACEBOOK_DOC_ID or FACEBOOK_FB_DTSG');
}
const body = new URLSearchParams({
  doc_id: docId,
  variables: JSON.stringify(variables),
  fb_dtsg: fbDtsg,
  ...(lsd ? { lsd } : {})
});

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    Cookie: cookie,
    'Content-Type': 'application/x-www-form-urlencoded',
    ...(lsd ? { 'X-FB-LSD': lsd } : {})
  },
  body
});
const text = await response.text();
if (!response.ok) throw new Error('Facebook HTTP ' + response.status);
const result = JSON.parse(text.replace(/^for\s*\(;;\);\s*/, ''));
console.log(JSON.stringify(result, null, 2));
