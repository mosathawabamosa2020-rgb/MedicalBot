"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReferencesPage;
const react_1 = require("react");
const router_1 = require("next/router");
function ReferencesPage() {
    const router = (0, router_1.useRouter)();
    const { id } = router.query;
    const [file, setFile] = (0, react_1.useState)(null);
    const [title, setTitle] = (0, react_1.useState)('');
    async function upload(e) {
        e.preventDefault();
        if (!file || !id)
            return alert('file and device id required');
        const form = new FormData();
        form.append('file', file);
        form.append('deviceId', id);
        form.append('title', title);
        const res = await fetch('/api/references/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (res.ok)
            alert('Uploaded and indexed: ' + data.indexedPages);
        else
            alert('Failed: ' + (data.error || ''));
    }
    return (<div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Reference</h2>
      <form onSubmit={upload} className="space-y-3">
        <div>
          <label className="block">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full"/>
        </div>
        <div>
          <input type="file" accept="application/pdf" onChange={(e) => { var _a; return setFile(((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || null); }}/>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white">Upload & Index</button>
      </form>
    </div>);
}
