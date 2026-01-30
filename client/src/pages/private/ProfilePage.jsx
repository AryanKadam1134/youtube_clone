import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { apiEndpoints } from "../../api";
import VideoFile from "../../components/VideoFile";

export default function ProfilePage() {
  const [myAllVideos, setMyAllVideos] = useState([]);

  const [filter, setFilter] = useState("all");

  const getAllMyVideos = async () => {
    try {
      const res = await apiEndpoints.getAllMyVideos({ isPublished: filter });

      const data = res.data?.data?.videos;

      setMyAllVideos(data);
      // console.log("All Current User Videos: ", data);
    } catch (error) {
      console.error("Error fetching all Current User Videos: ", error);
    }
  };

  useEffect(() => {
    getAllMyVideos();
  }, [filter]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="text-white">Your Videos</p>
        <Select
          placeholder="Select Filter"
          className="w-[200px]"
          options={[
            { value: "all", label: "All" },
            { value: true, label: "Published" },
            { value: false, label: "Unpublished" },
          ]}
          defaultValue="all"
          onChange={(value) => setFilter(value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 bg-[#0f0f0f]">
        {myAllVideos?.map((video, idx) => (
          <div key={idx}>
            <VideoFile video={video} refresh={getAllMyVideos} />
          </div>
        ))}
      </div>
    </div>
  );
}
