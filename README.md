# moMus

Site para informar a trilha sonora de filmes feito com nodejs, express, sequelize e handlebars.

## Requisitos

1. Node js
2. Docker

## Uso

1. crie um arquivo .env com os seguintes campos:
    ```
        DB_DATABASE={nome do database}
        DB_USER={nome do usuário}
        DB_PASSWORD={senha do usuário}
        DB_HOST=localhost
        DB_DIALECT=mysql
        PORT={porta do localhost}
        DB_PORT={porta do banco de dados}
    ```

2. insira no terminal: npm install
3. execute o compose
4. insira no terminal o seguinte comando: node main.js
5. visite http://localhost:{PORT}/filme/ no navegador

![2](https://github.com/ThiagoFBastos/moMus/blob/main/2.png)
![1](https://github.com/ThiagoFBastos/moMus/blob/main/1.png)
![3](https://github.com/ThiagoFBastos/moMus/blob/main/3.png)
![4](https://github.com/ThiagoFBastos/moMus/blob/main/4.png)
![5](https://github.com/ThiagoFBastos/moMus/blob/main/5.png)
