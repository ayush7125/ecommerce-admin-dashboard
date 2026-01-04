import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { authOptions } from '@/lib/auth-config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

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

    return NextResponse.json({
      totalProducts,
      totalStock: totalStock[0]?.total || 0,
      totalSales: totalSales[0]?.total || 0,
      lowStockProducts,
      categoryStats,
      topProducts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

