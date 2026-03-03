"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const PUBMED_SEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_SUMMARY_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
class PubMedAdapter {
    async search(query) {
        var _a;
        // use esearch to get ids, then esummary to fetch metadata
        const params = new URLSearchParams({ db: 'pubmed', term: query, retmode: 'json', retmax: '20' });
        const r = await (0, node_fetch_1.default)(`${PUBMED_SEARCH_URL}?${params.toString()}`);
        const j = await r.json();
        const ids = (((_a = j.esearchresult) === null || _a === void 0 ? void 0 : _a.idlist) || []);
        if (!ids.length)
            return [];
        const sumParams = new URLSearchParams({ db: 'pubmed', id: ids.join(','), retmode: 'json' });
        const s = await (0, node_fetch_1.default)(`${PUBMED_SUMMARY_URL}?${sumParams.toString()}`);
        const sj = await s.json();
        const results = ids.map((id) => {
            var _a;
            const rec = (_a = sj.result) === null || _a === void 0 ? void 0 : _a[id];
            return {
                id,
                title: (rec === null || rec === void 0 ? void 0 : rec.title) || 'No title',
                authors: ((rec === null || rec === void 0 ? void 0 : rec.authors) || []).map((a) => a.name),
                summary: (rec === null || rec === void 0 ? void 0 : rec.summary) || (rec === null || rec === void 0 ? void 0 : rec.title) || undefined,
                sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
            };
        });
        return results;
    }
    async fetchById(id) {
        var _a;
        // fetch summary for now
        const sumParams = new URLSearchParams({ db: 'pubmed', id, retmode: 'json' });
        const s = await (0, node_fetch_1.default)(`${PUBMED_SUMMARY_URL}?${sumParams.toString()}`);
        const sj = await s.json();
        return (_a = sj.result) === null || _a === void 0 ? void 0 : _a[id];
    }
    async fetchFullText(id) {
        // PubMed often doesn't host full text; try to obtain abstract/summary as fallback
        try {
            const summary = await this.fetchById(id);
            // prefer 'extract' fields if available, otherwise return title+summary
            const txt = (summary === null || summary === void 0 ? void 0 : summary.extract) || (summary === null || summary === void 0 ? void 0 : summary.title) || (summary === null || summary === void 0 ? void 0 : summary.summary) || null;
            return txt;
        }
        catch (e) {
            return null;
        }
    }
}
exports.default = PubMedAdapter;
