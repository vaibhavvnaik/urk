import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";
import useLoginModal from "./useLoginModal";

interface IUseFollowBrand {
  brandId: string;
  currentUser?: SafeUser | null;
}

const useFollowBrand = ({ brandId, currentUser }: IUseFollowBrand) => {
  const router = useRouter();
  const loginModal = useLoginModal();

  const isFollowing = useMemo(() => {
    const list = currentUser?.followedBrandIds || [];
    return list.includes(brandId);
  }, [currentUser, brandId]);

  const toggleFollow = useCallback(async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (isFollowing) {
        request = () => axios.delete(`/api/follow-brand/${brandId}`);
      } else {
        request = () => axios.post(`/api/follow-brand/${brandId}`);
      }

      await request();
      router.refresh();
      toast.success(isFollowing ? 'Unfollowed brand' : 'Following brand!');
    } catch (error) {
      toast.error('Something went wrong.');
    }
  }, [
    currentUser,
    isFollowing,
    brandId,
    loginModal,
    router
  ]);

  return {
    isFollowing,
    toggleFollow,
  }
}

export default useFollowBrand;
