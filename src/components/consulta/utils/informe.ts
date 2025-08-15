export function splitThink(informe?: string): { publicText: string; think: string | null } {
  if (!informe) return { publicText: '', think: null };
  const re = /<think>\s*([\s\S]*?)\s*<\/think>/i;
  const reOpenOnly = /<think>\s*([\s\S]*?)$/i;

  let think: string | null = null;
  let publicText = informe;

  const m = informe.match(re);
  if (m) {
    think = m[1].trim();
    publicText = informe.replace(re, '').trim();
    return { publicText, think };
  }
  const m2 = informe.match(reOpenOnly);
  if (m2) {
    think = m2[1].trim();
    publicText = informe.replace(reOpenOnly, '').trim();
  }
  return { publicText, think };
}
