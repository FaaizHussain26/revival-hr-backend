import { Model } from 'mongoose';
import { PaginationQueryDto } from './dto/pagination-query.dto';

export interface PaginationOutput<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

export async function PaginateAndFilter<T>(
  model: Model<T>,
  query: PaginationQueryDto,
  searchableFields: string[],
) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filter,
    search,
  } = query;

  const skip = (page - 1) * limit;
  const sort: { [key: string]: 1 | -1 } = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  type FilterValue = string | number | boolean | RegExp | object | null;

  let filters: Record<string, FilterValue> = {};
  if (filter) {
    try {
      filters = JSON.parse(filter as string);
    } catch {
      throw new Error('Invalid filter format');
    }
  }


  // if (isDelete === false) {
  //   filters.$or = [{ isDeleted: false }, { isDeleted: { $exists: false } }];
  // } else if (isDelete !== undefined) {
  //   filters.isDeleted = isDelete;
  // }



  if (search && searchableFields.length > 0) {
    filters.$or = searchableFields.map((field) => ({
      [field]: { $regex: new RegExp(search, 'i') },
    }));
  }

  const dbQuery = model.find(filters).sort(sort).skip(skip).limit(limit);

  const [items, total] = await Promise.all([
    dbQuery.exec(),
    model.countDocuments(filters),
  ]);

  return {
    data: items,
    total,
    current_page: page,
    last_page: Math.ceil(total / limit),
    per_page: limit,
  };
}
