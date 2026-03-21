export async function sendChatMessage(payload: {
  userId: string;
  businessId: string | number;
  messageContent: string;
  userPhone?: string;
  userEmail?: string;
  timestamp: string;
  productRef?: string;
}) {
  const response = await fetch('https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    mode: 'no-cors'
  });
  return response;
}
