const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const bodyParser = require('body-parser');

const { getStoredPosts, storePosts, resetPosts } = require('./posts');

const app = express();
const idsMap = new Map();

(async () => {
  const initialPosts = await getStoredPosts();

  initialPosts.forEach((post) => {
    idsMap.set(post.id, '');
  });
})();

app.use(bodyParser.json());

app.use((req, res, next) => {
  const localOrigin = 'http://localhost:5173';
  const prodOrigin = 'https://react-poster-and-router-6.web.app';
  const origin = req.headers.origin;

  if (origin === localOrigin || origin === prodOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/posts', async (req, res) => {
  const storedPosts = await getStoredPosts();
  res.json({ posts: storedPosts });
});

app.get('/posts/:id', async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);
  res.json({ post });
});

app.post('/posts', async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  let lastId = ++idsMap.size;
  let id = `post-${lastId}`;

  while (idsMap.has(id)) {
    id = `post-${++lastId}`;
  }

  idsMap.set(id, '');
  const newPost = {
    ...postData,
    id,
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: 'Stored new post.', post: newPost });
});

app.delete('/posts/:id', async (req, res) => {
  const requestId = req.params.id;

  // if (requestId === 'post-1' || requestId === 'post-2') {
  //   res.status(403).json({ message: `Post is read only!` });

  //   return;
  // }

  const existingPosts = await getStoredPosts();
  const updatedPosts = [
    ...existingPosts.filter((post) => post.id !== requestId),
  ];
  idsMap.delete(requestId);
  await storePosts(updatedPosts);
  res.status(201).json({ message: `Removed a post by ID: ${requestId}` });
});

exports.app = onRequest(app);
