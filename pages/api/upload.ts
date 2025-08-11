import { IncomingForm } from 'formidable';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new IncomingForm({ keepExtensions: true, multiples: true });

  // Parse form into fields/files
  const parseForm = () =>
    new Promise<{ fields: any; files: any }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm();

    const { title, author } = fields;
    const pdfFile = Array.isArray(files.pdf) ? files.pdf[0] : files.pdf;
    const coverFile = Array.isArray(files.cover) ? files.cover[0] : files.cover;

    if (!pdfFile || !coverFile || !title || !author) {
      return res.status(400).json({ message: 'Missing fields or files' });
    }

    // Upload PDF to Cloudinary
    const pdfUpload = await cloudinary.uploader.upload(pdfFile.filepath, {
      resource_type: 'raw', // for non-image files
      folder: 'books/pdf',
    });

    // Upload cover image to Cloudinary
    const coverUpload = await cloudinary.uploader.upload(coverFile.filepath, {
      folder: 'books/covers',
    });

    // Save file URLs in database
    await prisma.book.create({
      data: {
        title: title.toString(),
        author: author.toString(),
        pdfUrl: pdfUpload.secure_url,
        coverUrl: coverUpload.secure_url,
      },
    });

    return res.status(200).json({ message: 'Book uploaded successfully' });
  } catch (error) {
    console.error('Upload failed:', error);
    return res.status(500).json({ message: 'Upload failed', error });
  }
}
