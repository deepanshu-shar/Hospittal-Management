import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import EntityFormModal from '../../components/EntityFormModal';
import { apiClient } from '../../api/client';
import { useResource } from '../../hooks/useResource';

const statusOptions = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
];

const formatDateTimeLocal = (isoString) => {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  return formatted;
};

const AppointmentsPage = () => {
  const { items, loading, error, setParams, createItem, updateItem, deleteItem } = useResource('appointments');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [patientsResponse, doctorsResponse] = await Promise.all([
          apiClient.get('/v1/patients'),
          apiClient.get('/v1/doctors')
        ]);
        setPatients(patientsResponse.data.data || []);
        setDoctors(doctorsResponse.data.data || []);
      } catch (err) {
        console.error('Failed to load lookups', err);
      }
    };

    loadLookups();
  }, []);

  useEffect(() => {
    setParams((prev) => {
      const next = { ...prev };
      if (search) {
        next.q = search;
      } else {
        delete next.q;
      }
      return next;
    });
  }, [search, setParams]);

  useEffect(() => {
    setParams((prev) => {
      const next = { ...prev };
      if (statusFilter === 'all') {
        delete next.status;
      } else {
        next.status = statusFilter;
      }
      return next;
    });
  }, [statusFilter, setParams]);

  const handleCreateClick = () => {
    setEditingRecord(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (record) => {
    if (!window.confirm(`Delete appointment #${record.id}?`)) {
      return;
    }
    try {
      await deleteItem(record.id);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete appointment.';
      alert(message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      patientId: Number(values.patientId),
      doctorId: Number(values.doctorId),
      scheduledAt: new Date(values.scheduledAt).toISOString()
    };
    try {
      if (editingRecord) {
        await updateItem(editingRecord.id, payload);
      } else {
        await createItem(payload);
      }
      setIsModalOpen(false);
      setEditingRecord(null);
      setFormError(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to save appointment.');
    }
  };

  const modalFields = useMemo(
    () => [
      {
        name: 'patientId',
        label: 'Patient',
        type: 'select',
        required: true,
        options: patients.map((patient) => ({
          label: `${patient.firstName} ${patient.lastName}`,
          value: String(patient.id)
        }))
      },
      {
        name: 'doctorId',
        label: 'Doctor',
        type: 'select',
        required: true,
        options: doctors.map((doctor) => ({
          label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
          value: String(doctor.id)
        }))
      },
      {
        name: 'scheduledAt',
        label: 'Scheduled Time',
        type: 'datetime-local',
        required: true
      },
      {
        name: 'reason',
        label: 'Reason',
        type: 'textarea',
        required: true
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: statusOptions
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea'
      }
    ],
    [patients, doctors]
  );

  const columns = useMemo(
    () => [
      { key: 'id', label: '#ID' },
      {
        key: 'patient',
        label: 'Patient',
        render: (_, row) => `${row.patientFirstName} ${row.patientLastName}`
      },
      {
        key: 'doctor',
        label: 'Doctor',
        render: (_, row) => `Dr. ${row.doctorFirstName} ${row.doctorLastName}`
      },
      {
        key: 'scheduledAt',
        label: 'Scheduled',
        render: (value) => (value ? new Date(value).toLocaleString() : '—')
      },
      { key: 'status', label: 'Status', render: (value) => value?.toUpperCase() },
      {
        key: 'reason',
        label: 'Reason',
        render: (value) => value || '—'
      }
    ],
    []
  );

  const initialValues = editingRecord
    ? {
        ...editingRecord,
        patientId: String(editingRecord.patientId),
        doctorId: String(editingRecord.doctorId),
        scheduledAt: formatDateTimeLocal(editingRecord.scheduledAt),
        status: editingRecord.status || 'scheduled'
      }
    : {
        patientId: patients[0] ? String(patients[0].id) : '',
        doctorId: doctors[0] ? String(doctors[0].id) : '',
        scheduledAt: '',
        reason: '',
        status: 'scheduled',
        notes: ''
      };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Appointments</h1>
          <p className="text-sm text-slate-500">Schedule visits and track appointment statuses.</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-secondary"
        >
          Add Appointment
        </button>
      </header>

      <div className="space-y-4">
        <DataTable
          title="Appointment Calendar"
          columns={columns}
          rows={items}
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              name: 'status',
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { label: 'All', value: 'all' },
                ...statusOptions
              ]
            }
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyState={loading ? 'Loading appointments...' : 'No appointments found.'}
        />
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}
      </div>

      {isModalOpen ? (
        <EntityFormModal
          isOpen={isModalOpen}
          title={editingRecord ? 'Edit Appointment' : 'Add Appointment'}
          fields={modalFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onClose={handleModalClose}
          submitLabel={editingRecord ? 'Update Appointment' : 'Create Appointment'}
        />
      ) : null}

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
      ) : null}
    </div>
  );
};

export default AppointmentsPage;
