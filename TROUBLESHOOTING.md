# 🔧 دليل حل المشاكل - Troubleshooting Guide

## ❌ خطأ: "خطأ في الاتصال بالخادم"

إذا ظهر هذا الخطأ، اتبع الخطوات التالية:

### 1. ✅ تحقق من Environment Variables في Vercel

**هذا هو السبب الأكثر شيوعاً!**

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع `formulaire`
3. اذهب إلى **Settings** → **Environment Variables**
4. تأكد من وجود هذه المتغيرات:

   ```
   SUPABASE_URL = https://iaumommxiwgwutrdtpd.supabase.co
   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

5. **مهم جداً**: تأكد من تفعيلها لجميع البيئات:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

6. بعد إضافة/تعديل المتغيرات، قم بـ **Redeploy**:
   - اذهب إلى **Deployments**
   - اضغط على **"..."** بجانب آخر deployment
   - اختر **"Redeploy"**

### 2. ✅ تحقق من Supabase Setup

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard/project/iaumommxiwgwutrdtpd)
2. تأكد من:
   - ✅ جدول `registrations` موجود (Table Editor)
   - ✅ Storage bucket `uploads` موجود (Storage)
   - ✅ Bucket `uploads` هو **Public**

3. إذا لم تكن موجودة، شغّل `supabase-setup.sql` في SQL Editor

### 3. ✅ تحقق من Vercel Function Logs

1. في Vercel Dashboard → **Deployments**
2. اضغط على آخر deployment
3. اضغط على **"Functions"** tab
4. اضغط على `/api/register`
5. شاهد **Logs** للبحث عن أخطاء

### 4. ✅ تحقق من Console في المتصفح

1. افتح الموقع في المتصفح
2. اضغط **F12** لفتح Developer Tools
3. اذهب إلى **Console** tab
4. حاول إرسال النموذج
5. اقرأ الأخطاء الظاهرة

### 5. ✅ تحقق من Network Tab

1. في Developer Tools، اذهب إلى **Network** tab
2. حاول إرسال النموذج
3. ابحث عن طلب `/api/register`
4. اضغط عليه وشاهد:
   - **Status Code** (يجب أن يكون 200)
   - **Response** (يجب أن يحتوي على JSON)
   - **Headers** (تحقق من CORS)

### 6. ✅ تحقق من API Endpoint مباشرة

جرب استدعاء API مباشرة:

```bash
curl -X POST https://formulaire-ten-cyan.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

أو افتح في المتصفح:
```
https://formulaire-ten-cyan.vercel.app/api/register
```

يجب أن ترى رسالة خطأ (هذا طبيعي - يعني API يعمل)

## 🔍 أخطاء شائعة وحلولها

### خطأ: "Cannot find module '@supabase/supabase-js'"
**الحل**: تأكد من أن `package.json` يحتوي على جميع dependencies

### خطأ: "Missing environment variables"
**الحل**: أضف Environment Variables في Vercel (انظر #1 أعلاه)

### خطأ: "Table 'registrations' does not exist"
**الحل**: شغّل `supabase-setup.sql` في Supabase SQL Editor

### خطأ: "Bucket 'uploads' does not exist"
**الحل**: أنشئ storage bucket في Supabase Storage

### خطأ: CORS error
**الحل**: تأكد من أن CORS headers موجودة في API (موجودة بالفعل في الكود)

## 📞 الحصول على مساعدة

إذا استمرت المشكلة:

1. افتح **Vercel Function Logs** (انظر #3)
2. افتح **Browser Console** (انظر #4)
3. انسخ الأخطاء وأرسلها

## ✅ Checklist سريع

- [ ] Environment Variables موجودة في Vercel
- [ ] Environment Variables مفعلة لجميع البيئات
- [ ] تم عمل Redeploy بعد إضافة المتغيرات
- [ ] جدول `registrations` موجود في Supabase
- [ ] Storage bucket `uploads` موجود و Public
- [ ] Vercel deployment ناجح (Status: Ready)
- [ ] لا توجد أخطاء في Function Logs

