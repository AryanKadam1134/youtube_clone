import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [videos, setVideos] = useState(0);

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
    <div className="grid grid-cols-3 gap-5">
      {videos?.map((video, idx) => (
        <div
          key={idx}
          className="flex flex-col items-start justify-center gap-1"
        >
          <video className="rounded-lg" src={video?.videoFile?.url} controls></video>
        </div>
      ))}
    </div>
  );
}

export default App;
