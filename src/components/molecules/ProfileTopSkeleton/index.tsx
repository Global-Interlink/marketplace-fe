const ProfileTopSkeleton = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center space-x-6">
          <div className="">
            <div className="flex w-[44px] h-[44px] rounded-full  bg-slate-400 dark:bg-purple-500 mt-2 md:mt-0" />
          </div>
          <div className="text-black dark:text-white">
            <div className=" px-2 py-[2px] w-[140px] items-center flex space-x-[6px]">
              <div className="flex w-[100px] h-4 rounded-full  bg-slate-400 dark:bg-purple-500" />
              <div className="flex w-4 h-4 rounded-full  bg-slate-400 dark:bg-purple-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white text-black dark:text-white border shadow dark:bg-[#474474] dark:border-[#3D2662] p-6 rounded-[20px] justify-between flex mt-6">
        <div>
          <div className="flex w-[100px] h-6 rounded-full  bg-slate-400 dark:bg-purple-500" />
          <div className="flex w-[60px] h-6 rounded-full mt-2  bg-slate-400 dark:bg-purple-500" />
        </div>
        <div>
          <div className="flex w-[100px] h-6 rounded-full  bg-slate-400 dark:bg-purple-500" />
          <div className="flex w-[60px] h-6 rounded-full mt-2  bg-slate-400 dark:bg-purple-500" />
        </div>
        <div>
          <div className="flex w-[100px] h-6 rounded-full  bg-slate-400 dark:bg-purple-500" />
          <div className="flex w-[60px] h-6 rounded-full mt-2  bg-slate-400 dark:bg-purple-500" />
        </div>
        <div>
          <div className="flex w-[100px] h-6 rounded-full  bg-slate-400 dark:bg-purple-500" />
          <div className="flex w-[60px] h-6 rounded-full mt-2  bg-slate-400 dark:bg-purple-500" />
        </div>
      </div>
    </>
  );
};

export default ProfileTopSkeleton;
