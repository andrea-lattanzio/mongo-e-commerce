export type FindFilterQuery = {
  name?: { $regex: string; $options: string };
  price?: { $gte?: number; $lte?: number };
  stock?: number;
  categories?: { $in: string[] };
};
