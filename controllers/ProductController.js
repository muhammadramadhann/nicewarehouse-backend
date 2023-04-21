import Product from "../models/Product.js";
import path from "path";
import fs from "fs";

// generate product code
const productCodeGenerator = () => {
    const chars = "1234567890";
    const myLength = 4;
    const randomArray = Array.from(
        { length: myLength },
        (v, k) => chars[Math.floor(Math.random() * chars.length)]
    );
    const randomString = randomArray.join("");
    return 'NW-' + randomString;
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const saveProduct = (req, res) => {
    if (req.files === null) return res.status(400).json({ message: "No File Uploaded" });
    const code = productCodeGenerator()
    const name = req.body.name;
    const stock = req.body.stock;

    const file = req.files.image;
    const fileSize = file.data.length;
    const fileExtension = path.extname(file.name);
    const fileName = file.md5 + fileExtension;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpeg", ".jpg"];

    if (!allowedType.includes(fileExtension.toLowerCase())) return res.status(422).json({ message: "Please use a valid image!" });
    if (fileSize > 5000000) return res.status(422).json({ message: "Image size must be less than 5 MB!" });

    file.mv(`./public/images/${fileName}`, async (error) => {
        if (error) return res.status(500).json({ message: error.message });
        try {
            await Product.create({
                name: name,
                code: code,
                stock: stock,
                image: fileName,
                url: url,
            });
            res.status(201).json({ message: "Product saved successfully!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
}

export const updateProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            uuid: req.params.uuid
        }
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    let fileName = "";

    if (req.files === null) {
        fileName = product.image;
    } else {
        const file = req.files.image;
        const fileSize = file.data.length;
        const fileExtension = path.extname(file.name);
        fileName = file.md5 + fileExtension;
        const allowedType = [".png", ".jpeg", ".jpg"];

        if (!allowedType.includes(fileExtension.toLowerCase())) return res.status(422).json({ message: "Please use a valid image!" });
        if (fileSize > 5000000) return res.status(422).json({ message: "Image size must be less than 5 MB!" });

        const filePath = `./public/images/${product.image}`;
        fs.unlinkSync(filePath);

        file.mv(`./public/images/${fileName}`, (error) => {
            if (error) return res.status(500).json({ message: error.message });
        });
    }

    const name = req.body.name;
    const code = productCodeGenerator()
    const stock = req.body.stock;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Product.update({
            name: name,
            code: code,
            stock: stock,
            image: fileName,
            url: url
        }, {
            where: {
                uuid: req.params.uuid
            }
        });
        res.status(200).json({ message: "Product updated successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    const product = await Product.findOne({
        where: {
            uuid: req.params.uuid
        }
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    try {
        const filePath = `./public/images/${product.image}`;
        fs.unlinkSync(filePath);
        await Product.destroy({
            where: {
                uuid: req.params.uuid
            }
        });
        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}