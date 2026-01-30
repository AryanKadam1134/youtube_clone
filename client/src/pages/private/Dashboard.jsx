import React, { useEffect, useState } from "react";

import VideoFile from "../../components/VideoFile";

import { apiEndpoints } from "../../api";

export default function Dashboard() {
  const [videos, setVideos] = useState(null);

  const fetchAllVideos = async () => {
    try {
      const res = await apiEndpoints.getAllVideos();

      const data = res.data;
      setVideos(data?.data?.videos);
      // console.log("Videos: ", data);
    } catch (error) {
      console.error("Error fetching all videos: ", error);
    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 bg-[#0f0f0f]">
      {videos?.map((video, idx) => (
        <div key={idx}>
          <VideoFile video={video} refresh={fetchAllVideos} />
        </div>
      ))}
    </div>
  );
}
