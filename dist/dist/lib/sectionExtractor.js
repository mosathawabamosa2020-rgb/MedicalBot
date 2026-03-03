"use strict";
// Utilities for detecting and cleaning sections from extracted PDF text
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanPages = cleanPages;
exports.extractSections = extractSections;
function cleanPages(rawPages) {
    // split into lines and trim, also gather line frequencies
    const lineCounts = {};
    const pagesLines = rawPages.map(page => {
        const lines = page.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        lines.forEach(l => {
            lineCounts[l] = (lineCounts[l] || 0) + 1;
        });
        return lines;
    });
    // lines that appear on 3 or more pages are likely headers/footers
    const repeats = new Set(Object.keys(lineCounts).filter(l => lineCounts[l] > 2));
    return pagesLines.map(lines => lines.filter(l => {
        if (repeats.has(l))
            return false;
        if (/^Page\s+\d+/i.test(l))
            return false;
        if (/^\d+$/i.test(l))
            return false; // solitary page numbers
        return true;
    }));
}
function isProbableHeader(text) {
    if (!text)
        return false;
    const upper = text.toUpperCase();
    const patterns = [
        /DEVICE DESCRIPTION/, /INDICATIONS? FOR USE/, /CONTRAINDICATIONS?/, /STERILIZATION/, /MATERIALS?/, /SUBSTANTIAL EQUIVALENCE/, /SUMMARY/, /CLINICAL DATA/, /OPERATING PRINCIPLE/, /TECHNICAL/, /BACKGROUND/, /INTENDED USE/, /INDICATIONS/,
        /PREDICATE DEVICE/, /EQUIVALENCE/, /RISKS?/, /WARNINGS?/, /PRECAUTIONS?/, /DEFINITIONS?/, /COMPONENTS?/, /SPECIFICATIONS?/,
    ];
    for (const p of patterns) {
        if (p.test(upper))
            return true;
    }
    // all-caps line with at least 3 words
    if (upper === text && text.split(/\s+/).length >= 3 && text.replace(/[^A-Z0-9 ]/g, '') === text) {
        return true;
    }
    // numbered headings like 1.0 INTRODUCTION or III. MATERIALS
    if (/^[0-9]+(\.[0-9]+)*\s+[A-Z ]{3,}/.test(text))
        return true;
    if (/^[IVX]+\.?\s+[A-Z ]{3,}/.test(text))
        return true;
    return false;
}
function extractSections(rawPages) {
    // clean pages first
    const pagesLines = cleanPages(rawPages);
    const allLines = [];
    pagesLines.forEach(lines => lines.forEach(l => allLines.push(l)));
    const headers = [];
    for (let i = 0; i < allLines.length; i++) {
        const line = allLines[i];
        if (isProbableHeader(line)) {
            headers.push({ idx: i, title: line });
        }
    }
    if (headers.length === 0) {
        // fallback: treat whole text as one section
        return [{ title: 'Full Text', content: allLines.join(' ') }];
    }
    // ensure an end marker
    headers.push({ idx: allLines.length, title: '__END__' });
    const sections = [];
    for (let h = 0; h < headers.length - 1; h++) {
        const start = headers[h].idx + 1;
        const end = headers[h + 1].idx;
        const contentLines = allLines.slice(start, end);
        const content = contentLines.join(' ');
        sections.push({ title: headers[h].title, content: content.trim() });
    }
    return sections;
}
