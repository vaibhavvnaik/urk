import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getBrandBySlug from "@/app/actions/getBrandBySlug";
import getListings from "@/app/actions/getListings";
import InfiniteListings from "@/app/components/listings/InfiniteListings";
import BrandHeader from "@/app/components/brands/BrandHeader";

interface BrandPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    startDate?: string;
    endDate?: string;
    page?: number;
  };
}

const BrandPage = async ({ params, searchParams }: BrandPageProps) => {
  const brand = await getBrandBySlug(params.slug);
  const currentUser = await getCurrentUser();

  if (!brand) {
    return (
      <ClientOnly>
        <Container>
          <EmptyState
            title="Brand not found"
            subtitle="This brand doesn't exist or hasn't been added yet."
            showReset
          />
        </Container>
      </ClientOnly>
    );
  }

  const listings = await getListings({
    ...searchParams,
    brandSlug: params.slug,
  });

  return (
    <ClientOnly>
      <Container>
        <div className="pt-16">
          <BrandHeader brand={brand} currentUser={currentUser} />
          {listings.length === 0 ? (
            <EmptyState
              title="No emails yet"
              subtitle={`We haven't captured any emails from ${brand.name} yet.`}
            />
          ) : (
            <InfiniteListings
              initialListings={listings}
              searchParams={{ ...searchParams, brandSlug: params.slug }}
              currentUser={currentUser}
            />
          )}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default BrandPage;
