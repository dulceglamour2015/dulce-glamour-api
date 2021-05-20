const { File } = require('../database/Fiel');
const { createWriteStream, mkdir } = require('fs');
const path = require('path');
const { generateRandomString } = require('../utils/randomString');
const { PROD_URL } = require('../config');

const storeUpload = async ({ stream, filename }) => {
  const { ext } = path.parse(filename);
  const randomName = generateRandomString(12) + ext;
  const pathName = path.join(process.cwd(), `images/${randomName}`);
  const url = `${PROD_URL}images/${randomName}`;

  return new Promise((resolve, reject) => {
    stream
      .pipe(createWriteStream(pathName))
      .on('finish', () => resolve({ url }))
      .on('error', reject);
  });
};

const processUpload = async (upload) => {
  const { createReadStream, filename } = await upload.promise;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename });
  return file;
};

const uploadFile = async (file) => {
  mkdir('images', { recursive: true }, (err) => {
    if (err) return err;
  });
  const url = await processUpload(file);
  const dbFile = new File(url);
  dbFile.id = dbFile._id;
  await dbFile.save();

  return dbFile;
};

module.exports = {
  uploadFile
};
