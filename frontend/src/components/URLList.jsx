import React, { useState, useEffect } from "react";
import ClipboardJS from "clipboard";

const URLList = ({ urls }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const clipboard = new ClipboardJS(".copy-btn");
    clipboard.on("success", () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });

    return () => clipboard.destroy();
  }, []);

  return (
    <div className="overflow-x-auto relative">
      {copied && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-sm">
          Copied to clipboard!
        </div>
      )}
      <table className="w-full mt-8">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-800">
            <th className="py-3 px-4">Copy</th>
            <th className="py-3 px-4">Shortened Link</th>
            <th className="py-3 px-4">Original Link</th>
            <th className="py-3 px-4">Clicks</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr
              key={url.slug}
              className="border-b border-gray-800 hover:bg-gray-800"
            >
              <td className="py-4 px-4">
                <button
                  className="copy-btn text-gray-400 hover:text-gray-200"
                  data-clipboard-text={url.shortenedUrl}
                  aria-label="Copy to clipboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z" />
                  </svg>
                </button>
              </td>
              <td className="py-4 px-4">
                <a
                  href={`https://${url.shortenedUrl}`}
                  className="text-blue-500 hover:text-blue-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.shortenedUrl}
                </a>
              </td>
              <td className="py-4 px-4 truncate max-w-xs">
                <a
                  href={url.url}
                  className="text-gray-300 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url.url}
                </a>
              </td>
              <td className="py-4 px-4">{url.clicks}</td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    url.active
                      ? "bg-green-900 text-green-300"
                      : "bg-yellow-900 text-yellow-300"
                  }`}
                >
                  {url.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-400">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default URLList;
