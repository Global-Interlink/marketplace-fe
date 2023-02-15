export enum TimeStatus {
  LIVE = "live",
  UPCOMING = "upcoming",
  PAST = "past",
}

interface Whitelist {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  limitPerWallet: number;
}
interface Member {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  name: string;
  description: string;
  avatar: string;
  role: string;
  launchpadId: string;
}

interface FAQ {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  question: string;
  answer: string;
  launchpadId: string;
}

export interface Stage {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  type: string;
  startTime: string;
  price: string;
  whitelistId: string;
  launchpadId: string;
  whitelist: Whitelist;
  name: string;
  endTime: string;
}

export interface CurrentStage {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  type: string;
  startTime: string;
  price: string;
  whitelistId: string;
  launchpadId: string;
  whitelist: Whitelist;
  endTime: string;
  name: string;
}

interface Roadmap {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  name: string;
  description: string;
  estimatedTime: string;
  launchpadId: string;
  logo?: string;
}

export interface Launchpad {
  mintState: null;
  medium_link?: string;
  discord_link?: string;
  telegram_link?: string;
  twitter_link?: string;
  website_link?: string;
  currentStage: CurrentStage;
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  state: string;
  ownerId: string;
  contractAddress: string;
  featuredImage: string;
  name: string;
  description: string;
  totalItems: number;
  currencyId: string;
  startTime: string;
  endTime: string;
  aboutProject: string;
  owner: {
    id: string;
    createdAt: string;
    lastUpdatedAt: string;
    address: {
      id: string;
      createdAt: string;
      lastUpdatedAt: string;
      address: string;
    };
    name: string;
    logo?: string;
  };
  currency: {
    id: string;
    createdAt: string;
    lastUpdatedAt: string;
    name: string;
  };
  stages: Stage[];
  roadmaps?: Roadmap[];
  teamMembers?: Member[];
  faqs?: FAQ[];
  onchainData?: any;
}

export interface NFT {
  name: string;
  description: string;
  url: string;
  objectId: string;
  owner: string;
}
