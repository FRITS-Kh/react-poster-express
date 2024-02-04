const fs = require('node:fs/promises');

const path = 'functions';
const postsJson = `${path}/posts.json`;
const defaultPostsJson = `${path}/default-posts.json`;

async function getStoredPosts() {
  const rawFileContent = await fs.readFile(postsJson, { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedPosts = data.posts ?? [];
  return storedPosts;
}

function storePosts(posts) {
  const postsToStore = [...posts];

  if (postsToStore.length > 300) {
    postsToStore.splice(100, 300);
  }
  return fs.writeFile(postsJson, JSON.stringify({ posts: postsToStore || [] }));
}

function resetPosts() {
  fs.copyFile(defaultPostsJson, postsJson);
}

exports.getStoredPosts = getStoredPosts;
exports.storePosts = storePosts;
exports.resetPosts = resetPosts;
