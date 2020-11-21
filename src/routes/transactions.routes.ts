import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import multerConfig from '../config/multerConfig';
import TransactionsRepository from '../repositories/TransactionsRepository';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const handleFile = multer(multerConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();

  const balance = await transactionRepository.getBalance();

  return response.status(200).json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const data = {
    title,
    value,
    type,
    category,
  };

  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute(data);
  return response.status(201).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);
  return response.status(201).send();
});

transactionsRouter.post(
  '/import',
  handleFile.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const result = await importTransactionsService.execute(request.file.path);
    return response.status(201).json(result);
  },
);

export default transactionsRouter;
