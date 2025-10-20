import React, { useState, useEffect } from "react";

export default function App() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeJobId, setActiveJobId] = useState(null);

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requirements: {
      render: false,
      orthographic: false,
      drawing: false,
      step: false,
      prototype: false,
      video: false,
      brochure: false,
    },
    priority: "Not specified",
    status: "Not Started",
    dateSubmitted: "",
    dateComplete: "",
    image: null,
    comments: "",
  });

  // Save jobs to local storage whenever updated
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  // Color mappings
  const statusColors = {
    "Not Started": "bg-red-600",
    "In Progress": "bg-yellow-500",
    Completed: "bg-green-600",
  };

  const priorityColors = {
    "Ultra High": "bg-red-800",
    "Very High": "bg-red-600",
    High: "bg-orange-500",
    Moderate: "bg-yellow-400",
    Low: "bg-green-500",
    "Not specified": "bg-blue-500",
  };

  // Add a new job
  const addJob = () => {
    if (!newJob.title.trim()) return alert("Please enter a job title.");
    const job = {
      ...newJob,
      id: Date.now(),
      dateSubmitted: new Date().toISOString().split("T")[0],
    };
    setJobs([...jobs, job]);
    setNewJob({
      title: "",
      description: "",
      requirements: {
        render: false,
        orthographic: false,
        drawing: false,
        step: false,
        prototype: false,
        video: false,
        brochure: false,
      },
      priority: "Not specified",
      status: "Not Started",
      dateSubmitted: "",
      dateComplete: "",
      image: null,
      comments: "",
    });
  };

  // Update a job field
  const updateJob = (id, updates) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      )
    );
  };

  // Delete job
  const deleteJob = (id) => {
    if (window.confirm("Delete this job?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  // Calculate summary
  const totalJobs = jobs.length;
  const notStarted = jobs.filter((j) => j.status === "Not Started").length;
  const inProgress = jobs.filter((j) => j.status === "In Progress").length;
  const completed = jobs.filter((j) => j.status === "Completed").length;
  const processed = totalJobs;
  const progressPercent =
    totalJobs > 0 ? Math.round((completed / totalJobs) * 100) : 0;

  // Turnaround times
  const turnaroundTimes = jobs
    .filter((j) => j.dateComplete)
    .map(
      (j) =>
        (new Date(j.dateComplete) - new Date(j.dateSubmitted)) /
        (1000 * 60 * 60 * 24)
    );
  const avgTurnaround =
    turnaroundTimes.length > 0
      ? (turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length).toFixed(1)
      : 0;

  const activeJob = jobs.find((j) => j.id === activeJobId);

  // Job component
  const JobCard = ({ job }) => (
    <div
      className={`p-3 rounded-2xl shadow-md mb-3 ${statusColors[job.status]} text-black`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">{job.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-white text-sm ${priorityColors[job.priority]}`}
        >
          {job.priority}
        </span>
      </div>
      <p className="text-sm mb-2">{job.description}</p>

      {job.image && (
        <img
          src={job.image}
          alt="Preview"
          className="w-full rounded-xl mb-2"
        />
      )}

      <div className="text-sm mb-2">
        <p>Date Submitted: {job.dateSubmitted}</p>
        {job.dateComplete && <p>Date Complete: {job.dateComplete}</p>}
      </div>

      <label className="block mb-1 text-sm">Status:</label>
      <select
        value={job.status}
        onChange={(e) => updateJob(job.id, { status: e.target.value })}
        className="w-full mb-2 rounded p-1"
      >
        <option>Not Started</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>

      <label className="block mb-1 text-sm">Priority:</label>
      <select
        value={job.priority}
        onChange={(e) => updateJob(job.id, { priority: e.target.value })}
        className="w-full mb-2 rounded p-1"
      >
        <option>Ultra High</option>
        <option>Very High</option>
        <option>High</option>
        <option>Moderate</option>
        <option>Low</option>
        <option>Not specified</option>
      </select>

      <textarea
        value={job.comments}
        onChange={(e) => updateJob(job.id, { comments: e.target.value })}
        placeholder="Add comments..."
        className="w-full rounded p-2 text-sm mb-2"
      />

      <div className="flex justify-between">
        <button
          onClick={() => setActiveJobId(job.id)}
          className="bg-blue-700 text-white px-3 py-1 rounded-lg"
        >
          Set Active
        </button>
        <button
          onClick={() => deleteJob(job.id)}
          className="bg-gray-800 text-white px-3 py-1 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* Summary Bar */}
      <div className="bg-gray-800 p-4 rounded-xl mb-4">
        <h1 className="text-2xl font-bold mb-2">Job Tracker Dashboard</h1>
        {activeJob && (
          <p className="text-yellow-300 mb-1">
            Active Job: <strong>{activeJob.title}</strong>
          </p>
        )}
        <p>
          Total: {totalJobs} | Not Started: {notStarted} | In Progress:{" "}
          {inProgress} | Completed: {completed} | Processed: {processed}
        </p>
        <p>Overall Progress: {progressPercent}% | Avg Turnaround: {avgTurnaround} days</p>
      </div>

      {/* Add Job */}
      <div className="bg-gray-800 p-4 rounded-xl mb-4">
        <h2 className="font-bold mb-2">Add New Job</h2>
        <input
          placeholder="Job title"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
          className="w-full p-2 rounded mb-2 text-black"
        />
        <textarea
          placeholder="Job description"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          className="w-full p-2 rounded mb-2 text-black"
        />

        <label className="block mb-1 text-sm">Upload Preview Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewJob({
              ...newJob,
              image: URL.createObjectURL(e.target.files[0]),
            })
          }
          className="mb-2"
        />

        <label className="block mb-1 text-sm">Priority:</label>
        <select
          value={newJob.priority}
          onChange={(e) => setNewJob({ ...newJob, priority: e.target.value })}
          className="w-full mb-2 rounded p-1 text-black"
        >
          <option>Ultra High</option>
          <option>Very High</option>
          <option>High</option>
          <option>Moderate</option>
          <option>Low</option>
          <option>Not specified</option>
        </select>

        <button
          onClick={addJob}
          className="bg-green-600 text-white px-3 py-2 rounded-lg"
        >
          Add Job
        </button>
      </div>

      {/* Job Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Not Started", "In Progress", "Completed"].map((status) => (
          <div key={status}>
            <h3 className="font-bold text-xl mb-2">{status}</h3>
            {jobs
              .filter((j) => j.status === status)
              .map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
