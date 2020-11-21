import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from './CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

export default class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const createCategoryService = new CreateCategoryService();
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Invalid operation', 400);
    }

    const newCategory = await createCategoryService.execute(category);
    const transaction = {
      title,
      value,
      type,
      category_id: newCategory.id,
    };
    const newTransaction = transactionRepository.create(transaction);

    await transactionRepository.save(newTransaction);

    return newTransaction;
  }
}
