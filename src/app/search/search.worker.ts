/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const response: any = data;
  postMessage(response);
});
