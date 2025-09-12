interface CategorySelectProps {
  onChange: (value: string) => void;
  categories: string[];
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onChange, categories }) => {
  return (
    <select onChange={(e) => onChange(e.target.value)} defaultValue="" role="combobox">
      <option value="">All Categories</option>
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;