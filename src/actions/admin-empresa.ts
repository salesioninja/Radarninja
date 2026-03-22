'use server';

import { db } from '../db';
import { businesses, offers } from '../db/schema';
import { sql, eq } from 'drizzle-orm';
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

// ── R ── Read (Busca Múltipla & Por ID)
export async function getAdminEmpresas() {
  const allOffers = await db.select({
    offerInfo: offers,
    businessInfo: businesses
  })
  .from(offers)
  .innerJoin(businesses, eq(offers.businessId, businesses.id))
  .orderBy(businesses.name);

  return allOffers.map(row => ({
    id: row.offerInfo.id, // Offer ID is our primary key for editing
    businessName: row.businessInfo.name,
    category: row.businessInfo.category,
    price: row.offerInfo.rewardPoints,
    createdAt: row.offerInfo.createdAt,
  }));
}

export async function getAdminEmpresaById(offerId: string): Promise<EmpresaFormValues | null> {
  const [record] = await db.select({
    offerInfo: offers,
    businessInfo: businesses
  })
  .from(offers)
  .innerJoin(businesses, eq(offers.businessId, businesses.id))
  .where(eq(offers.id, offerId))
  .limit(1);

  if (!record) return null;

  return {
    name: record.businessInfo.name,
    category: record.businessInfo.category || 'Serviços',
    shortDescription: record.offerInfo.title,
    longDescription: record.businessInfo.longDescription || '',
    coverImageUrl: record.offerInfo.imageUrl || '',
    logoUrl: record.businessInfo.logoUrl || '',
    n8nEndpointUrl: record.businessInfo.n8nEndpointUrl || '',
    address: record.businessInfo.address || '',
    phone: record.businessInfo.phone || '',
    latitude: record.businessInfo.latitude,
    longitude: record.businessInfo.longitude,
    products: (record.offerInfo.products as any) || [],
    expiresAt: record.offerInfo.expiresAt || '',
  };
}

// ── U ── Update (Por ID do Offer)
export async function updateEmpresaAction(offerId: string, data: EmpresaFormValues): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = empresaFormSchema.parse(data);

    // Encontrar o businessId correspondente
    const [existingOffer] = await db.select({ businessId: offers.businessId }).from(offers).where(eq(offers.id, offerId)).limit(1);
    if (!existingOffer) return { success: false, error: 'Oferta não encontrada' };

    const descriptionFormatted = `${validated.category} | ${validated.shortDescription}`;

    await db.update(businesses).set({
      name: validated.name,
      category: validated.category,
      longDescription: validated.longDescription || null,
      n8nEndpointUrl: validated.n8nEndpointUrl || null,
      logoUrl: validated.logoUrl || null,
      address: validated.address,
      phone: validated.phone,
      latitude: validated.latitude,
      longitude: validated.longitude,
    }).where(eq(businesses.id, existingOffer.businessId));

    await db.update(offers).set({
      title: validated.shortDescription,
      description: descriptionFormatted,
      imageUrl: validated.coverImageUrl || null,
      products: validated.products && validated.products.length > 0 ? validated.products : null,
      expiresAt: validated.expiresAt || null,
    }).where(eq(offers.id, offerId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ── D ── Delete (Por ID do Offer)
export async function deleteEmpresaAction(offerId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const [existingOffer] = await db.select({ businessId: offers.businessId }).from(offers).where(eq(offers.id, offerId)).limit(1);
    if (!existingOffer) return { success: false, error: 'Oferta não encontrada' };

    // Deleta a oferta (Cascade pode não estar configurado via schema, então fazemos manual)
    await db.delete(offers).where(eq(offers.id, offerId));
    // Deleta business 
    await db.delete(businesses).where(eq(businesses.id, existingOffer.businessId));

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
