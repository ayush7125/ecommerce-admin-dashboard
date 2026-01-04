import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import ProductForm from '@/components/ProductForm';

async function getProduct(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  try {
    await import('@/lib/mongodb').then((mod) => mod.default());
    const Product = (await import('@/models/Product')).default;

    const product = await Product.findById(id).lean();

    if (!product) {
      return null;
    }

    return {
      ...product,
      _id: product._id.toString(),
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    redirect('/admin/products');
  }

  return <ProductForm mode="edit" initialData={product} />;
}

