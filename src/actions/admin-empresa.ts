'use server';

import { db } from '../db';
import { businesses, offers } from '../db/schema';
import { sql } from 'drizzle-orm';
import { NearbyOffer } from './get-nearby-offers';
import { empresaFormSchema, EmpresaFormValues } from '../schema/admin-empresa';

export async function createEmpresaAction(data: EmpresaFormValues): Promise<{ success: boolean; data?: NearbyOffer; error?: string }> {
  try {
    const validated = empresaFormSchema.parse(data);

    // Na arquitetura atual, "Categoria" é muitas vezes adicionada à descrição para compatibilidade.
    // Mas agora temos os campos explícitos.
    const descriptionFormatted = `${validated.category} | ${validated.shortDescription}`;

    const [business] = await db.insert(businesses).values({
      name: validated.name,
      category: validated.category,
      longDescription: validated.longDescription || null,
      n8nEndpointUrl: validated.n8nEndpointUrl || null,
      logoUrl: validated.logoUrl || null,
      address: validated.address,
      phone: validated.phone,
      latitude: validated.latitude,
      longitude: validated.longitude,
    }).returning();

    const [offer] = await db.insert(offers).values({
      businessId: business.id,
      title: validated.shortDescription, // Short description is technically the title in standard layout? Actually title is used as headline. Let's use name or shortDesc.
      description: descriptionFormatted,
      imageUrl: validated.coverImageUrl || null,
      products: validated.products && validated.products.length > 0 ? validated.products : null,
      rewardPoints: 100, // Defaul
      expiresAt: validated.expiresAt || null,
    }).returning();

    // Map back to NearbyOffer to fulfill test requirements and UI usage
    const resultJson: NearbyOffer = {
      id: offer.id,
      title: offer.title,
      description: offer.description,
      imageUrl: offer.imageUrl,
      products: (offer.products ? offer.products : null) as any,
      price: offer.rewardPoints ?? 100,
      businessName: business.name,
      businessAddress: business.address,
      businessPhone: business.phone,
      businessLat: business.latitude,
      businessLng: business.longitude,
      distance: 0, 
    };

    return { success: true, data: resultJson };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
