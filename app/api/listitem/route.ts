import { prisma } from '@/lib/prisma'; // Đảm bảo import đúng
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '9');
    const search = req.query.search as string || '';

    // Điều kiện tìm kiếm
    const where = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive' as const, // Tìm kiếm không phân biệt chữ hoa/thường
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    try {
      // Lấy dữ liệu từ Prisma
      const [items, total] = await Promise.all([
        prisma.listItem.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { id: 'desc' }, // Sắp xếp theo id giảm dần
        }),
        prisma.listItem.count({ where }), // Đếm tổng số lượng các item thỏa mãn điều kiện
      ]);

      // Thiết lập header để trả về tổng số lượng
      res.setHeader('X-Total-Count', total.toString());
      res.status(200).json({ items });
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Failed to fetch items' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
