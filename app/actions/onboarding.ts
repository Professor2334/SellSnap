'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

const businessSchema = z.object({
  businessName: z.string().min(2, 'Business name is too short'),
});

const productSchema = z.object({
  name: z.string().min(2, 'Product name is too short'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  description: z.string().optional(),
});

export async function updateBusinessName(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const rawData = Object.fromEntries(formData);
  const parsed = businessSchema.safeParse(rawData);

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    await db.user.update({
      where: { id: session.user.id },
      data: { businessName: parsed.data.businessName },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update business name' };
  }
}

export async function createFirstProduct(formData: FormData) {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

  const name = formData.get('name') as string | null;
  const price = formData.get('price') as string | null;
  const description = formData.get('description') as string | null;
  const imageFile = formData.get('image') as File | null;

  const parsed = productSchema.safeParse({ name, price, description });

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  try {
    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0 && imageFile.type.startsWith('image/')) {
      imageUrl = await uploadImage(imageFile);
    }

    const slug = `${parsed.data.name.toLowerCase().replace(/ /g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
    
    await db.$transaction([
      db.product.create({
        data: {
          userId: session.user.id,
          name: parsed.data.name,
          price: parsed.data.price,
          description: parsed.data.description || null,
          imageUrl,
          uniqueSlug: slug,
        },
      }),
      db.user.update({
        where: { id: session.user.id },
        data: { isOnboarded: true },
      }),
    ]);

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('onboarding.product.failed', error);
    return { success: false, error: 'Failed to create product' };
  }
}
