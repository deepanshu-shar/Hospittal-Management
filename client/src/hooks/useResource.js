import { useCallback, useEffect, useMemo, useState } from 'react';
import { createResourceClient } from '../api/resources';

export const useResource = (resourceName, defaultParams = {}) => {
  const [items, setItems] = useState([]);
  const [params, setParams] = useState(defaultParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const client = useMemo(() => createResourceClient(resourceName), [resourceName]);

  const fetchItems = useCallback(
    async (overrideParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await client.list({ ...params, ...overrideParams });
        setItems(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load data.');
      } finally {
        setLoading(false);
      }
    },
    [client, params]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = useCallback(
    async (payload) => {
      const { data } = await client.create(payload);
      await fetchItems();
      return data.data;
    },
    [client, fetchItems]
  );

  const updateItem = useCallback(
    async (id, payload) => {
      const { data } = await client.update(id, payload);
      await fetchItems();
      return data.data;
    },
    [client, fetchItems]
  );

  const deleteItem = useCallback(
    async (id) => {
      await client.remove(id);
      await fetchItems();
    },
    [client, fetchItems]
  );

  return {
    items,
    loading,
    error,
    params,
    setParams,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem
  };
};
