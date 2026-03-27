import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteEmpresaAction } from './admin-empresa';
import { auth } from '../../auth';
import { db } from '../db';

// Mock do auth e do banco
vi.mock('../../auth', async () => {
  const actual = await vi.importActual('../../auth') as any;
  return {
    ...actual,
    auth: vi.fn(),
  };
});


vi.mock('../db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => [{ businessId: 'bus_123' }])
        }))
      }))
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve())
    })),
  }
}));

// Mock do Drizzle-ORM
vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
  sql: vi.fn(),
}));

describe('Security: deleteEmpresaAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve falhar (401) se não houver sessão', async () => {
    (auth as any).mockResolvedValue(null);

    const result = await deleteEmpresaAction('offer_123');

    expect(result.success).toBe(false);
    expect(result).toMatchObject({
      error: 'Unauthorized',
      code: 401
    });
  });

  it('deve falhar (403) se o usuário for USER mas a ação exigir ADMIN', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'u123', role: 'USER' }
    });

    const result = await deleteEmpresaAction('offer_123');

    expect(result.success).toBe(false);
    expect(result).toMatchObject({
      error: 'Forbidden: Acesso Ninja negado.',
      code: 403
    });
  });

  it('deve ter sucesso se o usuário for ADMIN', async () => {
    (auth as any).mockResolvedValue({
      user: { id: 'admin_123', role: 'ADMIN' }
    });

    const result = await deleteEmpresaAction('offer_123');

    expect(result.success).toBe(true);
    expect(result).toMatchObject({
      data: { success: true }
    });
  });
});
