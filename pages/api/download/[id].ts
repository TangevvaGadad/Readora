import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Missing book id' });
  }

  try {
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const proto = (req.headers['x-forwarded-proto'] as string) || 'http';
    const host = req.headers.host;
    const base = `${proto}://${host}`;
    const resolvedUrl = /^https?:\/\//i.test(book.pdfUrl) ? book.pdfUrl : new URL(book.pdfUrl, base).toString();

    const upstream = await fetch(resolvedUrl, {
      redirect: 'follow',
      headers: {
        'Accept': 'application/pdf,application/octet-stream;q=0.9,*/*;q=0.8',
        'User-Agent': 'ReadoraDownloadProxy/1.0 (+node-fetch)'
      }
    });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ message: 'Failed to fetch PDF', statusText: upstream.statusText, status: upstream.status });
    }

    const arrayBuffer = await upstream.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = upstream.headers.get('content-type') || 'application/pdf';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', String(buffer.length));
    const safeTitle = book.title.replace(/[^a-z0-9-_\.]/gi, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);

    res.status(200).end(buffer);
  } catch (err) {
    console.error('Download proxy error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


