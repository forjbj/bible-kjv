addEventListener('message', ({ data }) => {
  const response = data;
  postMessage(response);
});
