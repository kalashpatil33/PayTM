export function Button({ label, onClick }) {
    return (
      <button
        onClick={onClick}
        type="button"
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2"
      >
        {label}
      </button>
    );
  }