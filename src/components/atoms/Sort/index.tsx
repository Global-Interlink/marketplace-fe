import React from "react";
import ArrowDown from "../Icons/ArrowDown";
import { useDetectClickOutside } from "react-detect-click-outside";
interface Props {
  onChange: (sort: "ASC" | "DESC") => void;
  sort: "ASC" | "DESC";
}
const Sort: React.FC<Props> = ({ onChange, sort }) => {
  const ref = useDetectClickOutside({
    onTriggered: () => {
      setOpen(false);
    },
  });

  const [open, setOpen] = React.useState(false);
  const [currentSort, setCurrentSort] = React.useState<"ASC" | "DESC">(sort);

  React.useEffect(() => {
    if (sort !== currentSort) {
      setCurrentSort(sort);
    }
  }, [sort]);

  return (
    <div className="relative" ref={ref}>
      <div
        className="flex text-xs leading-5 text-[#5B5B5B] dark:text-white bg-white items-center justify-between dark:bg-[#514E89] w-[155px] h-10 px-5 rounded-full cursor-pointer"
        onClick={() => {
          setOpen(true);
        }}
      >
        <p>{currentSort === "DESC" ? "High to low" : "Low to high"}</p>
        <ArrowDown />
      </div>
      {open && (
        <div className="absolute mt-2 bg-white dark:bg-[#514E89] shadow w-full rounded-full z-10">
          <p
            onClick={() => {
              setOpen(false);
              onChange(currentSort === "DESC" ? "ASC" : "DESC");
              setCurrentSort(currentSort === "DESC" ? "ASC" : "DESC");
            }}
            className="flex text-xs leading-5 text-[#5B5B5B] dark:text-white bg-white items-center justify-between dark:bg-[#514E89] w-[155px] h-10 px-5 rounded-full cursor-pointer"
          >
            {currentSort !== "DESC" ? "High to low" : "Low to high"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Sort;
