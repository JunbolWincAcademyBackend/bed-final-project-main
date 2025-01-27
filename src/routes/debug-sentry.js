// Debug route to test Sentry integration
app.get('/debug-sentry', (req, res) => {
    // this is to throw an error to test Sentry  intentionally
    throw new Error('Intentional test error for Sentry!');
  });
  