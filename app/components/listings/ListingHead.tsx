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
            top-1
            right-5
          "
        >
          <div className="flex gap-16">
            <Heading
              title={title}
              subtitle={createdAt}
            />
            <HeartButton 
              listingId={id}
              currentUser={currentUser}
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </>
   );
}
export default ListingHead;