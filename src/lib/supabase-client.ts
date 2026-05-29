import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Browser client (untyped for flexibility)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL &&
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
}

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  if (!isSupabaseConfigured()) {
    return { data: { user: { id: 'demo-user', email } }, error: null }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    return { data: { user: { id: 'demo-user', email } }, error: null }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// Contract helpers
export const getContracts = async (userId: string) => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getContract = async (id: string) => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*, contract_versions(*), contract_comments(*), signature_requests(*)')
    .eq('id', id)
    .single()
  return { data, error }
}

export const createContract = async (contract: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('contracts')
    .insert(contract)
    .select()
    .single()
  return { data, error }
}

export const updateContract = async (id: string, updates: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('contracts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Deal helpers
export const getDeals = async (userId: string) => {
  const { data, error } = await supabase
    .from('deals')
    .select('*, brands(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createDeal = async (deal: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('deals')
    .insert(deal)
    .select()
    .single()
  return { data, error }
}

export const updateDeal = async (id: string, updates: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Invoice helpers
export const getInvoices = async (userId: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createInvoice = async (invoice: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single()
  return { data, error }
}

export const updateInvoice = async (id: string, updates: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Brand CRM helpers
export const getBrands = async (userId: string) => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })
  return { data, error }
}

export const createBrand = async (brand: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('brands')
    .insert(brand)
    .select()
    .single()
  return { data, error }
}

// Notification helpers
export const getNotifications = async (userId: string, unreadOnly = false) => {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query
  return { data, error }
}

export const markNotificationRead = async (id: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Media Kit helpers
export const getMediaKit = async (userId: string) => {
  const { data, error } = await supabase
    .from('media_kits')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export const upsertMediaKit = async (mediaKit: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('media_kits')
    .upsert(mediaKit)
    .select()
    .single()
  return { data, error }
}

// Time tracking helpers
export const getTimeEntries = async (userId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)

  const { data, error } = await query
  return { data, error }
}

export const createTimeEntry = async (entry: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('time_entries')
    .insert(entry)
    .select()
    .single()
  return { data, error }
}

// Expense helpers
export const getExpenses = async (userId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)

  const { data, error } = await query
  return { data, error }
}

export const createExpense = async (expense: Record<string, unknown>) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single()
  return { data, error }
}

// File storage helpers
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: false })
  return { data, error }
}

export const getFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path])
  return { data, error }
}
