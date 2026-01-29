import { FindOptionsSelect } from 'typeorm';

export function parseFieldSelection<T>(
  fields: string,
): FindOptionsSelect<T> | undefined {
  if (!fields) {
    return undefined;
  }

  const select: any = {};
  const columns = fields.split(',');

  for (const column of columns) {
    const parts = column.trim().split('.');
    let current = select;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // If we encounter a node that is already fully selected (true),
      // we don't need to specify sub-fields, so we stop.
      if (current[part] === true) {
        break;
      }

      // If it's the last part, set it to true (selection)
      if (i === parts.length - 1) {
        current[part] = true;
      } else {
        // If it's not the last part, it's a relation
        // Initialize if not exists
        if (!current[part]) {
          // Always select ID for nested relations to ensure hydration works
          current[part] = { id: true };
        }
        // Move deeper
        current = current[part];
      }
    }
  }

  return select as FindOptionsSelect<T>;
}

export function parseRelationsFromFields(
  fields: string,
  knownRelations: string[] = [],
): string[] {
  if (!fields) {
    return [];
  }

  const relations = new Set<string>();
  const columns = fields.split(',');

  for (const column of columns) {
    const trimmed = column.trim();

    // If exact match with known relation, add it
    if (knownRelations.includes(trimmed)) {
      relations.add(trimmed);
    }

    const parts = trimmed.split('.');
    if (parts.length > 1) {
      let currentPath = '';
      // Iterate up to the second to last part (the last part is the column name)
      // This implicitly adds all parent relations
      for (let i = 0; i < parts.length - 1; i++) {
        if (i > 0) {
          currentPath += '.';
        }
        currentPath += parts[i];
        relations.add(currentPath);
      }
    }
  }

  return Array.from(relations);
}

export function sanitizeSelectForRelations(select: any, relations: string[]) {
  if (!select) return select;

  for (const relation of relations) {
    // Traverse the select object to find the relation key
    const parts = relation.split('.');
    let current = select;
    let parent = null;
    let lastPart = '';
    let found = true;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        parent = current;
        current = current[part];
        lastPart = part;
      } else {
        found = false;
        break;
      }
    }

    // If found and the value is exactly true, it means implicit "select all" for that relation.
    // We remove it from 'select' so TypeORM uses the 'relations' array to load it with default fields.
    if (found && current === true && parent) {
      delete parent[lastPart];
    }
  }
  return select;
}
