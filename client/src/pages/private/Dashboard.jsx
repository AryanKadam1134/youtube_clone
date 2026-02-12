import React, { useEffect, useState } from "react";

import VideoCard from "../../components/VideoCard";

import { apiEndpoints } from "../../api";

export default function Dashboard() {
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAllVideos = async () => {
    try {
      setLoading(true);
      const res = await apiEndpoints.getAllVideos();

      const data = res.data;
      setVideos(data?.data?.videos);
    } catch (error) {
      console.error("Error fetching all videos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-6">
      <div className="max-w-[1920px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="bg-[#272727] aspect-video rounded-xl mb-3" />
                <div className="flex gap-3">
                  <div className="size-9 bg-[#272727] rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#272727] rounded w-3/4" />
                    <div className="h-3 bg-[#272727] rounded w-1/2" />
                    <div className="h-3 bg-[#272727] rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos?.map((video, idx) => (
              <VideoCard key={video._id || idx} video={video} refresh={fetchAllVideos} />
            ))}
          </div>
        )}

        {!loading && videos?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-[#aaaaaa]">
            <p className="text-lg">No videos available</p>
          </div>
        )}
      </div>
    </div>
  );
}