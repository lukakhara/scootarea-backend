import type { Request, Response } from "express";
import * as blogService from "../services/blog.service";
import type { BlogQuery, BlogIdParam } from "../schemas/blog";

export async function getAllPosts(req: Request, res: Response) {
  const query = req.validatedQuery as BlogQuery;
  const result = await blogService.getBlogPosts(query);
  res.status(200).json(result);
}

export async function getPostById(req: Request, res: Response) {
  const { id } = req.validatedParams as BlogIdParam;
  const post = await blogService.getBlogPostById({ id });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
}
