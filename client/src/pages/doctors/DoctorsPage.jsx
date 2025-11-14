import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import EntityFormModal from '../../components/EntityFormModal';
import { apiClient } from '../../api/client';
import { useResource } from '../../hooks/useResource';

const DoctorsPage = () => {
  const { items, loading, error, setParams, createItem, updateItem, deleteItem } = useResource('doctors');
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const { data } = await apiClient.get('/v1/departments');
        setDepartments(data.data || []);
      } catch (err) {
        console.error('Failed to load departments', err);
      }
    };

    loadDepartments();
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
      if (departmentFilter === 'all') {
        delete next.departmentId;
      } else {
        next.departmentId = departmentFilter;
      }
      return next;
    });
  }, [departmentFilter, setParams]);

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
    if (!window.confirm(`Delete Dr. ${record.firstName} ${record.lastName}?`)) {
      return;
    }
    try {
      await deleteItem(record.id);
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete doctor.';
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
      departmentId: values.departmentId ? Number(values.departmentId) : null
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
      setFormError(err.response?.data?.message || 'Unable to save doctor.');
    }
  };

  const modalFields = useMemo(
    () => [
      {
        name: 'firstName',
        label: 'First Name',
        required: true
      },
      {
        name: 'lastName',
        label: 'Last Name',
        required: true
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true
      },
      {
        name: 'phone',
        label: 'Phone',
        required: true
      },
      {
        name: 'specialization',
        label: 'Specialization',
        required: true
      },
      {
        name: 'departmentId',
        label: 'Department',
        type: 'select',
        options: [
          { label: 'Unassigned', value: '' },
          ...departments.map((dept) => ({ label: dept.name, value: String(dept.id) }))
        ]
      }
    ],
    [departments]
  );

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        render: (_, row) => `Dr. ${row.firstName} ${row.lastName}`
      },
      { key: 'specialization', label: 'Specialization' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      {
        key: 'departmentName',
        label: 'Department',
        render: (value) => value || 'Unassigned'
      }
    ],
    []
  );

  const initialValues = editingRecord
    ? {
        ...editingRecord,
        departmentId: editingRecord.departmentId ? String(editingRecord.departmentId) : ''
      }
    : {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        departmentId: ''
      };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Doctors</h1>
          <p className="text-sm text-slate-500">Track physicians, specialties, and departmental assignments.</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-secondary"
        >
          Add Doctor
        </button>
      </header>

      <div className="space-y-4">
        <DataTable
          title="Doctor Directory"
          columns={columns}
          rows={items}
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              name: 'department',
              label: 'Department',
              value: departmentFilter,
              onChange: setDepartmentFilter,
              options: [
                { label: 'All', value: 'all' },
                ...departments.map((dept) => ({ label: dept.name, value: String(dept.id) }))
              ]
            }
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyState={loading ? 'Loading doctors...' : 'No doctors found.'}
        />
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}
      </div>

      {isModalOpen ? (
        <EntityFormModal
          isOpen={isModalOpen}
          title={editingRecord ? 'Edit Doctor' : 'Add Doctor'}
          fields={modalFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onClose={handleModalClose}
          submitLabel={editingRecord ? 'Update Doctor' : 'Create Doctor'}
        />
      ) : null}

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
      ) : null}
    </div>
  );
};

export default DoctorsPage;
