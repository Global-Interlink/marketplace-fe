import { Checkbox } from "antd";
import ArrowDown from "../../atoms/Icons/ArrowDown";
import React from "react";

interface Props {
  attribute: string;
  values: { value: string; count: string }[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  filterQueries: string[];
}

const NFTAttributeItem: React.FC<Props> = ({
  attribute,
  values,
  onSelect,
  onRemove,
  filterQueries,
}) => {
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div className=" space-y-4 dark:text-white text-[#101828]">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => {
          setOpen(!isOpen);
        }}
      >
        <p className="font-semibold">{attribute}</p>
        <ArrowDown />
      </div>
      {isOpen && (
        <div className="flex flex-col">
          {values.map((i) => {
            const value = `${attribute}[]=${i.value}`;
            return (
              <div key={i.value} className="flex items-center">
                <Checkbox
                  value={value}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    if (checked) {
                      onSelect(value);
                    } else {
                      onRemove(value);
                    }
                  }}
                  checked={filterQueries.includes(value)}
                >
                  <div className="flex flex-col dark:text-white text-[#101828] hover:text-[#E23DCC]">
                    <span className="whitespace-pre-wrap break-all line-clamp-1 font-medium  ">
                      {i.value}
                    </span>
                    <span>{i.count}</span>
                  </div>
                </Checkbox>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default NFTAttributeItem;
