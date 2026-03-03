"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const link_1 = __importDefault(require("next/link"));
const react_1 = require("next-auth/react");
const swr_1 = __importDefault(require("swr"));
const fetcher = (url) => fetch(url).then(res => res.json());
function Dashboard() {
    var _a, _b, _c;
    const { data: session } = (0, react_1.useSession)({ required: true });
    const { data, error } = (0, swr_1.default)('/api/admin/stats', fetcher);
    const ingested = (_a = data === null || data === void 0 ? void 0 : data.ingestedCount) !== null && _a !== void 0 ? _a : '...';
    const verification = (_b = data === null || data === void 0 ? void 0 : data.verificationCount) !== null && _b !== void 0 ? _b : '...';
    const knowledge = (_c = data === null || data === void 0 ? void 0 : data.knowledgeLibraryCount) !== null && _c !== void 0 ? _c : '...';
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
            <link_1.default href="/admin/ingestion-monitor" className="text-blue-600 hover:underline">
              Ingestion Monitor
            </link_1.default>
          </li>
          {/* future links: content studio, etc. */}
        </ul>
      </nav>
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">Executive Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-4 border rounded shadow">New Items Ingested: {ingested}</div>
          <div className="p-4 border rounded shadow">Items Pending Verification: {verification}</div>
          <div className="p-4 border rounded shadow">Knowledge Library Count: {knowledge}</div>
        </div>
        <div className="border rounded shadow p-4">
          <h2 className="font-semibold mb-2">User Activity Log</h2>
          <p className="text-gray-500">[placeholder]</p>
        </div>
      </main>
    </div>);
}
