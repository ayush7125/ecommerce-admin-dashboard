import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import DashboardClient from '@/components/DashboardClient';

async function getStats() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    redirect('/auth/signin');
  }

  try {
    await import('@/lib/mongodb').then((mod) => mod.default());
    const Product = (await import('@/models/Product')).default;

    const [
      totalProducts,
      totalStock,
      totalSales,
      lowStockProducts,
      categoryStats,
      topProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: '$stock' } } },
      ]),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: '$sales' } } },
      ]),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalSales: { $sum: '$sales' },
          },
        },
        { $sort: { totalSales: -1 } },
      ]),
      Product.find().sort({ sales: -1 }).limit(5).select('name sales').lean(),
    ]);

    return {
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      totalSales: totalSales[0]?.total || 0,
      lowStockProducts,
      categoryStats,
      topProducts,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalProducts: 0,
      totalStock: 0,
      totalSales: 0,
      lowStockProducts: 0,
      categoryStats: [],
      topProducts: [],
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return <DashboardClient stats={stats} />;
}

