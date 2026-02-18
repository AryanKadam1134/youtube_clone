import React, { useEffect, useState } from "react";
import { apiEndpoints } from "../../api";
import { useLocation } from "react-router-dom";
import VideoCard from "../../components/VideoCard";

export default function ChannelPage() {
  const location = useLocation();
  const userId = location?.state?.id;

  const [userDetails, setUserDetails] = useState({});
  const [userVideos, setUserVideos] = useState({});

  const fetchUserDetails = async () => {
    try {
      const res = await apiEndpoints.getUserChannelDetails(userId);

      const data = res.data?.data;

      setUserDetails(data);
      console.log("User Details: ", data);
    } catch (error) {
      console.error("Exxor fetching User Details: ", error);
    }
  };

  const fetchUserVideos = async () => {
    try {
      const res = await apiEndpoints.getUserChannelVideos(userId);

      const data = res.data?.data?.videos;

      setUserDetails(data);
      console.log("User Details: ", data);
    } catch (error) {
      console.error("Exxor fetching User Details: ", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserVideos();
  }, []);
  return <div>ChannelPage</div>;
}
