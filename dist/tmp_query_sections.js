require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
(async () => {
    const p = new PrismaClient();
    await p.$connect();
    const dev = await p.device.findFirst({ where: { model: 'K180324' } });
    const secs = await p.section.findMany({ where: { deviceId: dev.id }, orderBy: { order: 'asc' } });
    console.log('sections count', secs.length);
    secs.forEach(s => {
        console.log('---', s.order, s.title, '---');
        console.log(s.content.split('\n').slice(0, 3).join(' | '));
    });
    await p.$disconnect();
})();
