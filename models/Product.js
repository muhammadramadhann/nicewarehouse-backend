import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Product = db.define("products", {
    uuid: {
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    code: {
        type: DataTypes.STRING(7),
        unique: true
    },
    name: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    image: DataTypes.STRING,
    url: DataTypes.STRING
}, {
    freezeTableName: true,
});

export default Product;

(async () => {
    await db.sync();
})();