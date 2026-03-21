export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  created_at: string
}

export interface QrisAccount {
  id: string
  user_id: string
  label: string
  qris_string: string
  merchant_name: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface PaymentLink {
  id: string
  user_id: string
  qris_account_id: string
  slug: string
  title: string
  description: string | null
  amount: number
  is_active: boolean
  is_single_use: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
  // Joined
  qris_account?: QrisAccount
}

export type TransactionStatus = 'pending' | 'confirmed' | 'rejected'

export interface Transaction {
  id: string
  payment_link_id: string
  user_id: string
  amount: number
  payer_name: string | null
  payer_email: string | null
  status: TransactionStatus
  payment_proof: string
  notes: string | null
  ip_address: string
  created_at: string
  updated_at: string
  // Joined
  payment_link?: PaymentLink
}

export interface ApiKey {
  id: string
  user_id: string
  key_hash: string
  label: string
  last_used_at: string | null
  is_active: boolean
  created_at: string
}

export interface DashboardStats {
  total_links: number
  active_links: number
  total_transactions: number
  pending_transactions: number
  confirmed_transactions: number
  total_revenue: number
}
