import { createClient } from '@supabase/supabase-js';
import busboy from 'busboy';

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    // Parse multipart form data
    const formData = await parseFormData(req);
    
    const {
      nom,
      prenom,
      date_naissance,
      email,
      telephone,
      cne_massar,
      niveau,
      filiere,
      question
    } = formData.fields;

    // Validate required fields
    if (!nom || !prenom || !date_naissance || !email || !telephone || 
        !cne_massar || !niveau || !filiere) {
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول المطلوبة يجب ملؤها'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال عنوان بريد إلكتروني صحيح'
      });
    }

    // Check for duplicate email
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل'
      });
    }

    // Allowed file types
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'application/pdf'];
    const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'text/plain', 'application/rtf'];

    // Upload files to Supabase Storage
    let photoUrl = null;
    let certificatUrl = null;

    if (formData.files.photo_identite) {
      const photoFile = formData.files.photo_identite;
      
      // Validate file type
      if (!allowedImageTypes.includes(photoFile.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'نوع ملف الصورة غير مدعوم. يرجى استخدام: JPG, PNG, GIF, BMP, WebP, أو PDF'
        });
      }

      // Validate file size (100 MB)
      const maxSize = 100 * 1024 * 1024;
      if (photoFile.buffer.length > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'حجم ملف الصورة كبير جداً (الحد الأقصى: 100 ميجابايت)'
        });
      }

      const fileExt = getFileExtension(photoFile.filename);
      const fileName = `photo-${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
      
      const { data: photoData, error: photoError } = await supabase.storage
        .from('uploads')
        .upload(fileName, photoFile.buffer, {
          contentType: photoFile.mimetype,
          upsert: false
        });

      if (photoError) {
        console.error('Photo upload error:', photoError);
        return res.status(500).json({
          success: false,
          message: 'خطأ في رفع ملف الصورة'
        });
      }

      if (photoData) {
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
        photoUrl = publicUrl;
      }
    }

    if (formData.files.certificat_scolarite) {
      const certFile = formData.files.certificat_scolarite;
      
      // Validate file type
      if (!allowedDocumentTypes.includes(certFile.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'نوع ملف الشهادة غير مدعوم. يرجى استخدام: PDF, DOC, DOCX, JPG, PNG, GIF, BMP, WebP, TXT, أو RTF'
        });
      }

      // Validate file size (100 MB)
      const maxSize = 100 * 1024 * 1024;
      if (certFile.buffer.length > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'حجم ملف الشهادة كبير جداً (الحد الأقصى: 100 ميجابايت)'
        });
      }

      const fileExt = getFileExtension(certFile.filename);
      const fileName = `certificat-${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
      
      const { data: certData, error: certError } = await supabase.storage
        .from('uploads')
        .upload(fileName, certFile.buffer, {
          contentType: certFile.mimetype,
          upsert: false
        });

      if (certError) {
        console.error('Certificate upload error:', certError);
        return res.status(500).json({
          success: false,
          message: 'خطأ في رفع ملف الشهادة'
        });
      }

      if (certData) {
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
        certificatUrl = publicUrl;
      }
    }

    // Insert new registration
    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        nom: nom.trim(),
        prenom: prenom.trim(),
        date_naissance: date_naissance.trim(),
        email: email.toLowerCase().trim(),
        telephone: telephone.trim(),
        cne_massar: cne_massar.trim(),
        niveau: niveau.trim(),
        filiere: filiere.trim(),
        question: question ? question.trim() : null,
        photo_identite: photoUrl,
        certificat_scolarite: certificatUrl
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      
      // Check for duplicate email error
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مسجل بالفعل'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'خطأ في قاعدة البيانات'
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'تم إرسال النموذج بنجاح!',
      registration: {
        id: data[0].id,
        nom: data[0].nom,
        prenom: data[0].prenom,
        email: data[0].email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
}

// Helper function to parse multipart form data using Busboy
function parseFormData(req) {
  return new Promise((resolve, reject) => {
    try {
      // Check if req is a stream or has body
      const requestStream = req.body ? null : req;
      
      const bb = busboy({ 
        headers: req.headers,
        limits: {
          fileSize: 100 * 1024 * 1024 // 100 MB
        }
      });
      
      const fields = {};
      const files = {};
      let fileCount = 0;
      let fieldCount = 0;
      let finished = false;

      bb.on('file', (name, file, info) => {
        const { filename, encoding, mimeType } = info;
        const chunks = [];
        fileCount++;

        file.on('data', (data) => {
          chunks.push(data);
        });

        file.on('end', () => {
          files[name] = {
            filename,
            mimetype: mimeType,
            buffer: Buffer.concat(chunks)
          };
          fileCount--;
          checkFinish();
        });

        file.on('error', (err) => {
          console.error('File stream error:', err);
          fileCount--;
          checkFinish();
        });
      });

      bb.on('field', (name, value) => {
        fields[name] = value;
        fieldCount++;
      });

      bb.on('finish', () => {
        finished = true;
        checkFinish();
      });

      bb.on('error', (err) => {
        console.error('Busboy error:', err);
        reject(err);
      });

      // Handle Vercel's request format
      if (requestStream) {
        requestStream.pipe(bb);
      } else if (req.body) {
        // If body is already parsed, we need to handle it differently
        // For Vercel, we might need to reconstruct the stream
        if (Buffer.isBuffer(req.body)) {
          const stream = require('stream');
          const bufferStream = new stream.PassThrough();
          bufferStream.end(req.body);
          bufferStream.pipe(bb);
        } else {
          // Body might be a string or object
          reject(new Error('Unsupported request body format'));
        }
      } else {
        reject(new Error('Cannot parse request: no body or stream'));
      }

      function checkFinish() {
        if (finished && fileCount === 0) {
          resolve({ fields, files });
        }
      }

      // Timeout protection
      setTimeout(() => {
        if (!finished) {
          reject(new Error('Request timeout while parsing form data'));
        }
      }, 30000); // 30 second timeout

    } catch (error) {
      console.error('parseFormData error:', error);
      reject(error);
    }
  });
}

function getFileExtension(filename) {
  return filename ? '.' + filename.split('.').pop() : '';
}
