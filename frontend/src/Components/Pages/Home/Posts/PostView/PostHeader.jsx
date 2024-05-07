import { useContext } from "react";
import { UserContext } from "../../../../../../context/userContext";
import { isCreator, getReportPostEndpoint, validDate } from "../../utils/utils";
import PostDelete from "../ActionIcons/PostDelete";
import PostUpdate from "../ActionIcons/PostUpdate";
import moment from "moment/moment";
import { postTypes, reported } from "../../utils/const";
import axios from "axios";
import { Button } from "react-bootstrap";

export default function PostHeader({ postContent, fetchPosts }) {
  const { user } = useContext(UserContext);
  const reportPostEndpoint = getReportPostEndpoint(postContent.postType);

  const userReportThisPost = postContent.reports
    ? postContent.reports.includes(user?.id)
    : false;

  const imageUrl = (usrId, usr) => {
    if (usrId && usr?.profileImage) {
      return `${process.env.REACT_APP_BACKEND_URL}/user/${usrId}/profile`;
    } else {
      return "/assets/images/resources/user-pro-img.png";
    }
  };

  const handleReportClick = async () => {
    try {
      const ReportData = {
        userId: user.id,
      };

      await axios.post(`${reportPostEndpoint}/${postContent._id}`, ReportData);
      alert("report added");
    } catch (error) {
      // An error occurred while setting up the request
      console.error("Error setting up the request:", error.message);
      alert("Error setting up the request: " + error.message);
    }
  };

  return (
    <>
      <div className="post_topbar">
        <div className="usy-dt">
          {/* <img
          src={imageUrl(user.id, user)}
          alt={user.name}
          style={{ width: '55px', height: '55px', borderRadius: '50%' }}
        /> */}
          <div className="usy-name">
            <h3>{postContent.creator?.name}</h3>
            <span>
              <img src="/assets/images/clock.png" alt="" />
              Published in: {moment(postContent.DatePublication).format("lll")}
            </span>
          </div>
        </div>
        <div className="ed-opts">
          {!isCreator(user.id, postContent.creator?._id) && (
            <Button
              size="sm"
              onClick={() => handleReportClick(postContent._id)}
              variant={userReportThisPost ? reported.NO : reported.YES}
            >
              Alert
            </Button>
          )}
          {isCreator(user.id, postContent.creator?._id) && (
            <PostDelete postContent={postContent} fetchPosts={fetchPosts} />
          )}
          {isCreator(user.id, postContent.creator?._id) &&
            (postContent?.postType === postTypes.TEXT ||
              validDate(postContent.DateDebut, 4)) && (
              <PostUpdate postContent={postContent} />
            )}
        </div>
      </div>
      <div className="epi-sec">
        <ul className="descp"></ul>
      </div>
    </>
  );
}
