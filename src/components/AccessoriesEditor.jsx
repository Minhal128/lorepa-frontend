import { FaPlus, FaTrash } from "react-icons/fa";

const blankRow = () => ({ name: "", price: "", description: "", isActive: true });

// Owner-side editor for the optional add-ons a renter can pick at checkout.
// Every price here is a flat one-time fee for the whole rental, never per day.
const AccessoriesEditor = ({ value, onChange, labels = {} }) => {
  const rows = Array.isArray(value) ? value : [];
  const patch = (index, changes) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...changes } : row)));

  return (
    <div className="sm:col-span-2 mt-6 pt-6 border-t border-gray-200">
      <h4 className="text-base font-semibold text-gray-800">
        {labels.title || "Optional accessories for renters"}
      </h4>
      <p className="text-sm text-gray-500 mt-1 mb-4">
        {labels.hint || "One-time fee — not charged per day."}
      </p>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3 items-start">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {labels.name || "Accessory name"}
                </label>
                <input
                  type="text"
                  value={row.name || ""}
                  onChange={(e) => patch(index, { name: e.target.value })}
                  placeholder={labels.namePlaceholder || "Wheel straps"}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  {labels.price || "Price ($)"}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.price ?? ""}
                  onChange={(e) => patch(index, { price: e.target.value })}
                  placeholder="25"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
                aria-label={labels.remove || "Remove accessory"}
                title={labels.remove || "Remove accessory"}
                className="mt-6 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              >
                <FaTrash />
              </button>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                {labels.description || "Description (optional)"}
              </label>
              <input
                type="text"
                value={row.description || ""}
                onChange={(e) => patch(index, { description: e.target.value })}
                placeholder={labels.descriptionPlaceholder || "4 wheel straps included"}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...rows, blankRow()])}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
      >
        <FaPlus className="text-xs" />
        {rows.length ? (labels.addAnother || "Add another accessory") : (labels.add || "Add an accessory")}
      </button>
    </div>
  );
};

export default AccessoriesEditor;
