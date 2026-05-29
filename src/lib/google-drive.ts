import { google, drive_v3 } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

/**
 * Check if Google Drive is properly configured
 */
export function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REDIRECT_URI
  )
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthUrl(state?: string): string {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent', // Force consent to get refresh token
    state,
  })
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string
  refresh_token?: string
  expiry_date: number
}> {
  const { tokens } = await oauth2Client.getToken(code)

  return {
    access_token: tokens.access_token!,
    refresh_token: tokens.refresh_token ?? undefined,
    expiry_date: tokens.expiry_date!,
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string
  expiry_date: number
}> {
  oauth2Client.setCredentials({ refresh_token: refreshToken })
  const { credentials } = await oauth2Client.refreshAccessToken()

  return {
    access_token: credentials.access_token!,
    expiry_date: credentials.expiry_date!,
  }
}

/**
 * Get user info
 */
export async function getUserInfo(accessToken: string): Promise<{
  email: string
  name: string
  picture?: string
}> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data } = await oauth2.userinfo.get()

  return {
    email: data.email!,
    name: data.name!,
    picture: data.picture ?? undefined,
  }
}

/**
 * Upload a file to Google Drive
 */
export async function uploadToDrive(
  accessToken: string,
  file: {
    name: string
    mimeType: string
    content: Buffer | string
  },
  folderId?: string
): Promise<{
  id: string
  name: string
  webViewLink: string
  webContentLink?: string
}> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const fileMetadata: drive_v3.Schema$File = {
    name: file.name,
  }

  if (folderId) {
    fileMetadata.parents = [folderId]
  }

  const content = typeof file.content === 'string'
    ? Buffer.from(file.content, 'base64')
    : file.content

  // Create a readable stream from the buffer
  const { Readable } = await import('stream')
  const stream = new Readable()
  stream.push(content)
  stream.push(null)

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: {
      mimeType: file.mimeType,
      body: stream,
    },
    fields: 'id, name, webViewLink, webContentLink',
  })

  return {
    id: response.data.id!,
    name: response.data.name!,
    webViewLink: response.data.webViewLink!,
    webContentLink: response.data.webContentLink ?? undefined,
  }
}

/**
 * Create a folder in Google Drive
 */
export async function createFolder(
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<{
  id: string
  name: string
  webViewLink: string
}> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  const fileMetadata: drive_v3.Schema$File = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  }

  if (parentFolderId) {
    fileMetadata.parents = [parentFolderId]
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  })

  return {
    id: response.data.id!,
    name: response.data.name!,
    webViewLink: response.data.webViewLink!,
  }
}

/**
 * List folders in Google Drive
 */
export async function listFolders(
  accessToken: string,
  parentFolderId?: string
): Promise<Array<{
  id: string
  name: string
}>> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  let query = "mimeType='application/vnd.google-apps.folder' and trashed=false"

  if (parentFolderId) {
    query += ` and '${parentFolderId}' in parents`
  } else {
    query += " and 'root' in parents"
  }

  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    orderBy: 'name',
  })

  return (response.data.files || []).map((file) => ({
    id: file.id!,
    name: file.name!,
  }))
}

/**
 * List files in a folder
 */
export async function listFiles(
  accessToken: string,
  folderId?: string,
  mimeType?: string
): Promise<Array<{
  id: string
  name: string
  mimeType: string
  webViewLink: string
  createdTime: string
}>> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  let query = "trashed=false"

  if (folderId) {
    query += ` and '${folderId}' in parents`
  }

  if (mimeType) {
    query += ` and mimeType='${mimeType}'`
  } else {
    query += " and mimeType!='application/vnd.google-apps.folder'"
  }

  const response = await drive.files.list({
    q: query,
    fields: 'files(id, name, mimeType, webViewLink, createdTime)',
    orderBy: 'createdTime desc',
    pageSize: 100,
  })

  return (response.data.files || []).map((file) => ({
    id: file.id!,
    name: file.name!,
    mimeType: file.mimeType!,
    webViewLink: file.webViewLink!,
    createdTime: file.createdTime!,
  }))
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  await drive.files.delete({
    fileId,
  })
}

/**
 * Move a file to a different folder
 */
export async function moveFile(
  accessToken: string,
  fileId: string,
  newFolderId: string
): Promise<void> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  // Get current parents
  const file = await drive.files.get({
    fileId,
    fields: 'parents',
  })

  const previousParents = (file.data.parents || []).join(',')

  await drive.files.update({
    fileId,
    addParents: newFolderId,
    removeParents: previousParents,
    fields: 'id, parents',
  })
}

/**
 * Get or create a ContractGen folder
 */
export async function getOrCreateContractGenFolder(
  accessToken: string
): Promise<{
  id: string
  name: string
  webViewLink: string
}> {
  oauth2Client.setCredentials({ access_token: accessToken })
  const drive = google.drive({ version: 'v3', auth: oauth2Client })

  // Look for existing ContractGen folder
  const response = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and name='ContractGen' and trashed=false and 'root' in parents",
    fields: 'files(id, name, webViewLink)',
  })

  if (response.data.files && response.data.files.length > 0) {
    const folder = response.data.files[0]
    return {
      id: folder.id!,
      name: folder.name!,
      webViewLink: folder.webViewLink!,
    }
  }

  // Create new folder
  return createFolder(accessToken, 'ContractGen')
}
