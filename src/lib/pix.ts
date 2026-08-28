// Gera um BR Code Pix (EMV) válido para "Copia e Cola" e QR Code.
// Referência: Manual do BR Code — Banco Central do Brasil.

function tlv(id: string, value: string) {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Remove acentos e limita tamanho (ASCII apenas).
function ascii(v: string, max: number) {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .slice(0, max);
}

export type PixInput = {
  key: string;           // ex: "+5561981567985" ou email/cpf/aleatória
  merchantName: string;  // até 25 chars
  merchantCity: string;  // até 15 chars
  amount?: number;       // valor em BRL
  txid?: string;         // até 25 chars (alfanumérico) — "***" se dinâmico
  description?: string;  // opcional (curto)
};

export function buildPixPayload({
  key,
  merchantName,
  merchantCity,
  amount,
  txid = "***",
  description,
}: PixInput) {
  const mai = [tlv("00", "br.gov.bcb.pix"), tlv("01", key)];
  if (description) mai.push(tlv("02", ascii(description, 50)));

  const additional = tlv("05", ascii(txid || "***", 25));

  const parts = [
    tlv("00", "01"),
    tlv("26", mai.join("")),
    tlv("52", "0000"),
    tlv("53", "986"),
    ...(amount != null ? [tlv("54", amount.toFixed(2))] : []),
    tlv("58", "BR"),
    tlv("59", ascii(merchantName, 25)),
    tlv("60", ascii(merchantCity, 15)),
    tlv("62", additional),
  ].join("");

  const toCrc = `${parts}6304`;
  return `${toCrc}${crc16(toCrc)}`;
}

export function qrImageUrl(payload: string, size = 320) {
  // Serviço público de QR — sem dependência extra.
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&data=${encodeURIComponent(payload)}`;
}
