import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import ProductsClient from '@/components/ProductsClient';

async function getProducts(page: number = 1, search: string = '', category: string = '') {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  try {
    await import('@/lib/mongodb').then((mod) => mod.default());
    const Product = (await import('@/models/Product')).default;

    const limit = 10;
    const skip = (page - 1) * limit;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    // Convert ObjectIds to strings for all products
    const formattedProducts = products.map((product: any) => ({
      ...product,
      _id: String(product._id),
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      sales: Number(product.sales || 0),
    }));

    return {
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total: Number(total),
        pages: Math.ceil(Number(total) / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; category?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search || '';
  const category = searchParams.category || '';

  const data = await getProducts(page, search, category);

  return <ProductsClient initialData={data} />;
}

