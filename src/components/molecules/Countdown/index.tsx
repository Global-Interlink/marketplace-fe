import Countdown from "react-countdown";

interface Props {
  onEndMintTime?: () => void;
  startTime?: number | undefined;
}
const CountDown: React.FC<Props> = ({ onEndMintTime, startTime }) => {
  return startTime ? (
    <Countdown
      date={startTime}
      onComplete={onEndMintTime}
      renderer={({ days, hours, minutes, seconds }) => {
        return (
          <div className="flex gap-2 items-center">
            <div className="border text-[#475467] bg-white flex justify-center items-center text-[36px] font-medium border-[#D0D5DD] p-2 w-[64px] h-[64px] rounded-[8px] shadow-[0px_1px_2px_rgba(16_24_40_0.05)]">
              {days < 10 ? `0${days}` : days}
            </div>
            <div className="border text-[#475467] bg-white flex justify-center items-center text-[36px] font-medium border-[#D0D5DD] p-2 w-[64px] h-[64px] rounded-[8px] shadow-[0px_1px_2px_rgba(16_24_40_0.05)]">
              {hours < 10 ? `0${hours}` : hours}
            </div>
            <div className="border text-[#475467] bg-white flex justify-center items-center text-[36px] font-medium border-[#D0D5DD] p-2 w-[64px] h-[64px] rounded-[8px] shadow-[0px_1px_2px_rgba(16_24_40_0.05)]">
              {minutes < 10 ? `0${minutes}` : minutes}
            </div>
            <div className="border text-[#475467] bg-white flex justify-center items-center text-[36px] font-medium border-[#D0D5DD] p-2 w-[64px] h-[64px] rounded-[8px] shadow-[0px_1px_2px_rgba(16_24_40_0.05)]">
              {seconds < 10 ? `0${seconds}` : seconds}
            </div>
          </div>
        );
      }}
    />
  ) : null;
};

export default CountDown;
