import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendChatMessage } from './chat-webhook';

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('WebHook Chat Integration', () => {
  beforeEach(() => {
    fetchMock.mockClear();
    fetchMock.mockResolvedValue({ ok: true });
  });

  it('should post payload to the correct external webhook URL', async () => {
    const payload = {
      userId: 'test-user',
      businessId: 10,
      messageContent: 'I want to buy this.',
      timestamp: new Date().toISOString(),
      productRef: 'Product X'
    };

    await sendChatMessage(payload);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://webhook.acessaronline.com.br/webhook/chat-negocios-ninja',
      expect.objectContaining({
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
    );
  });
});
