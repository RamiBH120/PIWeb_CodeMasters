import { Button, Modal, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const TaskDelete = ({ upTask, refresh, show, handleClose, task, deleting }) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Row>
          <Modal.Title as={Col}>
            <h1 className=" text-white ">Delete task</h1>
          </Modal.Title>
          <Button
            as={Col}
            md="3"
            variant="secondary"
            onClick={handleClose}
            style={{
              backgroundColor: "#fff",
              color: "#e44d3a",
              cursor: "pointer",
            }}
          >
            Close
          </Button>
        </Row>
      </Modal.Header>

      <Modal.Body>
        <div className=" text-danger text-center ">
          Are you sure you want to delete this task
        </div>
        <div className=" text-danger text-center ">({task.title})</div>
      </Modal.Body>
      <Modal.Footer>
        {deleting === true ? (
          <Button
            style={{ backgroundColor: "#e44d3a" }}
            onClick={() => {
              upTask(task._id, task);
              refresh();
              handleClose();
            }}
          >
            Archive
          </Button>
        ) : (
          <Button
            style={{ backgroundColor: "#e44d3a" }}
            onClick={() => {
              upTask(task._id);
              handleClose();
            }}
          >
            Delete
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

TaskDelete.propTypes = {
  upTask: PropTypes.func,
  refresh: PropTypes.func,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  task: PropTypes.object,
  deleting: PropTypes.bool,
};

export default TaskDelete;
