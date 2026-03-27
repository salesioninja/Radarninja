'use server';

import { db } from '../db';
import { businesses, offers } from '../db/schema';
import { sql, eq } from 'drizzle-orm';
import { NearbyOffer, Product } from './get-nearby-offers';
import { empresaFormSchema, EmpresaFormValues } from '../schema/admin-empresa';
import { authenticatedAction } from '../../auth';


// ── C ── Create
export const createEmpresaAction = authenticatedAction(
  { requiredRole: 'ADMIN' },
  async (data: EmpresaFormValues) => {
    const validated = empresaFormSchema.parse(data);
    const descriptionFormatted = `${validated.category} | ${validated.shortDescription}`;

    const businessId = crypto.randomUUID();
    await db.insert(businesses).values({
      id: businessId,
      name: validated.name,
      category: validated.category,
      longDescription: validated.longDescription || null,
      n8nEndpointUrl: validated.n8nEndpointUrl || null,
      logoUrl: validated.logoUrl || null,
      address: validated.address,
      phone: validated.phone,
      latitude: validated.latitude,
      longitude: validated.longitude,
    });

    const offerId = crypto.randomUUID();
    await db.insert(offers).values({
      id: offerId,
      businessId: businessId,
      title: validated.shortDescription,
      description: descriptionFormatted,
      imageUrl: validated.coverImageUrl || null,
      products: validated.products && validated.products.length > 0 ? validated.products : null,
      rewardPoints: 100,
      expiresAt: validated.expiresAt || null,
    });

    const resultJson: NearbyOffer = {
      id: offerId,
      title: validated.shortDescription,
      description: descriptionFormatted,
      imageUrl: validated.coverImageUrl || '',
      products: (validated.products ? (validated.products as any[]).map(p => ({
        name: p.name || '',
        price: p.price || 0,
        image: p.image || '',
        link: p.link || '',
        buttonText: p.buttonText || ''
      })) : []) as Product[],

      price: 100,
      businessName: validated.name,
      category: validated.category,
      businessAddress: validated.address ?? '',
      businessPhone: validated.phone ?? '',
      businessLat: validated.latitude,
      businessLng: validated.longitude,
      distance: 0, 
    };



    return resultJson;
  }
);


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
    products: (record.offerInfo.products ? (record.offerInfo.products as any[]).map(p => ({
        name: p.name || '',
        price: p.price || 0,
        image: p.image || '',
        link: p.link || '',
        buttonText: p.buttonText || ''
    })) : []),

    expiresAt: record.offerInfo.expiresAt || '',
  };
}


// ── U ── Update (Por ID do Offer)
export const updateEmpresaAction = authenticatedAction(
  { requiredRole: 'ADMIN' },
  async ({ offerId, data }: { offerId: string; data: EmpresaFormValues }) => {
    const validated = empresaFormSchema.parse(data);

    // Encontrar o businessId correspondente
    const [existingOffer] = await db.select({ businessId: offers.businessId }).from(offers).where(eq(offers.id, offerId)).limit(1);
    if (!existingOffer) throw new Error('Oferta não encontrada');

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
  }
);



// ── D ── Delete (Por ID do Offer)

export const deleteEmpresaAction = authenticatedAction(
  { requiredRole: 'ADMIN' },
  async (offerId: string) => {
    const [existingOffer] = await db.select({ businessId: offers.businessId })
      .from(offers)
      .where(eq(offers.id, offerId))
      .limit(1);

    if (!existingOffer) throw new Error('Oferta não encontrada');

    // Deleta a oferta (Cascade pode não estar configurado via schema, então fazemos manual)
    await db.delete(offers).where(eq(offers.id, offerId));
    // Deleta business 
    await db.delete(businesses).where(eq(businesses.id, existingOffer.businessId));

    return { success: true };
  }
);

