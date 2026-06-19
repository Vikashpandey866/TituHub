"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import FormField from "@/components/forms/FormField";

export default function ImageUploadField({ label, value, error, onChange, helper = "PNG, JPG or WEBP" }) {
  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <FormField label={label} error={error}>
      <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/15 bg-panel2 text-center transition hover:border-orange hover:bg-orange/5">
        <input className="hidden" type="file" accept="image/*" onChange={(event) => handleImage(event.target.files?.[0])} />
        {value ? (
          <div className="relative h-full min-h-[280px] w-full">
            <Image src={value} alt="Preview" fill unoptimized={value.startsWith("data:")} sizes="300px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-xs text-white">Click to replace image</div>
          </div>
        ) : (
          <>
            <Upload className="mb-3 text-orange" size={34} />
            <div className="text-sm font-semibold">Upload image</div>
            <div className="mt-1 text-xs text-zinc-500">{helper}</div>
          </>
        )}
      </label>
    </FormField>
  );
}
