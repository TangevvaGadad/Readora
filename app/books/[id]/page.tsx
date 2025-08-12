interface BookPageProps {
  params: { id: string }
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
  const book = await res.json();

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
    </div>
  );
}