interface Props {
  type: "live" | "upcoming" | "past";
}
const LaunchpadListSkeleton: React.FC<Props> = ({ type }) => {
  return (
    <div>
      {type === "upcoming" && (
        <div className="h-8 md:h-[57px] w-1/2 lg:w-1/4 mt-12 animate-pulse bg-slate-300 dark:bg-gray-500 rounded-lg"></div>
      )}
      <div
        className={`py-4 md:py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
          type === "upcoming" ? "mt-12" : "mt-10"
        }`}
      >
        {Array.from(Array(4).keys()).map((i) => {
          return (
            <div
              key={i}
              className="flex flex-col rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <div className="flex">
                <div className="h-[212px] w-full animate-pulse  rounded-t-lg aspect-[298/212] bg-slate-300 dark:bg-gray-500" />
              </div>
              <div className="space-x-4 flex px-4 items-center mt-4">
                <div className="w-5 h-5 bg-slate-300 dark:bg-gray-500 rounded-full" />
                <div className="h-3 bg-slate-300 dark:bg-gray-500 animate-pulse rounded-full w-1/2"></div>
              </div>
              <div className="p-4 space-y-4 mt-auto animate-pulse">
                <div className="h-4 bg-slate-300 dark:bg-gray-500 rounded-full w-full mb-4"></div>
                <div className="h-4 bg-slate-300 dark:bg-gray-500 rounded-full w-full mb-4"></div>
              </div>
              <div className="space-x-4 flex p-4">
                <div className="h-3 bg-slate-300 dark:bg-gray-500 animate-pulse rounded-full w-1/2"></div>
                <div className="h-3 bg-slate-300 dark:bg-gray-500 animate-pulse rounded-full w-1/2"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LaunchpadListSkeleton;
