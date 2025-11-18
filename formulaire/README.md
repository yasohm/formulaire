# Formulaire d'Inscription

A modern registration form system with file upload capabilities, matching the design from the provided images.

## Features

- **Personal Information Fields:**
  - Nom (Last Name)
  - Prénom (First Name)
  - Date de Naissance (Date of Birth)
  - Email
  - Téléphone (Phone)
  - CNE / Massar Number

- **Academic Information:**
  - Niveau (Level) - Radio buttons (Première année / Deuxième année)
  - Filière (Field of Study) - Dropdown selection

- **File Uploads:**
  - Photo d'identité (Identity Photo) - Image files
  - Certificat de scolarité (School Certificate) - PDF/DOC files
  - Maximum file size: 100 MB per file

- **Additional:**
  - Optional question field
  - Form validation
  - Success/Error messages
  - Clear form functionality

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000/index.html
```

## Project Structure

```
formulaire/
├── index.html          # Main registration form
├── dev-server.js       # Express server with API routes
├── package.json        # Dependencies and scripts
├── env.example         # Environment variables template
├── README.md           # This file
└── uploads/            # Directory for uploaded files (created automatically)
```

## API Endpoints

- `POST /api/register` - Submit registration form
- `GET /api/registrations` - Get all registrations
- `DELETE /api/registrations?id={id}` - Delete a registration
- `GET /api/stats` - Get registration statistics
- `GET /api/export-excel` - Export registrations to Excel

## Technologies Used

- **Frontend:** HTML, CSS (Tailwind), JavaScript
- **Backend:** Node.js, Express.js
- **File Upload:** Multer
- **Excel Export:** XLSX

## 🚀 Quick Start / Configuration

**👉 For detailed step-by-step instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### Quick Overview:
1. **Set up Supabase**: Create project, run `supabase-setup.sql`, create storage bucket
2. **Push to GitHub**: Initialize git and push your code
3. **Deploy to Vercel**: Import repository, add environment variables, deploy
4. **Test**: Fill out the form and verify data in Supabase

For complete instructions with screenshots and troubleshooting, check **SETUP_GUIDE.md**.

## Notes

- **For Local Development:** Use `npm run dev` to run the Express server
- **For Production:** Deploy to Vercel (uses Supabase for database and file storage)
- Uploaded files are stored in Supabase Storage (production) or local `uploads/` directory (development)
- The form supports both French and Arabic text
- All required fields are validated on both client and server side

## License

MIT

