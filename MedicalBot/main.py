from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackQueryHandler, ContextTypes
from groq import Groq
from PIL import Image
import os
import pytesseract

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MEDIA_DIR = "received_files"
if not os.path.exists(MEDIA_DIR):
    os.makedirs(MEDIA_DIR)

# إعداد Groq
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

async def generate_questions_from_image(image_path):
    if client is None:
        return "Groq API key is not configured. Set GROQ_API_KEY."
    try:
        # قراءة الصورة باستخدام Pillow
        img = Image.open(image_path)

        # تحويل الصورة إلى نص باستخدام pytesseract (يدعم العربية)
        text = pytesseract.image_to_string(img, lang='ara')  # إذا كانت الصورة بالعربية

        # إرسال النص إلى Groq لإنشاء الأسئلة
        prompt = f"""
        أنت مساعد تعليمي. لديك نص من محاضرة باللغة العربية.
        مهمتك: إنشاء 5 أسئلة صح وخطأ، و5 أسئلة اختيار من متعدد.
        يجب أن تكون الأسئلة واضحة ومباشرة، وتغطي أهم النقاط في النص.

        النص:
        {text}

        الإجابة:
        """

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # ← تم تغيير النموذج
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024
        )

        return response.choices[0].message.content
    except Exception as e:
        return f"❌ حدث خطأ أثناء إنشاء الأسئلة: {str(e)}"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message:
        return

    welcome_message = """
    👋 مرحباً!  
    أنا بوت اللجنة العلمية لتخصص هندسة المعدات الطبية.  
    يمكنك إرسال أي ملف أو صورة أو استفسار — وسأحتفظ به لرئيس اللجنة.
    """
    await update.message.reply_text(welcome_message)
    await show_menu(update, context)  # ← بدون query


async def show_menu(update: Update,
                    context: ContextTypes.DEFAULT_TYPE,
                    query=None):
    keyboard = [
        [
            InlineKeyboardButton("📚 ميكانيكا حيوية",
                                 callback_data='biomechanics')
        ],
        [
            InlineKeyboardButton("🔬 أجهزة البصريات والمختبرات الطبية",
                                 callback_data='optics')
        ],
        [
            InlineKeyboardButton("💻 الاليكترونيات 1",
                                 callback_data='electronics1')
        ],
        [
            InlineKeyboardButton("⚡ دوائر كهربائية متقدمة",
                                 callback_data='circuits')
        ],
        [
            InlineKeyboardButton("✏️ مقرر الرسم الهندسي",
                                 callback_data='drawing')
        ],
        [InlineKeyboardButton("📐 الرياضيات الهندسية", callback_data='math')],
        [
            InlineKeyboardButton("💾 التصميم المنطقي الرقمي",
                                 callback_data='digital_design')
        ],
        [
            InlineKeyboardButton("🧪 الكيمياء العامة والحيوية",
                                 callback_data='chemistry')
        ],
        [
            InlineKeyboardButton("📩 إرسال استفسار",
                                 callback_data='ask_question')
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    if query:
        # إذا تم استدعاؤها من زر، نعدل الرسالة الحالية
        await query.edit_message_text("اختر المقرر أو خدمة من القائمة:",
                                      reply_markup=reply_markup)
    else:
        # إذا تم استدعاؤها من أمر `/start`، نرسل رسالة جديدة
        if update.message:
            await update.message.reply_text("اختر المقرر أو خدمة من القائمة:",
                                            reply_markup=reply_markup)


async def button_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if not query or not query.data:
        return

    await query.answer()

    # إذا كان المستخدم ضغط على مقرر، نعرض له الخيارات الثلاثة
    if query.data in [
            'biomechanics', 'optics', 'electronics1', 'circuits', 'drawing',
            'math', 'digital_design', 'chemistry'
    ]:
        course_name = {
            'biomechanics': 'ميكانيكا حيوية',
            'optics': 'أجهزة البصريات والمختبرات الطبية',
            'electronics1': 'الكترونيات 1',
            'circuits': 'دوائر كهربائية متقدمة',
            'drawing': 'مقرر الرسم الهندسي',
            'math': 'الرياضيات الهندسية',
            'digital_design': 'التصميم المنطقي الرقمي',
            'chemistry': 'الكيمياء العامة والحيوية'
        }.get(query.data, 'المقرر')

        keyboard = [
            [
                InlineKeyboardButton("📚 ملازم ومراجع",
                                     callback_data=f'{query.data}_notes')
            ],
            [
                InlineKeyboardButton("📝 ملخصات وتفريغات",
                                     callback_data=f'{query.data}_summaries')
            ],
            [
                InlineKeyboardButton("🧪 نماذج واختبارات",
                                     callback_data=f'{query.data}_exams')
            ],
            [
                InlineKeyboardButton("🔙 العودة للقائمة الرئيسية",
                                     callback_data='back_to_menu')
            ]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await query.edit_message_text(text=f"اختر خدمة لـ {course_name}:",
                                      reply_markup=reply_markup)

    # إذا كان المستخدم ضغط على أحد الخيارات الثلاثة
    elif '_notes' in query.data:
        await query.edit_message_text(
            text="✅ هنا ستظهر لك روابط أو ملفات الملازم والمراجع.",
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🔙 العودة للقائمة الرئيسية",
                                     callback_data='back_to_menu')
            ]]))
    elif '_summaries' in query.data:
        await query.edit_message_text(
            text="✅ هنا ستظهر لك روابط أو ملفات الملخصات والتفريغات.",
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🔙 العودة للقائمة الرئيسية",
                                     callback_data='back_to_menu')
            ]]))
    elif '_exams' in query.data:
        await query.edit_message_text(
            text="✅ هنا ستظهر لك روابط أو ملفات النماذج والاختبارات.",
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("🔙 العودة للقائمة الرئيسية",
                                     callback_data='back_to_menu')
            ]]))

    # إذا كان المستخدم ضغط على "العودة للقائمة الرئيسية"
    elif query.data == 'back_to_menu':
        await show_menu(update, context, query=query)  # ← نمرر الـ query


# دالة لحفظ الملفات والصور
async def handle_media(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.effective_user:
        return

    user = update.effective_user
    file_id = None
    file_name = "unnamed"

    if update.message.photo:
        file_id = update.message.photo[-1].file_id
        file_name = f"{user.id}_photo.jpg"
    elif update.message.document:
        file_id = update.message.document.file_id
        file_name = update.message.document.file_name or f"{user.id}_document"
    elif update.message.video:
        file_id = update.message.video.file_id
        file_name = f"{user.id}_video.mp4"
    elif update.message.audio:
        file_id = update.message.audio.file_id
        file_name = f"{user.id}_audio.mp3"
    elif update.message.voice:
        file_id = update.message.voice.file_id
        file_name = f"{user.id}_voice.ogg"

    if file_id:
        file = await context.bot.get_file(file_id)
        await file.download_to_drive(
            custom_path=os.path.join(MEDIA_DIR, file_name))
        await update.message.reply_text(f"تم حفظ الملف باسم: {file_name}")

        # إذا كان الملف صورة، نحاول إنشاء أسئلة
        if file_name.endswith(('.jpg', '.jpeg', '.png')):
            try:
                await update.message.reply_text("⏳ جاري تحليل الصورة وإنشاء الأسئلة...")
                questions = await generate_questions_from_image(os.path.join(MEDIA_DIR, file_name))
                await update.message.reply_text(f"✅ تم إنشاء الأسئلة:\n\n{questions}")
            except Exception as e:
                await update.message.reply_text(f"❌ حدث خطأ أثناء إنشاء الأسئلة: {str(e)}")


# دالة لحفظ الرسائل النصية
async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.effective_user or not update.message.text:
        return

    user = update.effective_user
    message_text = update.message.text
    user_message = f"[{user.id}] {user.full_name}: {message_text}\n"

    with open("messages.txt", "a", encoding="utf-8") as f:
        f.write(user_message)

    await update.message.reply_text("تم استلام رسالتك وتسجيلها. شكرًا!")


def main():
    if not TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN is required to run MedicalBot.")
    application = Application.builder().token(TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(button_handler))
    application.add_handler(
        MessageHandler(
            filters.PHOTO | filters.Document.ALL | filters.VIDEO
            | filters.AUDIO | filters.VOICE, handle_media))
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    print("البوت يعمل الآن... اضغط Ctrl+C لإيقافه.")
    application.run_polling()


if __name__ == "__main__":
    main()
