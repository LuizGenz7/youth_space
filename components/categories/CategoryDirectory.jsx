import CategoryListItem from "./CategoryListItem";

export default function CategoryDirectory({ categories }) {
  const availableCategories = categories.filter(
    (category) => category.count > 0,
  );

  if (!availableCategories.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p className="text-sm font-bold text-slate-700">
          No categories available yet.
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Categories will appear here as talent becomes available.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {availableCategories.map((category) => (
        <CategoryListItem
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}