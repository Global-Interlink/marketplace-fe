import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImgIcon from "../src/components/atoms/Icons/ImgIcon";
import Sort from "../src/components/atoms/Sort";
import Empty from "../src/components/molecules/EmptyView";
import ListCollectionItem from "../src/components/molecules/ListCollectionItem";
import BaseComponent from "../src/components/organisms/BaseComponent";
import { fetchListCollection } from "../src/redux/home/homeSlice";
import { useAppDispatch, useAppSelector } from "../src/redux/hook";

const Home = () => {
  const dispatch = useAppDispatch();
  const { response } = useAppSelector((store) => store.home.homeData);
  const LIMIT = 20;
  const [sort, setSort] = React.useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    dispatch(
      fetchListCollection({
        page: currentPage,
        limit: LIMIT,
        sort: sort,
      })
    );
  }, [currentPage, dispatch, sort]);

  return (
    <BaseComponent>
      <div className="py-4 md:py-8">
        <div className="flex items-center justify-end mt-10">
          <Sort onChange={setSort} />
        </div>
        {response && response.data ? (
          <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
            {response?.data.map((i) => {
              return <ListCollectionItem key={i.id} data={i} />;
            })}
          </div>
        ) : (
          <Empty />
        )}
        {response &&
          response.data &&
          currentPage < response.meta.totalPages && (
            <div className="mt-[70px] flex justify-center">
              <button
                onClick={() => {
                  if (response?.meta.currentPage < response?.meta.totalPages) {
                    setCurrentPage(response?.meta.currentPage + 1);
                  }
                }}
                className="bg-white text-primary font-bold rounded-lg border w-[189px] h-[49px]"
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
