# moMus

Site para informar a trilha sonora de filmes feito com nodejs, express, sequelize e handlebars.

## Requisitos

1. Node js
2. Mysql

## Uso

1. importar o arquivo moMus.sql para o mysql
2. inserir no terminal: npm install
3. criar um arquivo .env com os seguintes campos:
    ```
        DB_DATABASE={nome do database}
        DB_USER={nome do usuário}
        DB_PASSWORD={senha do usuário}
        DB_HOST=localhost
        DB_DIALECT=mysql
        PORT={porta}
    ```

4. inserir no terminal o seguinte comando: node main.js
5. visitar http://localhost:8181/filme/ no navegador

![2](https://github.com/ThiagoFBastos/moMus/blob/main/2.png)
![1](https://github.com/ThiagoFBastos/moMus/blob/main/1.png)
![3](https://github.com/ThiagoFBastos/moMus/blob/main/3.png)
![4](https://github.com/ThiagoFBastos/moMus/blob/main/4.png)
![5](https://github.com/ThiagoFBastos/moMus/blob/main/5.png)
