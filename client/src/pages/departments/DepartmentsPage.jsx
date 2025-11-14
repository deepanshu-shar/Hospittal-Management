import { useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import EntityFormModal from '../../components/EntityFormModal';
import { useResource } from '../../hooks/useResource';

const DepartmentsPage = () => {
  const { items, loading, error, setParams, createItem, updateItem, deleteItem } = useResource('departments');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formError, setFormError] = useState(null);

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
    if (!window.confirm(`Delete department ${record.name}?`)) {
      return;
    }
    try {
      await deleteItem(record.id);
    } catch (err) {
      const message = err.response?.data?.message ||
        'Unable to delete department. Ensure no doctors or patients are assigned.';
      alert(message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateItem(editingRecord.id, values);
      } else {
        await createItem(values);
      }
      setIsModalOpen(false);
      setEditingRecord(null);
      setFormError(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to save department.');
    }
  };

  const modalFields = useMemo(
    () => [
      {
        name: 'name',
        label: 'Department Name',
        required: true
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea'
      }
    ],
    []
  );

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Department' },
      {
        key: 'description',
        label: 'Description',
        render: (value) => value || '—'
      },
      {
        key: 'createdAt',
        label: 'Created',
        render: (value) => (value ? new Date(value).toLocaleDateString() : '—')
      }
    ],
    []
  );

  const initialValues = editingRecord
    ? { ...editingRecord }
    : { name: '', description: '' };

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Departments</h1>
          <p className="text-sm text-slate-500">Organize service lines and assign resources effectively.</p>
        </div>
        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-secondary"
        >
          Add Department
        </button>
      </header>

      <div className="space-y-4">
        <DataTable
          title="Department Directory"
          columns={columns}
          rows={items}
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setParams((prev) => {
              const next = { ...prev };
              if (value) {
                next.q = value;
              } else {
                delete next.q;
              }
              return next;
            });
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyState={loading ? 'Loading departments...' : 'No departments found.'}
        />
        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        ) : null}
      </div>

      {isModalOpen ? (
        <EntityFormModal
          isOpen={isModalOpen}
          title={editingRecord ? 'Edit Department' : 'Add Department'}
          fields={modalFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onClose={handleModalClose}
          submitLabel={editingRecord ? 'Update Department' : 'Create Department'}
        />
      ) : null}

      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{formError}</div>
      ) : null}
    </div>
  );
};

export default DepartmentsPage;
