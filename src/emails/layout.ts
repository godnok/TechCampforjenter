/**
 * Felles byggeklosser for e-postene.
 * E-postprogrammer (Outlook, Gmail ...) støtter lite moderne CSS, så malen bruker
 * tabeller og stil direkte på elementene (inline) – det er vanlig for e-post.
 */

/**
 * Gjør tekst trygg å sette inn i HTML. Uten dette kunne noen skrevet HTML eller
 * lenker i skjemaet som ville blitt vist i e-posten.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Nettsidens adresse, f.eks. https://techcamp.gonok.no – brukes i lenker i e-posten */
export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
}

/** Felles ramme rundt alle e-poster: lyserosa bakgrunn, hvit boks med rosa stripe øverst */
export function emailLayout({ title, bodyHtml }: { title: string; bodyHtml: string }): string {
  const siteUrl = getSiteUrl()
  return `<!DOCTYPE html>
<html lang="nb">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#fcecf2;font-family:Arial,Helvetica,sans-serif;color:#000000;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fcecf2;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;border-top:6px solid #fa6fc6;">
<tr><td style="padding:32px 28px;font-size:16px;line-height:1.5;">
${bodyHtml}
</td></tr>
</table>
<p style="margin:16px 0 0;font-size:13px;color:#555555;">Go'nok sin Tech camp for jenter · <a href="${siteUrl}" style="color:#c4237f;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a></p>
</td></tr>
</table>
</body>
</html>`
}

/** Overskrift i e-posten */
export function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">${escapeHtml(text)}</h1>`
}

/** Vanlig avsnitt. Tar imot HTML – husk escapeHtml() på brukerens tekst før den settes inn. */
export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;">${html}</p>`
}

/** Tabell med «Felt: verdi»-rader. Alle verdier escapes her. */
export function detailsTable(rows: Array<[label: string, value: string]>): string {
  const rowsHtml = rows
    .map(
      ([label, value]) => `<tr>
<td style="padding:6px 12px 6px 0;vertical-align:top;color:#555555;white-space:nowrap;">${escapeHtml(label)}</td>
<td style="padding:6px 0;vertical-align:top;">${escapeHtml(value).replace(/\n/g, '<br>')}</td>
</tr>`,
    )
    .join('')
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;font-size:15px;">${rowsHtml}</table>`
}

/** Rosa knapp-lenke (f.eks. til admin) */
export function buttonLink(href: string, text: string): string {
  return `<p style="margin:8px 0 16px;"><a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#fa6fc6;color:#000000;font-weight:bold;text-decoration:none;">${escapeHtml(text)}</a></p>`
}

/** Ren tekst-versjon av en tabell, til e-postprogrammer som ikke viser HTML */
export function detailsText(rows: Array<[label: string, value: string]>): string {
  return rows.map(([label, value]) => `${label}: ${value}`).join('\n')
}
