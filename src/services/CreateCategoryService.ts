import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

export default class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    if (!title) {
      throw new AppError('The category title can not be empty', 400);
    }
    const categoryRepository = getCustomRepository(CategoriesRepository);
    const categoryExists = await categoryRepository.findOne({
      where: { title },
    });
    if (categoryExists) {
      return categoryExists;
    }
    const data = {
      title,
    };
    const category = categoryRepository.create(data);
    await categoryRepository.save(category);
    return category;
  }
}
