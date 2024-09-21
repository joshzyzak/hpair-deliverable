// List of options for entry categories

export const categories = [
   { id: 0, name: "Misc." },
   { id: 1, name: "Politics" },
   { id: 2, name: "Business" },
   { id: 3, name: "Entertainment" }
];

export function getCategory(category_id) {
   const category = categories.find(x => x.id === category_id);
   return category ? category : { id: -1, name: "Unknown" }; // Default case
}
