import Image from "next/image";

const Empty = () => {
  return (
    <div className="flex items-center justify-center mt-12 flex-col">
      <Image src="/not-found.svg" alt="not-found" width={280} height={226} />
      <p className="text-base md:text-lg font-medium text-gray-400 mt-[36px]">
        There are currently no data.
      </p>
    </div>
  );
};

export default Empty;
