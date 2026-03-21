'use server';

import { auth } from '../../auth';
import { db } from '../db';
import { offers, businesses } from '../db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createOfferAction(data: {
  title: string;
  price: number;
  address: string;
}) {
  const session = await auth();

  // Segurança Edge + Server Action: Garante que só um BUSINESS crie missão.
  if (!session?.user || session.user.role !== 'BUSINESS') {
    throw new Error('Acesso Ninja Negado: Apenas Contas Empresariais (BUSINESS) podem recrutar ninjas no radar.');
  }

  // Geocodificação OpenStreetMap (Nominatim)
  const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.address)}`, {
    headers: { 'User-Agent': 'NegociosNinja/1.0' }
  });
  const geocodeData = await geocodeRes.json();

  if (!geocodeData || geocodeData.length === 0) {
    throw new Error('Geolocalização inválida: As coordenadas deste alvo não foram encontradas no plano físico.');
  }

  const lat = parseFloat(geocodeData[0].lat);
  const lng = parseFloat(geocodeData[0].lon);

  const userId = session.user.id;
  const existingBusiness = await db.select().from(businesses).where(eq(businesses.userId, userId));
  let businessId = existingBusiness[0]?.id;

  if (!businessId) {
    const [newBusiness] = await db.insert(businesses).values({
      userId: userId,
      name: session.user.name || 'Empresa Oculta',
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
