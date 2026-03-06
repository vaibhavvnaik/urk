'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import qs from 'query-string';

const SearchBar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params?.get('query') || '');

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;

    const currentParams = qs.parse(params?.toString() || '');
    const updatedParams = {
      ...currentParams,
      query: query.trim(),
    };

    const url = qs.stringifyUrl({
      url: '/search',
      query: updatedParams,
    }, { skipNull: true });

    router.push(url);
  }, [query, params, router]);

  const handleClear = useCallback(() => {
    setQuery('');
    router.push('/');
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="w-full md:w-auto">
      <div className="flex flex-row items-center border-[1px] rounded-full shadow-sm hover:shadow-md transition">
        <input
          type="text"
          placeholder="Search deals, brands, products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            w-full
            md:w-[300px]
            lg:w-[400px]
            py-2
            px-4
            text-sm
            font-light
            bg-transparent
            border-none
            outline-none
            placeholder:text-neutral-400
          "
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-1 mr-1 text-neutral-400 hover:text-neutral-600 transition"
          >
            <IoClose size={16} />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="p-2 mr-1 bg-rose-500 rounded-full text-white hover:bg-rose-600 transition"
        >
          <BiSearch size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
