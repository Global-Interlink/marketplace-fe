import React from "react";
import { useTheme } from "next-themes";
import { Collection } from "../../../api/types";
import Image from "next/image";
interface Props {
  response?: Collection;
}
const SocialView: React.FC<Props> = ({ response }) => {
  const { theme } = useTheme();
  return (
    <>
      {response?.website_url && (
        <a
          href={response?.website_url}
          target="_blank"
          rel="noreferrer"
          className="h-[24px] !w-[24px] bg-[#A0A0A0]/50 hover:bg-[#F626D1] rounded !flex justify-center items-center transition-all duration-500"
        >
          <Image src={"/ic-website.svg"} width={14} height={14} alt={""} />
        </a>
      )}
      {response?.telegram_url && (
        <a
          href={response?.telegram_url}
          target="_blank"
          rel="noreferrer"
          className="h-[24px] !w-[24px] bg-[#A0A0A0]/50 hover:bg-[#F626D1] rounded !flex justify-center items-center transition-all duration-500"
        >
          <Image src={"/ic-telegram.svg"} width={14} height={11} alt={""} />
        </a>
      )}
      {response?.discord_url && (
        <a
          href={response?.discord_url}
          target="_blank"
          rel="noreferrer"
          className="h-[24px] !w-[24px] bg-[#A0A0A0]/50 hover:bg-[#F626D1] rounded !flex justify-center items-center transition-all duration-500"
        >
          <Image src={"/ic-discord.svg"} width={16} height={12} alt={""} />
        </a>
      )}
      {response?.twitter_url && (
        <a
          href={response?.twitter_url}
          target="_blank"
          rel="noreferrer"
          className="h-[24px] !w-[24px] bg-[#A0A0A0]/50 hover:bg-[#F626D1] rounded !flex justify-center items-center transition-all duration-500"
        >
          <Image src={"/ic-twitter.svg"} width={15} height={15} alt={""} />
        </a>
      )}
    </>
  );
};

export default SocialView;
