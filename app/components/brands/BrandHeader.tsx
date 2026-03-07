'use client';

import Image from "next/image";
import { useMemo } from "react";
import { SafeBrandWithDetails, SafeUser } from "@/app/types";
import { HiOutlineExternalLink } from "react-icons/hi";
import useFollowBrand from "@/app/hooks/useFollowBrand";

interface BrandHeaderProps {
  brand: SafeBrandWithDetails;
  currentUser?: SafeUser | null;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({
  brand,
  currentUser
}) => {
  const { isFollowing, toggleFollow } = useFollowBrand({
    brandId: brand.id,
    currentUser,
  });

  // Format website URL for display (strip protocol)
  const displayUrl = useMemo(() => {
    if (!brand.siteURL) return null;
    try {
      const url = new URL(brand.siteURL);
      return url.hostname.replace('www.', '');
    } catch {
      return brand.siteURL;
    }
  }, [brand.siteURL]);

  // Calculate email frequency stats
  const frequencyText = useMemo(() => {
    if (!brand.firstEmailDate || !brand.latestEmailDate || !brand._count?.listing) {
      return null;
    }
    const first = new Date(brand.firstEmailDate);
    const latest = new Date(brand.latestEmailDate);
    const daysDiff = Math.max(1, Math.ceil(
      (latest.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
    ));
    const count = brand._count.listing;
    if (count <= 1) return null;

    const perWeek = (count / daysDiff) * 7;
    if (perWeek >= 5) return `~${Math.round(perWeek)}/week`;
    if (perWeek >= 1) return `~${Math.round(perWeek)}/week`;
    const perMonth = (count / daysDiff) * 30;
    if (perMonth >= 1) return `~${Math.round(perMonth)}/month`;
    return null;
  }, [brand.firstEmailDate, brand.latestEmailDate, brand._count]);

  // Format date range
  const dateRange = useMemo(() => {
    if (!brand.firstEmailDate) return null;
    const first = new Date(brand.firstEmailDate);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    const firstStr = first.toLocaleDateString('en-US', opts);
    if (!brand.latestEmailDate) return `Since ${firstStr}`;
    const latest = new Date(brand.latestEmailDate);
    const latestStr = latest.toLocaleDateString('en-US', opts);
    if (firstStr === latestStr) return firstStr;
    return `${firstStr} – ${latestStr}`;
  }, [brand.firstEmailDate, brand.latestEmailDate]);

  return (
    <div className="mb-8">
      <div className="flex flex-row items-center gap-6">
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
            <button
              onClick={toggleFollow}
              className={`px-4 py-1.5 text-sm font-semibold rounded-full border transition ${
                isFollowing
                  ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600'
                  : 'bg-white text-rose-500 border-rose-500 hover:bg-rose-50'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {brand.category?.name && (
              <span className="text-sm text-neutral-500">
                {brand.category.name}
              </span>
            )}
            {brand._count && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="text-sm text-neutral-400">
                  {brand._count.listing} email{brand._count.listing !== 1 ? 's' : ''} archived
                </span>
              </>
            )}
            {frequencyText && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="text-sm text-neutral-400">
                  {frequencyText}
                </span>
              </>
            )}
            {dateRange && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="text-sm text-neutral-400">
                  {dateRange}
                </span>
              </>
            )}
          </div>

          {/* Website URL as clickable text */}
          {brand.siteURL && displayUrl && (
            <a
              href={brand.siteURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 mt-1 transition"
            >
              <HiOutlineExternalLink size={14} />
              {displayUrl}
            </a>
          )}

          {brand.description && (
            <p className="text-sm text-neutral-600 mt-2">
              {brand.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandHeader;
