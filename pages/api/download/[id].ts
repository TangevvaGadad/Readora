import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

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

    // Configure Cloudinary (safe if called multiple times)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    // Try local file first
    const publicDir = path.join(process.cwd(), 'public');
    const localCandidates: string[] = [];
    if (book.pdfUrl) {
      if (book.pdfUrl.startsWith('/')) {
        localCandidates.push(path.join(publicDir, book.pdfUrl));
      }
      try {
        const last = new URL(book.pdfUrl, 'http://localhost').pathname.split('/').pop();
        if (last) localCandidates.push(path.join(publicDir, 'books', last));
      } catch {
        // ignore URL parse errors
      }
    }

    const localPath = localCandidates.find(p => p && fs.existsSync(p));
    if (localPath) {
      const stat = fs.statSync(localPath);
      const safeTitle = book.title.replace(/[^a-z0-9-_\.]/gi, '_');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', String(stat.size));
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
      res.setHeader('Cache-Control', 'public, max-age=0');
      const stream = fs.createReadStream(localPath);
      stream.pipe(res);
      return;
    }

    // Fallbacks: signed Cloudinary URL → then plain remote fetch

    // Try Cloudinary signed URL if this is a Cloudinary asset
    try {
      const url = new URL(book.pdfUrl);
      if (url.hostname.includes('res.cloudinary.com')) {
        const parts = url.pathname.split('/').filter(Boolean);
        // Expected: /<cloud_name>/raw/<delivery>/v<ver>/.../name.pdf
        const rawIdx = parts.findIndex((p) => p === 'raw');
        const afterRaw = rawIdx >= 0 ? parts.slice(rawIdx + 1) : [];
        const delivery = afterRaw[0] || 'authenticated';
        let rest = afterRaw.slice(1);
        if (rest[0]?.startsWith('v')) rest = rest.slice(1);
        const fileWithExt = rest.join('/');
        const publicId = fileWithExt.replace(/\.[^/.]+$/, '');

        const candidates: string[] = [];
        try {
          const authUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: 'authenticated',
            sign_url: true,
            secure: true,
            attachment: true,
            format: 'pdf',
            expires_at: Math.floor(Date.now() / 1000) + 300,
          });
          candidates.push(authUrl);
        } catch {}

        try {
          const privUrl = cloudinary.utils.private_download_url(publicId, 'pdf', {
            resource_type: 'raw',
            type: 'private',
            attachment: true,
            expires_at: Math.floor(Date.now() / 1000) + 300,
          } as any);
          if (privUrl) candidates.push(privUrl as unknown as string);
        } catch {}

        try {
          const uploadUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: 'upload',
            secure: true,
            attachment: true,
            format: 'pdf',
          });
          candidates.push(uploadUrl);
        } catch {}

        for (const urlCandidate of candidates) {
          const upstreamSigned = await fetch(urlCandidate, { redirect: 'follow' });
          if (upstreamSigned.ok) {
            const buffer = Buffer.from(await upstreamSigned.arrayBuffer());
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', String(buffer.length));
            const safeTitle = book.title.replace(/[^a-z0-9-_\.]/gi, '_');
            res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
            return res.status(200).end(buffer);
          } else {
            console.warn('Cloudinary candidate failed', { status: upstreamSigned.status });
          }
        }
        console.error('Cloudinary signing attempts failed', { publicId, delivery });
      }
    } catch {
      // ignore and proceed to plain fetch
    }

    // Plain remote fetch as last resort
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

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', String(buffer.length));
    const safeTitle = book.title.replace(/[^a-z0-9-_\.]/gi, '_');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.status(200).end(buffer);
  } catch (err) {
    console.error('Download proxy error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


