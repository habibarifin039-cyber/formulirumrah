// api/confirm.js
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

// Koneksi ke Supabase pakai Service Role (HANYA di server)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'Missing id' })

    // Ambil data pendaftar
    const { data, error } = await supabase
      .from('pendaftar')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Data not found' })

    // Format nomor WA (ubah 08... jadi 628...)
    let phone = String(data.nomor_wa).replace(/\D/g, '')
    if (phone.startsWith('0')) phone = '62' + phone.slice(1)

    const message = `Assalamualaikum ${data.nama}, pendaftaran umrah Anda untuk paket ${data.paket} pada tanggal ${data.tanggal} telah kami terima.`

    // Kirim pesan WA via Sumopod
    await axios.post('https://api.sumopod.com/send', {
      to: phone,
      message: message
    }, {
      headers: {
        Authorization: `Bearer ${process.env.SUMOPOD_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Confirm error:', err.message || err)
    return res.status(500).json({ error: err.message })
  }
}
