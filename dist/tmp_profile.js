require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
    await p.$connect();
    const rows = await p.$queryRawUnsafe(`SELECT kc.category,kc.content FROM "KnowledgeChunk" kc JOIN "Reference" r ON kc."referenceId"=r.id JOIN "Device" d ON r."deviceId"=d.id WHERE d.model=$1`, 'K180324');
    const profile = {};
    for (const r of rows) {
        if (!profile[r.category])
            profile[r.category] = [];
        profile[r.category].push(r.content);
    }
    console.log(JSON.stringify(profile, null, 2));
    await p.$disconnect();
})();
