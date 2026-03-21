"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import type { QrisAccount } from "@/lib/types";

interface QrisFormProps {
  initial?: QrisAccount;
  onSubmit: (data: {
    label: string;
    qris_string: string;
    merchant_name: string;
    is_default: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

export function QrisForm({ initial, onSubmit, onCancel }: QrisFormProps) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [qrisString, setQrisString] = useState(initial?.qris_string ?? "");
  const [merchantName, setMerchantName] = useState(
    initial?.merchant_name ?? "",
  );
  const [isDefault, setIsDefault] = useState(initial?.is_default ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">("idle");
  const [scanError, setScanError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setScanStatus("idle");
    setScanError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const { default: jsQR } = await import('jsqr');
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrisString(code.data);
          setScanStatus("success");
          setScanError("");
        } else {
          setScanStatus("error");
          setScanError("QR Code tidak ditemukan. Pastikan gambar QRIS jelas dan tidak terpotong.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        label,
        qris_string: qrisString,
        merchant_name: merchantName,
        is_default: isDefault,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="label"
        label="Label"
        placeholder="Contoh: Toko Saya - BCA"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        required
      />

      {/* Upload dropzone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text">
          Gambar QRIS
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors
            ${dragging ? "border-primary bg-primary/5" : "border-gray-200 bg-gray-50 hover:border-primary/50 hover:bg-primary/5"}
            ${scanStatus === "success" ? "border-green-400 bg-green-50" : ""}
            ${scanStatus === "error" ? "border-red-300 bg-red-50" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="qris_image"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageUpload}
            className="hidden"
          />

          {scanStatus === "success" ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <p className="text-sm font-medium text-green-700">QRIS berhasil dibaca</p>
              <p className="text-xs text-green-600 truncate max-w-full">{fileName}</p>
              <p className="text-xs text-gray-400">Klik untuk ganti gambar</p>
            </>
          ) : scanStatus === "error" ? (
            <>
              <XCircle className="h-8 w-8 text-red-400" />
              <p className="text-sm font-medium text-red-600">Gagal membaca QR</p>
              <p className="text-xs text-red-500 text-center">{scanError}</p>
              <p className="text-xs text-gray-400">Klik untuk coba gambar lain</p>
            </>
          ) : (
            <>
              {fileName ? (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {fileName ? fileName : "Drag & drop atau klik untuk upload"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">PNG, JPG hingga 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* QRIS string — hidden, diisi otomatis dari scan */}
      <input type="hidden" value={qrisString} readOnly />

      <Input
        id="merchant_name"
        label="Nama Merchant (opsional)"
        placeholder="Nama toko/bisnis Anda"
        value={merchantName}
        onChange={(e) => setMerchantName(e.target.value)}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
          className="rounded border-gray-300"
        />
        Jadikan sebagai QRIS default
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" loading={loading} disabled={!qrisString}>
          {initial ? "Simpan" : "Tambah QRIS"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
