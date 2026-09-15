// scripts/generateSqlMapping.js
import fs from 'fs'

const assets = JSON.parse(fs.readFileSync('cloudinary-mapping.json', 'utf-8'));

const rows = assets.map((a) => {
  // strip folder + random suffix to recover the original base filename
  const base = a.public_id.split('/').pop().replace(/_[a-z0-9]{6,}$/i, '');
  return `('${base}.jpg', '${a.secure_url}')`;
});

const sql = `
CREATE TEMP TABLE image_mapping (old_filename TEXT, new_url TEXT);

INSERT INTO image_mapping (old_filename, new_url) VALUES
${rows.join(',\n')};

UPDATE "Scooter" s
SET images = ARRAY[m.new_url]
FROM image_mapping m
WHERE s.images[1] LIKE '%' || m.old_filename;
`;

fs.writeFileSync('update-images.sql', sql);
console.log('Wrote update-images.sql — review before running.');