const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/** A Solana address is 32 bytes encoded as base58 (32–44 characters). */
export function isSolanaAddress(value: string): boolean {
  if (value.length < 32 || value.length > 44) return false;

  let n = BigInt(0);
  for (const char of value) {
    const digit = BASE58.indexOf(char);
    if (digit < 0) return false;
    n = n * BigInt(58) + BigInt(digit);
  }
  let bytes = 0;
  while (n > BigInt(0)) {
    n >>= BigInt(8);
    bytes++;
  }
  // Each leading "1" encodes a leading zero byte.
  let leadingZeros = 0;
  while (value[leadingZeros] === "1") leadingZeros++;
  return bytes + leadingZeros === 32;
}
