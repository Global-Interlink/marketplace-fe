import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TelegramIcon, TwitterIcon } from "react-share";
import { Collection } from "../../../api/types";
import DiscordIcon from "../../atoms/Icons/DiscordIcon";
import WebsiteIcon from "../../atoms/Icons/WebsiteICon";
// import { Launchpad } from "../../../api/types";
import ShareItem from "../../atoms/ShareItem";

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
