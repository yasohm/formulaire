import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*');

    if (error) {
      throw error;
    }

    const stats = {
      total: data.length,
      byFiliere: {},
      byNiveau: {},
      recent: 0
    };

    // Calculate recent registrations (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    data.forEach(reg => {
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
}

