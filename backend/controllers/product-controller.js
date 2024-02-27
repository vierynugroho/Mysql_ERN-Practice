import fs from 'fs';
import product from '../models/product-model.js';
import path from 'path';

export const getProducts = async (req, res) => {
	try {
		const response = await product.findAll();
		console.log('response:' + response);
		res.json(response);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const getProductById = async (req, res) => {
	try {
		const response = await product.findOne({
			where: {
				id: req.params.id,
			},
		});
		res.json(response);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addProduct = async (req, res) => {
	if (req.files === null)
		return res.status(400).json({
			message: 'Tidak Ada File yang Diunggah!',
		});

	const name = req.body.name;
	const file = req.files.image;
	const fileSize = file.size;
	const extension = path.extname(file.name);
	const fileName = file.md5 + extension;
	const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
	const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];

	if (!allowedTypes.includes(extension.toLowerCase()))
		return res.status(422).json({
			message: 'Gambar Tidak Valid, Jenis yang Diizinkan: png, jpg, jpeg, gif',
		});

	if (fileSize > 5000000)
		return res.status(422).json({
			message: 'Ukuran Gambar harus Kurang dari 5 MB',
		});

	file.mv(`./public/images/${fileName}`, async (error) => {
		if (error)
			return res.status(500).json({
				message: error.message,
			});
		try {
			await product.create({
				name: name,
				image: fileName,
				url: url,
			});

			res.status(201).json({
				message: 'Produk Telah Dibuat!',
			});
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			});
		}
	});
};

export const updateProduct = async (req, res) => {
	const productFound = await product.findOne({
		where: {
			id: req.params.id,
		},
	});
	if (!productFound)
		return res.status(404).json({
			message: 'Product Not Found',
		});

	let fileName = '';

	// jika tidak update gambar
	if (req.files === null) {
		fileName = productFound.image;
	} else {
		const file = req.files.image;
		const fileSize = file.size;
		const extension = path.extname(file.name);
		const fileName = file.md5 + extension;

		const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif'];

		if (!allowedTypes.includes(extension.toLowerCase()))
			return res.status(422).json({
				message: 'Gambar Tidak Valid, Jenis yang Diizinkan: png, jpg, jpeg, gif',
			});

		if (fileSize > 5000000)
			return res.status(422).json({
				message: 'Ukuran Gambar harus Kurang dari 5 MB',
			});

		// delete old image on folder
		const filePath = `./public/images/${productFound.image}`;
		fs.unlinkSync(filePath);

		// replace with new image
		file.mv(`./public/images/${fileName}`, (error) => {
			if (error)
				return res.status(500).json({
					message: error.message,
				});
		});
	}
	// update name product
	const name = req.body.name;
	const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;

	try {
		await product.update(
			{
				name: name,
				image: fileName,
				url: url,
			},
			{
				where: {
					id: req.params.id,
				},
			}
		);

		res.status(200).json({
			message: 'Product Updated!',
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			message: error.message,
		});
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const productFound = await product.findOne({
			where: {
				id: req.params.id,
			},
		});
		if (!productFound)
			return res.status(404).json({
				message: 'Product Not Found',
			});

		// delete file from folder public
		const filePath = `./public/images/${productFound.image}`;
		fs.unlinkSync(filePath);

		// delete data in db
		await product.destroy({
			where: {
				id: req.params.id,
			},
		});
		res.status(200).json({
			message: 'Product Deleted!',
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			message: error.message,
		});
	}
};
