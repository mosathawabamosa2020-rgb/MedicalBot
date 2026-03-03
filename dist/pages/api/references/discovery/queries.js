"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = __importDefault(require("../../../../lib/prisma"));
function generateQueries(name, model) {
    const queries = [];
    const base = model ? `${name} ${model}` : name;
    queries.push(`"${base}" user manual pdf`);
    queries.push(`"${base}" operator's guide filetype:pdf`);
    queries.push(`site:siemens-healthineers.com "${base}" specifications`);
    queries.push(`"${base}" service manual pdf`);
    queries.push(`"${base}" "user manual" "pdf"`);
    return queries;
}
async function handler(req, res) {
    try {
        const { deviceId, name, model } = req.query;
        let deviceName = name;
        let deviceModel = model;
        if (deviceId && !deviceName) {
            const device = await prisma_1.default.device.findUnique({ where: { id: deviceId } });
            if (device) {
                deviceName = device.name;
                deviceModel = device.model;
            }
        }
        if (!deviceName)
            return res.status(400).json({ error: 'deviceId or name required' });
        const queries = generateQueries(deviceName, deviceModel);
        return res.json({ queries });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
}
