import SearchIcon2 from "../../atoms/Icons/SearchIcon";

interface Props {
  onChangeText: (keyword: string) => void;
}
const SearchTicket: React.FC<Props> = ({ onChangeText }) => {
  return (
    <div className="flex-1 border rounded-md flex items-center space-x-2 py-3 px-4">
      <SearchIcon2 />
      <input
        className="w-full focus:outline-none bg-white text-[#344054]"
        onChange={(e) => {
          onChangeText(e.target.value);
        }}
        placeholder="Search with wallet address"
      />
    </div>
  );
};
export default SearchTicket;
