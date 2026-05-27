'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { generateUniqueSlug } from '@/lib/slug';
import { uploadImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

const productSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  price: z.preprocess((val) => Number(val), z.number().min(1, 'Price must be at least 1')),
  description: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const name = formData.get('name') as string | null;
    const price = formData.get('price') as string | null;
    const description = formData.get('description') as string | null;
    const imageFile = formData.get('image') as File | null;

    const parsed = productSchema.safeParse({ name, price, description });

    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message };
    }

    const { name: validName, price: validPrice, description: validDescription } = parsed.data;

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0 && imageFile.type.startsWith('image/')) {
      imageUrl = await uploadImage(imageFile);
    }

    const slug = generateUniqueSlug(validName);

    await db.product.create({
      data: {
        name: validName,
        price: validPrice,
        description: validDescription || null,
        imageUrl,
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
