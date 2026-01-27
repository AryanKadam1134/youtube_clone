import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [videos, setVideos] = useState(null);

  const fetchAllVideos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/videos/all");

      const data = res.data;
      setVideos(data?.data?.videos);
      console.log("Videos: ", data?.data?.videos);
    } catch (error) {
      console.error("Error fetching all videos: ", error);
    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-5 bg-[#0f0f0f]">
      {videos?.map((video, idx) => (
        <div key={idx} className="flex flex-col gap-2 text-sm">
          <img
            className="h-[250px] rounded-lg object-cover"
            src={video?.thumbnail?.url}
          
          />

          <div className="flex justify-start items-start gap-2">
            <img
              src={video?.owner?.avatar?.url}
              alt="User Avatar"
              className="size-[30px] rounded-full object-cover"
            />
            <div className="flex flex-col justify-center items-start gap-1 text-white">
              <p className="font-semibold text-[14px]">{video?.title}</p>
              <p className="text-[12px]">{video?.views} views</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
