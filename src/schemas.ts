import * as v from 'valibot';

export const SchemaPublisheds = v.pipe(
  v.string('Only string accepted'),
  v.parseJson({}, 'Not a json'),
  v.any(),
  v.transform(s => s.publishedPackages),
  v.array(
    v.looseObject({
      name: v.string(),
      version: v.string(),
    }),
  ),
);
