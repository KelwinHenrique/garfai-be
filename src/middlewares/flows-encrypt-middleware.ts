/**
 * Flows Encrypt Middleware
 * 
 * Provides middleware functions for flows encryption
 */
import { Request, Response, NextFunction } from 'express';
import { privateDecrypt, createCipheriv, constants } from 'node:crypto'

// Interface for request with flows data
export interface FlowsEncryptRequest extends Request {
  flowsData?: any;
}

/**
 * Middleware to encrypt flows data
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const flowsEncrypt = (req: FlowsEncryptRequest, res: Response, next: NextFunction): void => {
  console.warn(
    'PayloadToEncrypt',
    JSON.stringify(req.body.encryptedResponse, null, 2),
  )
  const response = JSON.stringify(req.body.encryptedResponse)

  let privateKeyPem = process.env.PRIVATE_KEY
  let passphrase =  process.env.KEY_PASSPHRASE

  // Ensure both are strings (not arrays)
  if (Array.isArray(privateKeyPem)) privateKeyPem = privateKeyPem[0]
  if (Array.isArray(passphrase)) passphrase = passphrase[0]

  const encryptedAesKeyB64 = req.body.encrypted_aes_key
  if (!privateKeyPem) {
    throw new Error('PRIVATE_KEY_PEM environment variable is not set')
  }
  const encryptedAesKey = Buffer.from(encryptedAesKeyB64, 'base64')

  const decryptedAesKey = privateDecrypt(
    {
      key: privateKeyPem,
      passphrase,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedAesKey,
  )

  const iv = Buffer.from(req.body.initial_vector, 'base64')

  const iv_decoded = iv
  const flipped_iv = []
  for (const pair of iv_decoded.entries()) {
    flipped_iv.push(~pair[1])
  }

  const cipher = createCipheriv(
    'aes-128-gcm',
    decryptedAesKey,
    Buffer.from(flipped_iv),
  )

  const encryptedPart = cipher.update(response, 'utf8', 'binary')
  const encryptedFinal = cipher.final('binary')
  const encrypted = Buffer.concat([
    Buffer.from(encryptedPart, 'binary'),
    Buffer.from(encryptedFinal, 'binary'),
    cipher.getAuthTag(),
  ])
  res.status(200).send(Buffer.from(encrypted).toString('base64'))
}; 