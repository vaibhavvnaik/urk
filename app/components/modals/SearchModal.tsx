'use client';
import qs from 'query-string';
import { useCallback, useState } from "react";
import { Range } from 'react-date-range';
import { formatISO, isAfter } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Heading from '../Heading';
 const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();
   const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
   const onSearch = useCallback(async () => {
    let currentQuery = {};
     if (params) {
      currentQuery = qs.parse(params.toString())
    }
     const updatedQuery: any = {
      ...currentQuery,
    };
     if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }
     if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }
     const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery,
    }, { skipNull: true });
     searchModal.onClose();
    router.push(url);
  }, [searchModal, dateRange, params]);
   const disabledDates = useCallback((date: Date) => {
    return isAfter(date, new Date());
  }, []);
   return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel="Search"
      onSubmit={onSearch}
      onClose={searchModal.onClose}
      body={(
        <div className="justify-center items-center flex flex-col gap-8">
          <Heading
            title="Stay in the loop! Choose your newsletter dates!"
            subtitle="Don't miss out! Grab your deal today!"
          />
          <Calendar
            onChange={(value) => setDateRange(value.selection)}
            value={dateRange}
          />
        </div>
      )}
    />
  );
}
 export default SearchModal;