'use client';

import Image from "next/image";
import DOMPurify from 'dompurify'
import useCountries from "@/app/hooks/useCountries";
import { SafeBrand, SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import ClientOnly from "../ClientOnly";
import Container from "../Container";
import Avatar from "../Avatar";
import he from 'he';

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
          h-[60vh]
          rounded-xl
          relative
        "
      >
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          <div
            dangerouslySetInnerHTML={{ __html: content }}
          />
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