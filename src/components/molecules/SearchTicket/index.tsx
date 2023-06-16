import SearchIcon from "../../atoms/Icons/search";

const SearchTicket = () => {
  return (
    <div className="flex-1 border rounded-md flex items-center space-x-3 py-3 px-4">
      <SearchIcon />
      <input className="w-full" placeholder="Search with wallet address" />
    </div>
  );
};
export default SearchTicket;
