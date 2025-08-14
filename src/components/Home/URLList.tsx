import axios from "axios";
import { useEffect, useState } from "react";

export default function URLList() {
  // const urlData = [
  //   {
  //     id: 1,
  //     shortLink: "shawty.ly/abc123",
  //     originalLink:
  //       "https://www.example.com/very-long-url-that-needs-to-be-shortened",
  //     clicks: 42,
  //     status: "Active",
  //     date: "2024-01-15",
  //   },
  //   {
  //     id: 2,
  //     shortLink: "shawty.ly/xyz789",
  //     originalLink: "https://www.google.com/search?q=url+shortener+service",
  //     clicks: 18,
  //     status: "Active",
  //     date: "2024-01-14",
  //   },
  //   {
  //     id: 3,
  //     shortLink: "shawty.ly/def456",
  //     originalLink:
  //       "https://github.com/username/repository-name-that-is-very-long",
  //     clicks: 7,
  //     status: "Inactive",
  //     date: "2024-01-13",
  //   },
  //   {
  //     id: 4,
  //     shortLink: "shawty.ly/mno321",
  //     originalLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //     clicks: 156,
  //     status: "Active",
  //     date: "2024-01-12",
  //   },
  //   {
  //     id: 5,
  //     shortLink: "shawty.ly/pqr654",
  //     originalLink:
  //       "https://stackoverflow.com/questions/12345678/how-to-create-url-shortener",
  //     clicks: 23,
  //     status: "Active",
  //     date: "2024-01-11",
  //   },
  //   {
  //     id: 6,
  //     shortLink: "shawty.ly/jkl987",
  //     originalLink: "https://news.ycombinator.com/item?id=123456",
  //     clicks: 11,
  //     status: "Active",
  //     date: "2024-01-10",
  //   },
  //   {
  //     id: 7,
  //     shortLink: "shawty.ly/bnm234",
  //     originalLink: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  //     clicks: 37,
  //     status: "Inactive",
  //     date: "2024-01-09",
  //   },
  //   {
  //     id: 8,
  //     shortLink: "shawty.ly/qwe321",
  //     originalLink: "https://chat.openai.com/chat",
  //     clicks: 98,
  //     status: "Active",
  //     date: "2024-01-08",
  //   },
  //   {
  //     id: 9,
  //     shortLink: "shawty.ly/tyu876",
  //     originalLink: "https://www.linkedin.com/in/example-profile",
  //     clicks: 55,
  //     status: "Active",
  //     date: "2024-01-07",
  //   },
  //   {
  //     id: 10,
  //     shortLink: "shawty.ly/ghj567",
  //     originalLink: "https://react.dev/learn",
  //     clicks: 14,
  //     status: "Inactive",
  //     date: "2024-01-06",
  //   },
  //   {
  //     id: 11,
  //     shortLink: "shawty.ly/vcx543",
  //     originalLink: "https://nextjs.org/docs",
  //     clicks: 21,
  //     status: "Active",
  //     date: "2024-01-05",
  //   },
  //   {
  //     id: 12,
  //     shortLink: "shawty.ly/wer876",
  //     originalLink: "https://www.reddit.com/r/programming",
  //     clicks: 63,
  //     status: "Active",
  //     date: "2024-01-04",
  //   },
  //   {
  //     id: 13,
  //     shortLink: "shawty.ly/zxc999",
  //     originalLink: "https://codepen.io/",
  //     clicks: 5,
  //     status: "Inactive",
  //     date: "2024-01-03",
  //   },
  //   {
  //     id: 14,
  //     shortLink: "shawty.ly/asd741",
  //     originalLink: "https://vercel.com/docs",
  //     clicks: 34,
  //     status: "Active",
  //     date: "2024-01-02",
  //   },
  //   {
  //     id: 15,
  //     shortLink: "shawty.ly/lkj258",
  //     originalLink: "https://www.producthunt.com/posts/url-shortener",
  //     clicks: 12,
  //     status: "Inactive",
  //     date: "2024-01-01",
  //   },
  // ];

  interface UrlData {
    _id: string;
    shortId: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    status: "active" | "inactive";
    date: string;
  }

  const [urls, setUrls] = useState<UrlData[]>([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await axios.get("/api/urls");
        setUrls(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching URLs:", error);
      }
    };

    fetchUrls();
  }, []);

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
            {urls.map((url) => (
              <tr
                key={url._id}
                className="border-b border-gray-800/50 hover:bg-gray-50/5 transition-colors"
              >
                <td className="py-3 px-4 text-sm">
                  <a
                    href={`http://localhost:3000/${url.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 font-mono
                    hover:text-blue-300 hover:underline
                     transition-colors"
                  >
                    {`http://localhost:3000/${url.shortId}`}
                  </a>
                </td>
                <td className="py-3 px-6 text-sm">
                  <div className="w-fit">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-white hover:underline transition-colors"
                      title={url.originalUrl} // Shows full URL on hover
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
                    {url.status.charAt(0).toUpperCase() + url.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-6 text-sm text-muted-foreground">
                  {new Date(url.date).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {/* Empty state when no URLs */}
            {urls.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground text-sm"
                >
                  No shortened URLs yet. Create your first link above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
