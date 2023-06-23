interface CollectionListSkeletonProps {
  isLoadMore?: boolean;
}

const CollectionListSkeleton = (props: CollectionListSkeletonProps) => {
  const { isLoadMore } = props;

  return (
    <div>
      {!isLoadMore ? (
        <div className="flex items-center justify-end md:mt-10">
          <div className="w-[155px] h-10 bg-slate-300 dark:bg-purple-500 rounded-full animate-pulse" />
        </div>
      ) : (
        ""
      )}
      <div className="py-4 md:py-6 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
        {Array.from(Array(4).keys()).map((i) => {
          return (
            <div
              key={i}
              className="flex flex-col w-full bg-transparent rounded-[20px] shadow hover:-translate-y-1 transition ease-in-out delay-150"
            >
              <div className="flex">
                <div className="flex w-full aspect-[310/216] animate-pulse rounded-t-[20px] object-cover bg-slate-400 dark:bg-purple-500" />
              </div>
              <div className="flex p-5 space-x-[14px] border-[2px] dark:border-[#3D2662]  bg-slate-300 dark:bg-[#2B294F] rounded-b-[20px]">
                <div className="flex min-w-[52px] w-[52px] h-[52px] rounded-full  bg-slate-400 dark:bg-purple-500" />
                <div className="w-full">
                  <div className="h-4 bg-slate-400 w-1/2 dark:bg-purple-500 rounded-full mb-4"></div>
                  <div className="flex items-center text-description dark:text-white space-x-1">
                    <div className="h-4 w-1/3 bg-slate-400 dark:bg-purple-500 rounded-full" />
                    <div className="flex w-4 h-4 rounded-full bg-slate-400 dark:bg-purple-500" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CollectionListSkeleton;
