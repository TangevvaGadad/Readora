import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const book = await prisma.book.findUnique({
    where: { id },
    select: { id: true, title: true, author: true },
  })

  if (!book) {
    return (
      <div>
        <h1>Book not found</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
    </div>
  )
}