/**
 * Generate encrypt key use case
 */

import * as yup from 'yup';
import { generateKeyPair, randomUUID } from 'node:crypto'
import axios from 'axios'

/**
 * Schema for encrypt key generation response
 */
export const encryptKeyResponseSchema = yup.object({
  privateKey: yup.string().required(),
  publicKey: yup.string().required()
});

export type EncryptKeyResponse = yup.InferType<typeof encryptKeyResponseSchema>;

/**
 * Generate a new encryption key
 * 
 * @returns The generated encryption key with metadata
 */
export async function generateEncryptKey(): Promise<EncryptKeyResponse> {
  
  const { publicKey, privateKey }: any = await new Promise((res, rej) => {
    generateKeyPair(
      'rsa',
      {
        modulusLength: 2048, // It holds a number. It is the key size in bits and is applicable for RSA, and DSA algorithm only.
        publicKeyEncoding: {
          type: 'spki', //Note the type is pkcs1 not spki
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8', //Note again the type is set to pkcs1
          format: 'pem',
          cipher: 'des3', //Optional
          passphrase: process.env.KEY_PASSPHRASE, //Using randomly generated UUID
        },
      },
      (err, publicKey, privateKey) => {
        // Handle errors and use the generated key pair.
        if (err) {
          console.log('Error!', err)
          rej(err)
        }
        res({ publicKey, privateKey })
        //Print the keys to the console or save them to a file.
      },
    )
  })

  const response = await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/whatsapp_business_encryption`,
    {
      business_public_key: publicKey,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.SYSTEM_USER_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  )

  console.log("result", response)
  
  
  return {
    privateKey,
    publicKey
  };
} 