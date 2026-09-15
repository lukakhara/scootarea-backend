import 'dotenv/config';
import cloudinary from 'cloudinary';
import fs from 'fs';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listAllAssets() {
  const result = await cloudinary.v2.api.resources({
    type: 'upload',
   
    max_results: 500,
  });

  const mapping = result.resources.map((r) => ({
    public_id: r.public_id,
    secure_url: r.secure_url,
  }));

  console.log(result.resources.map(r => r.public_id));

  fs.writeFileSync(
    'cloudinary-mapping.json',
    JSON.stringify(mapping, null, 2)
  );

  console.log(`Saved ${mapping.length} assets to cloudinary-mapping.json`);
}

listAllAssets().catch(console.error);