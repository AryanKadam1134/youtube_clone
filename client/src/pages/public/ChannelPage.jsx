import React, { useEffect, useState } from "react";
import { apiEndpoints } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, BellOff, Play } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import VideoCard from "../../components/VideoCard";

dayjs.extend(relativeTime);

export default function ChannelPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location?.state?.id;

  const [userDetails, setUserDetails] = useState({});
  const [userVideos, setUserVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(true);

  const {
    username,
    fullName,
    email,
    avatar,
    coverImage,
    isSubscribed,
    subscribersCount,
  } = userDetails;

  const fetchUserDetails = async () => {
    try {
      const res = await apiEndpoints.getUserChannelDetails(userId);

      const data = res.data?.data;

      setUserDetails(data);
      console.log("User Details: ", data);
    } catch (error) {
      console.error("Error fetching User Details: ", error);
    }
  };

  const fetchUserVideos = async () => {
    try {
      const res = await apiEndpoints.getUserChannelVideos(userId);

      const data = res.data?.data?.videos;

      setUserVideos(data);
      console.log("User Videos: ", data);
    } catch (error) {
      console.error("Error fetching User Videos: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      let res;
      if (isSubscribed) {
        res = await apiEndpoints.unsubscribeChannel(userId);
      } else {
        res = await apiEndpoints.subscribeChannel(userId);
      }

      const data = res?.data;

      fetchUserDetails();
      console.log("Subscribed to Channel: ", data);
    } catch (error) {
      console.error("Error Subscribing to Channel: ", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
      fetchUserVideos();
    }
  }, [userId]);

  const tabs = [
    { id: "videos", label: "Videos" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Cover Image */}
      <div className="relative w-full h-[200px] md:h-[300px] bg-[#272727]">
        {coverImage?.url ? (
          <img
            src={coverImage.url}
            alt="Channel Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-[#717171] text-lg">No cover image</div>
          </div>
        )}
      </div>

      {/* Channel Info Section */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6 -mt-10 md:-mt-16 relative z-10">
          {/* Avatar */}
          <div className="relative">
            <img
              src={avatar?.url}
              alt={username}
              className="size-[80px] md:size-[160px] rounded-full object-cover border-4 border-[#0f0f0f] bg-[#272727]"
            />
          </div>

          {/* Channel Details */}
          <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-2xl md:text-4xl font-bold">
                {fullName || username}
              </h1>
              <div className="flex items-center gap-2 text-[#aaaaaa] text-sm">
                <span>@{username}</span>
                <span>•</span>
                <span>
                  {subscribersCount?.toLocaleString() || 0} subscribers
                </span>
                <span>•</span>
                <span>{userVideos?.length || 0} videos</span>
              </div>
            </div>

            {/* Subscribe Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubscribe}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-colors cursor-pointer ${
                  isSubscribed
                    ? "bg-[#272727] text-white hover:bg-[#3d3d3d]"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell size={20} />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#3d3d3d] mt-6">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-[#aaaaaa] hover:text-white"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "videos" && (
            <div>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, idx) => (
                    <div key={idx} className="animate-pulse">
                      <div className="bg-[#272727] aspect-video rounded-xl mb-3" />
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#272727] rounded w-3/4" />
                          <div className="h-3 bg-[#272727] rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userVideos?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {userVideos.map((video, idx) => (
                    <div key={idx}>
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-[#aaaaaa]">
                  <Play size={64} className="mb-4 opacity-50" />
                  <p className="text-lg">No videos uploaded yet</p>
                  <p className="text-sm mt-2">
                    This channel hasn't uploaded any videos
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "about" && (
            <div className="max-w-4xl">
              <div className="bg-[#272727] rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">Description</h3>
                  <p className="text-[#aaaaaa] text-sm">
                    {userDetails.description || "No description available"}
                  </p>
                </div>

                <div className="border-t border-[#3d3d3d] pt-4">
                  <h3 className="text-white font-semibold mb-3">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-[#aaaaaa] min-w-[100px]">
                        Username:
                      </span>
                      <span className="text-white">@{username}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#aaaaaa] min-w-[100px]">
                        Email:
                      </span>
                      <span className="text-white">{email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#aaaaaa] min-w-[100px]">
                        Subscribers:
                      </span>
                      <span className="text-white">
                        {subscribersCount?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#aaaaaa] min-w-[100px]">
                        Total videos:
                      </span>
                      <span className="text-white">
                        {userVideos?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#3d3d3d] pt-4">
                  <h3 className="text-white font-semibold mb-2">Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0f0f0f] p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {userVideos?.length || 0}
                      </div>
                      <div className="text-xs text-[#aaaaaa]">Videos</div>
                    </div>
                    <div className="bg-[#0f0f0f] p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {subscribersCount?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-[#aaaaaa]">Subscribers</div>
                    </div>
                    <div className="bg-[#0f0f0f] p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {userVideos
                          ?.reduce((acc, video) => acc + (video.views || 0), 0)
                          ?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-[#aaaaaa]">Total views</div>
                    </div>
                    <div className="bg-[#0f0f0f] p-4 rounded-lg">
                      <div className="text-2xl font-bold text-white">
                        {userVideos
                          ?.reduce(
                            (acc, video) => acc + (video.likesCount || 0),
                            0,
                          )
                          ?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-[#aaaaaa]">Total likes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
