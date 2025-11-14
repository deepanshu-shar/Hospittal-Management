import { listBills, findBillById, createBill, updateBill, deleteBill } from '../models/billing.model.js';

export const getBills = async (req, res, next) => {
  try {
    const { q, status, patientId } = req.query;
    const bills = await listBills({ search: q, status, patientId });
    res.json({ data: bills });
  } catch (error) {
    next(error);
  }
};

export const getBillById = async (req, res, next) => {
  try {
    const bill = await findBillById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }
    return res.json({ data: bill });
  } catch (error) {
    return next(error);
  }
};

export const createBillHandler = async (req, res, next) => {
  try {
    const bill = await createBill(req.body);
    res.status(201).json({ data: bill });
  } catch (error) {
    next(error);
  }
};

export const updateBillHandler = async (req, res, next) => {
  try {
    const bill = await findBillById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }
    const updated = await updateBill(req.params.id, req.body);
    return res.json({ data: updated });
  } catch (error) {
    return next(error);
  }
};

export const deleteBillHandler = async (req, res, next) => {
  try {
    const bill = await findBillById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }
    await deleteBill(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
