'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { User, Lock, Key, Plus, Trash2, Copy, Check, Eye, EyeOff, Webhook } from 'lucide-react'
import { copyToClipboard } from '@/lib/clipboard'
import type { ApiKey } from '@/lib/types'

interface WebhookItem {
  id: string
  label: string
  url: string
  is_active: boolean
  last_triggered_at: string | null
  created_at: string
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-6 py-8 border-b border-gray-100 last:border-0 md:grid-cols-[200px_1fr] w-full">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-text">{title}</h2>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [newKeyLabel, setNewKeyLabel] = useState('')
  const [generatedKey, setGeneratedKey] = useState('')
  const [keyLoading, setKeyLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [deleteKeyTarget, setDeleteKeyTarget] = useState<string | null>(null)

  const [webhooks, setWebhooks] = useState<WebhookItem[]>([])
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const [webhookLabel, setWebhookLabel] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookLoading, setWebhookLoading] = useState(false)
  const [generatedSecret, setGeneratedSecret] = useState('')
  const [secretCopied, setSecretCopied] = useState(false)
  const [deleteWebhookTarget, setDeleteWebhookTarget] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    async function load() {
      const supabase = getBrowserSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email ?? '')
        setDisplayName(user.user_metadata?.display_name ?? '')
}
      loadApiKeys()
      loadWebhooks()
    }
    load()
  }, [])

  async function loadApiKeys() {
    const res = await fetch('/api/api-keys')
    const json = await res.json()
    setApiKeys(json.data ?? [])
  }

  async function loadWebhooks() {
    const res = await fetch('/api/webhooks')
    const json = await res.json()
    setWebhooks(json.data ?? [])
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    const supabase = getBrowserSupabase()
    const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } })
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ display_name: displayName }).eq('id', user.id)
    }
    setProfileMsg(error ? error.message : 'Profil berhasil diupdate.')
    setProfileLoading(false)
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword) { setPasswordMsg('Masukkan password saat ini.'); return }
    if (newPassword.length < 6) { setPasswordMsg('Password baru minimal 6 karakter.'); return }
    setPasswordLoading(true)
    setPasswordMsg('')
    const supabase = getBrowserSupabase()
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
    if (signInErr) {
      setPasswordMsg('Password saat ini salah.')
      setPasswordLoading(false)
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordMsg(error.message)
    } else {
      setPasswordMsg('Password berhasil diubah.')
      setCurrentPassword('')
      setNewPassword('')
    }
    setPasswordLoading(false)
  }

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault()
    setKeyLoading(true)
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: newKeyLabel }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setGeneratedKey(json.data.key)
      setNewKeyLabel('')
      await loadApiKeys()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal membuat API key')
    } finally {
      setKeyLoading(false)
    }
  }

  async function confirmDeleteKey() {
    if (!deleteKeyTarget) return
    await fetch(`/api/api-keys?id=${deleteKeyTarget}`, { method: 'DELETE' })
    setDeleteKeyTarget(null)
    toast('API key berhasil dihapus')
    await loadApiKeys()
  }

  async function handleCreateWebhook(e: React.FormEvent) {
    e.preventDefault()
    setWebhookLoading(true)
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: webhookLabel, url: webhookUrl }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setGeneratedSecret(json.data.secret)
      setWebhookLabel('')
      setWebhookUrl('')
      await loadWebhooks()
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal membuat webhook')
    } finally {
      setWebhookLoading(false)
    }
  }

  async function toggleWebhook(id: string, is_active: boolean) {
    await fetch(`/api/webhooks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active }),
    })
    await loadWebhooks()
  }

  async function confirmDeleteWebhook() {
    if (!deleteWebhookTarget) return
    await fetch(`/api/webhooks/${deleteWebhookTarget}`, { method: 'DELETE' })
    setDeleteWebhookTarget(null)
    toast('Webhook berhasil dihapus')
    await loadWebhooks()
  }

  async function handleCopySecret() {
    await copyToClipboard(generatedSecret)
    setSecretCopied(true)
    setTimeout(() => setSecretCopied(false), 2000)
  }

  async function handleCopyKey() {
    await copyToClipboard(generatedKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-heading font-bold text-text mb-6">Pengaturan</h1>
      <div className="w-full">

        <div className="rounded-xl border border-gray-100 bg-white px-6 w-full">
          <Section icon={User} title="Profil" description="Nama tampilan yang terlihat di dashboard Anda.">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input id="email" label="Email" value={email} disabled />
              <Input
                id="displayName"
                label="Nama"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              {profileMsg && <p className="text-sm text-green-600">{profileMsg}</p>}
              <Button type="submit" loading={profileLoading}>Simpan</Button>
            </form>
          </Section>

          <Section icon={Lock} title="Keamanan" description="Ubah password untuk menjaga keamanan akun Anda.">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <Input
                id="currentPassword"
                label="Password Saat Ini"
                type="password"
                placeholder="Password Anda saat ini"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                id="newPassword"
                label="Password Baru"
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
              />
              {passwordMsg && (
                <p className={`text-sm ${passwordMsg.includes('salah') || passwordMsg.includes('minimal') ? 'text-red-600' : 'text-green-600'}`}>
                  {passwordMsg}
                </p>
              )}
              <Button type="submit" loading={passwordLoading}>Ubah Password</Button>
            </form>
          </Section>

          <Section icon={Webhook} title="Webhooks" description="Terima notifikasi real-time ke URL Anda saat ada transaksi baru atau diperbarui.">
            <div className="space-y-3">
              <Button size="sm" onClick={() => { setGeneratedSecret(''); setShowWebhookModal(true) }}>
                <Plus className="h-4 w-4" />
                Tambah Webhook
              </Button>

              {webhooks.length === 0 ? (
                <EmptyState
                  icon={Webhook}
                  title="Belum ada webhook"
                  description="Tambah webhook untuk mendapat notifikasi otomatis saat transaksi masuk."
                />
              ) : (
                <div className="space-y-2">
                  {webhooks.map((wh) => (
                    <div
                      key={wh.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text">{wh.label}</p>
                        <p className="text-xs text-gray-400 truncate">{wh.url}</p>
                        {wh.last_triggered_at && (
                          <p className="text-xs text-gray-400">
                            Terakhir: {new Date(wh.last_triggered_at).toLocaleDateString('id-ID')}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <button
                          onClick={() => toggleWebhook(wh.id, !wh.is_active)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            wh.is_active ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                              wh.is_active ? 'translate-x-4.5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteWebhookTarget(wh.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          <Section icon={Key} title="API Keys" description="Gunakan API key untuk mengintegrasikan Bayaraja dengan sistem Anda.">
            <div className="space-y-3">
              <Button size="sm" onClick={() => { setGeneratedKey(''); setShowKeyModal(true) }}>
                <Plus className="h-4 w-4" />
                Buat Key
              </Button>

              {apiKeys.length === 0 ? (
                <EmptyState
                  icon={Key}
                  title="Belum ada API key"
                  description="Buat API key untuk mengakses QRIS API secara programatis."
                />
              ) : (
                <div className="space-y-2">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-text">{key.label}</p>
                        <p className="text-xs text-gray-400">
                          Dibuat {new Date(key.created_at).toLocaleDateString('id-ID')}
                          {key.last_used_at && (
                            <> · Dipakai {new Date(key.last_used_at).toLocaleDateString('id-ID')}</>
                          )}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteKeyTarget(key.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Create Key Modal */}
      <Modal
        open={showKeyModal}
        onClose={() => { setShowKeyModal(false); setGeneratedKey('') }}
        title={generatedKey ? 'API Key Dibuat' : 'Buat API Key'}
      >
        {generatedKey ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
              Simpan API key ini sekarang. Key tidak akan ditampilkan lagi setelah modal ini ditutup.
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-gray-100 p-3 text-xs break-all font-mono">
                {showKey ? generatedKey : '•'.repeat(40)}
              </code>
              <Button variant="ghost" size="sm" onClick={() => setShowKey(!showKey)}>
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyKey}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="primary" className="w-full" onClick={() => { setShowKeyModal(false); setGeneratedKey('') }}>
              Selesai
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreateKey} className="space-y-4">
            <Input
              id="keyLabel"
              label="Label"
              placeholder="Contoh: Production, Testing"
              value={newKeyLabel}
              onChange={(e) => setNewKeyLabel(e.target.value)}
              required
            />
            <Button type="submit" loading={keyLoading} className="w-full">
              Buat API Key
            </Button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteKeyTarget !== null}
        title="Hapus API Key"
        description="API key ini akan dihapus permanen dan tidak bisa digunakan lagi."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDeleteKey}
        onCancel={() => setDeleteKeyTarget(null)}
      />

      {/* Webhook Modal */}
      <Modal
        open={showWebhookModal}
        onClose={() => { setShowWebhookModal(false); setGeneratedSecret('') }}
        title={generatedSecret ? 'Webhook Dibuat' : 'Tambah Webhook'}
      >
        {generatedSecret ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
              Simpan secret ini sekarang. Secret tidak akan ditampilkan lagi setelah modal ini ditutup. Gunakan untuk verifikasi signature <code className="font-mono">X-Bayaraja-Signature</code>.
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-gray-100 p-3 text-xs break-all font-mono">
                {generatedSecret}
              </code>
              <Button variant="outline" size="sm" onClick={handleCopySecret}>
                {secretCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="primary" className="w-full" onClick={() => { setShowWebhookModal(false); setGeneratedSecret('') }}>
              Selesai
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreateWebhook} className="space-y-4">
            <Input
              id="webhookLabel"
              label="Label"
              placeholder="Contoh: Production, Notifikasi"
              value={webhookLabel}
              onChange={(e) => setWebhookLabel(e.target.value)}
              required
            />
            <Input
              id="webhookUrl"
              label="URL"
              type="url"
              placeholder="https://example.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400">
              Events: <code className="font-mono">transaction.created</code>, <code className="font-mono">transaction.confirmed</code>, <code className="font-mono">transaction.rejected</code>
            </p>
            <Button type="submit" loading={webhookLoading} className="w-full">
              Buat Webhook
            </Button>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteWebhookTarget !== null}
        title="Hapus Webhook"
        description="Webhook ini akan dihapus permanen."
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDeleteWebhook}
        onCancel={() => setDeleteWebhookTarget(null)}
      />
    </div>
  )
}
