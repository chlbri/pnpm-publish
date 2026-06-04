import * as v from 'valibot';

export const SchemaPublisheds = v.pipe(
  v.string('Only string accepted'),
  v.parseJson({}, 'Not a json'),
  v.array(
    v.looseObject({
      name: v.string(),
      version: v.string(),
    }),
  ),
);

export const SchemaVersions = v.pipe(
  v.string('Only string accepted'),
  v.parseJson({}, 'Not a json'),
  v.union([
    v.array(v.string()),
    v.pipe(
      v.string(),
      v.transform(val => [val]),
    ),
  ]),
);
