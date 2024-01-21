<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Delivery Control Clean Arch

Bem-vindo ao Projeto Delivery Control com Clean Architecture! Este é um projeto desenvolvido para ir além do básico CRUD, explorando conceitos avançados de arquitetura de software e tecnologias modernas. Meu principal objetivo era adquirir uma compreensão prática de como aplicar Clean Architecture, SOLID, DDD e Design Patterns. Ao moldar a aplicação, concentrei-me na separação de responsabilidades e na adoção de padrões de design para cenários de uso reais.

A seguir, você encontrará informações sobre os requisitos, como rodar o projeto com Docker e as tecnologias utilizadas.




## Requisitos

Para rodar o projeto localmente, você precisa ter as seguintes ferramentas instaladas:

- Node.js versao 18 ou superior

- Docker Engine

- VS Code ou similar.

## Rodando o Projeto com Docker

 1 - Clone este repositório:

```bash
  git clone https://github.com/m4chado/delivery-control-clean-arch.git
  cd delivery-control-clean-arch
```

 2 - Instale as dependências:

```bash
  npm install
```

 3 - Copie o arquivo de exemplo .env.example para .env e ajuste conforme necessário:

```bash
 cp .env.example .env
```

 4 - Inicie o projeto com Docker:

```bash
 docker-compose up -d
```
 5 - O projeto estará disponível em http://localhost:3333
    
## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```


## Rodando localmente

Clone o projeto

```bash
  git clone https://link-para-o-projeto
```

Entre no diretório do projeto

```bash
  cd my-project
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm run start
```


## Documentação

A documentação da API foi gerada utilizando Swagger e pode ser acessada em http://localhost:3333/docs


## Tecnologias Utilizadas

- NestJS
- Typescript
- Node.js
- JWT
- Prisma
- Docker
- Docker Compose
- Swagger
- Bcrypt
