import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { EditProductForm } from '@/app/dashboard/_components/EditProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  
  if (!session?.user?.id) {
    redirect('/auth?mode=login');
  }

  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  if (!product || product.userId !== session.user.id) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
