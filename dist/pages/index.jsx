"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
exports.default = Home;
const next_1 = require("next-auth/next");
const auth_1 = __importDefault(require("../lib/auth"));
function Home() {
    // page will never render because we always redirect in getServerSideProps
    return null;
}
const getServerSideProps = async (ctx) => {
    var _a;
    const session = await (0, next_1.getServerSession)(ctx.req, ctx.res, auth_1.default);
    if (!session) {
        return {
            redirect: { destination: '/auth/signin', permanent: false }
        };
    }
    const role = (((_a = session.user) === null || _a === void 0 ? void 0 : _a.role) || '').toString().toLowerCase();
    let destination = '/auth/signin';
    if (role === 'admin')
        destination = '/admin/dashboard';
    else if (role === 'reviewer')
        destination = '/admin/verification';
    else if (role === 'editor')
        destination = '/admin/content-studio';
    return {
        redirect: { destination, permanent: false }
    };
};
exports.getServerSideProps = getServerSideProps;
