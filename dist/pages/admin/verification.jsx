"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
exports.default = Verification;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const next_1 = require("next-auth/next");
const auth_1 = __importDefault(require("../../lib/auth"));
function Verification() {
    const [sections, setSections] = (0, react_1.useState)([]);
    const [metrics, setMetrics] = (0, react_1.useState)(null);
    async function loadData() {
        try {
            const [secRes, metRes] = await Promise.all([
                fetch('/api/admin/sections/queue'),
                fetch('/api/admin/metrics')
            ]);
            if (secRes.ok)
                setSections(await secRes.json());
            if (metRes.ok)
                setMetrics(await metRes.json());
        }
        catch (e) {
            console.error(e);
        }
    }
    (0, react_1.useEffect)(() => { loadData(); }, []);
    return (<div className="p-6">
      <h1 className="text-2xl font-bold">Verification Queue</h1>

      {metrics && <MetricsDisplay data={metrics}/>}

      <div className="mt-4">
        {sections.length === 0 ? (<p>No sections awaiting review.</p>) : (<ul className="space-y-2">
            {sections.map(s => {
                var _a, _b;
                return (<li key={s.id} className="border p-3 rounded hover:bg-gray-50">
                <link_1.default href={`/admin/sections/${s.id}`} className="block">
                  <div className="font-semibold">{s.title || '(no title)'}</div>
                  <div className="text-sm text-gray-600">
                    {s.content.slice(0, 200).replace(/\n/g, ' ')}{s.content.length > 200 ? '…' : ''}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {((_a = s.reference) === null || _a === void 0 ? void 0 : _a.title) || ((_b = s.reference) === null || _b === void 0 ? void 0 : _b.filePath) || 'unknown'}
                  </div>
                </link_1.default>
              </li>);
            })}
          </ul>)}
      </div>
    </div>);
}
const getServerSideProps = async (ctx) => {
    var _a;
    const session = await (0, next_1.getServerSession)(ctx.req, ctx.res, auth_1.default);
    if (!session || ((_a = session.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        return { redirect: { destination: '/api/auth/signin', permanent: false } };
    }
    return { props: {} };
};
exports.getServerSideProps = getServerSideProps;
function MetricsDisplay({ data }) {
    return (<div className="mt-6 p-4 bg-blue-50 rounded">
      <h2 className="font-semibold">Project Metrics</h2>
      <div>Total Devices: {data.deviceCount}</div>
      <div>Total Articles: {data.articleCount}</div>
      <div>Total Sections: {data.sectionCount}</div>
      <div className="mt-2">
        <span className="font-medium">Status Breakdown:</span>
        <ul className="ml-4 list-disc">
          {data.statusBreakdown.map((s) => (<li key={s.status}>{s.status}: {s._count.status}</li>))}
        </ul>
      </div>
    </div>);
}
