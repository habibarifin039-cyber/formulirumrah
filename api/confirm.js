import { createClient } from '@supabase/supabase-js'
import PDFDocument from 'pdfkit'
import axios from 'axios'

// 🔑 koneksi Supabase
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

    // 1️⃣ Ambil data pendaftar dari Supabase
    const { data, error } = await supabase
      .from('pendaftar')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    const { nama, nomor_wa, paket, tanggal } = data

    // 2️⃣ Buat PDF
    const doc = new PDFDocument()
    let buffers = []
    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers).toString('base64')

      // 3️⃣ Kirim ke API WhatsApp (Sumopod)
      await axios.post(process.env.WHATSAPP_API_URL, {
        to: nomor_wa,
        message: `Assalamualaikum ${nama},\n\nPendaftaran umrah Anda berhasil!\n\nPaket: ${paket}\nTanggal: ${tanggal}\n\nLihat detail di PDF terlampir.`,
        attachment: pdfData,
        filename: `Konfirmasi-${nama}.pdf`
      }, {
        headers: {
          Authorization: `Bearer ${process.env.SUMOPOD_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })

      return res.status(200).json({ success: true })
    })

    // ✍ isi PDF
    doc.fontSize(20).text('Konfirmasi Pendaftaran Umrah', { align: 'center' })
    doc.moveDown()
    doc.fontSize(14).text(`Nama: ${nama}`)
    doc.text(`Nomor WA: ${nomor_wa}`)
    doc.text(`Paket: ${paket}`)
    doc.text(`Tanggal: ${tanggal}`)
    doc.moveDown()
    doc.text('Terima kasih sudah mempercayakan perjalanan umrah Anda kepada Rehla Tours.')
    doc.end()

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
