import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { FiCopy, FiTrash2 } from "react-icons/fi";

const URLList = ({ urls, setUrls, isLoading }) => {
  const { isSignedIn, user } = useUser();

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async (slug) => {
    if (!isSignedIn) {
      toast.error("Please login to delete URLs");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/urls/${slug}`, {
        headers: { Authorization: `Bearer ${await user.getToken()}` },
      });

      setUrls(prev => {
        const updatedUrls = prev.filter(url => url.slug !== slug);
        if (!isSignedIn) {
          localStorage.setItem('urls', JSON.stringify(updatedUrls));
        }
        return updatedUrls;
      });

      toast.success("URL deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete URL");
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-3 text-left">Short Link</th>
              <th className="px-6 py-3 text-left">Original Link</th>
              <th className="px-6 py-3 text-center">Clicks</th>
              <th className="px-6 py-3 text-center">Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {urls.map((url, index) => (
                <motion.tr
                  key={url.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-700"
                >
                  <td className="px-6 py-4">
                    <a
                      href={url.shortenedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {url.shortenedUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white"
                    >
                      {url.originalUrl.length > 50
                        ? url.originalUrl.substring(0, 50) + "..."
                        : url.originalUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center">{url.clicks}</td>
                  <td className="px-6 py-4 text-center">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(url.shortenedUrl)}
                        className="p-1 hover:bg-gray-700 rounded"
                      >
                        <FiCopy className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(url.slug)}
                        className="p-1 hover:bg-gray-700 rounded text-red-500"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default URLList;
