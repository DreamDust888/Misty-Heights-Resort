import { Suspense } from "react";
import BookClient from "./BookClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Stay - Misty Heights Resort",
  description: "Secure your luxury hillside reservation today.",
};

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 text-center text-stone-400">
        <p className="text-xs">Preparing reservation system...</p>
      </div>
    }>
      <BookClient />
    </Suspense>
  );
}
