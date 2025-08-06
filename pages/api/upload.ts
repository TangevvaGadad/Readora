import { IncomingForm } from 'formidable';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new IncomingForm({
    uploadDir: './public/tmp',
    keepExtensions: true,
    multiples: true,
  });

  // Wrap form.parse in a Promise
  const parseForm = () =>
    new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm();

    console.log('Parsed fields:', fields);
    console.log('Parsed files:', files);

    const { title, author } = fields;

    const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    const coverFile = Array.isArray(files.cover) ? files.cover[0] : files.cover;

    if (!pdfFile || !coverFile || !title || !author) {
      return res.status(400).json({ message: 'Missing fields or files' });
    }

    const booksDir = path.join(process.cwd(), 'public/books');
    const coversDir = path.join(process.cwd(), 'public/covers');
    fs.mkdirSync(booksDir, { recursive: true });
    fs.mkdirSync(coversDir, { recursive: true });

    const pdfPath = path.join(booksDir, pdfFile.newFilename);
    const coverPath = path.join(coversDir, coverFile.newFilename);

    fs.renameSync(pdfFile.filepath, pdfPath);
    fs.renameSync(coverFile.filepath, coverPath);

    const pdfUrl = `/books/${pdfFile.newFilename}`;
    const coverUrl = `/covers/${coverFile.newFilename}`;

    await prisma.book.create({
      data: {
        title: title.toString(),
        author: author.toString(),
        pdfUrl,
        coverUrl,
      },
    });

    return res.status(200).json({ message: 'Book uploaded successfully' });
  } catch (error) {
    console.error('Upload failed:', error);
    return res.status(500).json({ message: 'Upload failed', error });
  }
}
