import type { APIRoute } from 'astro';
import { FLAG_1 } from '../../data/audit';

/**
 * RFC 9116 security.txt. It is also stop 1 of the hidden audit (see the auditor's report):
 * the page source points here, and the flag below is public on purpose.
 */
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const url = (p: string) => new URL(`${base}${p}`, site).href;
  const body = `# Sergio González, Inc. — security contact
# Found a real problem on this site or its Worker? Tell me on LinkedIn. Thank you.

Contact: https://www.linkedin.com/in/sergonm/
Expires: 2027-06-30T23:59:59.000Z
Preferred-Languages: en, es
Canonical: ${url('.well-known/security.txt')}
Policy: ${url('#auditor')}
Acknowledgments: ${url('#auditor-hall')}

# ------------------------------------------------------------------
# Auditor's working papers
#
# Paper 1 of 3, filed: ${FLAG_1}
#
# Paper 2 of 3 is not on this server. This site is static; the only
# thing that answers back is "Ask the analyst". Find its address in
# the page source and send it a plain GET. Read the envelope, not
# the letter.
#
# Submit what you find in the auditor's report: ${url('#auditor')}
# ------------------------------------------------------------------
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
