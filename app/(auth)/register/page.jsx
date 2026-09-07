import { getAllCategoriesAction } from "@/actions/categories";
import RegisterClient from "@/components/register/RegisterClient";



export default async function RegisterPage() {
  const result = await getAllCategoriesAction();

  const categories =
    result?.success && Array.isArray(result.categories)
      ? result.categories
      : [];

  return (
    <RegisterClient
      categories={categories}
      categoriesError={
        result?.success
          ? null
          : result?.error ||
            "Unable to load categories."
      }
    />
  );
}