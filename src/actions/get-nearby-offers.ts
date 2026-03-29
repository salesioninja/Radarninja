'use server';

import { db } from '../db';
import { offers, businesses } from '../db/schema';
import { eq, like, or } from 'drizzle-orm';
import { calculateDistance } from '../core/geo/haversine';

export interface Product {
  name: string;
  price: number;
  image: string;
  link?: string;
  buttonText?: string;
}

export interface NearbyOffer {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  products: Product[] | null;
  price: number;
  businessName: string;
  category: string | null;
  businessAddress: string | null;
  businessPhone: string | null;
  businessLat: number;
  businessLng: number;
  distance: number;
}

export async function getNearbyOffers(
  userLat?: number | null,
  userLng?: number | null,
  searchQuery?: string | null
) {
  const baseQuery = db
    .select({
      id: offers.id,
      title: offers.title,
      description: offers.description,
      imageUrl: offers.imageUrl,
      products: offers.products,
      price: offers.rewardPoints,
      businessId: businesses.id,
      businessName: businesses.name,
      category: businesses.category,
      businessDescription: businesses.longDescription,
      businessLogo: businesses.logoUrl,
      businessAddress: businesses.address,
      businessPhone: businesses.phone,
      businessLat: businesses.latitude,
      businessLng: businesses.longitude,
    })
    .from(businesses)
    .leftJoin(offers, eq(offers.businessId, businesses.id));

  const allOffers = searchQuery
    ? await baseQuery.where(
        or(
          like(businesses.name, `%${searchQuery}%`),
          like(businesses.category, `%${searchQuery}%`),
          like(offers.title, `%${searchQuery}%`),
          like(offers.description, `%${searchQuery}%`),
          like(offers.products, `%${searchQuery}%`)
        )
      )
    : await baseQuery;

  const hasGps = userLat != null && userLng != null;

  const mapped = allOffers.map(row => ({
    id: row.id || row.businessId,
    title: row.title || row.businessName,
    description: row.description || row.businessDescription || 'Visite nosso estabelecimento e conheça nossos serviços!',
    imageUrl: row.imageUrl || row.businessLogo || null,
    products: (row.products ? typeof row.products === 'string' ? JSON.parse(row.products) : row.products : null) as Product[] | null,
    price: row.price ?? 50,
    businessName: row.businessName,
    category: row.category,
    businessAddress: row.businessAddress,
    businessPhone: row.businessPhone,
    businessLat: row.businessLat,
    businessLng: row.businessLng,
    distance: hasGps
      ? calculateDistance(
          { latitude: userLat!, longitude: userLng! },
          { latitude: row.businessLat, longitude: row.businessLng }
        )
      : -1,
  }));

  return hasGps ? mapped.sort((a, b) => a.distance - b.distance) : mapped;
}
