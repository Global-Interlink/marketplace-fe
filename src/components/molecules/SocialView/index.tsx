import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";
import { Collection } from "../../../api/types";
import DiscordIcon from "../../atoms/Icons/DiscordIcon";
import TelegramIcon from "../../atoms/Icons/TelegramIcon";
import TwitterIcon from "../../atoms/Icons/TwitterIcon";
import WebsiteIcon from "../../atoms/Icons/WebsiteIcon";

interface Props {
  response?: Collection;
}
const SocialView: React.FC<Props> = ({ response }) => {
  const { theme } = useTheme();
  console.log("=response", response);
  return (
    <>
      {response?.website_url && (
        <Link href={response?.website_url} target="_blank">
          <WebsiteIcon />
        </Link>
      )}
      {response?.twitter_url && (
        <Link href={response.twitter_url} target="_blank">
          <TwitterIcon />
        </Link>
      )}
      {response?.telegram_url && (
        <Link href={response.telegram_url} target="_blank">
          <TelegramIcon />
        </Link>
      )}
      {response?.discord_url && (
        <Link href={response.discord_url} target="_blank">
          <DiscordIcon />
        </Link>
      )}
    </>
  );
};

export default SocialView;
