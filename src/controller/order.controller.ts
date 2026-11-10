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
  const input = createOrderSchema.parse(req.body);
  const userId = req.session.userId;
  const result = await orderService.createOrder(input, userId!);
  res.status(201).json(result);
};

export const listMine = async (req: Request, res: Response) => {
  const { id } = req.session.userId;
  res.json(await orderService.getUserOrders(id));
};

export const getOne = async (req: Request, res: Response) => {
  const { id } = idParamSchema.parse(req.params) as idParam;
  const userId = req.session.userId;
  const role = req.session.role;
  res.json(await orderService.getOrderById(id, { userId, role}));
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
