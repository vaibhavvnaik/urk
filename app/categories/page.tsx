
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getCategories from "@/app/actions/getCategories";
import CategoriesClient from "./CategoriesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState
      title="Unauthorized"
      subtitle="Please login"
    />
  }

  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No categories found"
          subtitle="Looks like you have no categories."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <CategoriesClient
        categories={categories}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
 
export default PropertiesPage;
