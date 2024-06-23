export const createEntityProps = (entity: {
  id: number;
  name: string;
  isArchived: Date;
}) => ({
  id: entity.id,
  name: entity.name,
  isArchived: entity.isArchived,
});
