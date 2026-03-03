"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
exports.default = SectionReview;
const react_1 = require("react");
const router_1 = require("next/router");
const next_1 = require("next-auth/next");
const auth_1 = __importDefault(require("../../../lib/auth"));
function SectionReview() {
    var _a, _b, _c;
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [section, setSection] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (id && typeof id === 'string') {
            fetch(`/api/admin/sections/${id}`)
                .then(r => r.json())
                .then(setSection);
        }
    }, [id]);
    async function updateStatus(newStatus) {
        if (!id || typeof id !== 'string')
            return;
        setLoading(true);
        const endpoint = `/api/admin/sections/${id}/${newStatus}`;
        const res = await fetch(endpoint, { method: 'POST' });
        setLoading(false);
        if (res.ok) {
            router.push('/admin/verification');
        }
        else {
            alert('Failed to update status');
        }
    }
    if (!section)
        return <div className="p-6">Loading…</div>;
    const fileName = ((_a = section.reference) === null || _a === void 0 ? void 0 : _a.filePath) ? section.reference.filePath.split(/[\\/]/).pop() : null;
    return (<div className="p-6">
      <h1 className="text-2xl font-bold">Review Section</h1>
      <div className="mt-4">
        <h2 className="font-semibold">{section.title || '(no title)'}</h2>
        <div className="mt-2 whitespace-pre-wrap border p-4 rounded bg-white">{section.content}</div>
        <div className="mt-4 text-sm text-gray-600">
          Reference: {((_b = section.reference) === null || _b === void 0 ? void 0 : _b.title) || fileName || 'unknown'}{' '}
          {fileName && (<a href={`/api/admin/file?name=${encodeURIComponent(fileName)}`} target="_blank" rel="noreferrer" className="underline text-blue-600">[open]</a>)}
          {((_c = section.reference) === null || _c === void 0 ? void 0 : _c.sourceUrl) && (<a href={section.reference.sourceUrl} target="_blank" rel="noreferrer" className="underline text-blue-600 ml-2">[source]</a>)}
        </div>
        <div className="mt-6 flex gap-4">
          <button onClick={() => updateStatus('verified')} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">Verify</button>
          <button onClick={() => updateStatus('rejected')} disabled={loading} className="px-4 py-2 bg-red-600 text-white rounded">Reject</button>
        </div>
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
