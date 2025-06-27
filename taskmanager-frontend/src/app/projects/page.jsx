"use client";
import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useRouter } from "next/router";
import { Modal, Button, Form } from "react-bootstrap";
import { useUser } from "../../Context/UserContext";

export default function page() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useUser();
  const [projectNameError, setProjectNameError] = useState("");
  const [projectDeadlineError, setProjectDeadlineError] = useState("");
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    deadline: "",
  });
  const [editProject, setEditProject] = useState(null);

  const handleCreateProject = async () => {
    try {
      const res = await api.post("/projects", {
        ...newProject,
        tasks: [], // Can be modified to allow first task entry
      });
      setProjects([...projects, res.data.project]);
      setShowAddModal(false);
      setNewProject({ name: "", description: "", deadline: "" });
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
  };

  const handleUpdateProject = async () => {
    if (!editProject?.name.trim()) {
      setProjectNameError("Project name is required.");
      return;
    } else {
      setProjectNameError("");
    }

    try {
      await api.put(`/projects/${editProject.id}`, {
        name: editProject.name,
        description: editProject.description,
      });

      // Optionally: refresh projects list or close modal
      setEditProject(null);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const [projects, setProjects] = useState();
  const router = useRouter;
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.projects);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchProjects();
  }, []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Your Projects</h2>

      <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center ">
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <div className="col" key={project.id}>
              <div
                className="card h-100"
                style={{ maxWidth: "320px", margin: "0 auto" }}
              >
                <div className="card-body">
                  <h5 className="card-title">{project.name}</h5>
                  <p className="card-text text-muted">
                    {project.description || (
                      <span className="text-muted">No Description</span>
                    )}
                  </p>
                  <p className="mb-2">
                    <small className="text-body-secondary">
                      {project.tasks.length}{" "}
                      {project.tasks.length === 1 ? "task" : "tasks"}
                    </small>
                  </p>
                  {/* Link to view project details */}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <a
                      href={`/tasks?projectId=${project.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      View Tasks
                    </a>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-light"
                        onClick={() => handleEdit(project)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger float-end"
                        onClick={() => {
                          setProjectToDelete(project);
                          setShowDeleteModal(true);
                        }}
                        title="Delete Project"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col text-center">
            <p className="text-muted">No projects found.</p>
          </div>
        )}
        {user && (
          <button
            className="btn btn-primary rounded-circle"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              width: "60px",
              height: "60px",
              fontSize: "30px",
            }}
            onClick={() => setShowAddModal(true)}
          >
            +
          </button>
        )}
        {/* delete project */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete{" "}
            <strong>{projectToDelete?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={deleting || !projectToDelete}
              onClick={async () => {
                if (!projectToDelete) return;
                setDeleting(true);
                try {
                  await api.delete(`/projects/${projectToDelete.id}`);
                  setProjects((prev) =>
                    prev.filter((p) => p.id !== projectToDelete.id)
                  );
                  setShowDeleteModal(false);
                  setProjectToDelete(null); // clear it after deletion
                } catch (err) {
                  console.error("Failed to delete project:", err);
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add new project modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={newProject.name}
                  onChange={(e) => {
                    setNewProject({ ...newProject, name: e.target.value });
                    setProjectNameError("");
                  }}
                />
                {projectNameError && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {projectNameError}
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => {
                    setNewProject({ ...newProject, deadline: e.target.value });
                    setProjectDeadlineError("");
                  }}
                />
                {projectDeadlineError && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {projectDeadlineError}
                  </div>
                )}
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
                let valid = true;

                if (!newProject.name.trim()) {
                  setProjectNameError("Project name is required.");
                  valid = false;
                } else {
                  setProjectNameError("");
                }

                if (!newProject.deadline) {
                  setProjectDeadlineError("Deadline is required.");
                  valid = false;
                } else {
                  setProjectDeadlineError("");
                }

                if (!valid) return;

                handleCreateProject();
              }}
            >
              Create
            </Button>
          </Modal.Footer>
        </Modal>

        {/* edit project */}
        <Modal show={!!editProject} onHide={() => setEditProject(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={editProject?.name || ""}
                  onChange={(e) => {
                    setEditProject({ ...editProject, name: e.target.value });
                    setProjectNameError("");
                  }}
                />
                {projectNameError && (
                  <div
                    className="text-danger mt-1"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {projectNameError}
                  </div>
                )}
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  value={editProject?.description || ""}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditProject(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateProject}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
