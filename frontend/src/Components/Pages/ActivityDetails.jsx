import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getActivities } from "../../services/activity-service";
import Tasks from "./Tasks";
import { Spinner } from "react-bootstrap";

const ActivityDetails = () => {
  const { id_activity } = useParams();

  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async (id) => {
      const data = await getActivities(id);
      setActivity(data.data.message);
      setLoading(false);
    };

    fetchActivity(id_activity);
  }, []);

  if (loading) {
    return (
      <main className="content">
        <div className=" text-center ">
          <Spinner animation="border" role="output" variant="danger">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </main>
    );
  }

  return (
    <div className="container p-0 ">
      <h1 className="h3 mb-3 text-center ">Activity Details</h1>

      <h1 className="h3 mb-3 text-center ">
        [ {activity.category} ] : ( {activity.name} )
      </h1>
      <div className=" row ">
        <div className=" col ">
          <h1 className=" text-bg-primary ">
            {" "}
            From: {activity?.startDate?.substr(0, 10)}
          </h1>
          <h1 className=" text-bg-primary ">
            {" "}
            To: {activity?.endDate?.substr(0, 10)}
          </h1>
        </div>
        <div className=" col-auto ">
          <small className=" text-bg-primary "> Description: </small>
          <p className=" text-body-emphasis ">{activity.description}</p>
        </div>
      </div>
      <hr />
      <Tasks activity={activity} />
    </div>
  );
};

export default ActivityDetails;
