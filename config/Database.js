import { Sequelize } from "sequelize";

const db = new Sequelize("nicewarehouse", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

export default db;