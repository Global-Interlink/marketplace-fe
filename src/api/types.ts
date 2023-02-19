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
  onChainId: number;
  name: string;
  description: string;
  image: string;
  fileType: string;
  state: string;
  ownedDate?: any;
  saleStatus?: any;
  owner: Owner;
  collection?: Collection;
  properties?: { name: string; value: string }[];
}
