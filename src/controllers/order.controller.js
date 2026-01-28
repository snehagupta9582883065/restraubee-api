const db = require("../models");
const Order = db.order;
const OrderItem = db.orderItem;

exports.createOrder = async (req, res) => {
    try {
        const branchId = req.branchId;
        const {
            userId,
            tableNumber,
            customerName,
            customerPhone,
            customerEmail,
            notes,
            totalAmount,
            totalItems,
            tableStatus,
            orderType,
            orderStatus
        } = req.body;

        if (!customerName) {
            return res.status(400).send({ message: "Customer Name is mandatory!" });
        }

        const order = await Order.create({
            branchId,
            userId,
            tableNumber,
            customerName,
            customerPhone: customerPhone || "",
            customerEmail: customerEmail || "",
            notes,
            totalAmount,
            tableStatus,
            orderType,
            orderStatus
        });

        if (totalItems && totalItems.length > 0) {
            const items = totalItems.map(item => ({
                ...item,
                orderId: order.id
            }));
            await OrderItem.bulkCreate(items);
        }

        const result = await Order.findByPk(order.id, {
            include: [{
                model: OrderItem,
                as: "totalItems",
                attributes: { exclude: ["createdAt", "updatedAt", "orderId"] }
            }]
        });

        res.status(201).send(result);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { branchId: req.branchId },
            include: [{
                model: OrderItem,
                as: "totalItems",
                attributes: { exclude: ["createdAt", "updatedAt", "orderId"] }
            }]
        });
        res.status(200).send(orders);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.bulkCreateOrders = async (req, res) => {
    try {
        const ordersData = req.body;

        if (!Array.isArray(ordersData)) {
            return res.status(400).send({ message: "Request body must be an array of orders!" });
        }

        const createdOrders = [];

        for (const orderData of ordersData) {
            const branchId = req.branchId;
            const {
                userId,
                tableNumber,
                customerName,
                customerPhone,
                customerEmail,
                notes,
                totalAmount,
                totalItems,
                tableStatus,
                orderType,
                orderStatus
            } = orderData;

            if (!customerName) continue;

            const order = await Order.create({
                branchId,
                userId,
                tableNumber,
                customerName,
                customerPhone: customerPhone || "",
                customerEmail: customerEmail || "",
                notes,
                totalAmount,
                tableStatus,
                orderType,
                orderStatus
            });

            if (totalItems && totalItems.length > 0) {
                const items = totalItems.map(item => ({
                    ...item,
                    orderId: order.id
                }));
                await OrderItem.bulkCreate(items);
            }

            const result = await Order.findByPk(order.id, {
                include: [{
                    model: OrderItem,
                    as: "totalItems",
                    attributes: { exclude: ["createdAt", "updatedAt", "orderId"] }
                }]
            });
            createdOrders.push(result);
        }

        res.status(201).send({
            message: `${createdOrders.length} orders created successfully!`,
            orders: createdOrders
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
