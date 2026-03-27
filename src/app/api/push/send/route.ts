import { db } from '@/db';
import { pushSubscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import webpush from '@/lib/web-push';
import { auth } from '../../../../../auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Proteção: apenas administradores podem enviar notificações globais
    // Se não houver role admin, retornamos não autorizado (somente ADMIN)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, body, icon, image, url } = await req.json();

    const subscriptions = await db.select().from(pushSubscriptions);
    
    const notifications = subscriptions.map((sub) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush.sendNotification(
        pushConfig,
        JSON.stringify({
          title: title || 'Novidade no Radar Ninja!',
          body: body || 'Confira agora.',
          icon: icon || '/radarninja/icon512_maskable.png',
          image: image,
          url: url || '/',
        })
      ).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Inscrição expirada ou inválida, deletar do banco
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, sub.endpoint));
        }
        console.error('Error sending push:', err);
      });
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true, count: subscriptions.length });
  } catch (error) {
    console.error('Error in push send:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
