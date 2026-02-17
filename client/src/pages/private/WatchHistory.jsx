import React, { useEffect, useState } from "react";

import VideoCard from "../../components/VideoCard";

import { apiEndpoints } from "../../api";

export default function WatchHistory() {
  const [history, setHistory] = useState([]);

  const fetchWatchHistory = async () => {
    try {
      const res = await apiEndpoints.getWatchHistory();

      const data = res.data?.data;

      setHistory(data);
      // console.log("All Current User Videos: ", data);
    } catch (error) {
      console.error("Error fetching all Current User Videos: ", error);
    }
  };

  useEffect(() => {
    fetchWatchHistory();
  }, []);

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex justify-between items-center">
        <p className="text-white">Watch History</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {history?.map((video, idx) => (
          <div key={idx}>
            <VideoCard video={video} refresh={fetchWatchHistory} />
          </div>
        ))}
      </div>
    </div>
  );
}
