"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ScraperAdmin;
const react_1 = require("react");
function ScraperAdmin() {
    var _a, _b, _c;
    const [termText, setTermText] = (0, react_1.useState)('chemistry analyzer');
    const [status, setStatus] = (0, react_1.useState)(null);
    const [starting, setStarting] = (0, react_1.useState)(false);
    const [stream, setStream] = (0, react_1.useState)(null);
    async function fetchStatus() {
        const r = await fetch('/api/admin/scraper/status');
        const j = await r.json();
        setStatus(j);
    }
    (0, react_1.useEffect)(() => { fetchStatus(); const id = setInterval(fetchStatus, 5000); return () => clearInterval(id); }, []);
    (0, react_1.useEffect)(() => {
        const es = new EventSource('/api/admin/scraper/logs');
        es.onmessage = (e) => {
            // incoming chunk
            setStatus((s) => (Object.assign(Object.assign({}, (s || {})), { log: ((s && s.log) || '') + e.data })));
        };
        es.onerror = () => {
            es.close();
        };
        setStream(es);
        return () => { es.close(); setStream(null); };
    }, []);
    async function start() {
        setStarting(true);
        const r = await fetch('/api/admin/scraper/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ terms: termText }) });
        const j = await r.json();
        setStarting(false);
        if (j.ok)
            fetchStatus();
        else
            alert('Failed to start: ' + JSON.stringify(j));
    }
    // No stop/kill controls in simplified architecture
    return (<div className="p-6">
      <h1 className="text-2xl font-bold">Scraper Admin (Project Apollo)</h1>
      <div className="mt-4">
        <label className="block">أدخل مصطلحات البحث (كل مصطلح في سطر جديد)</label>
        <textarea rows={6} className="border p-2 w-full" value={termText} onChange={e => setTermText(e.target.value)}/>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={start} className="px-4 py-2 bg-green-600 text-white rounded" disabled={starting}>{starting ? 'Running…' : 'Start'}</button>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Status</h2>
        <div className="mt-2">
          <div>State: {(status === null || status === void 0 ? void 0 : status.running) ? <span className="text-green-600 font-semibold">Running</span> : <span className="text-gray-600">Stopped</span>}</div>
          {(status === null || status === void 0 ? void 0 : status.running) && status.info ? (<div className="mt-2">
              <div>PID: <span className="font-mono">{(status.info && (status.info.pid || (status.info.pids && status.info.pids[0]))) || 'N/A'}</span></div>
              <div>Started: {((_a = status.info) === null || _a === void 0 ? void 0 : _a.startedAt) || ((_b = status.info) === null || _b === void 0 ? void 0 : _b.startedAt)}</div>
              {((_c = status.info) === null || _c === void 0 ? void 0 : _c.terms) ? <div>Terms: {Array.isArray(status.info.terms) ? status.info.terms.length : 'N/A'}</div> : null}
            </div>) : null}
          {(status === null || status === void 0 ? void 0 : status.stopRequested) ? <div className="mt-2 text-yellow-700">Stop requested, waiting for process to terminate...</div> : null}

          <div className="mt-4">
            <h3 className="font-medium">Log</h3>
            <div className={`mt-2 p-3 max-h-96 overflow-auto bg-black text-white text-sm rounded ${(status === null || status === void 0 ? void 0 : status.log) && /error|failed|exception/i.test(status.log) ? 'ring-2 ring-red-600' : ''}`}>
              <pre className="whitespace-pre-wrap">{(status === null || status === void 0 ? void 0 : status.log) || 'No logs yet'}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
