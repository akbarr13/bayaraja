/**
 * QRIS EMV-CO algorithm — extracted from arcthogus
 * Converts static QRIS to dynamic QRIS with embedded amount
 */

export function crc16(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc =
        crc & 0x8000
          ? ((crc << 1) ^ 0x1021) & 0xffff
          : (crc << 1) & 0xffff
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

export function convertQrisDinamis(
  qrisStatic: string,
  nominal: number
): string {
  if (!qrisStatic || typeof qrisStatic !== 'string') {
    throw new Error('QRIS string tidak valid')
  }
  if (!Number.isInteger(nominal) || nominal <= 0) {
    throw new Error('Nominal harus bilangan bulat positif')
  }
  if (nominal > 99999999) {
    throw new Error('Nominal terlalu besar')
  }

  const qris = qrisStatic.trim().slice(0, -4) // remove existing CRC
  const step1 = qris.replace('010211', '010212') // static → dynamic
  const step2 = step1.split('5802ID')

  if (step2.length < 2) {
    throw new Error('Format QRIS tidak valid — tidak ditemukan country code 5802ID')
  }

  const nomStr = String(nominal)
  const uang =
    '54' + String(nomStr.length).padStart(2, '0') + nomStr + '5802ID'
  const fix = step2[0] + uang + step2[1]

  return fix + crc16(fix)
}
