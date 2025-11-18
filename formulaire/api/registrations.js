import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      res.status(200).json({
        success: true,
        registrations: data
      });
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في تحميل البيانات'
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'معرف التسجيل مطلوب'
        });
      }

      // Get registration to delete files
      const { data: registration } = await supabase
        .from('registrations')
        .select('photo_identite, certificat_scolarite')
        .eq('id', id)
        .single();

      // Delete files from storage
      if (registration) {
        if (registration.photo_identite) {
          const photoPath = registration.photo_identite.split('/').pop();
          await supabase.storage.from('uploads').remove([photoPath]);
        }
        if (registration.certificat_scolarite) {
          const certPath = registration.certificat_scolarite.split('/').pop();
          await supabase.storage.from('uploads').remove([certPath]);
        }
      }

      // Delete registration
      const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      res.status(200).json({
        success: true,
        message: 'تم حذف التسجيل بنجاح'
      });
    } catch (error) {
      console.error('Error deleting registration:', error);
      res.status(500).json({
        success: false,
        message: 'خطأ في حذف التسجيل'
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }
}

