const NFTListSkeleton: React.FC<{
  hideSort?: boolean;
  hideHeader?: boolean;
  hideTab?: boolean;
}> = ({ hideSort, hideHeader, hideTab }) => {
  return (
    <div>
      {!hideTab&&(hideHeader ? (
        <div className="flex items-center mt-[36px] space-x-6 pb-6 border-b">
          <div className="flex h-10 animate-pulse w-40 rounded-lg  bg-slate-400 dark:bg-purple-500" />
          <div className="flex h-10 w-32 animate-pulse rounded-lg  bg-slate-400 dark:bg-purple-500" />
        </div>
      ) : (
        <div
          className={`flex items-center ${
            hideSort ? "justify-start" : "justify-between"
          }`}
        >
          <div className="h-4 w-32 bg-slate-300 dark:bg-purple-500 rounded-full" />
          {!hideSort && (
            <div className="w-[155px] h-10 bg-slate-300 dark:bg-purple-500 rounded-full animate-pulse" />
          )}
        </div>
      ))}
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
              <div className="flex flex-col p-5 space-y-4 border-[2px] dark:border-[#3D2662]  bg-slate-300 dark:bg-[#2B294F] rounded-b-[20px]">
                <div className="flex h-6 rounded-full  animate-pulse bg-slate-400 dark:bg-purple-500" />
                <div className="flex h-4 rounded-full animate-pulse  bg-slate-400 dark:bg-purple-500" />
                <div className="flex items-center mt-[18px] space-x-[30px]">
                  <div className="flex w-full h-[36px] rounded-md animate-pulse bg-slate-400 dark:bg-purple-500" />
                  <div className="flex w-full h-[36px] rounded-md animate-pulse bg-slate-400 dark:bg-purple-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default NFTListSkeleton;
