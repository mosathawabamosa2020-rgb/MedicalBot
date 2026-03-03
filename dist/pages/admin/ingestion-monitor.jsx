"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IngestionMonitor;
const swr_1 = __importDefault(require("swr"));
const react_1 = require("next-auth/react");
const link_1 = __importDefault(require("next/link"));
const fetcher = (url) => fetch(url).then(res => res.json());
function IngestionMonitor() {
    const { data: session } = (0, react_1.useSession)({ required: true });
    const { data, error } = (0, swr_1.default)('/api/admin/ingestion/logs', fetcher);
    const logs = (data === null || data === void 0 ? void 0 : data.logs) || [];
    return (<div className="flex h-screen">
      <nav className="w-64 bg-gray-100 p-6">
        <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
        <ul className="space-y-3">
          <li>
            <link_1.default href="/admin/research" className="text-blue-600 hover:underline">
              Search
            </link_1.default>
          </li>
          <li>
            <link_1.default href="/admin/verification" className="text-blue-600 hover:underline">
              Verification
            </link_1.default>
          </li>
          <li>
            <link_1.default href="/admin/ingestion-monitor" className="text-blue-600 hover:underline font-semibold">
              Ingestion Monitor
            </link_1.default>
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Ingestion Monitor</h1>
        <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded" onClick={async () => {
            await fetch('/api/admin/ingestion/run-worker', { method: 'POST' });
            // revalidate logs
            (data === null || data === void 0 ? void 0 : data.mutate) && data.mutate();
        }}>
          Run Worker Now
        </button>
        {error && <p className="text-red-600">Failed to load logs</p>}
        <ul className="space-y-2">
          {logs.map((l) => (<li key={l.id} className="border p-2 rounded">
              <div className="text-sm text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
              <div>{l.message}</div>
            </li>))}
        </ul>
      </main>
    </div>);
}
