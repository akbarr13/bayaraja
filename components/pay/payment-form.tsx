'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, ImageIcon, X } from 'lucide-react'
import { ALLOWED_IMAGE_TYPES, LIMITS } from '@/lib/constants'

interface PaymentFormProps {
  paymentLinkId: string
  onSuccess: (transactionId: string) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function mapUploadError(status: number, message: string): string {
  if (status === 429) return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.'
  if (status === 410) return 'Link sudah kadaluarsa/terpakai. Hubungi penjual.'
  if (status === 404) return 'Link tidak valid.'
  return message || 'Upload gagal. Coba lagi.'
}

export function PaymentForm({ paymentLinkId, onSuccess }: PaymentFormProps) {
  const [payerName, setPayerName] = useState('')
  const [payerEmail, setPayerEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(selected: File) {
    if (!ALLOWED_IMAGE_TYPES.includes(selected.type as typeof ALLOWED_IMAGE_TYPES[number])) {
      setError('Tipe file tidak diizinkan. Gunakan JPG, PNG, atau WebP.')
      return
    }
    if (selected.size > LIMITS.maxFileSize) {
      setError('Ukuran file maksimal 5MB')
      return
    }
    setError('')
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) handleFile(dropped)
  }

  function clearFile() {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) {
      setError('Upload bukti pembayaran terlebih dahulu')
      return
    }

    setError('')
    setLoading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('payment_link_id', paymentLinkId)
    formData.append('file', file)
    if (payerName) formData.append('payer_name', payerName)
    if (payerEmail) formData.append('payer_email', payerEmail)

    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100))
        }
      }

      xhr.onload = () => {
        setLoading(false)
        try {
          const data = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300 && data.success) {
            onSuccess(data.transaction_id)
          } else {
            setError(mapUploadError(xhr.status, data.error || ''))
          }
        } catch {
          setError('Respons server tidak valid.')
        }
        resolve()
      }

      xhr.onerror = () => {
        setLoading(false)
        setError('Koneksi terputus. Periksa internet Anda.')
        resolve()
      }

      xhr.open('POST', '/api/upload-proof')
      xhr.send(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Step header */}
      <div className="flex items-center gap-3 pb-1">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          2
        </div>
        <div>
          <h2 className="text-sm font-semibold text-text">Konfirmasi Pembayaran</h2>
          <p className="text-xs text-gray-400">Upload bukti transfer setelah bayar</p>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* File upload */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">
          Bukti Pembayaran <span className="text-red-500">*</span>
        </label>

        {preview ? (
          <div className="relative overflow-hidden rounded-xl border border-gray-200">
            <img src={preview} alt="Preview bukti" className="w-full object-cover max-h-48" />
            <button
              type="button"
              onClick={clearFile}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="bg-white px-3 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 truncate">
                {file?.name}
                {file && <span className="ml-2 text-gray-400">({formatFileSize(file.size)})</span>}
              </p>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 transition-colors
              ${dragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-primary/5'
              }`}
          >
            <div className="rounded-full bg-gray-100 p-2.5">
              {dragging ? (
                <ImageIcon className="h-5 w-5 text-primary" />
              ) : (
                <Upload className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {dragging ? 'Lepaskan file di sini' : 'Drag & drop atau klik untuk upload'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP — maks. 5MB</p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      {/* Upload progress */}
      {loading && (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-right">{uploadProgress}%</p>
        </div>
      )}

      {/* Optional fields */}
      <Input
        id="payer_name"
        label="Nama (opsional)"
        placeholder="Nama Anda"
        value={payerName}
        onChange={(e) => setPayerName(e.target.value)}
      />

      <Input
        id="payer_email"
        label="Email (opsional)"
        type="email"
        placeholder="email@anda.com"
        value={payerEmail}
        onChange={(e) => setPayerEmail(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
      )}

      <Button type="submit" variant="cta" className="w-full" loading={loading}>
        Kirim Bukti Pembayaran
      </Button>
    </form>
  )
}
