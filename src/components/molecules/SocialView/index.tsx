import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import { Launchpad } from "../../../api/types";
import ShareItem from "../../atoms/ShareItem";

interface Props {
  response?: any;
}
const SocialView: React.FC<Props> = ({ response }) => {
  const { theme } = useTheme();
  return (
    <>
      {typeof window !== "undefined" && window.location.href && (
        <ShareItem
          shareUrl={window.location.href}
          title={response?.name || ""}
        />
      )}
      {response?.website_link && (
        <Link href={response?.website_link} target="_blank">
          <Image
            width={24}
            height={24}
            src={theme === "dark" ? "/ic-website.svg" : "/ic-website-l.svg"}
            alt="ic-website"
          />
        </Link>
      )}
      {response?.twitter_link && (
        <Link href={response.twitter_link} target="_blank">
          <Image
            width={24}
            height={24}
            src={theme === "dark" ? "/ic-twitter.svg" : "/ic-twitter-l2.svg"}
            alt="ic-twitter"
          />
        </Link>
      )}
      {response?.telegram_link && (
        <Link href={response.telegram_link} target="_blank">
          <Image
            width={24}
            height={24}
            src={theme === "dark" ? "/ic-telegram.svg" : "/ic-telegram-l.svg"}
            alt="ic-telegram"
          />
        </Link>
      )}
      {response?.discord_link && (
        <Link href={response.discord_link} target="_blank">
          <Image
            width={24}
            height={24}
            src={theme === "dark" ? "/ic-discord.svg" : "/ic-discord-l.svg"}
            alt="ic-discord"
          />
        </Link>
      )}
      {response?.medium_link && (
        <Link href={response.medium_link} target="_blank">
          <Image
            width={24}
            height={24}
            src={theme === "dark" ? "/ic-medium.svg" : "/ic-medium-l.svg"}
            alt="ic-medium"
          />
        </Link>
      )}
    </>
  );
};

export default SocialView;
