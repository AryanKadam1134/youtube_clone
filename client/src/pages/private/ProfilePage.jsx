import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { apiEndpoints } from "../../api";

export default function ProfilePage() {
  const [myAllVideos, setMyAllVideos] = useState([]);

  const getAllMyVideos = async (value = "all") => {
    try {
      const res = await apiEndpoints.getAllMyVideos({ isPublished: value });

      const data = res.data?.data?.videos;

      setMyAllVideos(data);
      console.log("All Current User Videos: ", data);
    } catch (error) {
      console.error("Error fetching all Current User Videos: ", error);
    }
  };

  useEffect(() => {
    getAllMyVideos();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <Select
          placeholder="Select Filter"
          className="w-[200px]"
          options={[
            { value: "all", label: "All" },
            { value: true, label: "Published" },
            { value: false, label: "Unpublished" },
          ]}
          defaultValue="all"
          onChange={(value) => getAllMyVideos(value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-5 bg-[#0f0f0f]">
        {myAllVideos?.map((video, idx) => (
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
    </div>
  );
}
