import { NextResponse } from 'next/server';
import { db } from "@/db";
import { businesses, offers } from "@/db/schema";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const businessCount = await db.select().from(businesses);
    const offersCount = await db.select().from(offers);

    return NextResponse.json({ 
      success: true, 
      database: {
        businesses_found: businessCount.length,
        offers_found: offersCount.length,
        first_business: businessCount[0] || null
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
