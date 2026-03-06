'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import getListings, { IListingsParams } from '@/app/actions/getListings';
import { SafeListing, SafeUser } from '@/app/types';
import ListingCard from './ListingCard';

const PAGE_SIZE = 24;

interface InfiniteListingsProps {
  initialListings: SafeListing[];
  searchParams: IListingsParams;
  currentUser: SafeUser | null;
}

const InfiniteListings: React.FC<InfiniteListingsProps> = ({
  initialListings,
  searchParams,
  currentUser,
}) => {
  const [listings, setListings] = useState<SafeListing[]>(initialListings);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialListings.length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextPage = page + 1;
    const newListings = await getListings({ ...searchParams, page: nextPage });
    if (newListings.length < PAGE_SIZE) {
      setHasMore(false);
    }
    setListings((prev) => [...prev, ...newListings]);
    setPage(nextPage);
    setLoading(false);
  }, [loading, hasMore, page, searchParams]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div
        className="
          pt-16
          grid
          grid-cols-3
          sm:grid-cols-4
          md:grid-cols-5
          lg:grid-cols-6
          xl:grid-cols-7
          2xl:grid-cols-8
          gap-8
        "
      >
        {listings.map((listing) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-10 mt-4" />
      {loading && (
        <div className="flex justify-center py-4 text-neutral-500">
          Loading...
        </div>
      )}
    </>
  );
};

export default InfiniteListings;
