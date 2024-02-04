const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

const users = [];

// Middleware de log de requisições com verificação de ID
const logMiddleware = (req, res, next) => {
  const { id } = req.params;
  // Verifica se o ID é válido
  if (!id) {
    return res.status(400).json({ error: "ID da requisição ausente" });
  }
  // Verifica se o ID existe no array de usuários
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ID: ${id}`);
  req.userId = id; // Adiciona o ID ao objeto 'req' para que possa ser acessado nas rotas
  next();
};

app.use(express.json());

app.get("/users", (request, response) => {
  return response.json(users);
});

app.post("/users", (req, res) => {
  const { name, age } = req.body;
  const newUser = {
    id: uuidv4(),
    name,
    age
  };
  users.push(newUser);
  console.log(users);
  return res.status(201).json(newUser);
});

app.put("/users/:id", logMiddleware, (req, res) => {
  const { userId } = req; // Acessa o ID do usuário diretamente do objeto 'req'
  const { name, age } = req.body;

  // Atualiza os dados do usuário encontrado
  const userIndex = users.findIndex((user) => user.id === userId);
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    age: age || users[userIndex].age
  };

  return res.json(users[userIndex]);
});

app.delete("/users/:id", logMiddleware, (req, res) => {
  const { userId } = req; // Acessa o ID do usuário diretamente do objeto 'req'

  // Remove o usuário do array
  const deletedUser = users.splice(users.findIndex((user) => user.id === userId), 1)[0];

  return res.json(deletedUser);
});

app.listen(port, () => {
  console.log(`👻 Server is running on port ${port} 👻`);
});
