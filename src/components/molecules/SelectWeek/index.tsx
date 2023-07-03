import dayjs from "dayjs";
import { Week } from "../../../../pages/event/weekly-reward/tickets";
import CalendarIcon from "../../atoms/Icons/CalendarIcon";
import { Dropdown, MenuProps } from "antd";
import React from "react";

interface Props {
  week?: Week[];
  onChangeWeek: (start: string, end: string) => void;
}
const SelectWeek: React.FC<Props> = ({ week, onChangeWeek }) => {
  const [selectedWeek, setSelectedWeek] = React.useState<Week>();

  const index = selectedWeek && week ? week?.indexOf(selectedWeek) : 0;
  const items: MenuProps["items"] = week?.map((i, idx) => {
    return {
      key: idx,
      label: (
        <p
          className="text-[#344054] font-semibold"
          onClick={() => {
            setSelectedWeek(i);
            onChangeWeek(
              dayjs(i.start).format("YYYY-MM-DD"),
              dayjs(i.end).format("YYYY-MM-DD")
            );
          }}
        >
          Week{idx + 1} {dayjs(i.start).format("DD/MM")} -{" "}
          {dayjs(i.end).format("DD/MM")}
        </p>
      ),
    };
  });
  React.useEffect(() => {
    if (week && !selectedWeek) {
      const currentWeek = week?.find((i) => i.current);
      setSelectedWeek(currentWeek);
      onChangeWeek(
        dayjs(currentWeek?.start).format("YYYY-MM-DD"),
        dayjs(currentWeek?.end).format("YYYY-MM-DD")
      );
    }
  }, [week]);
  return (
    <Dropdown menu={{ items }} placement="bottom" arrow>
      <div className="inline-flex cursor-pointer text-sm text-[#344054] py-3 px-4 rounded-full border space-x-3 font-semibold">
        <CalendarIcon />
        <p>{`Week (${dayjs(selectedWeek?.start).format(
          "DD/MM"
        )} - ${dayjs(selectedWeek?.end).format("DD/MM")})`}</p>
      </div>
    </Dropdown>
  );
};
export default SelectWeek;
