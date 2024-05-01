require('dotenv').config();
const prismic = require('@prismicio/client');

const repositoryName = process.env.PRISMIC_REPO_NAME;

const client = prismic.createClient(repositoryName, {
  fetch,
  accessToken: process.env.PRISMIC_CLIENT_SECRET,
});

const init = async () => {
  const prismicDoc = await client.getFirst();

  const { title, description } = prismicDoc.data;
};

init();
