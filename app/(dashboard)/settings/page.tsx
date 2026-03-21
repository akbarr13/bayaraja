'use client'

import { useEffect, useState } from 'react'
import { getBrowserSupabase } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { User, Lock, Key, Plus, Trash2, Copy, Check, Eye, EyeOff } from 'lucide-react'
import type { ApiKey } from '@/lib/types'

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
    }
    load()
  }, [])

  async function loadApiKeys() {
    const res = await fetch('/api/api-keys')
    const json = await res.json()
    setApiKeys(json.data ?? [])
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

  async function handleCopyKey() {
    await navigator.clipboard.writeText(generatedKey)
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
    </div>
  )
}
