import { notFound } from "next/navigation";
import ShareClient from "@/app/r/[id]/share-client";
import { getGenerationById } from "@/lib/repo/generations";
import type {
  GenerationType,
  GeneratorInputMap,
  StoredOutput,
} from "@/lib/types";

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getGenerationById(id);
  if (!record) {
    notFound();
  }

  return (
    <ShareClient
      payload={{
        id: record.id,
        type: record.type as GenerationType,
        input: record.input as GeneratorInputMap[GenerationType],
        output: record.output as StoredOutput<GenerationType>,
        output_text: record.output_text,
      }}
    />
  );
}
