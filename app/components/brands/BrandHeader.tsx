'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SafeBrandWithDetails, SafeUser } from "@/app/types";
import { HiOutlineExternalLink } from "react-icons/hi";

interface BrandHeaderProps {
  brand: SafeBrandWithDetails;
  currentUser?: SafeUser | null;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ brand, currentUser }) => {
  return (
    <div className="mb-8 flex flex-row items-center gap-6">
      {/* Brand logo */}
      <div className="w-20 h-20 relative rounded-full overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center border">
        {brand.logo ? (
          <Image
            fill
            className="object-contain p-3"
            src={brand.logo}
            alt={brand.name}
          />
        ) : (
          <span className="text-3xl font-bold text-neutral-400">
            {brand.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Brand info */}
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-800">
            {brand.name}
          </h1>
          {brand.siteURL && (
            <a
              href={brand.siteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-rose-500 transition"
            >
              <HiOutlineExternalLink size={20} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-sm text-neutral-500">
            {brand.category?.name}
          </span>
          {brand._count && (
            <span className="text-sm text-neutral-400">
              {brand._count.listing} email{brand._count.listing !== 1 ? 's' : ''} archived
            </span>
          )}
        </div>
        {brand.description && (
          <p className="text-sm text-neutral-600 mt-2">
            {brand.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default BrandHeader;
