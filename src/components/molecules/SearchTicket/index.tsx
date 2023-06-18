import SearchIcon from "../../atoms/Icons/search";

interface Props {
  onChangeText: (keyword: string) => void;
}
const SearchTicket: React.FC<Props> = ({ onChangeText }) => {
  return (
    <div className="flex-1 border rounded-md flex items-center space-x-3 py-3 px-4">
      <SearchIcon />
      <input
        className="w-full px-2 focus:outline-none"
        onChange={(e) => {
          onChangeText(e.target.value);
        }}
        placeholder="Search with wallet address"
      />
    </div>
  );
};
export default SearchTicket;
