import crypto from "crypto";

// Encryption key and algorithm
const encryptionKey = process.env.DECODE_ENCODE_SECRET;
const algorithm = "aes-256-cbc";

export function encryptData(data) {
  // Convert the data to a Buffer
  const buffer = Buffer.from(data);

  // Create an initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create a cipher using the encryption key and algorithm
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

  // Encrypt the data and IV
  const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()]);

  // Combine the IV and encrypted data
  const encodedData = Buffer.concat([iv, encryptedData]).toString("base64");

  return encodedData;
}

export function decryptData(encodedData) {
  // Convert the encoded data to a Buffer
  const buffer = Buffer.from(encodedData, "base64");

  // Extract the IV and encrypted data from the buffer
  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);

  // Create a decipher using the encryption key, algorithm, and IV
  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);

  // Decrypt the encrypted data
  const decryptedData = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  // Convert the decrypted data to a string
  const decodedData = decryptedData.toString();

  return decodedData;
}
