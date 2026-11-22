import { Request, Response } from "express";

import * as orderService from "../services/order.service";
import {
  createOrderSchema,
  idParam,
  idParamSchema,
  ListOrdersQuery,
  listOrdersQuerySchema,
  UpdateOrderStatusInput,
  updateOrderStatusSchema,
} from "../schemas/order.schema";

export const create = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const input = createOrderSchema.parse(req.body);
  const result = await orderService.createOrder(userId!, input);
  res.status(201).json(result);
};

export const listMine = async (req: Request, res: Response) => {
  const orders = await orderService.getUserOrders(req.session.userId!);
  res.json(orders);
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params) as idParam;
  const order = await orderService.getOrderById(id, {
    id: req.session.userId!,
    role: req.session.role!,
  });
  res.json(order);
};

export const cancel = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params) as idParam;
  const userId = req.session.userId;
  const result = await orderService.cancelOrder(id, userId!);
  res.json(result);
};

export const listAll = async (req: Request, res: Response) => {
  const query = listOrdersQuerySchema.parse(req.query) as ListOrdersQuery;
  res.json(await orderService.getAllOrders(query));
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params) as idParam;
  const { status } = updateOrderStatusSchema.parse(
    req.body,
  ) as UpdateOrderStatusInput;
  res.json(await orderService.updateOrderStatus(id, status));
};
