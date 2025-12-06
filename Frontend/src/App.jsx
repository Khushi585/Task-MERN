import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import 'bootstrap/dist/css/bootstrap.min.css'
import DateFormat from './util/DateFormat'

const App = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: ''
    }
  })

  const [tasks, setTask] = useState([])
  const [editingTask, setEditingTask] = useState(null)

  async function showApi() {
    await axios
      .get(`${import.meta.env.VITE_API_URL}/tasks`)
      .then((res) => {
        setTask(res.data.records)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    showApi()
  }, [])

  async function submitTask(data) {
    try {
      if (editingTask) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/tasks/${editingTask._id}`,
          data
        )
        alert('Task updated successfully ✅')
        setEditingTask(null)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, data)
        alert('Task added successfully ✅')
      }

      reset({
        title: '',
        description: '',
        date: ''
      })
      showApi()
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    }
  }

  async function deleteTask(id) {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`)
      alert('Task deleted successfully 🗑️')
      showApi()
    } catch (err) {
      console.log(err)
      alert('Delete failed')
    }
  }

  function handleEdit(task) {
    setEditingTask(task)
    setValue('title', task.title || '')
    setValue('description', task.description || '')
    setValue(
      'date',
      task.date ? new Date(task.date).toISOString().slice(0, 10) : ''
    )
  }

  function cancelEdit() {
    setEditingTask(null)
    reset({
      title: '',
      description: '',
      date: ''
    })
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Top heading + stats */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-2">Task Manager</h1>
          <p className="text-muted mb-2">
            Organize your day with clean and simple tasks ✅
          </p>
          <span className="badge rounded-pill text-bg-primary px-3 py-2">
            Total Tasks: {tasks.length}
          </span>
        </div>

        <div className="row g-4">
          {/* Form Section */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-header bg-primary bg-gradient text-white rounded-top-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">
                      {editingTask ? 'Update Task' : 'Add New Task'}
                    </h5>
                    <small className="opacity-75">
                      {editingTask
                        ? 'Editing existing task'
                        : 'Fill the details to create a new task'}
                    </small>
                  </div>
                  {editingTask && (
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(submitTask)} noValidate>
                  {/* Title */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm rounded-3 ${errors.title ? 'is-invalid' : ''
                        }`}
                      placeholder="Enter task title"
                      {...register('title', {
                        required: 'Title is required',
                        minLength: {
                          value: 3,
                          message: 'Title must be at least 3 characters'
                        }
                      })}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">
                        {errors.title.message}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      rows="3"
                      className={`form-control form-control-sm rounded-3 ${errors.description ? 'is-invalid' : ''
                        }`}
                      placeholder="Write a short description..."
                      {...register('description', {
                        required: 'Description is required',
                        minLength: {
                          value: 5,
                          message:
                            'Description must be at least 5 characters'
                        }
                      })}
                    ></textarea>
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description.message}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Due Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control form-control-sm rounded-3 ${errors.date ? 'is-invalid' : ''
                        }`}
                      {...register('date', {
                        required: 'Date is required'
                      })}
                    />
                    {errors.date && (
                      <div className="invalid-feedback">
                        {errors.date.message}
                      </div>
                    )}
                  </div>

                  {/* Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-3 py-2 fw-semibold"
                  >
                    {editingTask ? 'Save Changes' : 'Add Task'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Task Cards */}
          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-semibold mb-0">Your Tasks</h4>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center text-muted py-5 border rounded-4 bg-white shadow-sm">
                <div style={{ fontSize: '2.5rem' }}>📝</div>
                <p className="mt-3 mb-1 fw-medium">
                  No tasks yet. Add your first task!
                </p>
                <small>Start by filling the form on the left.</small>
              </div>
            ) : (
              <div className="row g-3">
                {tasks.map((task) => (
                  <div className="col-md-6" key={task._id}>
                    <div className="card border-0 shadow-sm rounded-4 task-card h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title fw-bold mb-0">
                            {task.title}
                          </h5>
                          <span className="badge rounded-pill text-bg-light">
                            {DateFormat(task.date)}
                          </span>
                        </div>

                        <p className="card-text text-muted small mb-3">
                          {task.description}
                        </p>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-2 small text-secondary">
                            <span>
                              <strong>Updated:</strong>{' '}
                              {DateFormat(task.updatedAt)}
                            </span>
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary flex-fill"
                              onClick={() => handleEdit(task)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger flex-fill"
                              onClick={() => deleteTask(task._id)}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
