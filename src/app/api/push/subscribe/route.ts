import { db } from '@/db';
import { pushSubscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Subscription missing' }, { status: 400 });
    }

    // Check if already exists
    const existing = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint))
      .get();

    if (existing) {
      // Update userId if session exists and it was previously null or different
      if (session?.user?.id && existing.userId !== session.user.id) {
        await db
          .update(pushSubscriptions)
          .set({ userId: session.user.id })
          .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
      }
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    // Save new subscription
    await db.insert(pushSubscriptions).values({
      userId: session?.user?.id || null,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in push subscribe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json();

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint missing' }, { status: 400 });
    }

    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in push unsubscribe:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
