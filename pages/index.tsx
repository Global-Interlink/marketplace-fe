import React, { useEffect, useRef } from "react";
import { FetchStatus } from "../src/api/APIFunctions";
import Sort from "../src/components/atoms/Sort";
import CollectionListSkeleton from "../src/components/molecules/CollectionListSkeleton";
import Empty from "../src/components/molecules/EmptyView";
import ListCollectionItem from "../src/components/molecules/ListCollectionItem";
import BaseComponent from "../src/components/organisms/BaseComponent";
import {
  clear,
  fetchListCollection,
  fetchListCollectionLoadmore,
} from "../src/redux/home/homeSlice";
import { useAppDispatch, useAppSelector } from "../src/redux/hook";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  const dispatch = useAppDispatch();
  const { response, status } = useAppSelector((store) => store.home.homeData);
  const LIMIT = 12;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = React.useState(1);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(
      fetchListCollection({
        page: 1,
        limit: LIMIT,
        sort: sort,
      })
    );
  }, [sort]);

  useEffect(() => {
    return () => {
      dispatch(clear());
    };
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMore();
      }
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [response, sort]);

  const loadMore = () => {
    if (response&&
      response?.meta.currentPage < response?.meta.totalPages &&
      status !== FetchStatus.pending
    ) {
      dispatch(
        fetchListCollectionLoadmore({
          page: currentPage + 1,
          limit: LIMIT,
          sort: sort,
        })
      );
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const isShowEvent = process.env.NEXT_PUBLIC_EVENT_STARTED === "true";

  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        {status === FetchStatus.idle ||
        (status === FetchStatus.pending && currentPage === 1) ? (
          <CollectionListSkeleton />
        ) : (
          <>
            {isShowEvent && (
              <Link href={"/event"}>
                <Image
                  src={"/banner-event.png"}
                  className="object-cover rounded-md md:rounded-xl mb-6 h-[100px] md:h-auto"
                  width={3000}
                  height={500}
                  alt="banner"
                />
              </Link>
            )}
            <div className="flex items-center justify-end">
              <Sort onChange={setSort} sort={sort} />
            </div>
            {response && response.data && response.data.length > 0 ? (
              <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                {response.data.map((i) => {
                  return (
                    i?.hasOwnProperty("creator") && (
                      <ListCollectionItem key={i.id} data={i} />
                    )
                  );
                })}
              </div>
            ) : (
              <Empty />
            )}
            <div ref={loadMoreRef} className="mt-[70px]"></div>
          </>
        )}
      </div>
    </BaseComponent>
  );
};

export default Home;
