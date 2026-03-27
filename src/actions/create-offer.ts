'use server';

import { auth } from '../../auth';
import { db } from '../db';
import { offers, businesses } from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { authenticatedAction } from '../../auth';

type GeocodeResult = {
  lat: string;
  lon: string;
}[];


export const createOfferAction = authenticatedAction(
  { requiredRole: 'BUSINESS' },
  async (data: {
    title: string;
    price: number;
    address: string;
  }, user) => {
    // Geocodificação OpenStreetMap (Nominatim)
    const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.address)}`, {
      headers: { 'User-Agent': 'RadarNinja/1.0' }
    });

    if (!geocodeRes.ok) {
      throw new Error('Falha na comunicação com o serviço de mapas.');
    }

    const geocodeData = await geocodeRes.json() as GeocodeResult;

    if (!geocodeData || geocodeData.length === 0) {
      throw new Error('Geolocalização inválida: As coordenadas deste alvo não foram encontradas no plano físico.');
    }

    const lat = parseFloat(geocodeData[0].lat);
    const lng = parseFloat(geocodeData[0].lon);

    const userId = user.id;
    const existingBusiness = await db.select().from(businesses).where(eq(businesses.userId, userId));
    let businessId = existingBusiness[0]?.id;

    if (!businessId) {
      const [newBusiness] = await db.insert(businesses).values({
        userId: userId,
        name: 'Empresa Oculta',
        latitude: lat,
        longitude: lng,
      }).returning();
      businessId = newBusiness.id;
    } else {
      // Atualiza coordenada da empresa para a última missão postada
      await db.update(businesses).set({ latitude: lat, longitude: lng }).where(eq(businesses.id, businessId));
    }

    // Insere a oferta na tabela
    await db.insert(offers).values({
      businessId: businessId,
      title: data.title,
      rewardPoints: data.price,
    });

    // Limpa o cache estático do Next.js para o Radar (Home)
    revalidatePath('/');
    return { success: true };
  }
);

