'use client';

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import { differenceInDays, eachDayOfInterval } from 'date-fns';

import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeBrand, SafeListing, SafeReservation, SafeUser } from "@/app/types";

import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import AdCard from "@/app/components/listings/AdCard";


const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  useEffect(() => {``
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(
        dateRange.endDate, 
        dateRange.startDate
      );
    }
  }, [dateRange]);

  return (
    <Container>
      <div className="flex md:flex-row-reverse flex-wrap">
        <div className="w-full md:w-3/4 p-4 text-center text-gray-700">
          <ListingHead
                title={listing.title}
                createdAt={listing.createdAt}
                content={listing.content}
                id={listing.id}
                currentUser={currentUser}
          />
        </div>
        <div className="w-full md:w-1/4 p-4 text-center text-gray-200">
        </div>
      </div>
    </Container>
  );
}
 
export default ListingClient;
