# تقرير تحديث المخطط والهجرات اليدوية (Schema Update & Manual Migration Report)
## التاريخ: 2026-03-15

### 1. ملخص التغييرات (Summary of Changes)
تم تحديث ملف prisma/schema.prisma لإضافة حقول embedding إلى ثلاثة جداول رئيسية:
1. Reference
2. KnowledgeChunk
3. Section

تم استخدام النوع Unsupported("vector")? في Prisma Schema للإشارة إلى أن هذه الحقول موجودة في قاعدة البيانات ولكن Prisma لا يديرها مباشرة.

### 2. ملفات الهجرات اليدوية (Manual Migration Files)
تم إنشاء ثلاثة ملفات هجرة يدوياً في المسار prisma/migrations/:

1. **202603140001_add_reference_embedding**
   - الملف: migration.sql
   - المحتوى: ALTER TABLE "Reference" ADD COLUMN "embedding" vector(1536);

2. **202603140002_add_knowledgechunk_embedding**
   - الملف: migration.sql
   - المحتوى: ALTER TABLE "KnowledgeChunk" ADD COLUMN "embedding" vector(1536);

3. **202603140003_add_section_embedding**
   - الملف: migration.sql
   - المحتوى: ALTER TABLE "Section" ADD COLUMN "embedding" vector(1536);

### 3. حالة قاعدة البيانات (Database Status)
- **ملاحظة هامة**: لم يتم تطبيق هذه الهجرات على قاعدة البيانات الفعلية حتى الآن.
- **السبب**: عدم القدرة على الاتصال بقاعدة البيانات (Error: P1001: Can't reach database server).
- **التوصية**: يجب تطبيق هذه الهجرات فور توفر قاعدة البيانات باستخدام الأمر: 
px prisma migrate deploy.

### 4. التوافق مع الكود (Code Compatibility)
تم التأكد من أن هذه التغييرات متوافقة مع الكود الموجود في المستودع (Repository)، وتحديداً مع:
- lib/embeddings.ts (مسؤول عن إنشاء وإدارة الـ embeddings).
- lib/services/retrieval/ (مسؤول عن البحث والاسترجاع باستخدام الـ embeddings).

### 5. التوثيق (Documentation)
تم توثيق هذه التغييرات في هذا الملف لضمان إمكانية تتبعها في المستقبل.

---
**تم إنشاء هذا التقرير يدوياً لتعويض عدم القدرة على تشغيل أوامر Prisma التلقائية.**
