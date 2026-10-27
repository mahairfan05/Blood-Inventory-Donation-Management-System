
import { useState } from 'react'

const initialRequests = [
  {
    id: 1,
    patient: 'Ahmed Khan',
    hospital: 'City Hospital',
    bloodGroup: 'B+',
    component: 'Whole Blood',
    units: 2,
    urgency: 'Urgent',
    requiredDate: '',
    status: 'Pending',
  },
  {
    id: 2,
    patient: 'Sara Ali',
    hospital: 'General Hospital',
    bloodGroup: 'O-',
    component: 'Red Blood Cells',
    units: 1,
    urgency: 'Normal',
    requiredDate: '',
    status: 'Approved',
  },
  {
    id: 3,
    patient: 'Usman Tariq',
    hospital: 'Central Medical Center',
    bloodGroup: 'A+',
    component: 'Platelets',
    units: 3,
    urgency: 'Emergency',
    requiredDate: '',
    status: 'Pending',
  },
]

function App() {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    patient: '',
    hospital: '',
    bloodGroup: 'A+',
    component: 'Whole Blood',
    units: 1,
    urgency: 'Normal',
    requiredDate: '',
  })

  // Search requests and apply the selected status filter
  const filteredRequests = requests.filter((request) => {
    const searchText = search.toLowerCase()

    const matchesSearch =
      request.patient.toLowerCase().includes(searchText) ||
      request.hospital.toLowerCase().includes(searchText) ||
      request.bloodGroup.toLowerCase().includes(searchText)

    const matchesFilter =
      filter === 'All' || request.status === filter

    return matchesSearch && matchesFilter
  })

  // Dashboard statistics
  const pendingCount = requests.filter(
    (request) => request.status === 'Pending'
  ).length

  const approvedCount = requests.filter(
    (request) => request.status === 'Approved'
  ).length

  const issuedCount = requests.filter(
    (request) => request.status === 'Issued'
  ).length

  // Update a request's status
  function updateStatus(id, newStatus) {
    setRequests((previousRequests) =>
      previousRequests.map((request) =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    )
  }

  // Update form values as the user types
  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  // Submit a new blood request
  function handleSubmit(event) {
    event.preventDefault()

    const newRequest = {
      id: Date.now(),
      ...formData,
      units: Number(formData.units),
      status: 'Pending',
    }

    setRequests((previousRequests) => [
      newRequest,
      ...previousRequests,
    ])

    setFormData({
      patient: '',
      hospital: '',
      bloodGroup: 'A+',
      component: 'Whole Blood',
      units: 1,
      urgency: 'Normal',
      requiredDate: '',
    })

    setShowForm(false)
    setFilter('All')
    setSearch('')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-red-700">
              BloodLink
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Blood Donation Management System
            </p>
          </div>

          <div className="hidden text-right sm:block">
            <p className="font-semibold">Blood Bank Staff</p>
            <p className="text-sm text-slate-500">
              Requests & Issuing
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Blood Requests
            </h2>
            <p className="mt-1 text-slate-500">
              Manage patient requests, approvals, and blood issuing.
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            + New Blood Request
          </button>
        </div>

        {/* New request form */}
        {showForm && (
          <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold">
                  Register Blood Request
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the patient's and blood requirement details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Patient name */}
                <div>
                  <label
                    htmlFor="patient"
                    className="mb-2 block text-sm font-medium"
                  >
                    Patient Name
                  </label>
                  <input
                    id="patient"
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    placeholder="Enter patient name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Hospital */}
                <div>
                  <label
                    htmlFor="hospital"
                    className="mb-2 block text-sm font-medium"
                  >
                    Hospital / Medical Center
                  </label>
                  <input
                    id="hospital"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    placeholder="Enter hospital name"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Blood group */}
                <div>
                  <label
                    htmlFor="bloodGroup"
                    className="mb-2 block text-sm font-medium"
                  >
                    Blood Group
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >
                    {[
                      'A+',
                      'A-',
                      'B+',
                      'B-',
                      'AB+',
                      'AB-',
                      'O+',
                      'O-',
                    ].map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Component */}
                <div>
                  <label
                    htmlFor="component"
                    className="mb-2 block text-sm font-medium"
                  >
                    Blood Component
                  </label>
                  <select
                    id="component"
                    name="component"
                    value={formData.component}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >
                    <option>Whole Blood</option>
                    <option>Red Blood Cells</option>
                    <option>Plasma</option>
                    <option>Platelets</option>
                  </select>
                </div>

                {/* Units */}
                <div>
                  <label
                    htmlFor="units"
                    className="mb-2 block text-sm font-medium"
                  >
                    Units Required
                  </label>
                  <input
                    id="units"
                    name="units"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.units}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label
                    htmlFor="urgency"
                    className="mb-2 block text-sm font-medium"
                  >
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  >
                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Emergency</option>
                  </select>
                </div>

                {/* Required date */}
                <div>
                  <label
                    htmlFor="requiredDate"
                    className="mb-2 block text-sm font-medium"
                  >
                    Required Date
                  </label>
                  <input
                    id="requiredDate"
                    name="requiredDate"
                    type="date"
                    min={new Date().toLocaleDateString('en-CA')}
                    value={formData.requiredDate}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                >
                  Submit Request
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Requests"
            value={requests.length}
            description="All registered requests"
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            description="Awaiting review"
          />
          <StatCard
            title="Approved"
            value={approvedCount}
            description="Ready for issuing"
          />
          <StatCard
            title="Issued"
            value={issuedCount}
            description="Requests fulfilled"
          />
        </section>

        {/* Requests table */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-lg font-bold">
                Request Records
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Search and manage blood requests.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Search patient, hospital, group..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-red-500 sm:w-72"
              />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none focus:border-red-500"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Approved</option>
                <option>Issued</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Patient</th>
                  <th className="px-5 py-4 font-semibold">Hospital</th>
                  <th className="px-5 py-4 font-semibold">Blood Group</th>
                  <th className="px-5 py-4 font-semibold">Component</th>
                  <th className="px-5 py-4 font-semibold">Units</th>
                  <th className="px-5 py-4 font-semibold">Urgency</th>
                  <th className="px-5 py-4 font-semibold">Required Date</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-semibold">
                      {request.patient}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {request.hospital}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-red-50 px-3 py-1 font-bold text-red-700">
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {request.component}
                    </td>
                    <td className="px-5 py-4">{request.units}</td>
                    <td className="px-5 py-4">
                      <UrgencyBadge urgency={request.urgency} />
                    </td>
                    <td className="px-5 py-4">
                      {request.requiredDate || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {request.status === 'Pending' && (
                          <button
                            onClick={() =>
                              updateStatus(request.id, 'Approved')
                            }
                            className="rounded-md bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100"
                          >
                            Approve
                          </button>
                        )}

                        {request.status === 'Approved' && (
                          <button
                            onClick={() =>
                              updateStatus(request.id, 'Issued')
                            }
                            className="rounded-md bg-green-50 px-3 py-2 font-medium text-green-700 hover:bg-green-100"
                          >
                            Mark Issued
                          </button>
                        )}

                        {request.status === 'Issued' && (
                          <span className="px-2 py-2 text-slate-400">
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRequests.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No requests found. Try changing your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-500">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </section>

        <p className="mt-5 text-xs text-slate-400">
          Demo version: request records are currently stored in React state
          and will reset when the page is refreshed.
        </p>
      </main>
    </div>
  )
}

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700',
    Approved: 'bg-blue-50 text-blue-700',
    Issued: 'bg-green-50 text-green-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}

function UrgencyBadge({ urgency }) {
  const styles = {
    Normal: 'bg-slate-100 text-slate-600',
    Urgent: 'bg-orange-50 text-orange-700',
    Emergency: 'bg-red-50 text-red-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[urgency] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {urgency}
    </span>
  )
}

export default App
