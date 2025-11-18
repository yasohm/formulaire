const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100 MB
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// In-memory storage (replace with database in production)
let registrations = [];

// API Routes
app.post('/api/register', upload.fields([
  { name: 'photo_identite', maxCount: 1 },
  { name: 'certificat_scolarite', maxCount: 1 }
]), (req, res) => {
  try {
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
    } = req.body;

    // Validation
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
    const existingRegistration = registrations.find(
      reg => reg.email === email.toLowerCase()
    );
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل'
      });
    }

    // Get file paths
    const photoPath = req.files?.photo_identite?.[0]?.path || null;
    const certificatPath = req.files?.certificat_scolarite?.[0]?.path || null;

    // Create new registration
    const newRegistration = {
      id: registrations.length + 1,
      nom: nom.trim(),
      prenom: prenom.trim(),
      date_naissance: date_naissance.trim(),
      email: email.toLowerCase().trim(),
      telephone: telephone.trim(),
      cne_massar: cne_massar.trim(),
      niveau: niveau.trim(),
      filiere: filiere.trim(),
      question: question ? question.trim() : null,
      photo_identite: photoPath,
      certificat_scolarite: certificatPath,
      created_at: new Date().toISOString()
    };

    registrations.push(newRegistration);

    res.status(200).json({
      success: true,
      message: 'تم إرسال النموذج بنجاح!',
      registration: {
        id: newRegistration.id,
        nom: newRegistration.nom,
        prenom: newRegistration.prenom,
        email: newRegistration.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم'
    });
  }
});

app.get('/api/registrations', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      registrations: registrations.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
    });
  } catch (error) {
    console.error('Registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تحميل البيانات'
    });
  }
});

app.delete('/api/registrations', (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'معرف التسجيل مطلوب'
      });
    }

    const registrationIndex = registrations.findIndex(
      reg => reg.id === parseInt(id)
    );
    if (registrationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'التسجيل غير موجود'
      });
    }

    // Delete associated files
    const registration = registrations[registrationIndex];
    if (registration.photo_identite && fs.existsSync(registration.photo_identite)) {
      fs.unlinkSync(registration.photo_identite);
    }
    if (registration.certificat_scolarite && fs.existsSync(registration.certificat_scolarite)) {
      fs.unlinkSync(registration.certificat_scolarite);
    }

    registrations.splice(registrationIndex, 1);

    res.status(200).json({
      success: true,
      message: 'تم حذف التسجيل بنجاح'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف التسجيل'
    });
  }
});

app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      total: registrations.length,
      byFiliere: {},
      byNiveau: {},
      recent: 0
    };

    // Calculate recent registrations (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    registrations.forEach(reg => {
      // By filiere
      stats.byFiliere[reg.filiere] = (stats.byFiliere[reg.filiere] || 0) + 1;
      
      // By niveau
      stats.byNiveau[reg.niveau] = (stats.byNiveau[reg.niveau] || 0) + 1;
      
      // Recent registrations
      const regDate = new Date(reg.created_at);
      if (regDate >= weekAgo) {
        stats.recent++;
      }
    });

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حساب الإحصائيات'
    });
  }
});

app.get('/api/export-excel', (req, res) => {
  try {
    // Prepare data for Excel export
    const excelData = registrations.map(reg => ({
      'Nom': reg.nom,
      'Prénom': reg.prenom,
      'Date de Naissance': reg.date_naissance,
      'Email': reg.email,
      'Téléphone': reg.telephone,
      'CNE / Massar': reg.cne_massar,
      'Niveau': reg.niveau,
      'Filière': reg.filiere,
      'Question': reg.question || '',
      'Date d\'inscription': new Date(reg.created_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Nom
      { wch: 15 }, // Prénom
      { wch: 18 }, // Date de Naissance
      { wch: 25 }, // Email
      { wch: 15 }, // Téléphone
      { wch: 15 }, // CNE / Massar
      { wch: 15 }, // Niveau
      { wch: 12 }, // Filière
      { wch: 30 }, // Question
      { wch: 25 }  // Date d'inscription
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscriptions');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers for file download
    const fileName = `Inscriptions_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', excelBuffer.length);

    // Send the Excel file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Excel export error:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تصدير البيانات'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Formulaire System running at http://localhost:${PORT}`);
  console.log(`📝 Registration: http://localhost:${PORT}/index.html`);
});

