const CollectionDetailTopSkeleton = () => {
  return (
    <>
      <div className="flex space-y-5 md:items-center flex-col md:flex-row md:justify-between md:space-x-10">
        <div className="flex w-full md:items-center space-x-2 md:space-x-4">
          <div className="">
            <div className="flex w-[64px] h-[64px] animate-pulse rounded-full bg-slate-400 dark:bg-purple-500" />
          </div>

          <div className="w-full">
            <div className="w-full flex items-center justify-between">
              <div>
                <div className="flex w-[200px] h-6 rounded-full  bg-slate-400 dark:bg-purple-500" />
              </div>
              <div className=" hidden lg:flex items-center space-x-3 md:space-x-6">
                <div className="flex items-center space-x-6">
                  <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                  <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                  <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                  <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                  <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                  <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex text-black dark:text-white mt-2">
              <div className="flex w-[100px] h-6 rounded-full  bg-slate-400 dark:bg-purple-500" />
            </div>
            <div className="flex lg:hidden items-center space-x-3 mt-[28px]">
              <div className="flex items-center space-x-6">
                <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
                <div className=" bg-slate-400 dark:bg-purple-500 w-6 h-6 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[30px] space-y-10">
        <p className="text-black dark:text-white"></p>
        <div className="text-black dark:text-white space-y-4">
          <div className="flex w-1/2 h-4 rounded-full  bg-slate-400 dark:bg-purple-500" />
          <div className="flex w-1/3 h-4 rounded-full  bg-slate-400 dark:bg-purple-500" />
          <div className="flex w-1/4 h-4 rounded-full  bg-slate-400 dark:bg-purple-500" />
        </div>
        <div className="flex w-full aspect-[1300/500] animate-pulse  rounded-t-[20px] bg-slate-400 dark:bg-purple-500" />
      </div>
    </>
  );
};
export default CollectionDetailTopSkeleton;
