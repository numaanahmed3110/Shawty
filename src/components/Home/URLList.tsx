import { getSessionId } from "@/lib/session";
import { SignedIn, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface UrlListProps {
  refreshTrigger?: number;
}

interface UrlData {
  _id: string;
  shortId: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  status: "active" | "inactive";
  date: string;
}

export default function URLList({ refreshTrigger }: UrlListProps) {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [loading, setLoading] = useState(true);
  const [remainingUrls, setRemainingUrls] = useState(4);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setLoading(true);
        let apiUrl = "/api/urls";
        if (!isSignedIn) {
          const sessionId = getSessionId();
          apiUrl += `?sessionId=${encodeURIComponent(sessionId)}`;
        }
        const res = await axios.get(apiUrl);

        setUrls(res.data);
        if (!isSignedIn) {
          setRemainingUrls(Math.max(0, 4 - res.data.length));
        }
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching URLs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [isSignedIn, refreshTrigger]);

  return (
    <div className="w-full mt-8 px-12 mx-auto max-w-7xl">
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full border-collapse bg-background">
          <thead>
            <tr className="text-left text-white bg-[#181e29] border-b border-gray-800">
              <th className="py-4 px-6 text-sm font-medium">Short Link</th>
              <th className="py-4 px-6 text-sm font-medium">Original Link</th>
              <th className="py-4 px-6 text-sm font-medium text-center">
                QR Code
              </th>
              <th className="py-4 px-6 text-sm font-medium text-center">
                Clicks
              </th>
              <th className="py-4 px-6 text-sm font-medium text-center">
                Status
              </th>
              <th className="py-4 px-6 text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                    <span className="ml-2 text-muted-foreground">
                      Loading URLs...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {urls.map((url) => (
                  <tr
                    key={url._id}
                    className="border-b border-gray-800/50 hover:bg-gray-50/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 font-mono hover:text-blue-300 hover:underline transition-colors"
                      >
                        {url.shortUrl}{" "}
                      </a>
                    </td>
                    <td className="py-3 px-6 text-sm">
                      <div className="w-fit">
                        <a
                          href={url.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-white hover:underline transition-colors"
                          title={url.originalUrl}
                        >
                          {url.originalUrl.length > 50
                            ? `${url.originalUrl.substring(0, 50)}...`
                            : url.originalUrl}
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        View QR
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center text-sm">
                      <span className="text-green-400 font-medium">
                        {url.clicks}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          url.status === "active"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {url.status.charAt(0).toUpperCase() +
                          url.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-muted-foreground">
                      {new Date(url.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {/* Empty state when no URLs */}
                {!loading && urls.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground text-sm"
                    >
                      No shortened URLs yet. Create your first link above!
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
