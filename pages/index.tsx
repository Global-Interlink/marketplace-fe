import React from "react";
import { FetchStatus } from "../src/api/APIFunctions";
import Sort from "../src/components/atoms/Sort";
import CollectionListSkeleton from "../src/components/molecules/CollectionListSkeleton";
import Empty from "../src/components/molecules/EmptyView";
import ListCollectionItem from "../src/components/molecules/ListCollectionItem";
import BaseComponent from "../src/components/organisms/BaseComponent";
import {
  fetchListCollection,
  fetchListCollectionLoadmore,
} from "../src/redux/home/homeSlice";
import { useAppDispatch, useAppSelector } from "../src/redux/hook";

const Home = () => {
  const dispatch = useAppDispatch();
  const { response, status } = useAppSelector((store) => store.home.homeData);
  const LIMIT = 12;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");

  React.useEffect(() => {
    dispatch(
      fetchListCollection({
        page: 1,
        limit: LIMIT,
        sort: sort,
      })
    );
  }, []);

  return status === FetchStatus.idle || status === FetchStatus.pending ? (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <CollectionListSkeleton />
      </div>
    </BaseComponent>
  ) : (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="flex items-center justify-end mt-10">
          <Sort onChange={setSort} sort={sort} />
        </div>
        {response && response.data && response.data.length > 0 ? (
          <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {response.data.map((i) => {
              return <ListCollectionItem key={i.id} data={i} />;
            })}
          </div>
        ) : (
          <Empty />
        )}
        {response &&
          response.data &&
          response.meta.currentPage < response.meta.totalPages && (
            <div className="mt-[70px] flex justify-center">
              <button
                onClick={() => {
                  if (response?.meta.currentPage < response?.meta.totalPages) {
                    dispatch(
                      fetchListCollectionLoadmore({
                        page: response?.meta.currentPage + 1,
                        limit: LIMIT,
                        sort: sort,
                      })
                    );
                  }
                }}
                className="bg-white text-primary dark:bg-[#71659C] dark:text-white font-bold rounded-lg border border-[#c2c2c2] w-[189px] h-[49px]"
              >
                Load more
              </button>
            </div>
          )}
      </div>
    </BaseComponent>
  );
};
export default Home;
