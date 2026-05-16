import app from '@server/app';

const PORT = 6000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});