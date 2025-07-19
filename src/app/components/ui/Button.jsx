export default function Button({ children, ...props }) {
    return (
      <button
        {...props}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {children}
      </button>
    );
  }
  