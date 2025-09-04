"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // pastikan sudah ada konfigurasi Supabase

export default function FormPendaftaran() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    tanggal_pendaftaran: "",
    jenis_kelamin: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    nama_ayah: "",
    nama_ibu: "",
    alamat: "",
    kota: "",
    provinsi: "",
    kode_pos: "",
    pekerjaan: "",
    nik: "",
    no_paspor: "",
    tgl_terbit_paspor: "",
    tgl_akhir_paspor: "",
    tempat_terbit_paspor: "",
    no_hp: "",
    whatsapp: "",
    email: "",
    pernah_umroh: false,
    pernah_haji: false,
    kontak_darurat: "",
    hubungan: "",
    status_nikah: "",
    paket: "",
    metode_bayar: "",
    setuju: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.setuju) {
      alert("Harap centang persetujuan sebelum daftar.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("pendaftaran_umroh")
        .insert([formData]);

      if (error) throw error;

      alert("Pendaftaran berhasil!");
      setFormData({ ...formData, setuju: false }); // reset sebagian
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat submit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* contoh 1 field */}
      <input
        type="text"
        name="nama"
        placeholder="Nama sesuai paspor"
        value={formData.nama}
        onChange={handleChange}
        required
      />
      {/* tambahkan semua input lain sesuai field */}
      
      <label>
        <input
          type="checkbox"
          name="setuju"
          checked={formData.setuju}
          onChange={handleChange}
        />
        Saya menyetujui syarat dan ketentuan
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Daftar Umroh"}
      </button>
    </form>
  );
}
