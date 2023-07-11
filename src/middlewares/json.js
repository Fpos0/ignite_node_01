export async function json(req, res) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    // buffer vem em binario,transforma em string que transforma em json
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null;
  }

  res.setHeader('Content-type', 'application/json')
}