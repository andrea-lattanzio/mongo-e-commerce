export type FindFilterQuery = {
  $text?: { $search: string };
  price?: { $gte?: number; $lte?: number };
  stock?: number;
  categories?: { $in: string[] };
};
