'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slug';
import { revalidatePath } from 'next/cache';

const productSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  price: z.preprocess((val) => Number(val), z.number().min(1, 'Price must be at least 1')),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export async function createProduct(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const rawData = Object.fromEntries(formData);
    const parsed = productSchema.safeParse(rawData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { name, price, description, imageUrl } = parsed.data;

    const slug = generateUniqueSlug(name);

    await db.product.create({
      data: {
        name,
        price,
        description,
        imageUrl: imageUrl || null,
        uniqueSlug: slug,
        userId: session.user.id,
      },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('product.create.failed', { error });
    return { success: false, error: 'Something went wrong' };
  }
}

export async function deleteProduct(id: string) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify ownership
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product || product.userId !== session.user.id) {
      return { success: false, error: 'Product not found or unauthorized' };
    }

    await db.product.delete({
      where: { id },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('product.delete.failed', { error });
    return { success: false, error: 'Something went wrong' };
  }
}
