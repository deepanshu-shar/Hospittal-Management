import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import EntityFormModal from '../../components/EntityFormModal';
import { apiClient } from '../../api/client';
import { useResource } from '../../hooks/useResource';

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Cancelled', value: 'cancelled' }
];

const formatDate = (isoString) => (isoString ? new Date(isoString).toLocaleDateString() : '—');
const formatDateTimeLocal = (isoString) => {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const BillingPage = () => {
  const { items, loading, error, setParams, createItem, updateItem, deleteItem } = useResource('billing');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [patientsResponse, appointmentsResponse] = await Promise.all([
          apiClient.get('/v1/patients'),
          apiClient.get('/v1/appointments')
        ]);
        setPatients(patientsResponse.data.data || []);
        setAppointments(appointmentsResponse.data.data || []);
      } catch (err) {
        console.error('Failed to load billing lookups', err);
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
    if (!window.confirm(`Delete invoice ${record.invoiceNumber}?`)) {
      return;
    }
    try {
      await deleteItem(record.id);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete invoice.';
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
      appointmentId: values.appointmentId ? Number(values.appointmentId) : null,
      patientId: Number(values.patientId),
      amount: Number(values.amount),
      dueDate: values.dueDate,
      paidAt: values.paidAt ? new Date(values.paidAt).toISOString() : null
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
      setFormError(err.response?.data?.message || 'Unable to save invoice.');
    }
  };

  const modalFields = useMemo(
    () => [
      {
        name: 'invoiceNumber',
        label: 'Invoice #',
        required: true
      },
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
        name: 'appointmentId',
        label: 'Appointment',
        type: 'select',
        options: [
          { label: 'None', value: '' },
          ...appointments.map((appointment) => ({
            label: `#${appointment.id} - ${new Date(appointment.scheduledAt).toLocaleString()}`,
            value: String(appointment.id)
          }))
        ]
      },
      {
        name: 'amount',
        label: 'Amount ($)',
        type: 'number',
        step: 0.01,
        min: 0,
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
        name: 'dueDate',
        label: 'Due Date',
        type: 'date',
        required: true
      },
      {
        name: 'paidAt',
        label: 'Paid Date',
        type: 'datetime-local'
      },
      {
        name: 'paymentMethod',
        label: 'Payment Method'
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea'
      }
    ],
    [patients, appointments]
  );

  const columns = useMemo(
    () => [
      { key: 'invoiceNumber', label: 'Invoice #' },
      {
        key: 'patient',
        label: 'Patient',
        render: (_, row) => `${row.patientFirstName} ${row.patientLastName}`
      },
      {
        key: 'amount',
        label: 'Amount',
        render: (value) => `$${Number(value).toFixed(2)}`
      },
      {
        key: 'status',
        label: 'Status',
        render: (value) => value?.toUpperCase()
      },
      {
        key: 'dueDate',
        label: 'Due Date',
        render: (value) => formatDate(value)
      },
      {
        key: 'paidAt',
        label: 'Paid Date',
        render: (value) => (value ? new Date(value).toLocaleString() : '—')
      }
    ],
    []
  );

  const initialValues = editingRecord
    ? {
        ...editingRecord,
        patientId: String(editingRecord.patientId),
        appointmentId: editingRecord.appointmentId ? String(editingRecord.appointmentId) : '',
        amount: editingRecord.amount,
        status: editingRecord.status || 'pending',
        dueDate: editingRecord.dueDate ? editingRecord.dueDate.slice(0, 10) : '',
        paidAt: formatDateTimeLocal(editingRecord.paidAt)
      }
    : {
        invoiceNumber: '',
        patientId: patients[0] ? String(patients[0].id) : '',
        appointmentId: '',
        amount: 0,
        status: 'pending',
        dueDate: '',
        paidAt: '',
        paymentMethod: '',
        notes: ''
      };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Billing</h1>
          <p className="text-sm text-slate-500">Generate invoices and track payment statuses.</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-secondary"
        >
          Add Invoice
        </button>
      </header>

      <div className="space-y-4">
        <DataTable
          title="Billing Records"
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
          emptyState={loading ? 'Loading billing records...' : 'No billing records found.'}
        />
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}
      </div>

      {isModalOpen ? (
        <EntityFormModal
          isOpen={isModalOpen}
          title={editingRecord ? 'Edit Invoice' : 'Add Invoice'}
          fields={modalFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onClose={handleModalClose}
          submitLabel={editingRecord ? 'Update Invoice' : 'Create Invoice'}
        />
      ) : null}

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
      ) : null}
    </div>
  );
};

export default BillingPage;
