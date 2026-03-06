'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SafeBrandWithDetails, SafeUser } from "@/app/types";

interface BrandCardProps {
  brand: SafeBrandWithDetails;
  currentUser?: SafeUser | null;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, currentUser }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/brands/${brand.slug || brand.id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col items-center gap-3 p-4 border rounded-xl hover:shadow-md transition">
        <div className="w-16 h-16 relative rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
          {brand.logo ? (
            <Image
              fill
              className="object-contain p-2"
              src={brand.logo}
              alt={brand.name}
            />
          ) : (
            <span className="text-2xl font-bold text-neutral-400">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="text-center">
          <div className="font-semibold text-sm group-hover:text-rose-500 transition">
            {brand.name}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {brand.category?.name}
          </div>
          {brand._count && (
            <div className="text-xs text-neutral-400 mt-1">
              {brand._count.listing} email{brand._count.listing !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
