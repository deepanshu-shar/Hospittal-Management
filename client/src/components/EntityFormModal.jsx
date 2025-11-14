import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const defaultInitialValues = (fields) =>
  fields.reduce((accumulator, field) => {
    accumulator[field.name] = field.defaultValue ?? '';
    return accumulator;
  }, {});

const EntityFormModal = ({ isOpen, title, fields, initialValues, onSubmit, onClose, submitLabel }) => {
  const [values, setValues] = useState(() => defaultInitialValues(fields));

  useEffect(() => {
    if (isOpen) {
      setValues((prev) => ({ ...prev, ...defaultInitialValues(fields), ...initialValues }));
    }
  }, [fields, initialValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </header>
        <form onSubmit={handleSubmit} className="grid gap-4 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="flex flex-col gap-2 text-sm text-slate-600">
                <span className="font-medium">
                  {field.label}
                  {field.required ? <span className="ml-1 text-red-500">*</span> : null}
                </span>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={values[field.name] ?? ''}
                    required={field.required}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {(field.options || []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    name={field.name}
                    value={values[field.name] ?? ''}
                    required={field.required}
                    onChange={handleChange}
                    rows={field.rows || 3}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={values[field.name] ?? ''}
                    required={field.required}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder={field.placeholder}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-secondary"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EntityFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
      defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      placeholder: PropTypes.string,
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
      rows: PropTypes.number,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        })
      )
    })
  ).isRequired,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submitLabel: PropTypes.string
};

EntityFormModal.defaultProps = {
  initialValues: undefined,
  submitLabel: 'Save'
};

export default EntityFormModal;
