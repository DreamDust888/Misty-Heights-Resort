import { readDb } from "@/lib/db";
import RoomsClient from "./RoomsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accommodations & Suites",
  description: "Browse our luxurious hillside glass suites and secluded forest cabins.",
};

export default function RoomsPage() {
  const db = readDb();
  
  return <RoomsClient initialRooms={db.rooms} />;
}
