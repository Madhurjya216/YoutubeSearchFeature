require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const app     = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/search', async (req, res) => {
  const query     = req.body.query;
  const videoType = req.body.videoType; // "any" | "short" | "long"

  // Base search URL
  let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10`
             + `&q=${encodeURIComponent(query)}`
             + `&key=${process.env.YOUTUBE_API_KEY}`;

  // Append videoDuration if user selected short or long
  if (videoType === 'short' || videoType === 'long') {
    apiUrl += `&videoDuration=${videoType}`;
  }
  // else: videoType === 'any' → no additional filter

  try {
    const response = await axios.get(apiUrl);
    const videos   = response.data.items;
    res.render('result', { videos, query, videoType });
  } catch (err) {
    console.error('Error fetching videos:', err.message);
    res.send('Error fetching videos. Please try again later.');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
