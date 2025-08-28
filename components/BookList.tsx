"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import StarsBackground from "./StarsBackground";

type Book = {
  id: string;
  title: string;
  author: string;
  pdfUrl: string;
  coverUrl: string;
  createdAt: Date;
};

export default function BookList({ books }: { books: Book[] }) {
  return (
    <main className="relative min-h-screen flex flex-col items-center p-10">
      {/* 🌌 Animated Starry Background */}
      <StarsBackground />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 drop-shadow-lg"
      >
       Readora
      </motion.h1>

      {books.length === 0 ? (
        <p className="text-center text-lg text-gray-300">
          No books uploaded yet.
        </p>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 z-10"
        >
          {books.map((book) => (
            <motion.div
              key={book.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="relative border border-white/10 p-5 rounded-2xl shadow-xl 
                         bg-white/10 backdrop-blur-md flex flex-col items-center 
                         hover:shadow-purple-500/30 transition-all duration-300"
            >
              {/* Cover Image */}
              <motion.div whileHover={{ rotate: 2 }}>
                <Image
                  src={book.coverUrl}
                  alt={`${book.title} cover`}
                  width={280}
                  height={380}
                  className="rounded-xl mb-4 object-cover shadow-lg"
                  priority
                />
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center tracking-tight mb-1">
                {book.title}
              </h2>

              {/* Author */}
              <p className="text-md text-pink-300 italic mb-4">
                by {book.author}
              </p>

              {/* Download Button */}
              <motion.a
                whileTap={{ scale: 0.95 }}
                href={book.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium shadow hover:from-purple-600 hover:to-blue-600 transition-colors duration-300"
              >
                📥 Download PDF
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
