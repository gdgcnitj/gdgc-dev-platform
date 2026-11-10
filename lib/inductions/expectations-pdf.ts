// Client-safe paths for the generated expectation PDFs in public/.
export function expectationsPdfHref(cycleId: string, departmentId: string) {
  return `/inductions/${cycleId}/${departmentId}-expectations.pdf`;
}

export function expectationsManifestPath(cycleId: string) {
  return `inductions/${cycleId}/manifest.json`;
}

export function expectationsPdfName(departmentTitle: string) {
  return `GDGC ${departmentTitle} expectations.pdf`
    .replace(/[^A-Za-z0-9 .-]+/g, " ")
    .replace(/\s+/g, "-");
}
