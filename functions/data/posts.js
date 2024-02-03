const fs = require('node:fs/promises');

async function getStoredPosts() {
  const rawFileContent = await fs.readFile('posts.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedPosts = data.posts ?? [];
  return storedPosts;
}

function storePosts(posts) {
  const postsToStore = [...posts];

  if (postsToStore.length > 300) {
    postsToStore.splice(100, 300);
  }
  return fs.writeFile(
    'posts.json',
    JSON.stringify({ posts: postsToStore || [] }),
  );
}

function resetPosts() {
  fs.copyFile('default-posts.json', 'posts.json');
}

exports.getStoredPosts = getStoredPosts;
exports.storePosts = storePosts;
exports.resetPosts = resetPosts;
