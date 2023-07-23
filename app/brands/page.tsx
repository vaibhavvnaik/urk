
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getCategories from "@/app/actions/getCategories";
import CategoriesClient from "./BrandsClient";
import BrandsClient from "./BrandsClient";
import getBrands from "../actions/getBrands";

const BrandsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState
      title="Unauthorized"
      subtitle="Please login"
    />
  }

  const brands = await getBrands();
  const categories = await getCategories();

  if (brands.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No brands found"
          subtitle="Looks like you have no brands."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <BrandsClient
        brands={brands}
        categories={categories}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
 
export default BrandsPage;
