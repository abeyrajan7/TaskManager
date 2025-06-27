"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Modal, Button, Form } from "react-bootstrap";
import api from "@/utils/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
export default function TasksPage({ task, onUpdate }) {
  const handleClose = () => setShowModal(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    details: "",
    status: "pending",
    due_date: "",
  });

  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState(null);
  const [project, setProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    details: "",
    due_date: "",
  });
  const [dragTasks, setDragTasks] = useState(project?.tasks || []);
  const [isReordering, setIsReordering] = useState(false);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(dragTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setDragTasks(items);
    setIsReordering(true);
  };
  useEffect(() => {
    if (!projectId) {
      router.push("/projects");
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setProject(res.data);
      } catch (err) {
        console.error("Failed to load project", err);
        router.push("/projects");
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (project?.tasks) {
      setDragTasks([...project.tasks]);
    }
  }, [project]);

  const getDueDateClass = (dueDateStr) => {
    if (!dueDateStr || dueDateStr.startsWith("0006"))
      return "btn btn-secondary";

    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "btn btn-outline-secondary"; // past
    if (diffDays <= 2) return "btn btn-danger"; // urgent
    if (diffDays <= 5) return "btn btn-warning"; // moderate
    return "btn btn-success"; // safe
  };

  const handleSave = async () => {
    try {
      if (!selectedTask) {
        console.error("No task selected for editing");
        return;
      }

      await api.put(`/tasks/${selectedTask.id}/edit`, formData);
      setShowModal(false);

      // Immediately fetch updated project data
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data);
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/change-status`, { status: newStatus });
      setProject((prevProject) => ({
        ...prevProject,
        tasks: prevProject.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ),
      }));
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title || "",
      details: task.details || "",
      status: task.status || "pending",
      due_date: task.due_date || "",
    });
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleAddTask = async () => {
    try {
      const res = await api.post(`/projects/${projectId}/task`, newTask);

      setProject((prev) => ({
        ...prev,
        tasks: [...prev.tasks, res.data.task],
      }));

      setNewTask({ title: "", details: "", due_date: "" });
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  if (!project) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>{project.name}</h2>
      <p className="text-muted">{project.description || "No description."}</p>

      <h5 className="mt-4">Tasks</h5>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="list-group"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {dragTasks.length === 0 ? (
                <li className="list-group-item text-center text-muted py-3">
                  No tasks added to this project
                </li>
              ) : (
                dragTasks.map((task, index) => {
                  let bgClass = "bg-secondary text-white";
                  if (task.priority <= 1) bgClass = "bg-danger text-white";
                  else if (task.priority === 2)
                    bgClass = "bg-warning text-dark";
                  else if (task.priority === 3) bgClass = "bg-info text-dark";

                  return (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          className={`list-group-item d-flex justify-content-between align-items-center ${bgClass}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div>
                            <h6
                              className={`mb-1 ${
                                task.status === "completed"
                                  ? "text-decoration-line-through"
                                  : ""
                              }`}
                            >
                              {task.title}
                            </h6>
                            <small
                              className={`${
                                task.status === "completed"
                                  ? "text-decoration-line-through text-muted"
                                  : ""
                              }`}
                            >
                              {task.details || "No details"}
                            </small>
                          </div>

                          <div className="d-flex align-items-center gap-3 ms-3">
                            {task.due_date && (
                              <span
                                className={`px-3 py-1 rounded ${getDueDateClass(
                                  task.due_date
                                )} ${
                                  task.status === "completed"
                                    ? "text-decoration-line-through text-muted"
                                    : ""
                                }`}
                                style={{
                                  fontSize: "0.85rem",
                                  fontWeight: 500,
                                  whiteSpace: "nowrap",
                                  minWidth: "120px",
                                  textAlign: "center",
                                }}
                              >
                                {new Date(task.due_date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            )}

                            {/* Status Dropdown */}
                            <select
                              className="form-select form-select-sm"
                              style={{ width: "140px" }}
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(task.id, e.target.value)
                              }
                              title="Update Status"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>

                            {/* Edit Button */}
                            <button
                              className="btn btn-sm btn-light"
                              onClick={() => handleEdit(task)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            {/* Delete Button */}
                            <button
                                className="btn btn-sm btn-light"
                                onClick={() => {
                                  setTaskToDelete(task);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete"
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  );
                })
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {isReordering && (
        <div className="d-flex gap-3 mt-3">
          <Button
            variant="success"
            onClick={async () => {
              try {
                const reorderedTasks = dragTasks.map((task, index) => ({
                  ...task,
                  priority: index + 1, // assign new priority
                }));

                await api.put(`/projects/${projectId}/reorder`, {
                  tasks: reorderedTasks.map((t) => t.id),
                });

                setDragTasks(reorderedTasks); // update state with new priorities
                setProject((prev) => ({ ...prev, tasks: reorderedTasks }));
                setIsReordering(false);
              } catch (err) {
                console.error("Failed to save task order", err);
              }
            }}
          >
            Save Order
          </Button>

          <Button
            variant="outline-secondary"
            onClick={() => {
              setDragTasks(project.tasks);
              setIsReordering(false);
            }}
          >
            Cancel
          </Button>
        </div>
      )}
      <button
        className="btn btn-primary rounded-circle"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          fontSize: "28px",
          zIndex: 1000,
        }}
        onClick={() => setShowAddModal(true)}
        title="Add New Task"
      >
        +
      </button>

      {/* Add new task modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Project</Form.Label>
              <Form.Control value={project.name} disabled />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={newTask.title}
                onChange={(e) => {
                  setNewTask({ ...newTask, title: e.target.value });
                  setTitleError(""); // clear error on change
                }}
              />
              {titleError && (
                <div
                  className="text-danger mt-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  {titleError}
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                value={newTask.details}
                onChange={(e) =>
                  setNewTask({ ...newTask, details: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={newTask.due_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!newTask.title.trim()) {
                setTitleError("Task title is required.");
                return;
              }
              setTitleError(""); // clear error if valid
              handleAddTask();
            }}
          >
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Task ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await api.delete(
                  `/projects/${projectId}/tasks/${taskToDelete.id}`
                );
                setProject((prev) => ({
                  ...prev,
                  tasks: prev.tasks.filter((t) => t.id !== taskToDelete.id),
                }));
              } catch (err) {
                console.error("Failed to delete task:", err);
              } finally {
                setShowDeleteModal(false);
                setTaskToDelete(null);
              }
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Details</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
