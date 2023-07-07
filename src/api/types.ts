export interface Collection {
  createdDate: string;
  lastUpdatedDate: string;
  id: string;
  name: string;
  description: string;
  logo: string;
  logoFileType: string;
  banner: string;
  bannerFileType: string;
  featuredImage: string;
  totalNfts: string;
  featuredImageFileType: string;
  creator: {
    createdDate: string;
    lastUpdatedDate: string;
    id: string;
    address: {
      createdDate: string;
      lastUpdatedDate: string;
      id: number;
      address: string;
      network: {
        createdDate: string;
        lastUpdatedDate: string;
        id: number;
        network_id: string;
        provider_url?: string;
      };
    };
  };
  facebook_url?: string;
  discord_url?: string;
  reddit_url?: string;
  telegram_url?: string;
  twitter_url?: string;
  website_url?: string;
  youtube_url?: string;
  github_url?: string;
  instagram_url?: string;
}

export interface Meta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
interface Owner {
  createdDate: string;
  lastUpdatedDate: string;
  id: string;
  address: {
    createdDate: string;
    lastUpdatedDate: string;
    id: number;
    address: string;
    network: {
      createdDate: string;
      lastUpdatedDate: string;
      id: number;
      network_id: string;
      provider_url?: string;
    };
  };
}

export interface NFT {
  createdDate: string;
  lastUpdatedDate: string;
  id: string;
  onChainId: string;
  name: string;
  description: string;
  image: string;
  fileType: string;
  state: string;
  ownedDate?: any;
  saleStatus?: {
    onSale: boolean;
    price: string;
    saleItemId: string;
    buyType: string;
    auction?: any;
    hasExpired: boolean;
    usdPrice?: number;
  };
  owner: Owner;
  collection?: Collection;
  properties?: { name: string; value: string }[];
  objectId?: string;
  nftType: string;
}
