import { privateDecrypt, createDecipheriv, constants } from 'node:crypto'
/**
 * Flows Decrypt Middleware
 * 
 * Provides middleware functions for flows decryption validation
 */
import { Request, Response, NextFunction } from 'express';

// Interface for request with flows data
export interface FlowsDecryptRequest extends Request {
  flowsData?: any;
}

/**
 * Middleware to decrypt flows data using RSA and AES encryption
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const flowsDecrypt = (req: FlowsDecryptRequest, res: Response, next: NextFunction): void => {
  const privateKeyPem = process.env.PRIVATE_KEY
  const passphrase = process.env.KEY_PASSPHRASE

  const encryptedFlowDataB64 = req.body.encrypted_flow_data
  const encryptedAesKeyB64 = req.body.encrypted_aes_key
  const initialVectorB64 = req.body.initial_vector

  const encryptedAesKey = Buffer.from(encryptedAesKeyB64, 'base64')

  const decryptedAesKey = privateDecrypt(
    {
      key: privateKeyPem!,
      passphrase,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedAesKey,
  )

  const flowDataBuffer = Buffer.from(encryptedFlowDataB64, 'base64')
  const iv = Buffer.from(initialVectorB64, 'base64')

  const tag = flowDataBuffer.slice(-16)
  const encryptedData = flowDataBuffer.slice(0, -16)

  const decipher = createDecipheriv('aes-128-gcm', decryptedAesKey, iv)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(encryptedData)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  req.body.decryptedPayload = JSON.parse(decrypted.toString('utf8'))
  console.warn(
    'DecryptedPayload',
    JSON.stringify(req.body.decryptedPayload, null, 2),
  )
  next();
}; 