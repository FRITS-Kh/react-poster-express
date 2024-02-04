const fs = require('node:fs/promises');

const postsJson = 'functions/posts.json';
const postsLimit = 300;

async function getStoredPosts() {
  const rawFileContent = await fs.readFile(postsJson, { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedPosts = data.posts ?? [];

  return storedPosts;
}

function storePosts(posts) {
  const postsToStore = [...posts];

  if (postsToStore.length > postsLimit) {
    postsToStore.splice(100, postsLimit);
  }

  return fs.writeFile(postsJson, JSON.stringify({ posts: postsToStore || [] }));
}

exports.getStoredPosts = getStoredPosts;
exports.storePosts = storePosts;
