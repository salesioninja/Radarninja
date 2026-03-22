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
      businessName: businesses.name,
      businessAddress: businesses.address,
      businessPhone: businesses.phone,
      businessLat: businesses.latitude,
      businessLng: businesses.longitude,
    })
    .from(offers)
    .innerJoin(businesses, eq(offers.businessId, businesses.id));

  const allOffers = searchQuery
    ? await baseQuery.where(
        or(
          like(businesses.name, `%${searchQuery}%`),
          like(offers.title, `%${searchQuery}%`),
          like(offers.description, `%${searchQuery}%`)
        )
      )
    : await baseQuery;

  const hasGps = userLat != null && userLng != null;

  const mapped = allOffers.map(offer => ({
    id: offer.id,
    title: offer.title,
    description: offer.description,
    imageUrl: offer.imageUrl,
    products: (offer.products ? typeof offer.products === 'string' ? JSON.parse(offer.products) : offer.products : null) as Product[] | null,
    price: offer.price ?? 0,
    businessName: offer.businessName,
    businessAddress: offer.businessAddress,
    businessPhone: offer.businessPhone,
    businessLat: offer.businessLat,
    businessLng: offer.businessLng,
    distance: hasGps
      ? calculateDistance(
          { latitude: userLat!, longitude: userLng! },
          { latitude: offer.businessLat, longitude: offer.businessLng }
        )
      : -1,
  }));

  return hasGps ? mapped.filter(o => o.distance <= 5) : mapped;
}

