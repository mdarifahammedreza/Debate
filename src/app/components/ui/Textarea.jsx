export default function Textarea(props) {
    return (
      <textarea
        {...props}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
      />
    );
  }
  