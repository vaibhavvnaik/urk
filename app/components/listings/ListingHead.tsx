'use client';

import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeBrand, SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import BrandCard from "../brands/BrandCard";

interface ListingHeadProps {
  title: string;
  createdAt: string;
  content: string;
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  createdAt,
  content,
  id,
  currentUser,
}) => {
  return ( 
    <>
      <Heading
        title={title}
        subtitle={createdAt}
      />
      <div className="
          w-full
          min-h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="w-full"
          alt="Image"
        />
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          <HeartButton 
            listingId={id}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
   );
}
 
export default ListingHead;